import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Document Fields/Textarea',
  component: 'verdocs-field-textarea',
  args: {
    placeholder: 'Email address...',
    order: 1,
    value: '',
    disabled: false,
    required: false,
  },
  argTypes: {},
} as Meta;

export const Textarea = ({placeholder, order, value, required, disabled}) =>
  html`<verdocs-field-textarea .placeholder="${placeholder}" .order="${order}" .required="${required}" .value="${value}" .disabled="${disabled}" />`;
