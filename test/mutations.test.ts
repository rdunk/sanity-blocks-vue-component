import { h } from 'vue';
import { expect, test } from 'vitest';
import { mount } from '@vue/test-utils';
import {
  PortableText,
  PortableTextVueComponents,
  PortableTextProps,
} from '../src';
import * as fixtures from './fixtures';

const render = (props: PortableTextProps) =>
  mount(PortableText, { props }).html({ raw: true });

test('never mutates input', () => {
  for (const [key, fixture] of Object.entries(fixtures)) {
    if (key === 'default') {
      continue;
    }

    const highlight = () => h('mark');
    const components: Partial<PortableTextVueComponents> = {
      marks: { highlight },
      unknownMark: (_, { slots }) => h('span', slots.default?.()),
      unknownType: (_, { slots }) => h('div', slots.default?.()),
    };
    const originalInput = JSON.parse(JSON.stringify(fixture.input));
    const passedInput = fixture.input;
    try {
      render({
        value: passedInput as any,
        components,
      });
    } catch (error) {
      // ignore
    }
    expect(originalInput).toStrictEqual(passedInput);
  }
});
