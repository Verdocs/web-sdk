import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/Sign',
  component: 'verdocs-sign',
  args: {
    // https://verdocs.com/view/sign/42158c4b-8520-4e30-bbcc-65cd4590cdde/roleName/Seller/invitation/50d97f77ace9d8c87e2e9c40d2bd10fd
    envelopeId: '42158c4b-8520-4e30-bbcc-65cd4590cdde',
    roleId: 'Seller',
    inviteCode: '50d97f77ace9d8c87e2e9c40d2bd10fd',
  },
  argTypes: {},
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Sign = ({envelopeId, roleId, inviteCode}) => html`<verdocs-sign .envelopeId=${envelopeId} .roleId=${roleId} .inviteCode=${inviteCode} />`;
