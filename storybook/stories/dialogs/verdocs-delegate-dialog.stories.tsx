import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Dialogs/Delegate Dialog',
  component: 'verdocs-delegate-dialog',
  args: {
    envelope: {
      name: 'Purchase Agreement'
    }
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

export const DelegateDialog = ({envelope, onNext, onExit}) =>
  html`<div style="width: 500px; height: 600px;">
    <verdocs-delegate-dialog .envelope=${envelope} @exit=${onExit} @next=${onNext} />
  </div>`;
