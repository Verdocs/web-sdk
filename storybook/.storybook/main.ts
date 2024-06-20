import remarkGfm from 'remark-gfm';
import {StorybookConfig} from '@storybook/web-components-vite';
import {html} from 'lit-html';

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    '@storybook/addon-links',
    // Includes Actions, Backgrounds, Controls, Docs, Highlight, Measure & outline, Toolbars & globals, Viewport
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
  ],

  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },

  // decorators: [(story) => html`<div style="border: 3px dashed red">${story()}</div>`],
};

export default config;
