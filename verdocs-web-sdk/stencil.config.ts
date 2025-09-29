import {sass} from '@stencil/sass';
import {Config} from '@stencil/core';
import {vueOutputTarget} from '@stencil/vue-output-target';
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
    setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
    transformIgnorePatterns: ['/node_modules/(?!(tinybase|@verdocs/js-sdk|imask|sortablejs|axios)/)'],
  },
  rollupConfig: {
    inputOptions: {
      external: ['@verdocs/js-sdk'],
    },
  },
  rollupPlugins: {
    // before: [typescript()],
    // after: [nodePolyfills()],
  },
  extras: {
    enableImportInjection: true,
    addGlobalStyleToComponents: false,
  },
  outputTargets: [
    angularOutputTarget({
      componentCorePackage: '@verdocs/web-sdk',
      directivesProxyFile: '../verdocs-web-sdk-angular/src/directives/proxies.ts',
      valueAccessorConfigs: angularValueAccessorBindings,
    }),
    reactOutputTarget({
      outDir: '../verdocs-web-sdk-react/src',
      // componentCorePackage: '@verdocs/web-sdk',
      // proxiesFile: '../verdocs-web-sdk-react/src/components.ts',
      // includeImportCustomElements: true,
      // customElementsDir: 'dist/components',
    }),
    vueOutputTarget({
      componentCorePackage: '@verdocs/web-sdk',
      proxiesFile: '../verdocs-web-sdk-vue/lib/components.ts',
    }),
    {
      type: 'dist',
      // esmLoaderPath: '../dist/esm-loader',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'bundle',
      // customElementsExportBehavior: 'auto-define-custom-elements',
      generateTypeDeclarations: true,
      externalRuntime: false,
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
    // {
    //   type: 'docs-json',
    //   file: 'dist/docs.json',
    // },
    // {
    //   type: 'docs-custom',
    //   generator: (docs: JsonDocs) =>
    //     new WebTypesGenerator({
    //       name: '@verdocs/web-sdk',
    //       version: '4.0.6',
    //       defaultIconPath: './',
    //       outputPath: 'dist/types/web-types.json',
    //     }).generateWebTypesJson,
    // },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  plugins: [
    sass({
      // Silence a deprecation warning. We know about it and are planning to move to
      // CSS variables for most global/shared styling, but aren't ready to do it yet
      // and this is just cluttering up the build logs.
      // Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0
      silenceDeprecations: ['import'],
    }),
  ],
  // plugins: [inlineSvg(), sass()],
};
