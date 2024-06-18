import {create} from '@storybook/theming/create';

export default create({
  base: 'dark',
  brandTitle: 'Verdocs Web SDK',
  brandUrl: 'https://verdocs.com',
  brandImage: 'https://app.verdocs.com/assets/white-logo.svg',
  brandTarget: '_self',

  fontBase: '"Inter", "Open Sans", sans-serif',

  colorPrimary: '#654dcb',
  colorSecondary: '#654dcb',
  // colorSecondary: '#55bc81',
  // barSelectedColor:'#cfa',

  // Sidebar background color
  appBg: '#292C2E',

  // Background for story area.
  appPreviewBg: '#f2f5fa',

  // Backgrounds for things like code samples
  appContentBg: '#ffffff',
  appBorderColor: '#654dcb6f',
  appBorderRadius: 4,

  // Text colors
  textColor: '#333333',
  // textInverseColor: '#f3a',

  // Toolbar default and active colors
  inputBg: '#f1f2f3',
  inputBorder: '#654dcb5f',
  inputTextColor: '#999999',
  inputBorderRadius: 3,

  // barTextColor: '#33f',
  // barSelectedColor: '#3f3',
  // barHoverColor: '#f33',
  // barBg: '#f3f',
});
