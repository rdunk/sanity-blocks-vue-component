const objectAssign = require('object-assign')
const {blocksToNodes} = require('@sanity/block-content-to-hyperscript/internals')
const getSerializers = require('./serializers')

const isVueComponent = block =>
  block.hasOwnProperty('template') ||
  (block.hasOwnProperty('render') && typeof block.render === 'function')

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

    if (isVueComponent(serializer)) {
      const vueProps = props.node
      const sanityProps = {
        _sanityProps: {
          node: props.node,
          options: props.options
        }
      }
      const allProps = objectAssign({}, vueProps, sanityProps)
      props = {
        props: allProps
      }
    }

    return createElement(tag, props, childNodes)
  }

  const {defaultSerializers, serializeSpan} = getSerializers(renderNode)

  return blocksToNodes(renderNode, options, defaultSerializers, serializeSpan)
}

module.exports = blocksToVue
