import {Meta} from '@storybook/web-components';
import {html} from 'lit-html';
import {IOrganization} from '@verdocs/js-sdk/Organizations/Types';

const MockOrganization = {
  id: '21643fd6-4097-47c0-9780-62dc0c01ddce',
  name: 'Verdocs, LLC',
  url: 'https://verdocs.com/',
  address: null,
  phone: null,
  business_name: null,
  is_business: true,
  address2: null,
  contact_email: null,
  timezone: null,
  envelope_responsible: false,
  created_at: '2022-12-21 20:16:50.262113+00',
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
