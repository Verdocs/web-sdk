import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Fields/Attachment',
  component: 'verdocs-field-attachment',
  args: {
    disabled: false,
  },
  argTypes: {
    input: {
      action: 'input',
      description: 'Fired for each character entered in the field. e.target.value will contain the current text value.',
    },
  },
} as Meta;

export const Attachment = ({disabled, input}) =>
  html`<verdocs-field-attachment
    style="transform: scale(1.5);"
    .fieldname=${'storybook-field'}
    .templateid=${'0239fe5f-1b89-499a-bd83-098a2e1b4b9c'}
    .disabled=${disabled}
    .editable=${false}
    .moveable=${false}
    .done=${false}
    @input=${input}
  />`;
