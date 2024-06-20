import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

// This component is heavily commented so it can be used as a reference for developing other components. Please use the comments here
// as a guide / resource, but do not copy them to new components (so we don't create a maintenance hassle). If you copy this component
// as a template, clean up all the comments in the copy, so this remains the "main reference".

// We are using a custom doc generator specifically for Web Components. We use "inline docs" to get documentation out of code
// comments rather than having to use separate README files. See https://www.npmjs.com/package/@pxtrn/storybook-addon-docs-stencil
// for more information.

export default {
  // Where in Storybook this control will be listed
  title: 'Controls/Floating Menu',
  // Hint to help the docs addon find the component
  component: 'verdocs-floating-menu',
  parameters: {},
  // We can apply default args only shown in Storybook as follows
  args: {
    options: [
      {id: 'attachment', tooltip: 'Attachment', icon: 'A'},
      {id: 'checkbox', tooltip: 'Check Box', icon: 'C'},
      {id: 'date', tooltip: 'Date', icon: 'D'},
      {id: 'dropdown', tooltip: 'Dropdown', icon: 'O'},
      {id: 'initial', tooltip: 'Initials', icon: 'I'},
      {id: 'payment', tooltip: 'Payment', icon: 'P'},
      {id: 'radio', tooltip: 'Radio Button', icon: 'R'},
      {id: 'signature', tooltip: 'Signature', icon: 'S'},
      {id: 'textarea', tooltip: 'Text Area', icon: 'M'},
      {id: 'textbox', tooltip: 'Text Box', icon: 'T'},
      {id: 'timestamp', tooltip: 'Timestamp', icon: 'X'},
    ],
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

export const FloatingMenu = ({options, optionSelected}) => html`
  <div style="width: 400px; height: 600px; overflow-y: scroll; background: white;">
    <div style="margin:10px; height: 400px; box-sizing: border-box; border:1px solid #ef99a1;">&nbsp;</div>
    <div style="margin:10px; height: 400px; box-sizing: border-box; border:1px solid #ef99a1;">&nbsp;</div>
    <div style="margin:10px; height: 400px; box-sizing: border-box; border:1px solid #ef99a1;">&nbsp;</div>
    <verdocs-floating-menu .options=${options} @optionSelected=${optionSelected} />
  </div>
`;
