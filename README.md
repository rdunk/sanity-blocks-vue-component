# sanity-blocks-vue-component

A Vue component for rendering [block text](https://www.sanity.io/docs/schema-types/block-type) from [Sanity](https://www.sanity.io/). Allows you to pass other Vue components as custom serializers.

## Installing

### via npm

```
npm install --save sanity-blocks-vue-component
```

### Add Component Globally

```js
import BlockContent from 'sanity-blocks-vue-component'
Vue.component('block-content', BlockContent);
```

## Usage

### Script
```javascript
import MyComponent from 'MyComponent.vue'

export default {
  data() {
    return {
      blocks : [...], // Sanity block text
      serializers: {
        types: {
          custom: MyComponent
        }
      }
    };
  }
};
```

### Template
```html
<block-content
:blocks="blocks" 
:serializers="serializers"
/>
```

## Props

The following props can be passed to the component.

|Prop|Required|Description|Type|
|:---|---|---|---|
|`blocks`|Yes|Block text retreived from Sanity.|Array, Object|
|`serializers`|No|Any required custom serializers, see below for more detail.|Object|
|`className`|No|The class applied to any container element if present. Ignored if a custom container serializer is passed.|String|
|`projectId`|No|ID of the Sanity project.|String|
|`dataset`|No|Name of the Sanity dataset containing the document that is being rendered.|String|
|`imageOptions`|No|Query parameters to apply in image blocks to control size/crop mode etc.|Object|
|`renderContainerOnSingleChild`|No|Set true to enforce a container element for single block input data.|Boolean|

## Serializer Property
Serializers are the functions used for rendering block content. They can be defined either as a string (e.g. `div`) or as a Vue Component (see below for more detail). This package comes with default serializers that will work for rendering basic block content, but you may pass a `serializer` prop to override or extend the default serializers. The object passed will be merged with the default serializers object.

|Property|Description|
|:---|---|
|`types`|Object of serializers for block types.|
|`marks`|Object of serializers for marks.|
|`list`|Serializer for list containers.|
|`listItem`|Serializer for list items.|
|`hardBreak`|Serializer for hard breaks.|
|`container`|Serializer for the element used to wrap the blocks.|

## Component Serializers

### For Blocks
When using custom Vue components as block serializers, all properties of the block object will be passed as props. Components will also be passed a `_sanityProps` prop which is an object with two properties:

- `node` - the block data object.
- `options` - Sanity specific options (`projectId`, `dataset`, `imageOptions`) passed to the root component.

This additional prop can be useful for generating image URLs using the [@sanity/image-url](https://github.com/sanity-io/sanity/tree/next/packages/%40sanity/image-url) package.

### For Marks
When using custom Vue components as mark serializers, all properties of the mark object will be passed as props. You can use [slots](https://vuejs.org/v2/guide/components-slots.html) (e.g. `this.$slots.default`) to access the mark text or content.

## Credits

Relies heavily on the official Sanity [block-content-to-hyperscript](https://github.com/sanity-io/block-content-to-hyperscript) package.


## License

[MIT](http://opensource.org/licenses/MIT)