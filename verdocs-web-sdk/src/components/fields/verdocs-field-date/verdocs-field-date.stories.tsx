import {html} from 'lit-html';
import {IRole} from '@verdocs/js-sdk';
import {Meta} from '@storybook/web-components';

const templateId = 'd501d2df-b604-455d-a2fc-953d947cf79d';

export default {
  title: 'Fields/Date',
  component: 'verdocs-field-date',
  args: {
    field: {
      template_id: templateId,
      document_id: templateId,
      type: 'date',
      required: true,
      page_sequence: 1,
      tabindex: 0,
      x: 0,
      y: 0,
      width: 100,
      height: 50,
      role_name: 'storybook',
      name: 'date',
      setting: {x: 0, y: 0, required: true},
    },
    disabled: false,
    roles: [{template_id: templateId, name: 'date', type: 'signer', sequence: 1, order: 1}] as IRole[],
  },
  argTypes: {},
} as Meta;

export const Date = ({field, roles, disabled}) => html`<verdocs-field-date .templateid="${templateId}" .field="${field}" .roles="${roles}" .disabled="${disabled}" />`;
