import type { PortableTextVueComponents, PortableTextComponents } from '../types';

export function mergeComponents(
  parent: PortableTextVueComponents,
  overrides: PortableTextComponents,
): PortableTextVueComponents {
  const { block, list, listItem, marks, types, ...rest } = overrides;
  // @todo figure out how to not `as ...` these
  return {
    ...parent,
    block: mergeDeeply(parent, overrides, 'block') as PortableTextVueComponents['block'],
    list: mergeDeeply(parent, overrides, 'list') as PortableTextVueComponents['list'],
    listItem: mergeDeeply(parent, overrides, 'listItem') as PortableTextVueComponents['listItem'],
    marks: mergeDeeply(parent, overrides, 'marks') as PortableTextVueComponents['marks'],
    types: mergeDeeply(parent, overrides, 'types') as PortableTextVueComponents['types'],
    ...rest,
  };
}

function mergeDeeply(
  parent: PortableTextVueComponents,
  overrides: PortableTextComponents,
  key: 'block' | 'list' | 'listItem' | 'marks' | 'types',
): PortableTextVueComponents[typeof key] {
  const override = overrides[key];
  const parentVal = parent[key];

  if (typeof override === 'function') {
    return override;
  }

  if (override && typeof parentVal === 'function') {
    return override;
  }

  if (override) {
    return {
      ...parentVal,
      ...override,
    } as PortableTextVueComponents[typeof key];
  }

  return parentVal;
}
