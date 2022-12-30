import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Controls/Select Input',
  component: 'verdocs-select-input',
  args: {
    label: 'Name',
    value: '',
    options: [
      {label: 'Option 1', value: '1'},
      {label: 'Option 2', value: '2'},
      {label: 'Option 3', value: '3'},
    ],
  },
  argTypes: {
    onInput: {
      action: 'input',
      description: 'Fired when a new value is selected. e.target.value will contain the selected value.',
    },
  },
} as Meta;

export const SelectInput = ({type, label, value, placeholder, options, disabled, onInput}) =>
  html`<verdocs-select-input .type=${type} .label=${label} .placeholder=${placeholder} .value=${value} .options=${options} .disabled=${disabled} @input=${onInput} />`;
