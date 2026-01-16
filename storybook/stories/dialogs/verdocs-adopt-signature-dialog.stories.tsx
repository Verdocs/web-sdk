import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Dialogs/Adopt Signature Dialog',
  component: 'verdocs-adopt-signature-dialog',
  args: {
    name: 'Paige Turner',
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

export const AdoptSignatureDialog = ({name, onCancel, onExit}) =>
  html`<div style="width: 500px; height: 600px;">
    <verdocs-adopt-signature-dialog .name=${name} @cancel=${onCancel} @exit=${onExit} />
  </div>`;
