import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/Sign',
  component: 'verdocs-sign',
  args: {
    documentid: 'f484a296-4f4c-4783-9adf-a3302915a503',
    roleid: 'Recipient 2',
    invitecode: 'ea2328b1181b26118f5c676119232df6',
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
