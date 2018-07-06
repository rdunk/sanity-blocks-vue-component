const isEmpty = obj => Object.getOwnPropertyNames(obj).length === 0

const base = ['blocks', 'serializers', 'style', 'className', 'projectId', 'dataset', 'imageOptions']

// Transform properties for Vue
// https://vuejs.org/v2/guide/render-function.html#The-Data-Object-In-Depth
const transformProperties = props => {
  if (!props) return null
  if (isEmpty(props)) return {}

  const properties = {}

  const addToAttributes = (key, value) => {
    if (!properties.attrs) properties.attrs = {}
    return (properties.attrs[key] = value)
  }

  Object.entries(props).forEach(([key, value]) => {
    if (base.includes(key)) {
      if (key === 'className') return (properties.class = value)
      return (properties[key] = value)
    }
    return addToAttributes(key, value)
  })

  return properties
}

module.exports = transformProperties
