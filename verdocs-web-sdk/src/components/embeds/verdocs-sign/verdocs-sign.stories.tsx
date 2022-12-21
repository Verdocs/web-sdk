import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/Sign',
  component: 'verdocs-sign',
  args: {
    envelopeId: 'fa2e6afa-4da8-4c6e-ab37-27ec366b090b',
    roleId: 'Seller',
    inviteCode: '06cecc76ad9b3d02a8fadab5b0aad065',
  },
  argTypes: {
    envelopeId: {control: {type: 'string'}},
    roleId: {control: {type: 'string'}},
    inviteCode: {control: {type: 'string'}},
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Sign = ({envelopeId, roleId, inviteCode}) => html`<verdocs-sign .envelopeId=${envelopeId} .roleId=${roleId} .inviteCode=${inviteCode} />`;
