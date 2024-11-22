import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/Sign',
  component: 'verdocs-sign',
  args: {
    envelopeId: '98fb43a0-8e36-40a4-a1f7-5ea930569faa',
    roleId: 'Buyer',
    inviteCode: 'fi61ahww2i34jgbqw4eqkewb',
  },
  argTypes: {
    // envelopeId: {
    //   name: 'envelopeId',
    // },
    // roleId: {
    //   name: 'roleId',
    // },
    // inviteCode: {
    //   name: 'inviteCode',
    // },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Sign = ({envelopeId, roleId, inviteCode}) =>
  !envelopeId || !roleId || !inviteCode
    ? html`<img src="https://public-assets.verdocs.com/sample-signing-envelope.png" alt="Document sample" />`
    : html`<verdocs-sign .envelopeId=${envelopeId} .roleId=${roleId} .inviteCode=${inviteCode} />`;
