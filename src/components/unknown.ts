import { h } from 'vue';
import type { PortableTextVueComponents } from '../types';
import { unknownTypeWarning } from '../warnings';
import { basicElement } from './basic';

const hidden = { display: 'none' };

export const DefaultUnknownType: PortableTextVueComponents['unknownType'] = ({
  value,
  isInline,
}) => {
  const warning = unknownTypeWarning(value._type);
  return isInline ? h('span', { style: hidden }, warning) : h('div', { style: hidden }, warning);
};

export const DefaultUnknownMark: PortableTextVueComponents['unknownMark'] = (
  { markType },
  { slots },
) => {
  return h('span', { class: `unknown__pt__mark__${markType}` }, slots.default?.());
};

export const DefaultUnknownBlockStyle: PortableTextVueComponents['unknownBlockStyle'] =
  basicElement('p');

export const DefaultUnknownList: PortableTextVueComponents['unknownList'] = basicElement('ul');

export const DefaultUnknownListItem: PortableTextVueComponents['unknownListItem'] =
  basicElement('li');
