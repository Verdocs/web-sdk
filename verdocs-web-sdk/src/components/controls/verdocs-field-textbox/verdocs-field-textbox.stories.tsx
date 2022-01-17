import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Controls/Document Fields/Textbox',
  component: 'verdocs-field-textbox',
  args: {
    placeholder: 'Email address...',
    order: 1,
    value: '',
    disabled: false,
    required: false,
  },
  argTypes: {},
} as Meta;

export const Textbox = ({placeholder, order, value, required, disabled}) =>
  html`<verdocs-field-textbox .placeholder="${placeholder}" .order="${order}" .required="${required}" .value="${value}" .disabled="${disabled}" />`;
