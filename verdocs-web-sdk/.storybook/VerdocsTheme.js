import { create } from '@storybook/theming';

export default create({
  // Reverted this, it broke the text in the Canvas tab
  // base: 'dark',
  // textColor: 'white',
  // textInverseColor: 'rgba(255,255,255,0.9)',

  brandTitle: 'Verdocs Embeds',
  brandUrl: 'https://verdocs.com',
  brandImage: 'https://verdocs.com/en/wp-content/uploads/2020/05/wh-logo-1.svg',
  brandTarget: '_self',

  colorPrimary: 'hotpink',
  colorSecondary: '#654dcb',

  appContentBg: 'white',


  barTextColor: '#55bc81',
  barSelectedColor: '#55bc81',
  barBg: '#33364b',
});
