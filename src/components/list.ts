import type { PortableTextListComponent, PortableTextListItemComponent } from '../types';
import { basicElement } from './basic';

export const defaultLists: Record<'number' | 'bullet', PortableTextListComponent> = {
  number: basicElement('ol'),
  bullet: basicElement('ul'),
};

export const DefaultListItem: PortableTextListItemComponent = basicElement('li');
