import { mount } from '@vue/test-utils';
import { SanityBlocks } from '../src';

const content = [
  {
    _key: '64501e9fa998',
    _type: 'block',
    children: [
      {
        _key: 'e96a503c11c2',
        _type: 'span',
        marks: [],
        text: 'Test ',
      },
      {
        _key: '5dd4c472ac41',
        _type: 'span',
        marks: ['strong'],
        text: 'content',
      },
      {
        _key: '31cd73804778',
        _type: 'span',
        marks: [],
        text: ' ',
      },
      {
        _key: '433a2cd61ea6',
        _type: 'span',
        marks: ['em', 'underline', 'strong'],
        text: 'with',
      },
      {
        _key: '83467a588d01',
        _type: 'span',
        marks: [],
        text: ' ',
      },
      {
        _key: '6b235298b73e',
        _type: 'span',
        marks: ['strong'],
        text: 'styling',
      },
    ],
    markDefs: [],
    style: 'normal',
  },
  {
    _key: 'ec35b232aaf0',
    _type: 'block',
    children: [
      {
        _key: 'c0d40a831dd6',
        _type: 'span',
        marks: [],
        text: 'List',
      },
    ],
    markDefs: [],
    style: 'h1',
  },
  {
    _key: '5ae06c2e3a72',
    _type: 'block',
    children: [
      {
        _key: 'f642ad11fb0b',
        _type: 'span',
        marks: [],
        text: 'One ',
      },
      {
        _key: '1f6454c6a1e9',
        _type: 'span',
        marks: ['strong', 'em'],
        text: 'some',
      },
      {
        _key: '12cbf1935db0',
        _type: 'span',
        marks: [],
        text: ' stuff',
      },
    ],
    level: 1,
    listItem: 'number',
    markDefs: [],
    style: 'normal',
  },
  {
    _key: '3daf31788cef',
    _type: 'block',
    children: [
      {
        _key: '6e8f39d5c5a8',
        _type: 'span',
        marks: [],
        text: 'Two\nLine break...\n',
      },
    ],
    level: 2,
    listItem: 'number',
    markDefs: [],
    style: 'normal',
  },
  {
    _key: 'fdc820e4db7a',
    _type: 'block',
    children: [
      {
        _key: 'aeac8050a4f8',
        _type: 'span',
        marks: [],
        text: 'Three ',
      },
      {
        _key: '3730fb1a3206',
        _type: 'span',
        marks: ['underline'],
        text: 'with',
      },
      {
        _key: '22259cbe3615',
        _type: 'span',
        marks: [],
        text: ' ',
      },
      {
        _key: '814adf000456',
        _type: 'span',
        marks: ['strong'],
        text: 'extra',
      },
      {
        _key: 'c248b7acf9d2',
        _type: 'span',
        marks: [],
        text: ' bits',
      },
    ],
    level: 2,
    listItem: 'number',
    markDefs: [],
    style: 'normal',
  },
  {
    _key: '50f06b80a39f',
    _type: 'block',
    children: [
      {
        _key: '4a9cb90f0f3a',
        _type: 'span',
        marks: [],
        text: 'Four',
      },
    ],
    level: 3,
    listItem: 'number',
    markDefs: [],
    style: 'normal',
  },
  {
    _key: 'a1362ea9d33a',
    _type: 'block',
    children: [
      {
        _key: '1f9a06d0ffe0',
        _type: 'span',
        marks: [],
        text: 'Five',
      },
    ],
    level: 3,
    listItem: 'number',
    markDefs: [],
    style: 'normal',
  },
  {
    _key: 'd204018d3b21',
    _type: 'block',
    children: [
      {
        _key: '09720aad4447',
        _type: 'span',
        marks: [],
        text: 'Six',
      },
    ],
    level: 4,
    listItem: 'number',
    markDefs: [],
    style: 'normal',
  },
  {
    _key: 'faa8fd028bc5',
    _type: 'block',
    children: [
      {
        _key: 'fe38e2962715',
        _type: 'span',
        marks: [],
        text: 'Seven',
      },
    ],
    level: 3,
    listItem: 'number',
    markDefs: [],
    style: 'normal',
  },
  {
    _key: '3828a9b9b019',
    _type: 'block',
    children: [
      {
        _key: '11028e42fe94',
        _type: 'span',
        marks: [],
        text: 'Erm?',
      },
    ],
    markDefs: [],
    style: 'normal',
  },
  {
    _key: '1a4a0dae6925',
    _type: 'block',
    children: [
      {
        _key: '60a909c57149',
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
    _key: 'c91645d01c61',
    _type: 'block',
    children: [
      {
        _key: '0c5c8c453de1',
        _type: 'span',
        marks: [],
        text: 'Nine',
      },
    ],
    level: 2,
    listItem: 'number',
    markDefs: [],
    style: 'normal',
  },
  {
    _key: '60b2b9b12147',
    _type: 'block',
    children: [
      {
        _key: '9b87d745a58e',
        _type: 'span',
        marks: ['em'],
        text: 'Ten',
      },
    ],
    level: 1,
    listItem: 'number',
    markDefs: [],
    style: 'normal',
  },
  {
    _key: '26fdf1d0d0b3',
    _type: 'block',
    children: [
      {
        _key: 'bc02198f6cef',
        _type: 'span',
        marks: ['underline'],
        text: 'OK',
      },
    ],
    level: 1,
    listItem: 'number',
    markDefs: [],
    style: 'normal',
  },
  {
    _key: '3a6530b5886e',
    _type: 'block',
    children: [
      {
        _key: '322bc8f7d1fc',
        _type: 'span',
        marks: [],
        text: 'wtf',
      },
    ],
    level: 1,
    listItem: 'number',
    markDefs: [],
    style: 'h1',
  },
  {
    _key: '30a132394fc4',
    _type: 'block',
    children: [
      {
        _key: '7e4752ad2500',
        _type: 'span',
        marks: ['strong'],
        text: 'Eleven',
      },
    ],
    level: 1,
    listItem: 'number',
    markDefs: [],
    style: 'normal',
  },
  {
    _key: 'cc4d88a49aba',
    _type: 'block',
    children: [
      {
        _key: '82406da1c8c0',
        _type: 'span',
        marks: [],
        text: 'Twelve',
      },
    ],
    level: 2,
    listItem: 'number',
    markDefs: [],
    style: 'normal',
  },
  {
    _key: 'c1a64b743298',
    _type: 'block',
    children: [
      {
        _key: 'e574cad1d20c',
        _type: 'span',
        marks: [],
        text: 'Hello!',
      },
    ],
    markDefs: [],
    style: 'normal',
  },
  {
    _key: '6ad2dff85803',
    _type: 'block',
    children: [
      {
        _key: '63357d455724',
        _type: 'span',
        marks: [],
        text: 'Second list...',
      },
    ],
    level: 1,
    listItem: 'bullet',
    markDefs: [],
    style: 'normal',
  },
  {
    _key: '8ed902624b38',
    _type: 'block',
    children: [
      {
        _key: '2e052eb11a3b',
        _type: 'span',
        marks: [],
        text: 'More..',
      },
    ],
    level: 1,
    listItem: 'bullet',
    markDefs: [],
    style: 'normal',
  },
  {
    _key: '43f102963941',
    _type: 'block',
    children: [
      {
        _key: '376993bba2ca',
        _type: 'span',
        marks: [],
        text: 'Hmm...',
      },
    ],
    level: 2,
    listItem: 'number',
    markDefs: [],
    style: 'normal',
  },
];

test('matches html', () => {
  const wrapper = mount(SanityBlocks, {
    props: {
      blocks: content,
    },
  });

  expect(wrapper.html()).toMatch(
    '<p>Test <strong>content</strong> <span style="text-decoration: underline;"><em><strong>with</strong></em></span> <strong>styling</strong></p><h1>List</h1><ol><li>One <strong><em>some</em></strong> stuff<ol><li>Two<br>Line break...<br></li><li>Three <span style="text-decoration: underline;">with</span> <strong>extra</strong> bits<ol><li>Four</li><li>Five<ol><li>Six</li></ol></li><li>Seven</li></ol></li></ol></li></ol><p>Erm?</p><ol><li>Eight</li><li>Nine</li></ol><ol><li><em>Ten</em></li><li><span style="text-decoration: underline;">OK</span></li><li><h1>wtf</h1></li><li><strong>Eleven</strong><ol><li>Twelve</li></ol></li></ol><p>Hello!</p><ul><li>Second list...</li><li>More..<ol><li>Hmm...</li></ol></li></ul>'
  );
});
