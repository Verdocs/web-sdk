import {html} from 'lit-html';
import {IOrganization} from '@verdocs/js-sdk';
import {Meta} from '@storybook/web-components';

const MockOrganization: IOrganization = {
  id: '21643fd6-4097-47c0-9780-62dc0c01ddce',
  name: 'Verdocs, LLC',
  url: 'https://verdocs.com/',
  address: null,
  phone: null,
  business_name: null,
  is_business: true,
  address2: null,
  contact_email: null,
  slug: 'verdocs',
  primary_color: '',
  secondary_color: '',
  full_logo_url: '',
  thumbnail_url: 'https://app.verdocs.com/assets/verdocs-v.svg',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export default {
  title: 'Controls/Organization Card',
  component: 'verdocs-organization-card',
  args: {
    organization: MockOrganization,
  },
  argTypes: {},
} as Meta;

export const OrganizationCard = ({organization}) => html`<verdocs-organization-card .organization=${organization} />`;
