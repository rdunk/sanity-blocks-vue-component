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

module.exports = component
