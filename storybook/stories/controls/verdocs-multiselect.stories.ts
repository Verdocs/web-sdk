import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Controls/MultiSelect',
  component: 'verdocs-multiselect',
  args: {
    label: 'Methods',
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

export const MultiSelect = ({disabled, label, options, input}) => html`<verdocs-multiselect .label=${label} .options=${options} .disabled=${disabled} @input=${input} />`;
