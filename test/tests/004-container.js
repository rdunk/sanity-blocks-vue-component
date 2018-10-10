module.exports = {
  input: {
    blocks: {
      _key: 'R5FvMrjo',
      _type: 'block',
      children: [
        {
          _key: 'cZUQGmh4',
          _type: 'span',
          marks: [],
          text: 'Plain text.'
        }
      ],
      markDefs: [],
      style: 'normal'
    },
    serializers: {
      container: 'main'
    },
    renderContainerOnSingleChild: true
  },
  output: ['<main>', '<p>', 'Plain text.', '</p>', '</main>'].join('')
}
