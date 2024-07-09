import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';
import type {IOrganization, ITemplate} from '@verdocs/js-sdk';

const MockTemplate = {
  counter: 2,
  star_counter: 10,
  name: 'IRS Form I-9',
  id: '1',
  profile_id: '2',
  created_at: '2021-11-14T13:57:21Z',
  updated_at: '2021-11-14T13:57:21Z',
  last_used_at: '2021-11-14T13:57:21Z',
  organization_id: '3',
  is_personal: false,
  is_public: true,
  sender: 'creator',
  description: 'IRS Form I-9',

  // TODO: These fields need to be added to the API response
  organization: {
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

    slug: 'acme',
    url: '',
    full_logo_url: '',
    thumbnail_url: '',
    primary_color: '',
    secondary_color: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as IOrganization,

  template_document: {
    url: 'url',
    name: 'IRS Form I-9',
    page_numbers: 3,
    id: '4',
    updated_at: '2021-11-14T13:57:21Z',
    created_at: '2021-11-14T13:57:21Z',
    template_id: '1',
    mime: 'application/pdf',
    thumbnail_url: 'https://verdocs.com/en/wp-content/uploads/2021/12/Screen-Shot-2021-12-30-at-2.26.08-PM-e1640892536786.png',
  },

  reminder_id: null,
  is_sendable: true,
  search_key: '',
  data: {},
} as ITemplate;

export default {
  title: 'Templates/Template Card',
  component: 'verdocs-template-card',
  args: {
    template: MockTemplate,
  },
  argTypes: {},
} as Meta;

export const TemplateCard = ({template}) => html`<verdocs-template-card .template=${template} />`;
