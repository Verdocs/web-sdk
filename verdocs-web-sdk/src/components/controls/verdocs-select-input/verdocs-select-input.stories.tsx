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
    change: {
      action: 'change',
      table: {
        disable: true,
      },
    },
  },
} as Meta;

export const SelectInput = ({type, label, value, placeholder, options, disabled, change}) =>
  html`<verdocs-select-input .type=${type} .label=${label} .placeholder=${placeholder} .value=${value} .options=${options} .disabled=${disabled} @change=${change} />`;
