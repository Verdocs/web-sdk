import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Settings/Profile',
  component: 'verdocs-settings-profile',
  args: {},
  argTypes: {
    onProfileUpdated: {action: 'profileUpdated'},
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Profile = ({onProfileUpdated}) => html` <verdocs-settings-profile @profileUpdated=${onProfileUpdated} /> `;
