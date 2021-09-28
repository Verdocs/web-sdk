import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Controls/Dropdown Menu',
  argTypes: {
    options: {type: 'array', control: 'object', description: 'Menu Options', defaultValue: [{label: 'Option 1'}, {label: 'Disabled Option'}, {label: 'Option 2'}]},
    onSelectOption: {action: 'selected'},
  },
} as Meta;

export const DropdownMenu = ({options, onSelectOption}) => html`<dropdown-menu .options="${options}" .onSelectOption="${onSelectOption}"></dropdown-menu>`;
