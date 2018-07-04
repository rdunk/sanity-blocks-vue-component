const blocksToVue = require('./blocksToVue')

const component = {
  functional: true,
  props: {
    blocks: {
      type: [Array, Object],
      required: true
    },
    serializers: {
      type: Object,
      default: () => ({})
    },
    projectId: {
      type: String,
      default: undefined
    },
    dataset: {
      type: String,
      default: undefined
    },
    imageOptions: {
      type: Object,
      default: () => ({})
    },
    className: {
      type: String,
      default: undefined
    }
  },
  render(createElement, context = {}) {
    const {props, data} = context
    return blocksToVue(createElement, props)
  }
}

module.exports = component
