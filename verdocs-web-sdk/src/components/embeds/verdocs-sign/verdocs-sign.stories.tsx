import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/Sign',
  component: 'verdocs-sign',
  args: {
    documentid: '4868db9f-a565-4132-bdd2-c403ae703e95',
    roleid: 'Recipient 1',
    invitecode: '2bd1d634616622206bf58d25fb4b7362',
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
