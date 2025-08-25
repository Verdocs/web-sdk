// Rollup config for bundling vanilla-bundle.js into a single IIFE for CDN/Vanilla JS usage

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'bundle-entry.js',
  output: {
    file: 'dist/verdocs-web-sdk-vanilla.js',
    format: 'iife',
    name: 'VerdocsWebSDK',
    inlineDynamicImports: true,
    globals: {
      '@verdocs/js-sdk': 'VerdocsJsSdk'
    }
  },
  external: [
    '@verdocs/js-sdk'
  ],
  plugins: [
    resolve(),
    commonjs()
  ]
};