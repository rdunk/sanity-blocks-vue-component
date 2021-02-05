const objectAssign = require('object-assign')
const {blocksToNodes} = require('@sanity/block-content-to-hyperscript/internals')
const getSerializers = require('./serializers')

const isVueComponent = block =>
  Object.hasOwnProperty.call(block, 'template') ||
  (Object.hasOwnProperty.call(block, 'render') && typeof block.render === 'function')

function blocksToVue(createElement, options) {
  const renderNode = (serializer, properties, children) => {
    let data = properties || {}
    if (typeof serializer === 'function') {
      return serializer(
        objectAssign({}, data, {
          children
        })
      )
    }

    const tag = serializer
    let childNodes = data.children || children
    childNodes = Array.isArray(childNodes) ? childNodes : [childNodes]
    if (isVueComponent(serializer)) {
      let vueProps = {}
      let sanityProps = {}
      if (data.mark) {
        // If rendering a mark, we just pass the mark properties
        vueProps = data.mark
      } else {
        // If rendering a node, also pass options and original node
        vueProps = data.node || data
        sanityProps._sanityProps = {
          node: data.node,
          options: data.options
        }
      }
      const props = objectAssign({}, vueProps, sanityProps)
      data = {props}
    }

    return createElement(tag, data, childNodes)
  }

  const {defaultSerializers, serializeSpan} = getSerializers(renderNode)

  return blocksToNodes(renderNode, options, defaultSerializers, serializeSpan)
}

module.exports = blocksToVue
