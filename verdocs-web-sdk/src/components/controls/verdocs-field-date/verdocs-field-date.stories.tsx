import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Controls/Document Fields/Date',
  component: 'verdocs-field-date',
  args: {
    placeholder: 'Select Date',
    order: 1,
    value: '',
    disabled: false,
    required: false,
  },
  argTypes: {
    fieldFocus: {
      action: 'fieldFocus',
      table: {disable: true},
    },
    fieldBlur: {
      action: 'fieldBlur',
      table: {disable: true},
    },
    fieldChange: {
      action: 'fieldChange',
      table: {disable: true},
    },
    fieldInput: {
      action: 'fieldInput',
      table: {disable: true},
    },
  },
} as Meta;

export const Date = ({placeholder, order, value, required, disabled}) =>
  html`<verdocs-field-textbox .placeholder="${placeholder}" .order="${order}" .required="${required}" .value="${value}" .disabled="${disabled}" />`;
