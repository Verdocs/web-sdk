// https://github.com/storybookjs/storybook/tree/next/app/web-components
// https://dev.to/ofhouse/build-a-web-component-library-with-stencil-and-storybook-c27
// https://github.com/ofhouse/storybook-stencil-example/blob/main/src/components/my-component/my-component.stories.js
// https://dev.to/ofhouse/enhance-your-stencil-web-components-in-storybook-with-knobs-actions-and-jsx-54m4
// https://medium.com/@neza.djukic/storybook-stenciljs-ionic-4-angular-under-one-roof-159cc8dab3a4
// https://gist.github.com/jpzwarte/0be6a491a3762f2ee2e784ab29669a2c
// https://storybook.js.org/addons/@storybook/addon-docs/

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-docs', '@pxtrn/storybook-addon-docs-stencil'],
  webpackFinal: async config => {
    // find web-components rule for extra transpilation
    const webComponentsRule = config.module.rules.find(rule => rule.use && rule.use.options && rule.use.options.babelrc === false);
    // add your own `my-library`
    webComponentsRule.test.push(new RegExp(`node_modules(\\/|\\\\)my-library(.*)\\.js$`));

    return config;
  },
};
