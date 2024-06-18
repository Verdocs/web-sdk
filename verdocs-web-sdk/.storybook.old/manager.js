import {addons} from '@storybook/addons';
// import {themes} from '@storybook/theming';
import VerdocsTheme from './VerdocsTheme';

addons.setConfig({
  theme: VerdocsTheme,
  // theme: themes.dark,
});
