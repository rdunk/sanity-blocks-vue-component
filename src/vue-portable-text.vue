<template><Render /></template>

<script lang="ts" setup generic="B extends TypedObject = PortableTextBlock">
import type { PortableTextBlock, TypedObject } from '@portabletext/types';
import type { PortableTextProps } from './types';
import { nestLists, LIST_NEST_MODE_HTML } from '@portabletext/toolkit';
import { mergeComponents } from './components/merge';
import { defaultComponents } from './components/defaults';
import { getNodeRenderer } from './node-renderer';
import { printWarning } from './warnings';

function noop() {
  // Intentional noop
}

const props = withDefaults(defineProps<PortableTextProps<B>>(), {
  onMissingComponent: printWarning,
});

const handleMissingComponent = props.onMissingComponent || noop;

const blocks = Array.isArray(props.value) ? props.value : [props.value];

const nested = nestLists(blocks, props.listNestingMode || LIST_NEST_MODE_HTML);

const components = props.components
  ? mergeComponents(defaultComponents, props.components)
  : defaultComponents;

const renderNode = getNodeRenderer(components, handleMissingComponent);

const rendered = nested.map((node, index) =>
  renderNode({ node: node, index, isInline: false, renderNode }),
);

const Render = () => rendered;
</script>
