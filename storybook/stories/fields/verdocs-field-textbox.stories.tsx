import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Fields/Textbox',
  component: 'verdocs-field-textbox',
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

export const Textbox = ({disabled, input}) =>
  html`<verdocs-field-textbox
    style="transform: scale(1.5); width: 150px; height: 15px;"
    .fieldname=${'storybook-field'}
    .templateid=${'0239fe5f-1b89-499a-bd83-098a2e1b4b9c'}
    .disabled=${disabled}
    .editable=${false}
    .moveable=${false}
    .done=${false}
    @input=${input}
  />`;
