import {Meta} from '@storybook/react';
import {VerdocsDropdown} from '@verdocs/web-sdk-react';

import '../common.css';

export default {
  title: 'Controls/Dropdown',
  component: VerdocsDropdown,
  tags: ['autodocs', '!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story:
          'Display a drop-down menu button. A menu of the specified options will be displayed when the button is pressed.\n' +
          'The menu will be hidden when the button is pressed again, or an option is selected. Separators may be created\n' +
          'by supplying an entry with an empty label.\n' +
          '\n' +
          '`options` should be an array of entries conforming to the following shape:\n' +
          '\n' +
          '```ts\n' +
          'interface IDropdownItem {\n' +
          '  // Required. The label to show in the dropown list.\n' +
          '  label: string;\n' +
          '\n' +
          '  // Optional identifier, will be included in the change event. If not set, "label" will be used.\n' +
          '  id?: any;\n' +
          '\n' +
          '  // If true, the option will not be selectable by the uesr.\n' +
          '  disabled?: boolean;\n' +
          '}\n' +
          '```\n' +
          '\n' +
          '<div className="tip-wrapper">\n' +
          '<span className="warning">NOTE</span> This control is meant to be used in application UI\'s. It is not for document\n' +
          'signing. Use `<verdocs-field-dropdown />` for that.\n' +
          '</div>',
      },
    },
  },
  args: {
    options: [{label: 'Option 1'}, {label: 'Disabled Option', disabled: true}, {label: ''}, {label: 'Option 2'}],
  },
  argTypes: {
    // label: {type: 'string'},
    // name: {type: 'string'},
    // theme: {control: 'select', options: ['light', 'dark'], description: 'Use "dark" when rendering on a dark background.'},
  },
} as Meta;

export const Dropdown = {};
