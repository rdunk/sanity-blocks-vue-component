import type { ArbitraryTypedObject } from '@portabletext/types';

const input: ArbitraryTypedObject[] = [
  {
    _type: 'code',
    _key: '9a15ea2ed8a2',
    language: 'javascript',
    code: "const foo = require('foo')\n\nfoo('hi there', (err, thing) => {\n  console.log(err)\n})\n",
  },
];

export default {
  input,
  output: [
    '<pre data-language="javascript">',
    '<code>',
    "const foo = require('foo')\n\n",
    "foo('hi there', (err, thing) => {\n",
    '  console.log(err)\n',
    '})\n',
    '</code></pre>',
  ].join(''),
};
