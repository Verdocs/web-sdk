import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Document Fields/Dropdown',
  component: 'verdocs-field-dropdown',
  args: {
    order: 1,
    value: '',
    disabled: false,
    required: false,
    options: [{id: 'id1', value: 'Option 1'}],
  },
  argTypes: {},
} as Meta;

export const Dropdown = ({order, value, required, disabled, options}) =>
  html`<verdocs-field-dropdown .order="${order}" .required="${required}" .value="${value}" .disabled="${disabled}" .options="${options}" />`;
