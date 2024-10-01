import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Fields/Signature',
  component: 'verdocs-field-signature',
  args: {
    disabled: false,
    required: false,
  },
  argTypes: {},
} as Meta;

export const Signature = ({disabled, required, input}) =>
  html`<verdocs-field-signature
    style="transform: scale(1.5);"
    .fieldname=${'storybook-field'}
    .templateid=${'0239fe5f-1b89-499a-bd83-098a2e1b4b9c'}
    .name=${'John Doe'}
    .disabled=${disabled}
    .required=${required}
    .editable=${false}
    .moveable=${false}
    .done=${false}
    @input=${input}
  />`;
