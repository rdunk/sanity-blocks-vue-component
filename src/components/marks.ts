import { h } from 'vue';
import type { TypedObject } from '@portabletext/types';
import type { PortableTextMarkComponent } from '../types';

interface DefaultLink extends TypedObject {
  _type: 'link';
  href: string;
}

const link: PortableTextMarkComponent<DefaultLink> = ({ value }, { slots }) =>
  h('a', { href: value?.href }, slots.default?.());

const underlineStyle = { textDecoration: 'underline' };

export const defaultMarks: Record<
  string,
  PortableTextMarkComponent | undefined
> = {
  em: (_, { slots }) => h('em', slots.default?.()),
  strong: (_, { slots }) => h('strong', slots.default?.()),
  code: (_, { slots }) => h('code', slots.default?.()),
  underline: (_, { slots }) =>
    h('span', { style: underlineStyle }, slots.default?.()),
  'strike-through': (_, { slots }) => h('del', slots.default?.()),
  link,
};
