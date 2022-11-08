import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Dialogs/Template Sender Dialog',
  component: 'verdocs-template-sender-dialog',
  args: {
    open: true,
    message: 'Login failed. Please check your username and password and try again.',
  },
  argTypes: {
    closed: {
      action: 'closed',
      table: {
        disable: true,
      },
    },
  },
} as Meta;

export const TemplateSenderDialog = ({message, open, closed}) => html`<verdocs-template-sender-dialog .message=${message} .open=${open} @closed=${closed} />`;
