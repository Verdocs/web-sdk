import {Preview} from '@storybook/react';
import StoriesTheme from './StoriesTheme';

const preview: Preview = {
  parameters: {
    options: {
      // storySort: (a, b) => (a.id === b.id ? 0 : a.id.localeCompare(b.id, undefined, {numeric: true})),
    },
    docs: {
      theme: StoriesTheme,
    },
    tags: ['!autodocs'],
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
