import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Controls/Dropdown Menu',
  argTypes: {
    options: {
      type: {required: true, summary: 'array', detail: 'Test'},
      control: 'object',
      description: 'Array of menu options to display.',
      table: {
        type: {summary: 'string'},
        defaultValue: {summary: 'Hello'},
      },
      defaultValue: [{label: 'Option 1'}, {label: 'Disabled Option', disabled: true}, {label: 'Option 2'}],
    },
    open: {description: 'If true, the menu will be open by default. Useful for testing.', defaultValue: false},
    onSelectOption: {action: 'selected', description: 'Callback that will be triggered with the element clicked.'},
  },
  parameters: {
    docs: {iframeHeight: 400},
  },
} as Meta;

export const DropdownMenu = ({options, open, onSelectOption}) => html`<dropdown-menu .options=${options} .open=${open} @selectOption=${onSelectOption} />`;
