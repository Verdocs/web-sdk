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
  argTypes: {},
} as Meta;

export const RadioButton = ({checked, name, value, disabled}) => html` <verdocs-radio-button .checked=${checked} .name=${name} .value=${value} .disabled=${disabled} /> `;
