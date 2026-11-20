import {fileURLToPath} from 'node:url';
import remarkGfm from 'remark-gfm';
import {searchForWorkspaceRoot} from 'vite';
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

  addons: [
    '@storybook/addon-links',
    '@chromatic-com/storybook',
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

  // decorators: [(story) => html`<div style="border: 3px dashed red">${story()}</div>`],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },

  docs: {
    // autodocs: true
    docsMode: true,
  },

  // LOCAL_JS_SDK=1: let Vite serve ../hub/packages/js-sdk, which scripts/local-js-sdk.sh links into node_modules.
  // Linked packages outside node_modules are served as source, and Vite refuses files outside the workspace root.
  async viteFinal(config) {
    if (process.env.LOCAL_JS_SDK) {
      config.server ??= {};
      config.server.fs ??= {};
      config.server.fs.allow = [
        ...(config.server.fs.allow ?? [searchForWorkspaceRoot(process.cwd())]),
        fileURLToPath(new URL('../../../hub/packages/js-sdk', import.meta.url)),
      ];
    }
    return config;
  },
};

export default config;
