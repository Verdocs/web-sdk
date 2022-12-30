import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Dialogs/Signature Dialog',
  component: 'verdocs-signature-dialog',
  args: {
    name: 'Paige Turner',
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

export const SignatureDialog = ({name, onCancel, onNext}) => html`<verdocs-signature-dialog .name=${name} @cancel=${onCancel} @next=${onNext} />`;
