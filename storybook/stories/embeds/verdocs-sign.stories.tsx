import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/Sign',
  component: 'verdocs-sign',
  args: {
    envelopeId: 'fca14dc4-4570-4b56-9131-dda39c28b3c1',
    roleId: 'Recipient 1',
    inviteCode: 'yeeabukotzrgcnqwp14gzdnv',
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
