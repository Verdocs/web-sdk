import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Elements/Document Fields/Radio Button',
  component: 'verdocs-field-radio-button',
  args: {
    required: false,
    value: 'id-1',
    checked: false,
    name: 'radio-1',
  },
  argTypes: {},
} as Meta;

export const RadioButton = ({required, value, checked, name}) => html`<verdocs-field-radio-button .required=${required} .value=${value} .checked=${checked} .name=${name} />`;
