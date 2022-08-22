import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/Sign',
  component: 'verdocs-sign',
  args: {
    // documentId: '96ccc2e9-1bb8-4be8-9dbd-7113107383ee',
    // roleId: 'Recipient 2',
    // inviteCode: 'e21cdf86dcc502f9f460f8ddb7c3f2e1',
    documentId: '96ccc2e9-1bb8-4be8-9dbd-7113107383ee',
    roleId: 'Recipient 1',
    inviteCode: '11f1253a186864b1871a48efed8ff9c1',
  },
  argTypes: {
    documentId: {control: {type: 'string'}},
    roleId: {control: {type: 'string'}},
    inviteCode: {control: {type: 'string'}},
    // documentId: {defaultValue: '', control: {type: 'string'}},
    // roleId: {defaultValue: '', control: {type: 'string'}},
    // inviteCode: {defaultValue: '', control: {type: 'string'}},
    // authenticated: {
    //   action: 'authenticated',
    //   table: {
    //     disable: true,
    //   },
    // },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Sign = ({documentId, roleId, inviteCode}) => html`<verdocs-sign .documentId=${documentId} .roleId=${roleId} .inviteCode=${inviteCode} />`;
