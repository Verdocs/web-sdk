import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/Sign',
  component: 'verdocs-sign',
  args: {
    documentid: '29b99d0b-8079-4e98-827c-28c375e5ecb7',
    roleid: 'Recipient 1',
    invitecode: 'fd5ba5f9147f1e125503a0d021b96d40',
  },
  argTypes: {
    authenticated: {
      action: 'authenticated',
      table: {
        disable: true,
      },
    },
  },
} as Meta;

export const Default = ({documentid, roleid, invitecode, authenticated}) =>
  html`<verdocs-sign .documentid=${documentid} .roleid=${roleid} .invitecode=${invitecode} @authenticated=${authenticated} />`;
