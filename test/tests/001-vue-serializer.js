const component = {
  props: {
    foo: {
      type: String,
      required: true
    },
    bar: {
      type: String,
      required: true
    }
  },
  render(createElement) {
    return createElement('div', {}, [this.foo, this.bar])
  }
}

module.exports = {
  input: {
    blocks: {
      _type: 'vueComponent',
      _key: '3l37kf8jq1b4',
      foo: 'foo!',
      bar: 'bar!'
    },
    serializers: {
      types: {
        vueComponent: component
      }
    }
  },
  output: ['<div>foo!bar!</div>'].join('')
}
