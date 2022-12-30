import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Dialogs/Ok Dialog',
  component: 'verdocs-ok-dialog',
  args: {
    showCancel: true,
    heading: 'Login Error',
    message: 'Login failed. Please check your username and password and try again.',
  },
  argTypes: {
    onNext: {
      action: 'next',
      table: {disable: true},
    },
    onCancel: {
      action: 'cancel',
      table: {disable: true},
    },
  },
} as Meta;

export const OkDialog = ({heading, message, showCancel, onNext, onCancel}) =>
  html`<verdocs-ok-dialog .heading=${heading} .message=${message} .showCancel=${showCancel} @cancel=${onCancel} @next=${onNext} />`;
