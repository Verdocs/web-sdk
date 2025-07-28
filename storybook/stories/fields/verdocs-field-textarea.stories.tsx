import {html} from 'lit-html';
import {Meta} from '@storybook/web-components-vite';

export default {
  title: 'Fields/Textarea',
  component: 'verdocs-field-textarea',
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

export const Textarea = ({disabled, required, input}) =>
  html`<verdocs-field-textarea
    style="transform: scale(1.5); width: 150px; height: 41px;"
    .fieldname=${'storybook-field'}
    .templateid=${'0239fe5f-1b89-499a-bd83-098a2e1b4b9c'}
    .disabled=${disabled}
    .required=${required}
    .editable=${false}
    .moveable=${false}
    .done=${false}
    @input=${input}
  />`;
