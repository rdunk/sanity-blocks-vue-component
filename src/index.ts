import merge from 'lodash.merge';
import { DefineComponent, defineComponent, h, PropType, toRaw } from 'vue';

import {
  Block,
  BlockList,
  BlockSerializer,
  BlockSpan,
  BlockText,
  CustomBlock,
  MarkDefinition,
  MarkSerializer,
  SerializedNode,
  Serializer,
  Serializers,
  SpanSerializer,
} from './types';

const createElementFromStyle = (
  block: BlockText,
  serializers: Serializers,
  children: (SerializedNode | SerializedNode[])[]
) => {
  if (block.style) {
    const styleSerializer = serializers.styles[block.style];
    if (styleSerializer) {
      return h(styleSerializer, {}, children);
    }
  }
  return children.flatMap((a) => a);
};

const blockIsSpan = (block: Block | BlockSpan): block is BlockSpan => {
  return block._type === 'span' && 'marks' in block && 'text' in block;
};

// @TODO This probably needs improving...
const serializerIsVueComponent = (
  serializer: Serializer
): serializer is DefineComponent => {
  return (
    typeof serializer === 'object' &&
    ('template' in serializer ||
      'setup' in serializer ||
      'render' in serializer ||
      'ssrRender' in serializer)
  );
};

const findBlockSerializer = (block: Block, serializers: Serializers) => {
  if (block._type === 'list') {
    return serializers.list;
  }
  if ('listItem' in block) {
    return serializers.listItem;
  }
  if (blockIsSpan(block)) {
    return serializers.span;
  }
  return serializers.types[block._type];
};

// Typically returns an array of text nodes
// but might also include a VNode of a line break (<br>)
const renderText = (text: string, serializers: Serializers) => {
  const lines: Array<SerializedNode> = text.split('\n');
  for (let line = lines.length; line-- > 1; ) {
    lines.splice(line, 0, serializers.hardBreak());
  }
  return lines;
};

const attachMarks = (
  span: BlockSpan,
  remainingMarks: string[],
  serializers: Serializers,
  markDefs: MarkDefinition[]
): SerializedNode | SerializedNode[] => {
  const [mark, ...marks] = remainingMarks;
  if (!mark) {
    return renderText(span.text, serializers);
  }

  const markDef =
    mark in serializers.marks
      ? { _type: mark, _key: '' }
      : markDefs.find((m) => m._key === mark);

  const serializer = markDef ? serializers.marks[markDef._type] : 'span';

  if (serializerIsVueComponent(serializer)) {
    const props = extractProps(markDef);
    return h(serializer, props, () =>
      attachMarks(span, marks, serializers, markDefs)
    );
  }

  if (typeof serializer === 'function') {
    return serializer(markDef, attachMarks(span, marks, serializers, markDefs));
  }

  return h(
    serializer,
    extractProps(markDef),
    attachMarks(span, marks, serializers, markDefs)
  );
};

const spanSerializer: SpanSerializer = (span, serializers, markDefs) => {
  const defaults = ['em', 'strong', 'code'];
  // Defaults first
  const marks = [...span.marks].sort((a, b) => {
    if (defaults.includes(a)) return 1;
    if (defaults.includes(b)) return -1;
    return 0;
  });
  return attachMarks(span, marks, serializers, markDefs);
};

const blockTextSerializer = (block: BlockText, serializers: Serializers) => {
  // @TODO Using type assertion, maybe not ideal
  const nodes = block.children.flatMap((span: BlockSpan) => {
    return spanSerializer(span, serializers, block.markDefs);
  });
  return createElementFromStyle(block, serializers, nodes);
};

const underlineSerializer: MarkSerializer = (_, children) =>
  h('span', { style: 'text-decoration: underline;' }, children);

const linkSerializer: MarkSerializer = (props, children) => {
  return h(
    'a',
    { href: props.href, target: props.newtab ? '_blank' : undefined },
    children
  );
};

const listSerializer = (block: BlockText, serializers: Serializers) => {
  const el = block.listItem === 'number' ? 'ol' : 'ul';
  return h(el, {}, renderBlocks(block.children, serializers, block.level));
};

const listItemSerializer = (block: BlockText, serializers: Serializers) => {
  // Array of array of strings or nodes
  const children = renderBlocks(block.children, serializers, block.level);
  const shouldWrap = block.style && block.style !== 'normal';
  return h(
    'li',
    {},
    shouldWrap ? createElementFromStyle(block, serializers, children) : children
  );
};

// Remove extraneous object properties
const extractProps = (item: CustomBlock | MarkDefinition | undefined) => {
  if (item) {
    const { _key, _type, ...props } = item;
    return props;
  }
  return {};
};

const serializeBlock = (block: Block | BlockSpan, serializers: Serializers) => {
  // Find the serializer for this type of block
  const serializer = findBlockSerializer(block, serializers);
  // If none found, return null
  if (!serializer) return null;
  // If the serializer is a vue component, render it
  if (serializerIsVueComponent(serializer)) {
    const props = extractProps(block);
    return h(serializer, props);
  }
  // Probably block text i.e. type 'block'
  // Could also be a span
  if (typeof serializer === 'function') {
    // We do some manual type assertion here
    // the findBlockSerializer method will have narrowed down the serializer if the block is a span type
    if (blockIsSpan(block)) {
      return (serializer as SpanSerializer)(block, serializers, []);
    }
    return (serializer as BlockSerializer)(block, serializers);
  }
  // Must be a string by this point
  return h(serializer, {});
};

const createList = (block: BlockText): BlockList => {
  return {
    _type: 'list',
    _key: `${block._key}-parent`,
    level: block.level,
    listItem: block.listItem,
    children: [block],
  };
};

const nestBlocks = (blocks: Array<Block | BlockSpan>, level = 0) => {
  const isListOrListItem = (block: Block | BlockSpan): block is BlockText =>
    'level' in block;
  const hasChildren = (
    block: Block | BlockSpan
  ): block is BlockText | BlockList => block && 'children' in block;
  const newBlocks: Array<Block | BlockSpan> = [];
  let currentList: BlockList | null = null;

  blocks.forEach((block, i) => {
    if (!isListOrListItem(block)) {
      newBlocks.push(block);
      return;
    }

    const lastBlock = newBlocks[newBlocks.length - 1];

    // If this is the first level, nest a bit differently
    if (level === 0) {
      if (
        !lastBlock ||
        !isListOrListItem(lastBlock) ||
        lastBlock.level > block.level
      ) {
        newBlocks.push(createList(block));
        return;
      }
      lastBlock.children.push(block);
      return;
    }

    // Level > 0
    if (block.level === level) {
      newBlocks.push(block);
      if (currentList && hasChildren(lastBlock)) {
        // @TODO Why is this only ever a block?
        lastBlock.children.push(currentList);
        currentList = null;
        return;
      }
    }

    if (block.level > level) {
      if (hasChildren(lastBlock)) {
        if (currentList) {
          currentList.children.push(block);
        } else {
          currentList = createList(block);
        }
      }
      if (i === blocks.length - 1) {
        if (currentList && lastBlock && 'children' in lastBlock) {
          lastBlock.children.push(currentList);
          currentList = null;
          return;
        }
        newBlocks.push(block);
        return;
      }
    }
  });

  return newBlocks;
};

// Returns an array of strings, vnodes, or arrays of either
const renderBlocks = (
  blocks: Block[] | BlockSpan[],
  serializers: Serializers,
  level = 0
) => {
  // Nest list items in lists
  const nestedBlocks = nestBlocks(blocks, level);

  // Loop through each block, and serialize it
  return nestedBlocks.map((block) => serializeBlock(block, serializers));
};

const defaultSerializers: Serializers = {
  // For blocks
  types: {
    image: 'image',
    block: blockTextSerializer,
  },
  // For marks
  marks: {
    strong: 'strong',
    em: 'em',
    link: linkSerializer,
    underline: underlineSerializer,
  },
  // For span styles
  styles: {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    normal: 'p',
  },
  hardBreak: () => h('br'),
  span: spanSerializer,
  list: listSerializer,
  listItem: listItemSerializer,
  container: 'div',
};

export const SanityBlocks = defineComponent({
  functional: true,
  props: {
    blocks: {
      type: Array as PropType<Block[]>,
      default: () => [],
    },
    serializers: {
      type: Object as PropType<Partial<Serializers>>,
      default: () => ({}),
    },
  },
  setup(props) {
    const serializers = merge({}, defaultSerializers, props.serializers);

    return () => renderBlocks(toRaw(props.blocks), serializers);
  },
});
