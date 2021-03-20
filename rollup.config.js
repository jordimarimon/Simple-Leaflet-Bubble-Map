import resolve from '@rollup/plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from "rollup-plugin-terser";
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import { config } from 'dotenv';

export default {
  input: 'src/index.js',
  output: {
    format: 'es',
    dir: 'dist',
    entryFileNames: 'index.js',
    sourcemap: true
  },
  plugins: [
    replace({__env: JSON.stringify({...config().parsed})}),
    json(),
    resolve(),
    commonjs(),
    terser(),
  ],
};