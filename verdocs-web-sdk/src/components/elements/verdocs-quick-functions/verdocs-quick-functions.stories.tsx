import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Elements/Search/Quick Functions',
  component: 'verdocs-quick-functions',
  args: {
    options: {
      title: 'Quick Create',
    },
  },
  argTypes: {
    createTemplate: {action: 'createTemplate'},
    createDocument: {action: 'createDocument'},
  },
} as Meta;

export const QuickFunctions = ({options, createTemplate, createDocument}) =>
  html`<verdocs-quick-functions .options=${options} @createTemplate=${createTemplate} @createDocument=${createDocument} tall />`;
