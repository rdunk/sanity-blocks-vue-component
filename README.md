<div align="center">
	<h1>Sanity Blocks Vue Component</h1>
  <p>
    <img alt="NPM version" src="https://img.shields.io/npm/v/sanity-blocks-vue-component?color=000&style=flat-square">
    <img alt="NPM downloads" src="https://img.shields.io/npm/dm/sanity-blocks-vue-component?color=000&style=flat-square">
    <img alt="GitHub Release Date" src="https://img.shields.io/github/release-date/rdunk/sanity-blocks-vue-component?color=000&style=flat-square">
    <img alt="Vue version" src="https://img.shields.io/github/package-json/dependency-version/rdunk/sanity-blocks-vue-component/vue?color=000&style=flat-square">
    <img alt="License" src="https://img.shields.io/npm/l/sanity-blocks-vue-component.svg?color=000&style=flat-square">
    </p>
	</p>
	<p>
		<h3>A Vue component for rendering <a href="https://www.sanity.io/docs/block-content" _target="blank">block content</a> from Sanity.</h3>
	<br>
	<br>
</div>

## Install

> **Notice**: This version is a complete rewrite for **Vue 3**. For **Vue 2** and **Nuxt 2**, follow the instructions in the [legacy branch](https://github.com/rdunk/sanity-blocks-vue-component/tree/legacy#sanity-blocks-vue-component).

```bash
$ npm i sanity-blocks-vue-component # or yarn add sanity-blocks-vue-component
```

## Usage

Import directly into your component or view:

```vue
<template>
  <SanityBlocks :blocks="blocks" :serializers="serializers" :use-fallback-serializer="true" />
</template>

<script>
import { SanityBlocks } from 'sanity-blocks-vue-component';
import CustomComponent from 'CustomComponent.vue';

export default {
  components: { SanityBlocks },
  setup() {
    const blocks = [...]; // Sanity block text
    const serializers = {
      types: {
        custom: CustomComponent,
      },
    };
    return { blocks, serializers };
  }
}
</script>
```

Or install globally:

```ts
import { createApp } from 'vue';
import { SanityBlocks } from 'sanity-blocks-vue-component';
import App from './App.vue';

const app = createApp(App);
app.component('sanity-blocks', SanityBlocks);
app.mount('#app');
```

## Props

The following props can be passed to the component.

| Prop                    | Required | Description                                           | Type    |
| ----------------------- | -------- | ----------------------------------------------------- | ------- |
| `blocks`                | Yes      | Block content retrieved from Sanity.                  | Array   |
| `serializers`           | No       | Any custom serializers you want to use. See below.    | Object  |
| `useFallbackSerializer` | No       | Show fallback component if custom type doe not exist. | Boolean |

## Serializers

Serializers are the functions used for rendering block content. They can be defined as a string or a Vue Component. This package comes with default serializers for rendering basic block content, you can pass a `serializer` prop to override or extend the defaults.

| Property    | Description                            |
| ----------- | -------------------------------------- |
| `types`     | Object of serializers for block types. |
| `marks`     | Object of serializers for marks.       |
| `styles`    | Object of serializers for styles.      |
| `list`      | Serializer for list containers.        |
| `listItem`  | Serializer for list items.             |
| `hardBreak` | Serializer for hard breaks.            |

## Component Serializers

The most common use case is defining serializers for custom block types and marks, using the `types` and `marks` serializer properties. For example, if you have a block of type `custom`, you can add a property to the `serializers.types` object with the key `custom` and a value of the Vue component that should serialize blocks of that type.

When using a custom Vue component as a serializer, all properties of the block or mark object (excluding `_key` and `_type`) will be passed as [props](https://v3.vuejs.org/guide/component-props.html).

> **To access the data, you should define the correpsonding props in your component.**

For mark serializers, you can also use [slots](https://v3.vuejs.org/guide/component-slots.html) to access the mark text or content.

## License

[MIT](http://opensource.org/licenses/MIT)
