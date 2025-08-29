import {addons} from 'storybook/manager-api';
import ManagerTheme from './ManagerTheme';

addons.setConfig({
  theme: ManagerTheme,
  navSize: 220,
  sidebar: {
    showRoots: true,
    collapsedRoots: ['controls', 'dialogs', 'envelopes', 'fields', 'templates'],
  }
});
