const {getImageUrl} = require('@sanity/block-content-to-hyperscript/internals')

const component = {
  props: {
    _sanityProps: {
      type: Object,
      required: true
    }
  },
  render(createElement) {
    const imageUrl = getImageUrl(this._sanityProps)
    return createElement('img', {
      attrs: {src: imageUrl}
    })
  }
}

module.exports = {
  input: {
    blocks: {
      _type: 'vueComponent',
      _key: 'cu5s70mb10ck',
      asset: {
        _type: 'reference',
        _ref: 'image-50m31m4g3-4000x2000-jpg'
      }
    },
    serializers: {
      types: {
        vueComponent: component
      }
    },
    projectId: 'pr0j3c71d',
    dataset: 'production',
    imageOptions: {
      w: 1000,
      h: 500,
      fit: 'max'
    }
  },
  output: [
    '<img src="https://cdn.sanity.io/images/pr0j3c71d/production/50m31m4g3-4000x2000.jpg?w=1000&amp;h=500&amp;fit=max">'
  ].join('')
}
