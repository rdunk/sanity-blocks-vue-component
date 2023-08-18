import { h } from 'vue';
import type { ToolkitNestedPortableTextSpan, ToolkitTextNode } from '@portabletext/toolkit';
import type {
  MissingComponentHandler,
  NodeRenderer,
  PortableTextVueComponents,
  ReactPortableTextList,
  Serializable,
  SerializedBlock,
  VueNode,
} from './types';
import type {
  PortableTextBlock,
  PortableTextListItemBlock,
  PortableTextMarkDefinition,
  PortableTextSpan,
  TypedObject,
} from '@portabletext/types';
import {
  isPortableTextBlock,
  isPortableTextListItemBlock,
  isPortableTextToolkitList,
  isPortableTextToolkitSpan,
  isPortableTextToolkitTextNode,
  spanToPlainText,
  buildMarksTree,
} from '@portabletext/toolkit';
import {
  unknownBlockStyleWarning,
  unknownListItemStyleWarning,
  unknownListStyleWarning,
  unknownMarkWarning,
  unknownTypeWarning,
} from './warnings';

export const getNodeRenderer = (
  components: PortableTextVueComponents,
  handleMissingComponent: MissingComponentHandler,
): NodeRenderer => {
  function renderNode<N extends TypedObject>(options: Serializable<N>): VueNode {
    const { node, index, isInline } = options;
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
    const tree = serializeBlock({ node, index, isInline: false, renderNode });
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
      const { listItem, ...blockNode } = node;
      children = renderNode({
        node: blockNode,
        index,
        isInline: false,
        renderNode,
      });
    }

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
        node: child._key ? child : { ...child, _key: `li-${index}-${childIndex}` },
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
    const { markDef, markType, markKey } = node;
    const Span = components.marks[markType] || components.unknownMark;
    const children = node.children.map((child, childIndex) =>
      renderNode({ node: child, index: childIndex, isInline: true, renderNode }),
    );

    if (Span === components.unknownMark) {
      handleMissingComponent(unknownMarkWarning(markType), {
        nodeType: 'mark',
        type: markType,
      });
    }

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
    const { _key, children, ...props } = serializeBlock({
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

    return h(Block, { key, ...props, value: props.node, renderNode }, () => children);
  }

  function renderText(node: ToolkitTextNode, key: string) {
    if (node.text === '\n') {
      const HardBreak = components.hardBreak;
      return HardBreak ? h(HardBreak, { key }) : '\n';
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
    return h(UnknownType, { key, ...nodeOptions });
  }

  function renderCustomBlock(node: TypedObject, index: number, key: string, isInline: boolean) {
    const nodeOptions = {
      value: node,
      isInline,
      index,
      renderNode,
    };

    const Node = components.types[node._type];
    return Node ? h(Node, { key, ...nodeOptions }) : undefined;
  }

  return renderNode;
};

function serializeBlock(options: Serializable<PortableTextBlock>): SerializedBlock {
  const { node, index, isInline, renderNode } = options;
  const tree = buildMarksTree(node);
  const children = tree.map((child, i) =>
    renderNode({ node: child, isInline: true, index: i, renderNode }),
  ) as VueNode; // @todo Is casting here acceptable?

  return {
    _key: node._key || `block-${index}`,
    children,
    index,
    isInline,
    node,
  };
}
