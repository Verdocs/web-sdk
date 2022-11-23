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
  argTypes: {},
} as Meta;

export const Checkbox = ({checked, name, value, disabled}) => html` <verdocs-checkbox .checked=${checked} .name=${name} .value=${value} .disabled=${disabled} /> `;
