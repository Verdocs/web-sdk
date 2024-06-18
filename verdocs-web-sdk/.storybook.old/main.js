module.exports = {
  // core: {
  //   builder: 'webpack5',
  // },
  // features: {
  //   babelModeV7: true,
  // },
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: [
    '@storybook/addon-links',
    // '@pxtrn/storybook-addon-docs-stencil',
    // actions, viewport docs, controls, backgrounds, toolbars
    '@storybook/addon-essentials',
    '@storybook/addon-webpack5-compiler-swc',
    '@chromatic-com/storybook'
  ],

  webpackFinal: async (config, {configType}) => {
    config.devtool = 'inline-source-map';
    // config.output.hashFunction = 'xxhash64';

    return config;
  },

  // webpackFinal: async config => {
  //   // find web-components rule for extra transpilation
  //   const webComponentsRule = config.module.rules.find(rule => rule.use && rule.use.options && rule.use.options.babelrc === false);
  //   // add your own `my-library`
  //   // webComponentsRule.test.push(new RegExp(`node_modules(\\/|\\\\)verdocs-web-sdk(.*)\\.js$`));
  //
  //   return config;
  // },
  //
  // webpackFinal: async (config, {configType}) => {
  //   console.log('Compiling', configType);
  //   //   // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  //   //   // You can change the configuration based on that.
  //   //   // 'PRODUCTION' is used when building the static version of storybook.
  //   //
  //   //   // Make whatever fine-grained changes you need
  //   //   config.module.rules.push({
  //   //     test: /\.scss$/,
  //   //     use: ['style-loader', 'css-loader', 'sass-loader'],
  //   //     include: path.resolve(__dirname, '../'),
  //   //   });
  //   //
  //   //   // Return the altered config
  //   return config;
  // },
  staticDirs: ['../public'],

  framework: {
    name: '@storybook/web-components-webpack5',
    options: {}
  },

  docs: {}
};