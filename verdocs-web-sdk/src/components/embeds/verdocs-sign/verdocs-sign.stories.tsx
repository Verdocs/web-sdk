import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/Sign',
  component: 'verdocs-sign',
  args: {
    documentid: 'f8ef90d3-8631-4f75-8e51-82d0b43fc363',
    roleid: 'Recipient 1',
    invitecode: 'd48c3e7d7071e1cc6c4788932f2604d9',
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

export const Sign = ({documentid, roleid, invitecode, authenticated}) =>
  html`<verdocs-sign .documentid=${documentid} .roleid=${roleid} .invitecode=${invitecode} @authenticated=${authenticated} />`;
