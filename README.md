# @portabletext/vue

[![npm version](https://img.shields.io/npm/v/@portabletext/vue.svg?style=flat-square)](https://www.npmjs.com/package/@portabletext/vue)[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@portabletext/vue?style=flat-square)](https://bundlephobia.com/result?p=@portabletext/vue)[![Build Status](https://img.shields.io/github/actions/workflow/status/portabletext/vue-portabletext/main.yml?branch=main&style=flat-square)](https://github.com/portabletext/vue-portabletext/actions?query=workflow%3Atest)

Render [Portable Text](https://portabletext.org/) with Vue.

Migrating from [sanity-blocks-vue-component](https://www.npmjs.com/package/rdunk/sanity-blocks-vue-component)? Refer to the [migration docs](https://github.com/portabletext/vue-portabletext/blob/main/MIGRATING.md).

## Table of contents

- [Installation](#installation)
- [Basic usage](#basic-usage)
- [Styling](#styling-the-output)
- [Customizing components](#customizing-components)
- [Available components](#available-components)
  - [types](#types)
  - [marks](#marks)
  - [block](#block)
  - [list](#list)
  - [listItem](#listItem)
  - [hardBreak](#hardBreak)
  - [unknown components](#unknownMark)
- [Disable warnings / Handling unknown types](#disabling-warnings--handling-unknown-types)
- [Rendering Plain Text](#rendering-plain-text)
- [Typing Portable Text](#typing-portable-text)

## Installation

```
npm install --save @portabletext/vue
```

## Basic usage

```vue
<script setup>
import { PortableText } from '@portabletext/vue';
</script>

<template>
  <PortableText
    :value="[
      /* array of portable text blocks */
    ]"
    :components="/* optional object of custom components to use */"
  />
</template>
```

## Styling the output

The rendered HTML does not have any styling applied, so you will either render a parent container with a class name you can target in your CSS, or pass [custom components](#customizing-components) if you want to control the direct markup and CSS of each element.

## Customizing components

Default components are provided for all standard features of the Portable Text spec, with logical HTML defaults. You can pass an object of components to use, both to override the defaults and to provide components for your custom content types.

Provided components will be merged with the defaults. In other words, you only need to provide the things you want to override.

```js
const myPortableTextComponents = {
  types: {
    image: ({ value }) => <img src={value.imageUrl} />,
    callToAction: ({ value, isInline }) =>
      isInline ? (
        <a href={value.url}>{value.text}</a>
      ) : (
        <div className="callToAction">{value.text}</div>
      ),
  },

  marks: {
    link: ({ children, value }) => {
      const rel = !value.href.startsWith('/')
        ? 'noreferrer noopener'
        : undefined;
      return (
        <a href={value.href} rel={rel}>
          {children}
        </a>
      );
    },
  },
};

const YourComponent = (props) => {
  return (
    <PortableText value={props.value} components={myPortableTextComponents} />
  );
};
```

## Available components

These are the overridable/implementable keys:

### `types`

An object of Vue components that renders different types of objects that might appear both as part of the input array, or as inline objects within text blocks - eg alongside text spans.

Use the `isInline` property to check whether or not this is an inline object or a block.

The object has the shape `{typeName: ReactComponent}`, where `typeName` is the value set in individual `_type` attributes.

Example of rendering a custom `image` object:

```jsx
import { PortableText } from '@portabletext/vue';
import urlBuilder from '@sanity/image-url';
import { getImageDimensions } from '@sanity/asset-utils';

// Barebones lazy-loaded image component
const SampleImageComponent = ({ value, isInline }) => {
  const { width, height } = getImageDimensions(value);
  return (
    <img
      src={urlBuilder()
        .image(value)
        .width(isInline ? 100 : 800)
        .fit('max')
        .auto('format')
        .url()}
      alt={value.alt || ' '}
      loading="lazy"
      style={{
        // Display alongside text if image appears inside a block text span
        display: isInline ? 'inline-block' : 'block',

        // Avoid jumping around with aspect-ratio CSS property
        aspectRatio: width / height,
      }}
    />
  );
};

const components = {
  types: {
    image: SampleImageComponent,
    // Any other custom types you have in your content
    // Examples: mapLocation, contactForm, code, featuredProjects, latestNews, etc.
  },
};

const YourComponent = (props) => {
  return <PortableText value={somePortableTextInput} components={components} />;
};
```

### `marks`

Object of Vue components that renders different types of marks that might appear in spans. Marks can be either be simple "decorators" (eg emphasis, underline, italic) or full "annotations" which include associated data (eg links, references, descriptions).

If the mark is a decorator, the component will receive a `markType` prop which has the name of the decorator (eg `em`). If the mark is an annotation, it will receive both a `markType` with the associated `_type` property (eg `link`), and a `value` property with an object holding the data for this mark.

The component also receives a `children` prop that should (usually) be returned in whatever parent container component makes sense for this mark (eg `<a>`, `<em>`).

```tsx
// `components` object you'll pass to PortableText w/ optional TS definition
import { PortableTextComponents } from '@portabletext/vue';

const components: PortableTextComponents = {
  marks: {
    // Ex. 1: custom renderer for the em / italics decorator
    em: ({ children }) => (
      <em className="text-gray-600 font-semibold">{children}</em>
    ),

    // Ex. 2: rendering a custom `link` annotation
    link: ({ value, children }) => {
      const target = (value?.href || '').startsWith('http')
        ? '_blank'
        : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === '_blank' && 'noindex nofollow'}
        >
          {children}
        </a>
      );
    },
  },
};
```

### `block`

An object of Vue components that renders portable text blocks with different `style` properties. The object has the shape `{styleName: ReactComponent}`, where `styleName` is the value set in individual `style` attributes on blocks (`normal` being the default).

```jsx
// `components` object you'll pass to PortableText
const components = {
  block: {
    // Ex. 1: customizing common block types
    h1: ({ children }) => <h1 className="text-2xl">{children}</h1>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-purple-500">{children}</blockquote>
    ),

    // Ex. 2: rendering custom styles
    customHeading: ({ children }) => (
      <h2 className="text-lg text-primary text-purple-700">{children}</h2>
    ),
  },
};
```

The `block` object can also be set to a single Vue component, which would handle block styles of _any_ type.

### `list`

Object of Vue components used to render lists of different types (`bullet` vs `number`, for instance, which by default is `<ul>` and `<ol>`, respectively).

Note that there is no actual "list" node type in the Portable Text specification, but a series of list item blocks with the same `level` and `listItem` properties will be grouped into a virtual one inside of this library.

```jsx
const components = {
  list: {
    // Ex. 1: customizing common list types
    bullet: ({ children }) => <ul className="mt-xl">{children}</ul>,
    number: ({ children }) => <ol className="mt-lg">{children}</ol>,

    // Ex. 2: rendering custom lists
    checkmarks: ({ children }) => (
      <ol className="m-auto text-lg">{children}</ol>
    ),
  },
};
```

The `list` property can also be set to a single Vue component, which would handle lists of _any_ type.

### `listItem`

Object of Vue components used to render different list item styles. The object has the shape `{listItemType: ReactComponent}`, where `listItemType` is the value set in individual `listItem` attributes on blocks.

```jsx
const components = {
  listItem: {
    // Ex. 1: customizing common list types
    bullet: ({ children }) => (
      <li style={{ listStyleType: 'disclosure-closed' }}>{children}</li>
    ),

    // Ex. 2: rendering custom list items
    checkmarks: ({ children }) => <li>✅ {children}</li>,
  },
};
```

The `listItem` property can also be set to a single Vue component, which would handle list items of _any_ type.

### `hardBreak`

Component to use for rendering "hard breaks", eg `\n` inside of text spans.

Will by default render a `<br />`. Pass `false` to render as-is (`\n`)

### `unknownMark`

Vue component used when encountering a mark type there is no registered component for in the `components.marks` prop.

### `unknownType`

Vue component used when encountering an object type there is no registered component for in the `components.types` prop.

### `unknownBlockStyle`

Vue component used when encountering a block style there is no registered component for in the `components.block` prop. Only used if `components.block` is an object.

### `unknownList`

Vue component used when encountering a list style there is no registered component for in the `components.list` prop. Only used if `components.list` is an object.

### `unknownListItem`

Vue component used when encountering a list item style there is no registered component for in the `components.listItem` prop. Only used if `components.listItem` is an object.

## Disabling warnings / handling unknown types

When the library encounters a block, mark, list or list item with a type that is not known (eg it has no corresponding component in the `components` property), it will by default print a console warning.

To disable this behavior, you can either pass `false` to the `onMissingComponent` property, or give it a custom function you want to use to report the error. For instance:

```tsx
import {PortableText} from '@portabletext/vue'

<PortableText
  value={[/* array of portable text blocks */]}
  onMissingComponent={false}
/>

// or, pass it a function:

<PortableText
  value={[/* array of portable text blocks */]}
  onMissingComponent={(message, options) => {
    myErrorLogger.report(message, {
      // eg `someUnknownType`
      type: options.type,

      // 'block' | 'mark' | 'blockStyle' | 'listStyle' | 'listItemStyle'
      nodeType: options.nodeType
    })
  }}
/>
```

## Rendering Plain Text

This module also exports a function (`toPlainText()`) that will render one or more Portable Text blocks as plain text. This is helpful in cases where formatted text is not supported, or you need to process the raw text value.

For instance, to render an OpenGraph meta description for a page:

```tsx
import { toPlainText } from '@portabletext/vue';

const MetaDescription = (myPortableTextData) => {
  return <meta name="og:description" value={toPlainText(myPortableTextData)} />;
};
```

Or to generate element IDs for headers, in order for them to be linkable:

```tsx
import {
  PortableText,
  toPlainText,
  PortableTextComponents,
} from '@portabletext/vue';
import slugify from 'slugify';

const LinkableHeader = ({ children, value }) => {
  // `value` is the single Portable Text block of this header
  const slug = slugify(toPlainText(value));
  return <h2 id={slug}>{children}</h2>;
};

const components: PortableTextComponents = {
  block: {
    h2: LinkableHeader,
  },
};
```

## Typing Portable Text

Portable Text data can be typed using the `@portabletext/types` package.

### Basic usage

Use `PortableTextBlock` without generics for loosely typed defaults.

```ts
import { PortableTextBlock } from '@portabletext/types';

interface MySanityDocument {
  portableTextField: (PortableTextBlock | SomeBlockType)[];
}
```

### Narrow types, marks, inline-blocks and lists

`PortableTextBlock` supports generics, and has the following signature:

```ts
interface PortableTextBlock<
  M extends PortableTextMarkDefinition = PortableTextMarkDefinition,
  C extends TypedObject = ArbitraryTypedObject | PortableTextSpan,
  S extends string = PortableTextBlockStyle,
  L extends string = PortableTextListItemType
> {}
```

Create your own, narrowed Portable text type:

```ts
import {
  PortableTextBlock,
  PortableTextMarkDefinition,
  PortableTextSpan,
} from '@portabletext/types';

// MARKS
interface FirstMark extends PortableTextMarkDefinition {
  _type: 'firstMark';
  // ...other fields
}

interface SecondMark extends PortableTextMarkDefinition {
  _type: 'secondMark';
  // ...other fields
}

type CustomMarks = FirstMark | SecondMark;

// INLINE BLOCKS

interface MyInlineBlock {
  _type: 'myInlineBlock';
  // ...other fields
}

type InlineBlocks = PortableTextSpan | MyInlineBlock;

// STYLES

type TextStyles = 'normal' | 'h1' | 'myCustomStyle';

// LISTS

type ListStyles = 'bullet' | 'myCustomList';

// CUSTOM PORTABLE TEXT BLOCK

// Putting it all together by specifying generics
// all of these are valid:
// type CustomPortableTextBlock = PortableTextBlock<CustomMarks>
// type CustomPortableTextBlock = PortableTextBlock<CustomMarks, InlineBlocks>
// type CustomPortableTextBlock = PortableTextBlock<CustomMarks, InlineBlocks, TextStyles>
type CustomPortableTextBlock = PortableTextBlock<
  CustomMarks,
  InlineBlocks,
  TextStyles,
  ListStyles
>;

// Other BLOCKS that can appear inbetween text

interface MyCustomBlock {
  _type: 'myCustomBlock';
  // ...other fields
}

// TYPE FOR PORTABLE TEXT FIELD ITEMS
type PortableTextFieldType = CustomPortableTextBlock | MyCustomBlock;

// Using it in your document type
interface MyDocumentType {
  portableTextField: PortableTextFieldType[];
}
```

## License

MIT © [Sanity.io](https://www.sanity.io/)
