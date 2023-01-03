import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/Sign',
  component: 'verdocs-sign',
  args: {
    envelopeId: '92f3dd1e-9ff2-44c3-8c96-32a5b650ed6d',
    roleId: 'Seller',
    inviteCode: '67aad4b04fbb83c03d238f7404113b6b',
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
