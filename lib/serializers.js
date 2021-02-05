'use strict';

var _require = require('@sanity/block-content-to-hyperscript/internals'),
    getImageUrl = _require.getImageUrl;

var objectAssign = require('object-assign');

module.exports = function (h) {
  // Low-level block serializer
  function BlockSerializer(props) {
    var node = props.node,
        serializers = props.serializers,
        options = props.options,
        isInline = props.isInline,
        children = props.children;

    var blockType = node._type;
    var serializer = serializers.types[blockType];
    if (!serializer) {
      throw new Error('Unknown block type "' + blockType + '", please specify a serializer for it in the `serializers.types` prop');
    }

    return h(serializer, {
      node: node,
      options: options,
      isInline: isInline
    }, children);
  }

  // Low-level span serializer
  function SpanSerializer(props) {
    var _props$node = props.node,
        mark = _props$node.mark,
        children = _props$node.children;

    var isPlain = typeof mark === 'string';
    var markType = isPlain ? mark : mark._type;
    var serializer = props.serializers.marks[markType];
    if (!serializer) {
      // @todo Revert back to throwing errors?
      // eslint-disable-next-line no-console
      console.warn('Unknown mark type "' + markType + '", please specify a serializer for it in the `serializers.marks` prop');
      return h(props.serializers.markFallback, null, children);
    }

    return h(serializer, props.node, children);
  }

  // Low-level list serializer
  function ListSerializer(props) {
    var tag = props.type === 'bullet' ? 'ul' : 'ol';
    return h(tag, null, props.children);
  }

  // Low-level list item serializer
  function ListItemSerializer(props) {
    var children = !props.node.style || props.node.style === 'normal' // Don't wrap plain text in paragraphs inside of a list item
    ? props.children // But wrap any other style in whatever the block serializer says to use
    : h(props.serializers.types.block, props, props.children);
    return h('li', null, children);
  }

  // Renderer of an actual block of type `block`. Confusing, we know.
  function BlockTypeSerializer(props) {
    var style = props.node.style || 'normal';

    if (/^h\d/.test(style)) {
      return h(style, null, props.children);
    }

    return style === 'blockquote' ? h('blockquote', null, props.children) : h('p', null, props.children);
  }

  // Serializers for things that can be directly attributed to a tag without any props
  // We use partial application to do this, passing the tag name as the first argument
  function RawMarkSerializer(tag, props) {
    return h(tag, null, props.children);
  }

  function UnderlineSerializer(props) {
    return h('span', {
      style: {
        textDecoration: 'underline'
      }
    }, props.children);
  }

  function StrikeThroughSerializer(props) {
    return h('del', null, props.children);
  }

  function LinkSerializer(props) {
    return h('a', {
      attrs: {
        href: props.mark.href
      }
    }, props.children);
  }

  function ImageSerializer(props) {
    var img = h('img', {
      attrs: {
        src: getImageUrl(props)
      }
    });
    return props.isInline ? img : h('figure', null, img);
  }

  // Serializer that recursively calls itself, producing a hyperscript tree of spans
  function serializeSpan(span, serializers, index, options) {
    if (span === '\n' && serializers.hardBreak) {
      return h(serializers.hardBreak, {
        key: 'hb-' + index
      });
    }

    if (typeof span === 'string') {
      return serializers.text ? h(serializers.text, {
        key: 'text-' + index
      }, span) : span;
    }

    var children = void 0;
    if (span.children) {
      children = {
        children: span.children.map(function (child, i) {
          return options.serializeNode(child, i, span.children, true);
        })
      };
    }

    var serializedNode = objectAssign({}, span, children);

    return h(serializers.span, {
      key: span._key || 'span-' + index,
      node: serializedNode,
      serializers: serializers
    });
  }

  var HardBreakSerializer = function HardBreakSerializer() {
    return h('br');
  };
  var defaultMarkSerializers = {
    strong: RawMarkSerializer.bind(null, 'strong'),
    em: RawMarkSerializer.bind(null, 'em'),
    code: RawMarkSerializer.bind(null, 'code'),
    underline: UnderlineSerializer,
    'strike-through': StrikeThroughSerializer,
    link: LinkSerializer
  };

  function ContainerSerializer(props) {
    var properties = null;
    var containerClass = props.className;
    if (containerClass) {
      properties = {
        class: containerClass
      };
    }
    return h('div', properties, props.children);
  }

  var defaultSerializers = {
    // Common overrides
    types: {
      block: BlockTypeSerializer,
      image: ImageSerializer
    },
    marks: defaultMarkSerializers,

    // Less common overrides
    list: ListSerializer,
    listItem: ListItemSerializer,

    block: BlockSerializer,
    span: SpanSerializer,
    hardBreak: HardBreakSerializer,

    container: ContainerSerializer,

    // When we can't resolve the mark properly, use this renderer as the container
    markFallback: 'span',

    // Allow overriding text renderer, but leave undefined to just use plain strings by default
    text: undefined,

    // Empty nodes (React uses null, hyperscript with empty strings)
    empty: null
  };

  return {
    defaultSerializers: defaultSerializers,
    serializeSpan: serializeSpan
  };
};
//# sourceMappingURL=serializers.js.map