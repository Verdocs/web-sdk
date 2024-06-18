import type {StorybookConfig} from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-webpack5-compiler-swc',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    // {
    //   name: 'storybook-addon-stencil',
    //   options: {
    //     stencilOptions: {},
    //   },
    // },
  ],
  //     '@pxtrn/storybook-addon-docs-stencil',
  //     '@storybook/addon-webpack5-compiler-swc',
  // webpackFinal: async (config, {configType}) => {
  //   config.devtool = 'inline-source-map';
  //   // config.output.hashFunction = 'xxhash64';
  //
  //   return config;
  // },
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  staticDirs: ['../public'],
};
export default config;
