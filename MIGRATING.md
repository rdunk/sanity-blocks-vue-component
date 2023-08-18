# Migrating from sanity-blocks-vue-component to @portabletext/vue

This document outlines the differences between [@portabletext/vue](https://www.npmjs.com/package/@portabletext/vue) and [sanity-blocks-vue-component](https://www.npmjs.com/package/sanity-blocks-vue-component) so you can adjust your code to use the newer @portabletext/vue.

## `SanityBlocks` renamed to `PortableText`

PortableText is an [open-source specification](https://portabletext.org/), and as such we're giving it more prominence through the library and component renaming.

From:

```vue
<script setup>
import { SanityBlocks } from 'sanity-blocks-vue-component';
</script>
<template>
  <SanityBlocks ... />
</template>
```

✅ To:

```vue
<script setup>
import { PortableText } from '@portabletext/vue';
</script>
<template>
  <PortableText ... />
</template>
```

## `blocks` renamed to `value`

This component renders any Portable Text content or custom object (such as `codeBlock`, `mapLocation` or `callToAction`). As `blocks` is tightly coupled to text blocks, we've renamed the main input to `value`.

From:

```vue
<template>
  <SanityBlocks :blocks="[/*...*/]" />
</template>
```

✅ To:

```vue
<template>
  <PortableText :value="[/*...*/]" />
</template>
```

## `serializers` renamed to `components`

"Serializers" are now named "Components".

From:

```vue
<template>
  <SanityBlocks
    :serializers="{
      marks: {/* ... */},
      types: {/* ... */},
      list: {/* ... */},
    }"
  />
</template>
```

✅ To:

```vue
<template>
  <PortableText
    :components="{
      marks: {/* ... */},
      types: {/* ... */},
      list: {/* ... */},
    }"
  />
</template>
```

## New component properties

The properties for custom components (previously "serializers") have changed slightly:

- Blocks: `node` has been renamed to `value`
- Marks: `mark` has been renamed to `value`

## Images aren't handled by default anymore

We've removed the only Sanity-specific part of the module, which was image handling. You'll have to provide a component to specify how images should be rendered yourself in this new version.

We've seen the community have vastly different preferences on how images should be rendered, so having a generic image component included out of the box felt unnecessary.

```vue
<script setup>
import urlBuilder from '@sanity/image-url';
import { getImageDimensions } from '@sanity/asset-utils';

// Barebones lazy-loaded image component
const SampleImageComponent = ({ value }) => {
  const { width, height } = getImageDimensions(value);
  return (
    <img
      :src="urlBuilder().image(value).width(800).fit('max').auto('format').url()"
      :alt="value.alt || ' '"
      loading="lazy"
      :style="{
        // Avoid jumping around with aspect-ratio CSS property
        aspectRatio: width / height,
      }"
    />
  );
};
</script>

<template>
  <!-- You'll now need to define your own image component -->
  <PortableText
    :value="input"
    :components="{
      // ...
      types: {
        image: SampleImageComponent,
      },
    }"
  />;
</template>
```
