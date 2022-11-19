import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Controls/Text Input',
  component: 'verdocs-text-input',
  args: {
    label: 'Name',
    value: '',
    placeholder: 'Enter your name...',
  },
  argTypes: {
    input: {
      action: 'input',
      table: {
        disable: true,
      },
    },
  },
} as Meta;

export const TextInput = ({type, label, value, placeholder, disabled, input}) =>
  html`<verdocs-text-input .type=${type} .label=${label} .placeholder=${placeholder} .value=${value} .disabled=${disabled} @input=${input} />`;
