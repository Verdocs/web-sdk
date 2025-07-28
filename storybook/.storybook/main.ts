import remarkGfm from 'remark-gfm';
import {StorybookConfig} from '@storybook/web-components-vite';

const config: StorybookConfig = {
  core: {
    builder: {
      name: '@storybook/builder-vite',
      // See https://github.com/storybookjs/storybook/issues/13795
      options: {fsCache: false},
    },

    disableWhatsNewNotifications: true,
  },

  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: ['@storybook/addon-links', '@chromatic-com/storybook', {
    name: '@storybook/addon-docs',
    options: {
      mdxPluginOptions: {
        mdxCompileOptions: {
          remarkPlugins: [remarkGfm],
        },
      },
    },
  }, '@storybook/addon-vitest'],

  // decorators: [(story) => html`<div style="border: 3px dashed red">${story()}</div>`],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },

  docs: {
    // autodocs: true
    docsMode: true,
  },
};

export default config;
