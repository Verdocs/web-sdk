import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Document Fields/Radio Button',
  component: 'verdocs-field-radio-button',
  args: {
    field: {
      settings: {
        x: 0,
        y: 0,
        checked: false,
        name: 'radio-1',
      },
    },
  },
  argTypes: {},
} as Meta;

export const RadioButton = ({field}) => html`<verdocs-field-radio-button .field="${field}" />`;
