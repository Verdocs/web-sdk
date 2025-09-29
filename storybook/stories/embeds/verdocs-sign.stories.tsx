import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';
import {VerdocsEndpoint} from '@verdocs/js-sdk';

export default {
  title: 'Embeds/Sign',
  component: 'verdocs-sign',
  args: {
    envelopeId: 'd9547f59-94ff-461b-8bc7-87ea83d8c8bd',
    roleId: 'Taxpayer',
    inviteCode: 'eh1nuwixocisf55t19qw13lq',
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
