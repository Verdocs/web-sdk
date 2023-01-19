import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/Sign',
  component: 'verdocs-sign',
  args: {
    envelopeId: 'b4a03f7e-8a2b-4752-ac65-621114a1f878',
    roleId: 'Seller',
    inviteCode: 'e4bee24c3d2795f340ceeb53f6fefc1a',
  },
  argTypes: {},
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Sign = ({envelopeId, roleId, inviteCode}) => html`<verdocs-sign .envelopeId=${envelopeId} .roleId=${roleId} .inviteCode=${inviteCode} />`;
