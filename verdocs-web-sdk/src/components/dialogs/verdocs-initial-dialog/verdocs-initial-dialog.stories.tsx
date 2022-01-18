import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Dialogs/Initial Dialog',
  component: 'verdocs-initial-dialog',
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

export const InitialDialog = ({fullname, open, closed}) => html`<verdocs-initial-dialog .fullname=${fullname} .open=${open} @closed=${closed} />`;
