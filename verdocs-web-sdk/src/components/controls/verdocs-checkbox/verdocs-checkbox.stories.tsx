import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Controls/Checkbox',
  component: 'verdocs-checkbox',
  args: {
    checked: false,
    name: 'test',
    value: '1',
    disabled: false,
  },
  argTypes: {
    onInput: {
      action: 'input',
      description: 'Fired when the checkbox is clicked. e.target.checked will indicate the current status (true if checked).',
    },
  },
} as Meta;

export const Checkbox = ({checked, name, value, disabled, onInput}) =>
  html` <verdocs-checkbox .checked=${checked} .name=${name} .value=${value} .disabled=${disabled} @input=${onInput} /> `;
