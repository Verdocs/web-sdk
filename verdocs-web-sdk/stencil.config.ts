import {sass} from '@stencil/sass';
import {Config} from '@stencil/core';
import {inlineSvg} from 'stencil-inline-svg';
// import typescript from 'rollup-plugin-typescript';
// import nodePolyfills from 'rollup-plugin-node-polyfills';
import {reactOutputTarget} from '@stencil/react-output-target';
import {angularOutputTarget, ValueAccessorConfig} from '@stencil/angular-output-target';

const angularValueAccessorBindings: ValueAccessorConfig[] = [
  {
    elementSelectors: ['pdf-viewer'],
    event: 'pdfClicked',
    targetAttr: 'value',
    type: 'number',
  },
];

export const config: Config = {
  namespace: 'verdocs-web-sdk',
  buildEs5: true,
  commonjs: {},
  sourceMap: true,
  devServer: {
    openBrowser: false,
  },
  testing: {
    transform: {
      '^.+\\.svg$': 'jest-svg-transformer',
    },
  },
  rollupPlugins: {
    // before: [typescript()],
    // after: [nodePolyfills()],
  },
  outputTargets: [
    angularOutputTarget({
      componentCorePackage: '@verdocs/web-sdk',
      directivesProxyFile: '../verdocs-web-sdk-angular/src/directives/proxies.ts',
      valueAccessorConfigs: angularValueAccessorBindings,
    }),
    reactOutputTarget({
      componentCorePackage: '@verdocs/web-sdk',
      proxiesFile: '../verdocs-web-sdk-react/src/components.ts',
      includeDefineCustomElements: true,
    }),
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      autoDefineCustomElements: true,
      generateTypeDeclarations: true,
    },
    // {
    //   type: 'dist-custom-elements-bundle',
    // },
    // We actually don't need these docs, we want Storybook to use "inline" docs instead. But commenting out this block
    // didn't appear to actually disable their generation. Overriding the target directory gets them out of the way so
    // storybook can do its job.
    {
      dir: '../docs',
      type: 'docs-readme',
      footer: '*[Verdocs](https://verdocs.com/)*',
    },
    {
      type: 'docs-vscode',
      file: 'dist/custom-elements.json',
    },
    {
      type: 'docs-json',
      file: 'dist/docs.json',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  plugins: [inlineSvg(), sass()],
};
