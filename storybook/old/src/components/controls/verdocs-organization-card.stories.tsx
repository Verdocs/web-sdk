import {html} from 'lit-html';
import {IOrganization} from '@verdocs/js-sdk';
import {Meta} from '@storybook/web-components';


export default {
  title: 'Controls/Organization Card',
  component: 'verdocs-organization-card',
  args: {
    organization: MockOrganization,
  },
  argTypes: {},
} as Meta;

export const OrganizationCard = ({organization}) => html`<verdocs-organization-card .organization=${organization} />`;
