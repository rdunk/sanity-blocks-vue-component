import ts from 'rollup-plugin-typescript2';
import { babel } from '@rollup/plugin-babel';

const pkg = require('./package.json');

const createConfig = (file, format, plugins = []) => ({
  input: 'src/index.ts',
  output: { file, format },
  plugins: [
    ts({
      tsconfig: 'tsconfig.json',
    }),
    ...plugins,
  ],
});

export default [
  createConfig(pkg.module, 'es'),
  createConfig(pkg.main, 'cjs', [
    // babel({
    //   extensions: ['js', '.ts'],
    //   babelHelpers: 'bundled',
    // }),
  ]),
];
