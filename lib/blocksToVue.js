'use strict';

var objectAssign = require('object-assign');

var _require = require('@sanity/block-content-to-hyperscript/internals'),
    blocksToNodes = _require.blocksToNodes;

var getSerializers = require('./serializers');

var isVueComponent = function isVueComponent(block) {
  return Object.hasOwnProperty.call(block, 'template') || Object.hasOwnProperty.call(block, 'render') && typeof block.render === 'function';
};

function blocksToVue(createElement, options) {
  var renderNode = function renderNode(serializer, properties, children) {
    var data = properties || {};
    if (typeof serializer === 'function') {
      return serializer(objectAssign({}, data, {
        children: children
      }));
    }

    var tag = serializer;
    var childNodes = data.children || children;
    childNodes = Array.isArray(childNodes) ? childNodes : [childNodes];
    if (isVueComponent(serializer)) {
      var vueProps = {};
      var sanityProps = {};
      if (data.mark) {
        // If rendering a mark, we just pass the mark properties
        vueProps = data.mark;
      } else {
        // If rendering a node, also pass options and original node
        vueProps = data.node || data;
        sanityProps._sanityProps = {
          node: data.node,
          options: data.options
        };
      }
      var props = objectAssign({}, vueProps, sanityProps);
      data = { props: props };
    }

    return createElement(tag, data, childNodes);
  };

  var _getSerializers = getSerializers(renderNode),
      defaultSerializers = _getSerializers.defaultSerializers,
      serializeSpan = _getSerializers.serializeSpan;

  return blocksToNodes(renderNode, options, defaultSerializers, serializeSpan);
}

module.exports = blocksToVue;
//# sourceMappingURL=blocksToVue.js.map