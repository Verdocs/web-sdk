import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Dialogs/Initial Dialog',
  component: 'verdocs-initial-dialog',
  args: {
    open: true,
    initials: 'PT',
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

export const InitialDialog = ({initials, open, closed}) => html`<verdocs-initial-dialog .initials=${initials} .open=${open} @closed=${closed} />`;
