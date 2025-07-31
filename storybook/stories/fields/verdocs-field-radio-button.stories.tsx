import {html} from 'lit-html';
import {Meta} from '@storybook/web-components-vite';

export default {
  title: 'Fields/Radio Button',
  component: 'verdocs-field-radio',
  args: {
    disabled: false,
    required: false,
  },
  argTypes: {
    input: {
      action: 'input',
      description: 'Fired when the option is selected.',
    },
  },
} as Meta;

export const RadioButton = ({disabled, required, input}) =>
  html`<verdocs-field-radio
    style="transform: scale(1.5);"
    .fieldname=${'storybook-field'}
    .templateid=${'0239fe5f-1b89-499a-bd83-098a2e1b4b9c'}
    .disabled=${disabled}
    .required=${required}
    @input=${input}
  />`;
