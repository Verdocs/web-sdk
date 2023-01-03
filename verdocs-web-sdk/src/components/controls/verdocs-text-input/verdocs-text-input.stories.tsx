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
      description: 'Fired for each character entered in the field. e.target.value will contain the current text value.',
    },
  },
} as Meta;

export const TextInput = ({type, label, value, placeholder, disabled, input}) =>
  html`<verdocs-text-input .type=${type} .label=${label} .placeholder=${placeholder} .value=${value} .disabled=${disabled} @input=${input} />`;
