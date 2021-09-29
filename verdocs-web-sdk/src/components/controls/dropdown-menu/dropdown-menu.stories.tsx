import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Controls/Dropdown Menu',
  argTypes: {
    options: {type: 'array', control: 'object', description: 'Menu Options', defaultValue: [{label: 'Option 1'}, {label: 'Disabled Option', disabled: true}, {label: 'Option 2'}]},
    open: {type: 'boolean', defaultValue: false},
    onSelectOption: {action: 'selected'},
  },
} as Meta;

export const DropdownMenu = ({options, open, onSelectOption}) => html`<dropdown-menu .options="${options}" .open="${open}" .onSelectOption="${onSelectOption}"></dropdown-menu>`;
