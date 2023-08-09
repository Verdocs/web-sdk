import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/Sign',
  component: 'verdocs-sign',
  args: {
    envelopeId: '1dbb69bd-5d0d-4678-978d-962dd0775aaa',
    roleId: 'Recipient 1',
    inviteCode: '203d4d671b40db359e92a14fa54c1c3a',
  },
  argTypes: {
    envelopeId: {
      name: 'envelopeId',
    },
    roleId: {
      name: 'roleId',
    },
    inviteCode: {
      name: 'inviteCode',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Sign = ({envelopeId, roleId, inviteCode}) =>
  !envelopeId || !roleId || !inviteCode
    ? html`<img src="https://verdocs-public-assets.s3.amazonaws.com/sample-signing-envelope.png" alt="Document sample" />`
    : html`<verdocs-sign .envelopeId=${envelopeId} .roleId=${roleId} .inviteCode=${inviteCode} />`;
