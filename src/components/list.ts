import { h } from 'vue';
import type {
  PortableTextListComponent,
  PortableTextListItemComponent,
} from '../types';

export const defaultLists: Record<
  'number' | 'bullet',
  PortableTextListComponent
> = {
  number: (_, { slots }) => h('ol', slots.default?.()),
  bullet: (_, { slots }) => h('ul', slots.default?.()),
};

export const DefaultListItem: PortableTextListItemComponent = (_, { slots }) =>
  h('li', slots.default?.());
