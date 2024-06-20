import {Preview} from '@storybook/react';
import StoriesTheme from './StoriesTheme';

import {defineCustomElements} from '../../verdocs-web-sdk/dist/esm/loader';

defineCustomElements();

const preview: Preview = {
  parameters: {
    options: {
      // storySort: (a, b) => (a.id === b.id ? 0 : a.id.localeCompare(b.id, undefined, {numeric: true})),
    },
    docs: {
      // toc: true, // 👈 Enables the table of contents
      theme: StoriesTheme,
      extractComponentDescription: () => {
        console.log('b');
        return 'component description'
      },

    },
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
