const {getImageUrl} = require('@sanity/block-content-to-hyperscript/internals')
const objectAssign = require('object-assign')

module.exports = h => {
  // Low-level block serializer
  function BlockSerializer(props) {
    const {node, serializers, options, isInline, children} = props
    const blockType = node._type
    const serializer = serializers.types[blockType]
    if (!serializer) {
      throw new Error(
        `Unknown block type "${blockType}", please specify a serializer for it in the \`serializers.types\` prop`
      )
    }

    return h(
      serializer,
      {
        node,
        options,
        isInline
      },
      children
    )
  }

  // Low-level span serializer
  function SpanSerializer(props) {
    const {mark, children} = props.node
    const isPlain = typeof mark === 'string'
    const markType = isPlain ? mark : mark._type
    const serializer = props.serializers.marks[markType]
    if (!serializer) {
      // @todo Revert back to throwing errors?
      // eslint-disable-next-line no-console
      console.warn(
        `Unknown mark type "${markType}", please specify a serializer for it in the \`serializers.marks\` prop`
      )
      return h(props.serializers.markFallback, null, children)
    }

    return h(serializer, props.node, children)
  }

  // Low-level list serializer
  function ListSerializer(props) {
    const tag = props.type === 'bullet' ? 'ul' : 'ol'
    return h(tag, {}, props.children)
  }

  // Low-level list item serializer
  function ListItemSerializer(props) {
    return h('li', null, props.children)
  }

  // Renderer of an actual block of type `block`. Confusing, we know.
  function BlockTypeSerializer(props) {
    const style = props.node.style || 'normal'

    if (/^h\d/.test(style)) {
      return h(style, null, props.children)
    }

    return style === 'blockquote'
      ? h('blockquote', null, props.children)
      : h('p', null, props.children)
  }

  // Serializers for things that can be directly attributed to a tag without any props
  // We use partial application to do this, passing the tag name as the first argument
  function RawMarkSerializer(tag, props) {
    return h(tag, null, props.children)
  }

  function UnderlineSerializer(props) {
    return h(
      'span',
      {
        style: {
          textDecoration: 'underline'
        }
      },
      props.children
    )
  }

  function StrikeThroughSerializer(props) {
    return h('del', null, props.children)
  }

  function LinkSerializer(props) {
    return h(
      'a',
      {
        attrs: {
          href: props.mark.href
        }
      },
      props.children
    )
  }

  function ImageSerializer(props) {
    const img = h('img', {
      attrs: {
        src: getImageUrl(props)
      }
    })
    return props.isInline ? img : h('figure', null, [img])
  }

  // Serializer that recursively calls itself, producing a hyperscript tree of spans
  function serializeSpan(span, serializers, index, options) {
    if (span === '\n' && serializers.hardBreak) {
      return h(serializers.hardBreak, {
        key: `hb-${index}`
      })
    }

    if (typeof span === 'string') {
      return serializers.text
        ? h(
            serializers.text,
            {
              key: `text-${index}`
            },
            span
          )
        : span
    }

    let children
    if (span.children) {
      children = {
        children: span.children.map((child, i) =>
          options.serializeNode(child, i, span.children, true)
        )
      }
    }

    const serializedNode = objectAssign({}, span, children)

    return h(serializers.span, {
      key: span._key || `span-${index}`,
      node: serializedNode,
      serializers
    })
  }

  const HardBreakSerializer = () => h('br')
  const defaultMarkSerializers = {
    strong: RawMarkSerializer.bind(null, 'strong'),
    em: RawMarkSerializer.bind(null, 'em'),
    code: RawMarkSerializer.bind(null, 'code'),
    underline: UnderlineSerializer,
    'strike-through': StrikeThroughSerializer,
    link: LinkSerializer
  }

  function ContainerSerializer(props) {
    let properties = null
    const containerClass = props.className
    if (containerClass) {
      properties = {
        class: containerClass
      }
    }
    return h('div', properties, props.children)
  }

  const defaultSerializers = {
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
    // empty: () => h('div', {}, '')
    empty: null
  }

  return {
    defaultSerializers,
    serializeSpan
  }
}
