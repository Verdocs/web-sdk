import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Dialogs/Ok Dialog',
  component: 'verdocs-ok-dialog',
  args: {
    open: true,
    cancel: true,
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

export const OkDialog = ({heading, message, open, cancel, closed}) =>
  html`<verdocs-ok-dialog .heading=${heading} .message=${message} .open=${open} .cancel=${cancel} @closed=${closed} />`;
