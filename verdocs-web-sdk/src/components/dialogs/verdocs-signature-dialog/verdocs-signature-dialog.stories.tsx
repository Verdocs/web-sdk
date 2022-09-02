import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Dialogs/Signature Dialog',
  component: 'verdocs-signature-dialog',
  args: {
    open: true,
    name: 'Paige Turner',
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

export const SignatureDialog = ({name, open, closed}) => html`<verdocs-signature-dialog .name=${name} .open=${open} @closed=${closed} />`;
