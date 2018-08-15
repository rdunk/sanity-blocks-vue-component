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
|`serializers`|No|Any required custom serializers.|Object|
|`className`|No|The class applied to any container element if present.|String|
|`projectId`|No|ID of the Sanity project.|String|
|`dataset`|No|Name of the Sanity dataset containing the document that is being rendered.|String|
|`imageOptions`|No|Query parameters to apply in image blocks to control size/crop mode etc.|Object|

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