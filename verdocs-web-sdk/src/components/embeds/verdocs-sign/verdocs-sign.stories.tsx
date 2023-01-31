import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/Sign',
  component: 'verdocs-sign',
  args: {
    envelopeId: 'f2618253-1123-4842-8f64-70d7cd90b54e',
    roleId: 'Seller',
    inviteCode: '1d1e86fe92d8bba459167bc136f66b4f',
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
