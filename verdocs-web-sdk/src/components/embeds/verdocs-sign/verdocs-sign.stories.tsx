import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/Sign',
  component: 'verdocs-sign',
  args: {
    documentid: 'bd8ecb8f-6eb9-4998-802a-b8d8b7f14d63',
    roleid: 'Recipient 1',
    invitecode: '9c5284cd58e6e7a86c0a94522b58d433',
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
