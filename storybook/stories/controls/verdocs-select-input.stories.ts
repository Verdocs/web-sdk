import {html} from 'lit-html';
import {Meta} from '@storybook/web-components-vite';

export default {
  title: 'Controls/Select Input',
  component: 'verdocs-select-input',
  args: {
    label: 'Name',
    value: '',
    disabled: false,
    options: [
      {label: 'Option 1', value: '1'},
      {label: 'Option 2', value: '2'},
      {label: 'Option 3', value: '3'},
    ],
  },
  argTypes: {
    input: {
      action: 'input',
      description: 'Fired when a new value is selected. e.target.value will contain the selected value.',
    },
  },
} as Meta;

export const SelectInput = ({disabled, label, value, options, input}) =>
  html`<verdocs-select-input .label=${label} .value=${value} .options=${options} .disabled=${disabled} @input=${input} />`;
