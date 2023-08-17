import { h } from 'vue';
import type { PortableTextBlockStyle } from '@portabletext/types';
import type {
  PortableTextBlockComponent,
  PortableTextVueComponents,
} from '../types';
import { defaultMarks } from './marks';
import { defaultLists, DefaultListItem } from './list';
import {
  DefaultUnknownType,
  DefaultUnknownMark,
  DefaultUnknownList,
  DefaultUnknownListItem,
  DefaultUnknownBlockStyle,
} from './unknown';
import { basicElement } from './empty';

export const DefaultHardBreak = () => h('br');

export const defaultBlockStyles: Record<
  PortableTextBlockStyle,
  PortableTextBlockComponent | undefined
> = {
  normal: basicElement('p'),
  blockquote: basicElement('blockquote'),
  h1: basicElement('h1'),
  h2: basicElement('h2'),
  h3: basicElement('h3'),
  h4: basicElement('h4'),
  h5: basicElement('h5'),
  h6: basicElement('h6'),
};

export const defaultComponents: PortableTextVueComponents = {
  types: {},

  block: defaultBlockStyles,
  marks: defaultMarks,
  list: defaultLists,
  listItem: DefaultListItem,
  hardBreak: DefaultHardBreak,

  unknownType: DefaultUnknownType,
  unknownMark: DefaultUnknownMark,
  unknownList: DefaultUnknownList,
  unknownListItem: DefaultUnknownListItem,
  unknownBlockStyle: DefaultUnknownBlockStyle,
};
