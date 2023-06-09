import {Meta} from '@storybook/web-components';
import {html} from 'lit-html';

export default {
  title: 'Templates/Template Star',
  component: 'verdocs-template-star',
  args: {
    template: {
      id: '90c2e63d-6b61-4dd2-a2e2-e137778f5ab5',
      name: 'Bill of Sale Test',
      sender: 'creator',
      counter: 7,
      description: null,
      created_at: '2023-05-08T12:57:30.112Z',
      updated_at: '2023-06-06T15:49:01.268Z',
      is_personal: true,
      is_public: false,
      profile_id: 'a44a0fa0-04ca-409d-a5d6-2b12ce893b60',
      organization_id: 'eae89e66-83bc-44f7-bb35-a8ef55958b3e',
      last_used_at: '2023-05-30T12:13:34.216Z',
      document_name: 'billofsale.pdf',
      star_counter: 0,
      tag_name: null,
      is_starred: false,
    },
  },
  argTypes: {},
} as Meta;

export const TemplateStar = ({template}) => html`<verdocs-template-star .template="${template}" />`;
