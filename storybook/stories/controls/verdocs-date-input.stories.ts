import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Controls/Date Input',
  component: 'verdocs-date-input',
  parameters: {},
  args: {
    label: 'DOB',
    value: '',
    placeholder: 'Date of Birth...',
  },
  argTypes: {
    input: {
      action: 'input',
      description: 'Fired for each character entered in the field. e.target.value will contain the current text value.',
    },
  },
} as Meta;

export const DateInput = ({type, label, value, placeholder, disabled, input}) =>
  html`<verdocs-date-input .type=${type} .label=${label} .placeholder=${placeholder} .value=${value} .disabled=${disabled} @input=${input} />`;
