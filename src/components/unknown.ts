import { h } from 'vue';
import type { PortableTextVueComponents } from '../types';
import { unknownTypeWarning } from '../warnings';

const hidden = { display: 'none' };

export const DefaultUnknownType: PortableTextVueComponents['unknownType'] = ({
  value,
  isInline,
}) => {
  const warning = unknownTypeWarning(value._type);
  return isInline
    ? h('span', { style: hidden }, warning)
    : h('div', { style: hidden }, warning);
};

export const DefaultUnknownMark: PortableTextVueComponents['unknownMark'] = (
  { markType },
  { slots }
) => {
  return h(
    'span',
    { class: `unknown__pt__mark__${markType}` },
    slots.default?.()
  );
};

export const DefaultUnknownBlockStyle: PortableTextVueComponents['unknownBlockStyle'] =
  (_, { slots }) => h('p', slots.default?.());

export const DefaultUnknownList: PortableTextVueComponents['unknownList'] = (
  _,
  { slots }
) => h('ul', slots.default?.());

export const DefaultUnknownListItem: PortableTextVueComponents['unknownListItem'] =
  (_, { slots }) => h('li', slots.default?.());
