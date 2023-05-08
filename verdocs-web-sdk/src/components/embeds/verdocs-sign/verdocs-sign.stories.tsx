import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/Sign',
  component: 'verdocs-sign',
  args: {
    envelopeId: '056fb148-c2d3-47a5-b124-0adfe2038432',
    roleId: 'Seller',
    inviteCode: 'b865961a6bd74d2314f43e8bce9b767b',
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
