import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Settings/Members',
  component: 'verdocs-settings-members',
  args: {},
  argTypes: {
    onMemberInvited: {action: 'memberInvited'},
    onMemberUpdated: {action: 'memberUpdated'},
    onMemberRemoved: {action: 'memberRemoved'},
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Members = ({onMemberInvited, onMemberUpdated, onMemberRemoved}) => html`
  <verdocs-settings-members @memberInvited=${onMemberInvited} @memberUpdated=${onMemberUpdated} @memberRemoved=${onMemberRemoved} />
`;
