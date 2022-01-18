import {Meta} from '@storybook/web-components';
import {html} from 'lit-html';
import {IOrganization} from '@verdocs/js-sdk/Organizations/Types';

const MockOrganization = {
  id: '3',
  name: 'ACME Widgets, LLC',
  address: null,
  phone: null,
  business_name: null,
  is_business: true,
  address2: null,
  contact_email: null,
  timezone: null,
  envelope_responsible: false,
} as IOrganization;

export default {
  title: 'Controls/Organization Card',
  component: 'verdocs-organization-card',
  args: {
    organization: MockOrganization,
  },
  argTypes: {},
} as Meta;

export const OrganizationCard = ({organization}) => html`<verdocs-organization-card .organization=${organization} />`;
