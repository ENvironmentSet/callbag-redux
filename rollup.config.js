import babel from 'rollup-plugin-babel';

const input = 'index.js';
const outputs = [
  { file: 'build/lib/callbag-redux.js', format: 'cjs' },
  { file: 'build/es/callbag-redux.js', format: 'es' },
  { file: 'build/es/callbag-redux.mjs', format: 'es' },
  { file: 'build/dist/callbag-redux.js', format: 'umd', name: 'callbagRedux' },
];

const toConfig = output => ({
  input,
  output: { indent: false, ...output },
  plugins: babel(),
});

export default outputs.map(toConfig);