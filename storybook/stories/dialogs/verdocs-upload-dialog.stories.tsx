import {html} from 'lit-html';
import {Meta} from '@storybook/web-components-vite';

export default {
  title: 'Dialogs/Upload Dialog',
  component: 'verdocs-upload-dialog',
  args: {
    open: true,
    message: 'Login failed. Please check your username and password and try again.',
  },
  argTypes: {
    onExit: {
      action: 'exit',
      table: {disable: true},
    },
  },
} as Meta;

export const UploadDialog = ({message, open, onExit}) =>
  html`<div style="width: 500px; height: 500px;">
    <verdocs-upload-dialog .message=${message} .open=${open} @exit=${onExit} />
  </div>`;
