import {withThemeFromJSXProvider} from '@storybook/addon-themes';
import type {Preview} from '@storybook/web-components';
import {ThemeProvider} from '@storybook/theming';

const THEME = {
  typography: {
    fonts: {
      base: 'Arial, sans-serif',
      mono: 'Courier, monospace',
    },
  },
};

const preview: Preview = {
  decorators: [
    withThemeFromJSXProvider({
      themes: {
        dark: THEME,
        light: THEME,
      },
      defaultTheme: 'dark',
      Provider: ThemeProvider,
    }),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
