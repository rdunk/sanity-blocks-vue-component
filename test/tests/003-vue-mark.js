const component = {
  props: {
    href: {
      type: String
    },
    newtab: {
      type: Boolean
    }
  },
  render(createElement) {
    const props = {
      attrs: {
        href: this.href
      }
    }
    if (this.newtab) props.attrs.target = '_blank'
    return createElement('a', props, this.$slots.default)
  }
}

module.exports = {
  input: {
    blocks: [
      {
        _key: 'bf9c6389cddf',
        _type: 'block',
        children: [
          {
            _key: 'bf9c6389cddf0',
            _type: 'span',
            marks: [],
            text: 'A '
          },
          {
            _key: 'bf9c6389cddf1',
            _type: 'span',
            marks: ['1376a4796fb6'],
            text: 'link'
          },
          {
            _key: 'bf9c6389cddf2',
            _type: 'span',
            marks: [],
            text: '.'
          }
        ],
        markDefs: [
          {
            _key: '1376a4796fb6',
            _type: 'link',
            href: 'https://google.com',
            newtab: true
          }
        ],
        style: 'normal'
      }
    ],
    serializers: {
      marks: {
        link: component
      }
    }
  },
  output: ['<p>A <a href="https://google.com" target="_blank">link</a>.</p>'].join('')
}
