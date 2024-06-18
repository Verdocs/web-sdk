import {fn} from '@storybook/test';
import {Meta} from '@storybook/react';
import {VerdocsButton} from '@verdocs/web-sdk-react';
import {IconOptions, Icons} from '../icons';

export default {
  title: 'Controls/Button',
  component: VerdocsButton,
  parameters: {
    layout: 'centered',
  },
  args: {
    type: 'button',
    variant: 'standard',
    size: 'normal',
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    label: {type: 'string'},
    type: {control: 'select', options: ['button', 'submit', 'reset'], description: 'The type of the button.'},
    size: {control: 'select', options: ['small', 'normal', 'medium', 'large'], description: 'The size of the button.'},
    variant: {control: 'select', options: ['standard', 'text', 'outline']},
    startIcon: {...IconOptions, description: 'If set to an SVG, will be displayed to the left of the button label'},
    endIcon: {...IconOptions, description: 'If set to an SVG, will be displayed to the right of the button label'},
    onClick: {action: 'click', description: 'Fired when the user clicks the button.'},
  },
} as Meta;

export const Button = {args: {label: 'Click Me'}};
//
// export const Outline = {args: {label: 'Outline', variant: 'outline'}};
//
// export const Text = {args: {label: 'Text', variant: 'text'}};
//
// export const Small = {args: {size: 'small', label: 'Small'}};
//
// export const StartIcon = {args: {size: 'small', label: 'Start Icon', startIcon: Icons.CircleIcon}};
//
// export const EndIcon = {args: {size: 'small', label: 'End Icon', endIcon: Icons.ArrowIcon}};
