import {Config} from '@stencil/core';
import {inlineSvg} from 'stencil-inline-svg';
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
  devServer: {
    openBrowser: false,
  },
  testing: {
    transform: {
      '^.+\\.svg$': 'jest-svg-transformer',
    },
  },
  outputTargets: [
    angularOutputTarget({
      componentCorePackage: 'verdocs-web-sdk',
      directivesProxyFile: '../verdocs-web-sdk-angular/src/directives/proxies.ts',
      valueAccessorConfigs: angularValueAccessorBindings,
    }),
    reactOutputTarget({
      componentCorePackage: 'verdocs-web-sdk',
      proxiesFile: '../verdocs-web-sdk-react/src/components.ts',
      includeDefineCustomElements: true,
    }),
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements-bundle',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  plugins: [inlineSvg()],
};
