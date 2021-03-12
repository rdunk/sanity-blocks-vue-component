import { h, defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { SanityBlocks } from '..';

test('custom type serializer with template', () => {
  const wrapper = mount(SanityBlocks, {
    props: {
      blocks: [
        {
          _type: 'message',
          _key: '3l37kf8jq1b4',
          msg: 'Foobar!',
        },
      ],
      serializers: {
        types: {
          message: {
            template: '<p>{{ msg }}</p>',
            props: ['msg'],
          },
        },
      },
    },
  });

  expect(wrapper.html()).toMatch('<p>Foobar!</p>');
});

test('custom type serializer with setup', () => {
  const wrapper = mount(SanityBlocks, {
    props: {
      blocks: [
        {
          _type: 'message',
          _key: '3l37kf8jq1b4',
          msg: 'Foobar!',
        },
      ],
      serializers: {
        types: {
          message: defineComponent({
            props: ['msg'],
            setup(props) {
              return () => h('p', props.msg);
            },
          }),
        },
      },
    },
  });

  expect(wrapper.html()).toMatch('<p>Foobar!</p>');
});

test('custom mark serializer with setup', () => {
  const wrapper = mount(SanityBlocks, {
    props: {
      blocks: [
        {
          _key: 'bf9c6389cddf',
          _type: 'block',
          children: [
            {
              _key: 'bf9c6389cddf0',
              _type: 'span',
              marks: [],
              text: 'OK.\nA ',
            },
            {
              _key: 'bf9c6389cddf1',
              _type: 'span',
              marks: ['1376a4796fb6'],
              text: 'link',
            },
            {
              _key: 'bf9c6389cddf2',
              _type: 'span',
              marks: [],
              text: '.',
            },
          ],
          markDefs: [
            {
              _key: '1376a4796fb6',
              _type: 'link',
              href: 'https://google.com',
              data: { key: 'foo', value: 'bar' },
            },
          ],
          style: 'normal',
        },
      ],
      serializers: {
        marks: {
          link: defineComponent({
            props: ['href', 'data'],
            setup(props, { slots }) {
              return () =>
                h(
                  'a',
                  {
                    href: props.href,
                    [`data-${props.data.key}`]: props.data.value,
                  },
                  slots.default ? slots.default() : undefined
                );
            },
          }),
        },
      },
    },
  });

  expect(wrapper.html()).toMatch(
    '<p>OK.<br>A <a href="https://google.com" data-foo="bar">link</a>.</p>'
  );
});
