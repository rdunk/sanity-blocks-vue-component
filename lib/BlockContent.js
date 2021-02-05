'use strict';

var blocksToVue = require('./blocksToVue');

var component = {
  functional: true,
  props: {
    blocks: {
      type: [Array, Object],
      required: true
    },
    serializers: {
      type: Object,
      default: function _default() {
        return {};
      }
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
      default: function _default() {
        return {};
      }
    },
    className: {
      type: String,
      default: undefined
    },
    renderContainerOnSingleChild: {
      type: Boolean,
      default: false
    }
  },
  render: function render(createElement) {
    var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var props = context.props,
        data = context.data;

    return blocksToVue(createElement, props);
  }
};

module.exports = component;
//# sourceMappingURL=BlockContent.js.map