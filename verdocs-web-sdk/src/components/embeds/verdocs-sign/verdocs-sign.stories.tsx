import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/Sign',
  component: 'verdocs-sign',
  args: {
    envelopeId: '26651429-f023-4afc-b969-23ba68adad4b',
    roleId: 'Buyer',
    inviteCode: '44fcfa9435cdb855a7ddb0c3c2d7da9c',
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
