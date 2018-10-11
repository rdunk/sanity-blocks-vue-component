# sanity-blocks-vue-component

A Vue component for rendering [block text](https://www.sanity.io/docs/schema-types/block-type) from [Sanity](https://www.sanity.io/). Allows you to pass other Vue components as custom serializers.

## Contents

- [Installing](#installing)
- [Usage](#usage)
- [Props](#props)
- [Serializer Property](serializer-property)
- [Component Serializers](component-serializers)
- [Full Example](#full-example)
- [Credits](#credits)
- [License](#license)

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

Basic usage in a single file component, see the [full example](#full-example) below for more detail.

```html
<template>
  <block-content
  :blocks="blocks" 
  :serializers="serializers"
  />
</template>

<script>
import MyComponent from 'MyComponent.vue'

export default {
  data() {
    return {
      blocks : [...], // Sanity block text
      serializers: {
        types: {
          foo: MyComponent
        }
      }
    };
  }
};
</script>
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
When using custom Vue components as block serializers, all properties of the block object will be passed via [`v-bind`](https://vuejs.org/v2/api/#v-bind). **To access the data, define the corresponding [props](https://vuejs.org/v2/guide/components-props.html) in your component**. Components will also be passed a `_sanityProps` prop which is an object with two properties:

- `node` - the block data object.
- `options` - Sanity specific options (`projectId`, `dataset`, `imageOptions`) passed to the root component.

This additional prop can be useful for generating image URLs using the [@sanity/image-url](https://github.com/sanity-io/sanity/tree/next/packages/%40sanity/image-url) package.

### For Marks
When using custom Vue components as mark serializers, all properties of the block object will be passed via [`v-bind`](https://vuejs.org/v2/api/#v-bind). **To access the data, define the corresponding [props](https://vuejs.org/v2/guide/components-props.html) in your component**. You can use [slots](https://vuejs.org/v2/guide/components-slots.html) (e.g. `this.$slots.default`) to access the mark text or content.

## Full Example

#### MainComponent.vue

```html
<template>
  <block-content
  :blocks="blocks" 
  :serializers="serializers"
  />
</template>

<script>
// Import the component if not already added globally
import BlockContent from 'sanity-blocks-vue-component'
// Import any components to be used as serializers
import GreetingComponent from 'GreetingComponent.vue'

export default {
  components: {
    BlockContent
  },
  data() {
    return {
      // The block data will usually be retrieved from Sanity
      blocks: [
        {
          _type: 'greeting', // Sanity specific prop, corresponds to the serializer name
          _key: 'example', // Sanity specific prop
          firstname: 'Foobert', // Example custom property for this block type
          lastname: 'Barson', // Example custom property for this block type
        }
      ],
      serializers: {
        types: {
          greeting: GreetingComponent
        }
      }
    };
  }
};
</script>
```

##### GreetingComponent.vue
```html
<template>
  <div>Hello, {{ firstname }} {{ lastname }}.</div>
</template>

<script>
export default {
  // Define the block object properties this component receives as props
  props: {
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    }
  },
}
</script>
```

## Credits

Relies heavily on the official Sanity [block-content-to-hyperscript](https://github.com/sanity-io/block-content-to-hyperscript) package.


## License

[MIT](http://opensource.org/licenses/MIT)