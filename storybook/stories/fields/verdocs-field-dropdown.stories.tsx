import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Fields/Dropdown',
  component: 'verdocs-field-dropdown',
  args: {
    disabled: false,
    required: false,
  },
  argTypes: {
    input: {
      action: 'input',
      description: 'Fired for each character entered in the field. e.target.value will contain the current text value.',
    },
  },
} as Meta;

export const Dropdown = ({disabled, required, input}) =>
  html`<verdocs-field-dropdown
    style="transform: scale(1.5);"
    .fieldname=${'storybook-field'}
    .templateid=${'0239fe5f-1b89-499a-bd83-098a2e1b4b9c'}
    .disabled=${disabled}
    .required=${required}
    .editable=${false}
    .moveable=${false}
    .done=${false}
    @input=${input}
  />`;
