const objectAssign = require('object-assign')
const {blocksToNodes} = require('@sanity/block-content-to-hyperscript/internals')
const getSerializers = require('./serializers')
const transformProperties = require('./transformProperties')

function blocksToVue(createElement, options) {
  const renderNode = (serializer, properties, children) => {
    let props = properties || {}
    if (typeof serializer === 'function') {
      return serializer(
        objectAssign({}, props, {
          children
        })
      )
    }

    const tag = serializer
    const childNodes = props.children || children

    // @TODO This isn't ideal but needed for passing tests
    props = transformProperties(props)
    // If we have a Vue component ...
    if (serializer.render && typeof serializer.render === 'function') {
      props = props.node
    }

    return createElement(tag, props, childNodes)
  }

  const {defaultSerializers, serializeSpan} = getSerializers(renderNode)

  return blocksToNodes(renderNode, options, defaultSerializers, serializeSpan)
}

module.exports = blocksToVue
