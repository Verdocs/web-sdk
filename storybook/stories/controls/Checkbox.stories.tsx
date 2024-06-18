import {Meta} from '@storybook/react';
import {VerdocsCheckbox} from '@verdocs/web-sdk-react';
import {fn} from '@storybook/test';

export default {
  title: 'Controls/Checkbox',
  component: VerdocsCheckbox,
  parameters: {
    layout: 'centered',
  },
  args: {
    checked: false,
    disabled:false,
    name: 'checkbox-1',
    label: 'Yes',
    theme: 'light',
    onInput: fn(),
  },
  argTypes: {
    label: {type: 'string'},
    name: {type: 'string'},
    theme: {control: 'select', options: ['light', 'dark'], description: 'Use "dark" when rendering on a dark background.'},
  },
} as Meta;

export const Checkbox = {};
