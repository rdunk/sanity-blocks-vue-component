import {h, defineComponent} from 'vue';
import type {PropType} from 'vue';
import {
  LIST_NEST_MODE_HTML,
  ToolkitNestedPortableTextSpan,
  ToolkitTextNode,
} from '@portabletext/toolkit';
import type {
  MissingComponentHandler,
  NodeRenderer,
  PortableTextProps,
  PortableTextVueComponents,
  ReactPortableTextList,
  Serializable,
  SerializedBlock,
  VueNode,
} from './types';
import {
  isPortableTextBlock,
  isPortableTextListItemBlock,
  isPortableTextToolkitList,
  isPortableTextToolkitSpan,
  isPortableTextToolkitTextNode,
  nestLists,
  spanToPlainText,
  buildMarksTree,
} from '@portabletext/toolkit';
import type {
  PortableTextBlock,
  PortableTextListItemBlock,
  PortableTextMarkDefinition,
  PortableTextSpan,
  TypedObject,
} from '@portabletext/types';
import {mergeComponents} from './components/merge';
import {defaultComponents} from './components/defaults';
import {
  printWarning,
  unknownBlockStyleWarning,
  unknownListItemStyleWarning,
  unknownListStyleWarning,
  unknownMarkWarning,
  unknownTypeWarning,
} from './warnings';

export const PortableText = defineComponent({
  name: 'PortableText',
  props: {
    value: {
      type: [Object, Array] as PropType<TypedObject | TypedObject[]>,
      required: true,
    },
    components: {
      type: Object as PropType<Partial<PortableTextVueComponents> | undefined>,
      required: false,
    },
    listNestingMode: {
      type: null,
    },
    onMissingComponent: {
      type: null,
      default: printWarning,
    },
  },
  setup(props) {
    const handleMissingComponent = props.onMissingComponent || noop;
    const blocks = Array.isArray(props.value) ? props.value : [props.value];
    const nested = nestLists(blocks, props.listNestingMode || LIST_NEST_MODE_HTML);

    const components = props.components
      ? mergeComponents(defaultComponents, props.components)
      : defaultComponents;

    const renderNode = getNodeRenderer(components, handleMissingComponent);

    const rendered = nested.map((node, index) =>
      renderNode({node: node, index, isInline: false, renderNode}),
    );

    return () => rendered;
  },
});

export function PortableTextR<B extends TypedObject = PortableTextBlock>({
  value: input,
  components: componentOverrides,
  listNestingMode,
  onMissingComponent: missingComponentHandler = printWarning,
}: PortableTextProps<B>) {
  const handleMissingComponent = missingComponentHandler || noop;
  const blocks = Array.isArray(input) ? input : [input];
  const nested = nestLists(blocks, listNestingMode || LIST_NEST_MODE_HTML);

  const components = componentOverrides
    ? mergeComponents(defaultComponents, componentOverrides)
    : defaultComponents;

  const renderNode = getNodeRenderer(components, handleMissingComponent);

  const rendered = nested.map((node, index) =>
    renderNode({node: node, index, isInline: false, renderNode}),
  );

  // return <>{rendered}</>;
  return rendered;
}

const getNodeRenderer = (
  components: PortableTextVueComponents,
  handleMissingComponent: MissingComponentHandler,
): NodeRenderer => {
  function renderNode<N extends TypedObject>(options: Serializable<N>): VueNode {
    const {node, index, isInline} = options;
    const key = node._key || `node-${index}`;

    if (isPortableTextToolkitList(node)) {
      return renderList(node, index, key);
    }

    if (isPortableTextListItemBlock(node)) {
      return renderListItem(node, index, key);
    }

    if (isPortableTextToolkitSpan(node)) {
      return renderSpan(node, index, key);
    }

    if (hasCustomComponentForNode(node)) {
      return renderCustomBlock(node, index, key, isInline);
    }

    if (isPortableTextBlock(node)) {
      return renderBlock(node, index, key, isInline);
    }

    if (isPortableTextToolkitTextNode(node)) {
      return renderText(node, key);
    }

    return renderUnknownType(node, index, key, isInline);
  }

  function hasCustomComponentForNode(node: TypedObject): boolean {
    return node._type in components.types;
  }

  function renderListItem(
    node: PortableTextListItemBlock<PortableTextMarkDefinition, PortableTextSpan>,
    index: number,
    key: string,
  ) {
    const tree = serializeBlock({node, index, isInline: false, renderNode});
    const renderer = components.listItem;
    const handler = typeof renderer === 'function' ? renderer : renderer[node.listItem];
    const Li = handler || components.unknownListItem;

    if (Li === components.unknownListItem) {
      const style = node.listItem || 'bullet';
      handleMissingComponent(unknownListItemStyleWarning(style), {
        type: style,
        nodeType: 'listItemStyle',
      });
    }

    let children = tree.children;
    if (node.style && node.style !== 'normal') {
      // Wrap any other style in whatever the block serializer says to use
      const {listItem, ...blockNode} = node;
      children = renderNode({
        node: blockNode,
        index,
        isInline: false,
        renderNode,
      });
    }

    // return (
    //   <Li
    //     key={key}
    //     value={node}
    //     index={index}
    //     isInline={false}
    //     renderNode={renderNode}
    //   >
    //     {children}
    //   </Li>
    // );
    return h(
      Li,
      {
        key,
        value: node,
        index,
        isInline: false,
        renderNode,
      },
      () => children,
    );
  }

  function renderList(node: ReactPortableTextList, index: number, key: string) {
    const children = node.children.map((child, childIndex) =>
      renderNode({
        node: child._key ? child : {...child, _key: `li-${index}-${childIndex}`},
        index: childIndex,
        isInline: false,
        renderNode,
      }),
    );

    const component = components.list;
    const handler = typeof component === 'function' ? component : component[node.listItem];
    const List = handler || components.unknownList;

    if (List === components.unknownList) {
      const style = node.listItem || 'bullet';
      handleMissingComponent(unknownListStyleWarning(style), {
        nodeType: 'listStyle',
        type: style,
      });
    }

    return h(
      List,
      {
        key,
        value: node,
        index,
        isInline: false,
        renderNode,
      },
      () => children,
    );
  }

  function renderSpan(node: ToolkitNestedPortableTextSpan, _index: number, key: string) {
    const {markDef, markType, markKey} = node;
    const Span = components.marks[markType] || components.unknownMark;
    const children = node.children.map((child, childIndex) =>
      renderNode({node: child, index: childIndex, isInline: true, renderNode}),
    );

    if (Span === components.unknownMark) {
      handleMissingComponent(unknownMarkWarning(markType), {
        nodeType: 'mark',
        type: markType,
      });
    }

    // return (
    //   <Span
    //     key={key}
    //     text={spanToPlainText(node)}
    //     value={markDef}
    //     markType={markType}
    //     markKey={markKey}
    //     renderNode={renderNode}
    //   >
    //     {children}
    //   </Span>
    // );
    return h(
      Span,
      {
        key,
        text: spanToPlainText(node),
        value: markDef,
        markType,
        markKey,
        renderNode,
      },
      () => children,
    );
  }

  function renderBlock(node: PortableTextBlock, index: number, key: string, isInline: boolean) {
    const {_key, children, ...props} = serializeBlock({
      node,
      index,
      isInline,
      renderNode,
    });
    const style = props.node.style || 'normal';
    const handler =
      typeof components.block === 'function' ? components.block : components.block[style];
    const Block = handler || components.unknownBlockStyle;

    if (Block === components.unknownBlockStyle) {
      handleMissingComponent(unknownBlockStyleWarning(style), {
        nodeType: 'blockStyle',
        type: style,
      });
    }

    // return (
    //   <Block key={key} {...props} value={props.node} renderNode={renderNode} />
    // );

    return h(Block, {key, ...props, value: props.node, renderNode}, () => children);
  }

  function renderText(node: ToolkitTextNode, key: string) {
    if (node.text === '\n') {
      const HardBreak = components.hardBreak;
      // return HardBreak ? <HardBreak key={key} /> : '\n';
      return HardBreak ? h(HardBreak, {key}) : '\n';
    }

    return node.text;
  }

  function renderUnknownType(node: TypedObject, index: number, key: string, isInline: boolean) {
    const nodeOptions = {
      value: node,
      isInline,
      index,
      renderNode,
    };

    handleMissingComponent(unknownTypeWarning(node._type), {
      nodeType: 'block',
      type: node._type,
    });

    const UnknownType = components.unknownType;
    return h(UnknownType, {key, ...nodeOptions});
  }

  function renderCustomBlock(node: TypedObject, index: number, key: string, isInline: boolean) {
    const nodeOptions = {
      value: node,
      isInline,
      index,
      renderNode,
    };

    const Node = components.types[node._type];
    return Node ? h(Node, {key, ...nodeOptions}) : undefined;
  }

  return renderNode;
};

function serializeBlock(options: Serializable<PortableTextBlock>): SerializedBlock {
  const {node, index, isInline, renderNode} = options;
  const tree = buildMarksTree(node);
  const children = tree.map((child, i) =>
    renderNode({node: child, isInline: true, index: i, renderNode}),
  ) as VueNode; // @TODO Hmm...

  return {
    _key: node._key || `block-${index}`,
    children,
    index,
    isInline,
    node,
  };
}

function noop() {
  // Intentional noop
}
