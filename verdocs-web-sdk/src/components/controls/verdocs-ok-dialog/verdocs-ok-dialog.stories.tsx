import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Controls/Dialogs',
  component: 'verdocs-ok-dialog',
  args: {
    open: true,
    heading: 'Login Error',
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

export const OkDialog = ({heading, message, open, closed}) => html`<verdocs-ok-dialog .heading=${heading} .message=${message} .open=${open} @closed=${closed} />`;
