import {Preview} from '@storybook/react';
import {setCustomElementsManifest} from '@storybook/web-components';
import customElements from '../../verdocs-web-sdk/dist/custom-elements.json';
// import StoriesTheme from './StoriesTheme';

import {defineCustomElements} from '../../verdocs-web-sdk/dist/esm/loader';
import {VerdocsEndpoint} from '@verdocs/js-sdk';
defineCustomElements();

setCustomElementsManifest(customElements);

VerdocsEndpoint.getDefault().setBaseURL('https://stage-api.verdocs.com');

const preview: Preview = {
  tags: ['autodocs', 'autodocs', 'autodocs'],

  parameters: {
    layout: 'centered',

    options: {
      // storySort: (a, b) => (a.id === b.id ? 0 : a.id.localeCompare(b.id, undefined, {numeric: true})),
    },

    docs: {
      canvas: {
        // With lit-html and web-components it doesn't show args, just <verdocs-button><.verdocs-button>.
        sourceState: 'none',
      },
      // toc: true, // 👈 Enables the table of contents
      // theme: StoriesTheme,
      // extractComponentDescription: () => {
      //   console.log('b');
      //   return 'component description';
      // },

      extractComponentDescription: (a, b) => {
        const componentDocs = customElements.tags.find(tag => tag.name === b.component);
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

  // TODO:
  // https://storybook.js.org/docs/essentials/viewport#parameters
  // https://storybook.js.org/docs/essentials/interactions#parameters
  // https://storybook.js.org/docs/essentials/controls#parameters
};

export default preview;
