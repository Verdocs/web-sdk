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
    onExit: {
      action: 'exit',
      table: {disable: true},
    },
  },
} as Meta;

export const OkDialog = ({heading, message, showCancel, onNext, onExit}) =>
  html`<verdocs-ok-dialog .heading=${heading} .message=${message} .showCancel=${showCancel} @exit=${onExit} @next=${onNext} />`;
