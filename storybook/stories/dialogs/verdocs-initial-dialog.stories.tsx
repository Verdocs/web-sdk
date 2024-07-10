import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Dialogs/Initial Dialog',
  component: 'verdocs-initial-dialog',
  args: {
    initials: 'PT',
  },
  argTypes: {
    onNext: {
      action: 'next',
      description: 'Fired when the user completes the dialog and clicks Adopt. The event detail will contain a base64-encoded string representation of the initials adopted.',
    },
    onExit: {
      action: 'exit',
      description: 'Fired if the user cancels the dialog.',
    },
  },
} as Meta;

export const InitialDialog = ({initials, onNext, onExit}) =>
  html`<div style="width: 500px; height: 500px;">
    <verdocs-initial-dialog .initials=${initials} @exit=${onExit} @next=${onNext} />
  </div>`;
