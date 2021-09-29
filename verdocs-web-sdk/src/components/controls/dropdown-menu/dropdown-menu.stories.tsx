import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';
// import {action} from '@storybook/addon-actions';

// This component is heavily commented so it can be used as a reference for developing other components. Please use the comments here
// as a guide / resource, but do not copy them to new components (so we don't create a maintenance hassle). If you copy this component
// as a template, clean up all the comments in the copy, so this remains the "main reference".

// We are using a custom doc generator specifically for Web Components. We use "inline docs" to get documentation out of code
// comments rather than having to use separate README files. See https://www.npmjs.com/package/@pxtrn/storybook-addon-docs-stencil
// for more information.

export default {
  // Where in Storybook this control will be listed
  title: 'Controls/Dropdown Menu',
  // Hint to help the docs addon find the component
  component: 'dropdown-menu',
  // We can apply default args only shown in Storybook as follows
  args: {
    options: [{label: 'Option 1'}, {label: 'Disabled Option', disabled: true}, {label: 'Option 2'}],
  },
  // Here we can apply overrides to component property documentation. Note that we don't need to (and shouldn't) specify every field
  // here. Only those that need special attention.
  argTypes: {
    optionSelected: {action: 'optionSelected'},
    // optionSelected: {action: 'onOptionSelected'},

    // Here we take advantage of "hidden" properties to make an undocumented feature. We will allow "tall" to be set as an
    // attribute to force the component to set a fixed height on its host container. (See the CSS for how this is applied.)
    // We are doing this only so Storybook can draw it properly, though, and don't want it used as a regular feature, so we
    // hide it from the documentation
    tall: {
      table: {
        disable: true,
      },
    },
  },
} as Meta;

// See https://lit-html.polymer-project.org/guide/template-reference "Binding Types" for an explanation of '.' vs '@'
export const Default = ({options, optionSelected}) => html`<dropdown-menu .options=${options} @optionSelected=${optionSelected} tall />`;
export const Open = ({options, optionSelected}) => html`<dropdown-menu .options=${options} @optionSelected=${optionSelected} tall open />`;
