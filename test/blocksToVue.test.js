const {mount} = require('@vue/test-utils')
const runTests = require('@sanity/block-content-tests')
const {getImageUrl} = require('@sanity/block-content-to-hyperscript/internals')
const BlockContent = require('../src/BlockContent')
const transformProperties = require('../src/transformProperties')

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

const normalizeAttributeOrder = html => html.replace(/(class=".*?") (href=".*?")/gm, '$2 $1')

const normalize = html => {
  if (html === '') return undefined
  let output = normalizeHtml(html)
  output = normalizeAttributeOrder(output)
  return output
}

runTests({
  render,
  h,
  normalize,
  getImageUrl
})

describe('vue', () => {
  test('can use vue component as serializer', () => {
    const {input, output} = require('./tests/001-vue-serializer')
    const result = render(input)
    expect(result).toEqual(output)
  })
  test('passes options and node to vue component serializers', () => {
    const {input, output} = require('./tests/002-pass-options')
    const result = render(input)
    expect(result).toEqual(output)
  })
})
