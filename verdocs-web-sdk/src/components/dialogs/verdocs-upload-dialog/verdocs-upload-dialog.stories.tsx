import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

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

export const UploadDialog = ({message, open, onExit}) => html`<verdocs-upload-dialog .message=${message} .open=${open} @exit=${onExit} />`;
