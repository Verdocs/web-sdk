import {fn} from '@storybook/test';
import {IconOptions} from '../icons';

import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Controls/Button',
  component: 'verdocs-button',
  parameters: {
    layout: 'centered',
    docs: {
      extractComponentDescription: () => {
        console.log('a');
        return 'component description';
      },
      description: {
        story:
          'Display a simple button.\n' +
          '\n' +
          "Three variants are supported. `standard` and `outline` buttons look like traditional form buttons and are ideal candidates for 'Ok' and\n" +
          "'Cancel' options in most cases. `text` buttons are intended to be used inline in content blocks or for more subtle button options.\n" +
          '(Auth uses text buttons for the Forgot Password and Sign Up options.)\n' +
          '\n' +
          'Four sizes are also supported. Most use cases will call for the `normal` size, but a `small` size is ideal for more subtle controls, such\n' +
          'as pagination or other secondary functions. `medium` buttons are slightly larger to provide balance in forms where other items are also\n' +
          'bigger, and `large` buttons are for cases where the page has mostly white-space and the buttons need to fill more space.\n' +
          '\n' +
          'Icons may be placed either before ("start") or after ("end") the button label. Icons should be SVG objects passed as strings and will\n' +
          'be rendered as HTML inside the button label area. It is important that the root &lt;SVG&gt; tag contains a default `fill="#ffffff"` setting\n' +
          'for the base color, and that child elements below it do not. This allows the button color to carry into the icon properly.',
      },
    },
  },
  args: {
    label: 'Click Me',
    type: 'button',
    size: 'normal',
    variant: 'standard',
    disabled: false,
    startIcon: null,
    endIcon: null,
  },
  argTypes: {
    label: {type: 'string'},
    type: {control: 'select', options: ['button', 'submit', 'reset'], description: 'The type of the button.'},
    size: {control: 'select', options: ['small', 'normal', 'medium', 'large'], description: 'The size of the button.'},
    variant: {control: 'select', options: ['standard', 'text', 'outline']},
    startIcon: {...IconOptions, description: 'If set to an SVG, will be displayed to the left of the button label'},
    endIcon: {...IconOptions, description: 'If set to an SVG, will be displayed to the right of the button label'},
    click: {action: 'click', description: 'Fired when the user clicks the button.'},
  },
} as Meta;

export const Button = ({label, size, variant, disabled, startIcon, endIcon, click}) =>
  html`<verdocs-button .label=${label} .size=${size} .variant=${variant} .disabled=${disabled} .startIcon=${startIcon} .endIcon=${endIcon} @click=${click} />`;

//
//
//
//
//
//
//
//
//
//
//
// export default {
//   title: 'Controls/Button',
//   args: {
//     label: 'Click Me',
//     type: 'button',
//     variant: 'standard',
//     size: 'normal',
//     disabled: false,
//     onClick: fn(),
//   },
// } as Meta;
//
// export const Button = ({label, type, size, variant, startIcon, endIcon, onClick}) =>
//   html`<verdocs-button .label=${label} .type=${type} .size=${size} .variant=${variant} .startIcon=${startIcon} .endIcon=${endIcon} @click="onClick" />`;
// //
// // export default {
// //   title: 'Controls/Button',
// //   component: VerdocsButton,
// //   tags: ['autodocs', '!dev'],
// // } as Meta;
// //
// // export const Button = {args: {label: 'Click Me'}};
// //
// // // export const Outline = {args: {label: 'Outline', variant: 'outline'}};
// // //
// // // export const Text = {args: {label: 'Text', variant: 'text'}};
// // //
// // // export const Small = {args: {size: 'small', label: 'Small'}};
// // //
// // // export const StartIcon = {args: {size: 'small', label: 'Start Icon', startIcon: Icons.CircleIcon}};
// // //
// // // export const EndIcon = {args: {size: 'small', label: 'End Icon', endIcon: Icons.ArrowIcon}};
