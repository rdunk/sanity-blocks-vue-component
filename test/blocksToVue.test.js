const {mount} = require('@vue/test-utils')
const runTests = require('@sanity/block-content-tests')
const {getImageUrl} = require('@sanity/block-content-to-hyperscript/internals')
const BlockContent = require('../src/BlockContent')
const transformProperties = require('../src/transformProperties')
const vueComponent = require('./Component')

const h = (span, props, children) => {
  // The test props are written for Hyperscript/React, so transform for Vue
  const properties = transformProperties(props)
  // Create a component object with a render function
  const childNodes = Array.isArray(children) ? children : [children]
  const component = {
    render(createElement) {
      return createElement(span, properties, childNodes)
    }
  }
  return mount(component).vm._vnode
}

const render = options => {
  const wrapper = mount(BlockContent, {
    context: {props: options}
  })
  return wrapper.html()
}

const normalizeHtml = html =>
  html
    .replace(/<br(.*?)\/>/g, '<br$1>')
    .replace(/<img(.*?)\/>/g, '<img$1>')
    .replace(/&quot;/g, '"')
    .replace(/&#x(\d+);/g, (match, code) => {
      return String.fromCharCode(parseInt(code, 16))
    })
    .replace(/ style="(.*?)"/g, (match, styleProps) => {
      const style = styleProps.replace(/:(\S)/g, ': $1')
      return ` style="${style}"`
    })

const normalize = html => {
  if (html === '') return undefined
  return normalizeHtml(html)
}

runTests({
  render,
  h,
  normalize,
  getImageUrl
})

describe('vue', () => {
  const input = [
    {
      _type: 'vueComponent',
      _key: '3l37kf8jq1b4',
      foo: 'Foo!',
      bar: 'Bar!'
    }
  ]
  const output = ['<div>Foo! / Bar!</div>'].join('')
  const types = {vueComponent}
  const result = render({
    blocks: input,
    serializers: {
      types
    }
  })
  test('can use vue component as serializer', () => {
    expect(result).toEqual(output)
  })
})
