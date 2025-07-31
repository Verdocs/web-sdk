import {html} from 'lit-html';
import {Meta} from '@storybook/web-components-vite';

// This component is heavily commented so it can be used as a reference for developing other components. Please use the comments here
// as a guide / resource, but do not copy them to new components (so we don't create a maintenance hassle). If you copy this component
// as a template, clean up all the comments in the copy, so this remains the "main reference".

// We are using a custom doc generator specifically for Web Components. We use "inline docs" to get documentation out of code
// comments rather than having to use separate README files. See https://www.npmjs.com/package/@pxtrn/storybook-addon-docs-stencil
// for more information.

export default {
  // Where in Storybook this control will be listed
  title: 'Controls/Dropdown',
  // Hint to help the docs addon find the component
  component: 'verdocs-dropdown',
  parameters: {},
  // We can apply default args only shown in Storybook as follows
  args: {
    options: [{label: 'Option 1'}, {label: 'Disabled Option', disabled: true}, {label: ''}, {label: 'Option 2'}],
  },
  // Here we can apply overrides to component property documentation. Note that we don't need to (and shouldn't) specify every field
  // here. Only those that need special attention.
  argTypes: {
    optionSelected: {
      action: 'optionSelected',
      // Prevents a duplicate event entry from appearing in the properties table
      table: {
        disable: true,
      },
    },
  },
} as Meta;

// See https://lit-html.polymer-project.org/guide/template-reference "Binding Types" for an explanation of '.' vs '@'
export const Dropdown = ({options, optionSelected}) => html`<verdocs-dropdown .options=${options} @optionSelected=${optionSelected} />`;
