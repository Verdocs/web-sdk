import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/Sign',
  component: 'verdocs-sign',
  args: {
    envelopeId: 'df74744c-d0b0-4793-8dff-02303b0d1dff',
    roleId: 'Recipient 1',
    inviteCode: '6fd90bae9298b296aeb0a85c698b6324',
    // envelopeId: '',
    // roleId: '',
    // inviteCode: '',
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
