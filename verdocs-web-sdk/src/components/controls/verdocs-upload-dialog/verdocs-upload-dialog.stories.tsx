import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Controls/Dialogs/Upload Dialog',
  component: 'verdocs-upload-dialog',
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

export const UploadDialog = ({message, open, closed}) => html`<verdocs-upload-dialog .message=${message} .open=${open} @closed=${closed} />`;
