import { h } from 'vue';
import { expect, test } from 'vitest';
import { mount } from '@vue/test-utils';
import {
  PortableText,
  type PortableTextVueComponents,
  type PortableTextMarkComponent,
  type PortableTextProps,
  type MissingComponentHandler,
} from '../src';
import * as fixtures from './fixtures';

const render = (props: PortableTextProps) =>
  mount(PortableText, { props }).html({ raw: true });

test('builds empty tree on empty block', () => {
  const { input, output } = fixtures.emptyBlock;
  const result = render({ value: input });
  expect(result).toBe(output);
});

test('builds simple one-node tree on single, markless span', () => {
  const { input, output } = fixtures.singleSpan;
  const result = render({ value: input });
  expect(result).toBe(output);
});

test('builds simple multi-node tree on markless spans', () => {
  const { input, output } = fixtures.multipleSpans;
  const result = render({ value: input });
  expect(result).toBe(output);
});

test('builds annotated span on simple mark', () => {
  const { input, output } = fixtures.basicMarkSingleSpan;
  const result = render({ value: input });
  expect(result).toBe(output);
});

test('builds annotated, joined span on adjacent, equal marks', () => {
  const { input, output } = fixtures.basicMarkMultipleAdjacentSpans;
  const result = render({ value: input });
  expect(result).toBe(output);
});

test('builds annotated, nested spans in tree format', () => {
  const { input, output } = fixtures.basicMarkNestedMarks;
  const result = render({ value: input });
  expect(result).toBe(output);
});

test('builds annotated spans with expanded marks on object-style marks', () => {
  const { input, output } = fixtures.linkMarkDef;
  const result = render({ value: input });
  expect(result).toBe(output);
});

test('builds correct structure from advanced, nested mark structure', () => {
  const { input, output } = fixtures.messyLinkText;
  const result = render({ value: input });
  expect(result).toBe(output);
});

test('builds bullet lists in parent container', () => {
  const { input, output } = fixtures.basicBulletList;
  const result = render({ value: input });
  expect(result).toBe(output);
});

test('builds numbered lists in parent container', () => {
  const { input, output } = fixtures.basicNumberedList;
  const result = render({ value: input });
  expect(result).toBe(output);
});

test('builds nested lists', () => {
  const { input, output } = fixtures.nestedLists;
  const result = render({ value: input });
  expect(result).toBe(output);
});

test('builds all basic marks as expected', () => {
  const { input, output } = fixtures.allBasicMarks;
  const result = render({ value: input });
  expect(result).toBe(output);
});

test('builds weirdly complex lists without any issues', () => {
  const { input, output } = fixtures.deepWeirdLists;
  const result = render({ value: input });
  expect(result).toBe(output);
});

test('renders all default block styles', () => {
  const { input, output } = fixtures.allDefaultBlockStyles;
  const result = render({ value: input });
  expect(result).toBe(output);
});

test('sorts marks correctly on equal number of occurences', () => {
  const { input, output } = fixtures.marksAllTheWayDown;
  const marks: PortableTextVueComponents['marks'] = {
    highlight: ({ value }, { slots }) =>
      h(
        'span',
        { style: { border: `${value?.thickness}px solid` } },
        slots.default?.()
      ),
  };
  const result = render({ value: input, components: { marks } });
  expect(result).toBe(output);
});

test('handles keyless blocks/spans', () => {
  const { input, output } = fixtures.keyless;
  const result = render({ value: input });
  expect(result).toBe(output);
});

test('handles empty arrays', () => {
  const { input, output } = fixtures.emptyArray;
  const result = render({ value: input });
  expect(result).toBe(output);
});

test('handles lists without level', () => {
  const { input, output } = fixtures.listWithoutLevel;
  const result = render({ value: input });
  expect(result).toBe(output);
});

test('handles inline non-span nodes', () => {
  const { input, output } = fixtures.inlineNodes;
  const result = render({
    value: input,
    components: {
      types: {
        rating: ({ value }) => {
          return h('span', {
            class: `rating type-${value.type} rating-${value.rating}`,
          });
        },
      },
    },
  });
  expect(result).toBe(output);
});

test('handles hardbreaks', () => {
  const { input, output } = fixtures.hardBreaks;
  const result = render({ value: input });
  expect(result).toBe(output);
});

test('can disable hardbreak component', () => {
  const { input, output } = fixtures.hardBreaks;
  const result = render({ value: input, components: { hardBreak: false } });
  expect(result).toBe(output.replace(/<br>/g, '\n'));
});

test('can customize hardbreak component', () => {
  const { input, output } = fixtures.hardBreaks;
  const hardBreak = () => h('br', { class: 'dat-newline' });
  const result = render({ value: input, components: { hardBreak } });
  expect(result).toBe(output.replace(/<br>/g, '<br class="dat-newline">'));
});

test('can nest marks correctly in block/marks context', () => {
  const { input, output } = fixtures.inlineObjects;
  const result = render({
    value: input,
    components: {
      types: {
        localCurrency: ({ value }) => {
          // in the real world we'd look up the users local currency,
          // do some rate calculations and render the result. Obviously.
          const rates: Record<string, number> = {
            USD: 8.82,
            DKK: 1.35,
            EUR: 10.04,
          };
          const rate = rates[value.sourceCurrency] || 1;
          return h(
            'span',
            { class: 'currency' },
            `~${Math.round(value.sourceAmount * rate)} NOK`
          );
        },
      },
    },
  });

  expect(result).toBe(output);
});

test('can render inline block with text property', () => {
  const { input, output } = fixtures.inlineBlockWithText;
  const result = render({
    value: input,
    components: {
      types: {
        button: (props) => h('button', { type: 'button' }, props.value.text),
      },
    },
  });
  expect(result).toBe(output);
});

test('can render styled list items', () => {
  const { input, output } = fixtures.styledListItems;
  const result = render({ value: input });
  expect(result).toBe(output);
});

test('can render custom list item styles with fallback', () => {
  const { input, output } = fixtures.customListItemType;
  const result = render({ value: input });
  expect(result).toBe(output);
});

test('can render custom list item styles with provided list style component', () => {
  const { input } = fixtures.customListItemType;
  const result = render({
    value: input,
    components: {
      list: {
        square: (_, { slots }) =>
          h('ul', { class: 'list-squared' }, slots.default?.()),
      },
    },
  });
  expect(result).toBe(
    '<ul class="list-squared"><li>Square 1</li><li>Square 2<ul><li>Dat disc</li></ul></li><li>Square 3</li></ul>'
  );
});

test('can render custom list item styles with provided list style component', () => {
  const { input } = fixtures.customListItemType;
  const result = render({
    value: input,
    components: {
      listItem: {
        square: (_, { slots }) =>
          h('li', { class: 'item-squared' }, slots.default?.()),
      },
    },
  });
  expect(result).toBe(
    '<ul><li class="item-squared">Square 1</li><li class="item-squared">Square 2<ul><li>Dat disc</li></ul></li><li class="item-squared">Square 3</li></ul>'
  );
});

test('warns on missing list style component', () => {
  const { input } = fixtures.customListItemType;
  const result = render({
    value: input,
    components: { list: {} },
  });
  expect(result).toBe(
    '<ul><li>Square 1</li><li>Square 2<ul><li>Dat disc</li></ul></li><li>Square 3</li></ul>'
  );
});

test('can render styled list items with custom list item component', () => {
  const { input, output } = fixtures.styledListItems;
  const result = render({
    value: input,
    components: {
      listItem: (_, { slots }) => {
        return h('li', slots.default?.());
      },
    },
  });
  expect(result).toBe(output);
});

test('can specify custom component for custom block types', () => {
  const { input, output } = fixtures.customBlockType;
  const types: Partial<PortableTextVueComponents>['types'] = {
    code: ({ renderNode, ...props }) => {
      expect(props).toStrictEqual({
        value: {
          _key: '9a15ea2ed8a2',
          _type: 'code',
          code: input[0]?.code,
          language: 'javascript',
        },
        index: 0,
        isInline: false,
      });
      return h(
        'pre',
        { 'data-language': props.value.language },
        h('code', props.value.code)
      );
    },
  };
  const result = render({ value: input, components: { types } });
  expect(result).toBe(output);
});

test('can specify custom component for custom block types with children', () => {
  const { input, output } = fixtures.customBlockTypeWithChildren;
  const types: Partial<PortableTextVueComponents>['types'] = {
    quote: ({ renderNode, ...props }) => {
      expect(props).toStrictEqual({
        value: {
          _type: 'quote',
          _key: '9a15ea2ed8a2',
          background: 'blue',
          children: [
            {
              _type: 'span',
              _key: '9a15ea2ed8a2',
              text: 'This is an inspirational quote',
            },
          ],
        },
        index: 0,
        isInline: false,
      });

      return h(
        'p',
        { style: { background: props.value.background } },
        props.value.children.map(({ text }) => `Customers say: ${text}`)
      );
    },
  };
  const result = render({ value: input, components: { types } });
  expect(result).toBe(output);
});

test('can specify custom components for custom marks', () => {
  const { input, output } = fixtures.customMarks;
  const highlight: PortableTextMarkComponent<{
    _type: 'highlight';
    thickness: number;
  }> = ({ value }, { slots }) =>
    h(
      'span',
      { style: { border: `${value?.thickness}px solid` } },
      slots.default?.()
    );

  const result = render({ value: input, components: { marks: { highlight } } });
  expect(result).toBe(output);
});

test('can specify custom components for defaults marks', () => {
  const { input, output } = fixtures.overrideDefaultMarks;
  const link: PortableTextMarkComponent<{ _type: 'link'; href: string }> = (
    { value },
    { slots }
  ) => h('a', { class: 'mahlink', href: value?.href }, slots.default?.());

  const result = render({ value: input, components: { marks: { link } } });
  expect(result).toBe(output);
});

test('falls back to default component for missing mark components', () => {
  const { input, output } = fixtures.missingMarkComponent;
  const result = render({ value: input });
  expect(result).toBe(output);
});

test('can register custom `missing component` handler', () => {
  let warning = '<never called>';
  const onMissingComponent: MissingComponentHandler = (message) => {
    warning = message;
  };

  const { input } = fixtures.missingMarkComponent;
  render({ value: input, onMissingComponent });
  expect(warning).toBe(
    '[@portabletext/vue] Unknown mark type "abc", specify a component for it in the `components.marks` prop'
  );
});
