import {Preview} from '@storybook/react-vite';
import {setCustomElementsManifest} from '@storybook/web-components-vite';
import customElements from '../../verdocs-web-sdk/dist/custom-elements.json';

import {defineCustomElements} from '../../verdocs-web-sdk/dist/esm/loader';

defineCustomElements();
setCustomElementsManifest(customElements);

const preview: Preview = {
  tags: ['autodocs'],

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
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#f8faff',
        },
        {
          name: 'dark',
          value: '#333',
        },
      ],
    },
  },
};

export default preview;
