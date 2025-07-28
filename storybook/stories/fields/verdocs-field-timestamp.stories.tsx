import {html} from 'lit-html';
import {Meta} from '@storybook/web-components-vite';

export default {
  title: 'Fields/Timestamp',
  component: 'verdocs-field-timestamp',
  args: {
    disabled: false,
    required: false,
  },
  argTypes: {},
} as Meta;

export const Timestamp = ({disabled, required}) =>
  html`<verdocs-field-timestamp
    style="transform: scale(1.5);"
    .fieldname=${'storybook-field'}
    .templateid=${'0239fe5f-1b89-499a-bd83-098a2e1b4b9c'}
    .disabled=${disabled}
    .required=${required}
    .editable=${false}
    .moveable=${false}
    .done=${false}
  />`;
