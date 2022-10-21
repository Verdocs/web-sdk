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
  argTypes: {},
} as Meta;

export const Textbox = ({field, disabled}) => html`<verdocs-field-textbox .field=${field} .disabled=${disabled} />`;
