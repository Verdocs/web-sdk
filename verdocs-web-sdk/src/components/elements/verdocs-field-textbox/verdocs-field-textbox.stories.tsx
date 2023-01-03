import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Fields/Textbox',
  component: 'verdocs-field-textbox',
  args: {
    field: {
      settings: {
        x: 0,
        y: 0,
      },
    },
    disabled: false,
  },
  argTypes: {
    input: {
      action: 'input',
      description: 'Fired for each character entered in the field. e.target.value will contain the current text value.',
    },
  },
} as Meta;

export const Textbox = ({field, disabled, input}) => html`<verdocs-field-textbox .field=${field} .disabled=${disabled} @input=${input} />`;
