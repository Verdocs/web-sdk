import {Preview} from '@storybook/react-vite';
import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {setCustomElementsManifest} from '@storybook/web-components-vite';
import customElements from '../../verdocs-web-sdk/dist/custom-elements.json';
import {defineCustomElements} from '../../verdocs-web-sdk/dist/esm/loader';
import {API_URL} from '../stories/utils';

import '../../verdocs-web-sdk/src/globals.css';
import '../../verdocs-web-sdk/src/overrides.css';

// Point every component that uses the default endpoint at STORYBOOK_API_URL (a local api server, say). The default
// endpoint lives on globalThis, so this reaches the components' copy of the js-sdk too. Set it before the components
// load, so nothing calls the api first.
if (API_URL) {
  VerdocsEndpoint.getDefault().setBaseURL(API_URL);
  console.log('[STORYBOOK] Using api', API_URL);
}

defineCustomElements();
setCustomElementsManifest(customElements);

const preview: Preview = {
  tags: ['autodocs'],

  globalTypes: {
    theme: {
      description: 'Global Theme for components',
      defaultValue: 'verdocs',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          {value: 'verdocs', icon: 'circlehollow', title: 'Verdocs (Default)'},
          {value: 'custom', icon: 'circle', title: 'Overrides (Example)'},
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    (Story, context) => {
      const theme = context.globals.theme;
      if (theme === 'custom') {
        document.documentElement.classList.add('verdocs-custom-theme');
      } else {
        document.documentElement.classList.remove('verdocs-custom-theme');
      }
      return Story();
    },
  ],

  parameters: {
    layout: 'centered',

    options: {
      storySort: {
        order: ['Embeds', ['Sign']],
      },
      // storySort: (a, b) => (a.id === b.id ? 0 : a.id.localeCompare(b.id, undefined, {numeric: true})),
    },

    docs: {
      canvas: {
        // With lit-html and web-components it doesn't show args, just <verdocs-button><.verdocs-button>.
        sourceState: 'none',
      },

      extractComponentDescription: (a, b) => {
        const componentDocs = (customElements.tags as any).find(tag => tag.name === b.component);
        if (componentDocs) {
          return componentDocs.description.value;
        }
      },
    },

    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    backgrounds: {
      options: {
        light: {
          name: 'light',
          value: '#f8faff',
        },

        dark: {
          name: 'dark',
          value: '#333',
        }
      }
    },
  },

  initialGlobals: {
    backgrounds: {
      value: 'light'
    }
  }
};

export default preview;
