import { h } from 'vue';
import { expect, test } from 'vitest';
import { mount } from '@vue/test-utils';
import { PortableText, PortableTextProps } from '../src';

const render = (props: PortableTextProps) =>
  mount(PortableText, { props }).html({ raw: true });

test('can override unknown mark component', () => {
  const result = render({
    value: {
      _type: 'block',
      markDefs: [{ _key: 'unknown-mark', _type: 'unknown-mark' }],
      children: [
        { _type: 'span', marks: ['unknown-deco'], text: 'simple' },
        { _type: 'span', marks: ['unknown-mark'], text: 'advanced' },
      ],
    },
    components: {
      unknownMark: ({ markType }, { slots }) => {
        return h('span', { class: 'unknown' }, [
          `Unknown (${markType}): `,
          slots.default?.(),
        ]);
      },
    },
  });
  expect(result).toBe(
    '<p><span class="unknown">Unknown (unknown-deco): simple</span><span class="unknown">Unknown (unknown-mark): advanced</span></p>'
  );
});
