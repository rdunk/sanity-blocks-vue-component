import { mount } from '@vue/test-utils';
import { SanityBlocks } from '..';

test('handles sequences of ordered and unordered lists', () => {
  const blocks = [
    {
      _key: '2c6fdfe3b63f',
      _type: 'block',
      children: [
        {
          _key: '0d6f58f717a3',
          _type: 'span',
          marks: [],
          text: 'One',
        },
      ],
      level: 1,
      listItem: 'bullet',
      markDefs: [],
      style: 'normal',
    },
    {
      _key: '7e26d666420d',
      _type: 'block',
      children: [
        {
          _key: '568c79b83f5d',
          _type: 'span',
          marks: [],
          text: 'Two',
        },
      ],
      level: 1,
      listItem: 'bullet',
      markDefs: [],
      style: 'normal',
    },
    {
      _key: 'e543c684b6ac',
      _type: 'block',
      children: [
        {
          _key: '4b2a4a47827e',
          _type: 'span',
          marks: [],
          text: 'Three',
        },
      ],
      level: 1,
      listItem: 'number',
      markDefs: [],
      style: 'normal',
    },
    {
      _key: '28ed94e89ee2',
      _type: 'block',
      children: [
        {
          _key: '04f728babe2e',
          _type: 'span',
          marks: [],
          text: 'Four',
        },
      ],
      level: 1,
      listItem: 'number',
      markDefs: [],
      style: 'normal',
    },
    {
      _key: '7b3ed455e5c8',
      _type: 'block',
      children: [
        {
          _key: 'b136c78e14ee',
          _type: 'span',
          marks: [],
          text: 'Five',
        },
      ],
      level: 1,
      listItem: 'bullet',
      markDefs: [],
      style: 'normal',
    },
    {
      _key: '875b9781290a',
      _type: 'block',
      children: [
        {
          _key: '3566c13afd15',
          _type: 'span',
          marks: [],
          text: 'Six',
        },
      ],
      level: 1,
      listItem: 'bullet',
      markDefs: [],
      style: 'normal',
    },
    {
      _key: 'd279400dfff2',
      _type: 'block',
      children: [
        {
          _key: 'c09e0dc89560',
          _type: 'span',
          marks: [],
          text: 'Seven',
        },
      ],
      level: 2,
      listItem: 'number',
      markDefs: [],
      style: 'normal',
    },
    {
      _key: '2cabbe83f886',
      _type: 'block',
      children: [
        {
          _key: 'f15c8ac1ca4c',
          _type: 'span',
          marks: [],
          text: 'Eight',
        },
      ],
      level: 2,
      listItem: 'number',
      markDefs: [],
      style: 'normal',
    },
    {
      _key: '8c39120c5830',
      _type: 'block',
      children: [
        {
          _key: '195af314c5d4',
          _type: 'span',
          marks: [],
          text: 'Nine',
        },
      ],
      level: 2,
      listItem: 'bullet',
      markDefs: [],
      style: 'normal',
    },
    {
      _key: '24686faf7e52',
      _type: 'block',
      children: [
        {
          _key: 'b968d408863a',
          _type: 'span',
          marks: [],
          text: 'Ten',
        },
      ],
      level: 2,
      listItem: 'bullet',
      markDefs: [],
      style: 'normal',
    },
  ];

  const wrapper = mount(SanityBlocks, {
    props: {
      blocks,
    },
  });

  expect(wrapper.html()).toMatch(
    '<ul><li>One</li><li>Two</li></ul><ol><li>Three</li><li>Four</li></ol><ul><li>Five</li><li>Six<ol><li>Seven</li><li>Eight</li></ol><ul><li>Nine</li><li>Ten</li></ul></li></ul>'
  );
});
