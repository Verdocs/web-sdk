import {Preview} from '@storybook/react-vite';
import {setCustomElementsManifest} from '@storybook/web-components-vite';
import customElements from '../../verdocs-web-sdk/dist/custom-elements.json';
import {defineCustomElements} from '../../verdocs-web-sdk/dist/esm/loader';

import '../../verdocs-web-sdk/src/globals.css';
import '../../verdocs-web-sdk/src/overrides.css';

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
        },
      },
    },
  },

  initialGlobals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export default preview;
