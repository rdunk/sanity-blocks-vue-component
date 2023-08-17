import { h } from 'vue';
import type { TypedObject } from '@portabletext/types';
import type { PortableTextMarkComponent } from '../types';
import { basicElement } from './empty';

interface DefaultLink extends TypedObject {
  _type: 'link';
  href: string;
}

const link: PortableTextMarkComponent<DefaultLink> = ({ value }, { slots }) =>
  h('a', { href: value?.href }, slots.default?.());

const underlineStyle = { textDecoration: 'underline' };

export const defaultMarks: Record<string, PortableTextMarkComponent | undefined> = {
  code: basicElement('code'),
  em: basicElement('em'),
  link,
  'strike-through': basicElement('del'),
  strong: basicElement('strong'),
  underline: (_, { slots }) => h('span', { style: underlineStyle }, slots.default?.()),
};
