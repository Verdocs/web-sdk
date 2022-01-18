import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Dialogs/Signature Dialog',
  component: 'verdocs-signature-dialog',
  args: {
    open: true,
    fullname: 'Paige Turner',
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

export const SignatureDialog = ({fullname, open, closed}) => html`<verdocs-signature-dialog .fullname=${fullname} .open=${open} @closed=${closed} />`;
