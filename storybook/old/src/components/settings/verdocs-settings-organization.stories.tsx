import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Settings/Organization',
  component: 'verdocs-settings-organization',
  args: {},
  argTypes: {
    onOrganizationUpdated: {action: 'organizationUpdated'},
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Organization = ({onOrganizationUpdated}) => html` <verdocs-settings-organization @organizationUpdated=${onOrganizationUpdated} /> `;
