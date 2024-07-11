import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Fields/Initial',
  component: 'verdocs-field-initial',
  args: {
    disabled: false,
  },
  argTypes: {},
} as Meta;

export const Initial = ({disabled, input}) =>
  html`<verdocs-field-initial
    style="transform: scale(1.5);"
    .fieldname=${'storybook-field'}
    .templateid=${'0239fe5f-1b89-499a-bd83-098a2e1b4b9c'}
    .initials=${'JD'}
    .disabled=${disabled}
    .editable=${false}
    .moveable=${false}
    .done=${false}
    @input=${input}
  />`;
