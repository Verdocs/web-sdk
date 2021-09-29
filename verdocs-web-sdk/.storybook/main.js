module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@pxtrn/storybook-addon-docs-stencil',
    '@storybook/addon-essentials', // actions, viewport docs, controls, backgrounds, toolbars
  ],
  // webpackFinal: async config => {
  //   // find web-components rule for extra transpilation
  //   const webComponentsRule = config.module.rules.find(rule => rule.use && rule.use.options && rule.use.options.babelrc === false);
  //   // add your own `my-library`
  //   // webComponentsRule.test.push(new RegExp(`node_modules(\\/|\\\\)verdocs-web-sdk(.*)\\.js$`));
  //
  //   return config;
  // },
};
