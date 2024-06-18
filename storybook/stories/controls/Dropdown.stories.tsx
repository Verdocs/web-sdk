import {Meta} from '@storybook/react';
import {VerdocsDropdown} from '@verdocs/web-sdk-react';

export default {
  title: 'Controls/Dropdown',
  component: VerdocsDropdown,
  parameters: {
    layout: 'centered',
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
