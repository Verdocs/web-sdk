import {html} from 'lit';
import {Meta} from '@storybook/web-components-vite';

export default {
  title: 'Dialogs/Id Scan Dialog',
  component: 'verdocs-id-scan-dialog',
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

export const IdScanDialog = ({heading, message, showCancel, onNext, onExit}) =>
  html`<div style="width: 500px; height: 800px;">
    <verdocs-id-scan-dialog .heading=${heading} .message=${message} .showCancel=${showCancel} @exit=${onExit} @next=${onNext} />
  </div>`;
