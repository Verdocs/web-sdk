import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';
import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {loadStoryDefaults} from '../utils';

export default {
  title: 'Embeds/Sign',
  component: 'verdocs-sign',
  args: loadStoryDefaults('embeds-sign', {
    envelopeId: '',
    roleId: '',
    inviteCode: '',
  }),
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Sign = ({envelopeId, roleId, inviteCode}) =>
  !envelopeId || !roleId || !inviteCode
    ? html`<img src="https://public-assets.verdocs.com/sample-signing-envelope.png" alt="Document sample" />`
    : html`<verdocs-sign .envelopeId=${envelopeId} .roleId=${roleId} .inviteCode=${inviteCode} />`;
