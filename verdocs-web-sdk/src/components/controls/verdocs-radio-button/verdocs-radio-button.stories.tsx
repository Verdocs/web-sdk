import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Controls/Radio Button',
  component: 'verdocs-radio-button',
  args: {
    checked: false,
    name: 'test',
    value: '1',
    disabled: false,
  },
  argTypes: {
    input: {
      action: 'input',
      description:
        'Fired when the radio button is clicked. e.target.checked will always be true, because radio button onChange events are fired only when the radio button is clicked to select it.',
    },
  },
} as Meta;

export const RadioButton = ({checked, name, value, disabled, input}) =>
  html` <verdocs-radio-button .checked=${checked} .name=${name} .value=${value} .disabled="${disabled}" @input=${input} /> `;
