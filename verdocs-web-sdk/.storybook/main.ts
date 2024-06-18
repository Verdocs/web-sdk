import type {StorybookConfig} from '@storybook/web-components-webpack5';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-webpack5-compiler-swc',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    {
      name: 'storybook-addon-stencil',
      options: {
        stencilOptions: {},
      },
    },
  ],
  //     '@pxtrn/storybook-addon-docs-stencil',
  //     '@storybook/addon-webpack5-compiler-swc',
  framework: {
    name: '@storybook/web-components-webpack5',
    options: {},
  },
  staticDirs: ['../public'],
};
export default config;
