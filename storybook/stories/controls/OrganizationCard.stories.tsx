import {Meta} from '@storybook/react';
import {VerdocsOrganizationCard} from '@verdocs/web-sdk-react';

import '../common.css';
import {IOrganization} from '@verdocs/js-sdk';

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
  thumbnail_url: '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export default {
  title: 'Controls/Organization Card',
  component: VerdocsOrganizationCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Display a small summary card describing an organization.',
      },
    },
  },
  tags: ['autodocs', '!dev'],

  args: {},
  argTypes: {},
} as Meta;

export const OrganizationCardStories = {
  args: {organization: MockOrganization},
};
