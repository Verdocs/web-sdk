import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Elements/Dialogs/Signature Dialog',
  component: 'verdocs-signature-dialog',
  args: {
    open: true,
    fullName: 'Paige Turner',
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

export const SignatureDialog = ({fullName, open, closed}) => html`<verdocs-signature-dialog .fullName=${fullName} .open=${open} @closed=${closed} />`;
