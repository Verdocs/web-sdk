import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Document Fields/Checkbox',
  component: 'verdocs-field-checkbox',
  args: {
    required: false,
    value: false,
  },
  argTypes: {},
} as Meta;

export const Checkbox = ({required, value}) => html`<verdocs-field-checkbox .required=${required} .value=${value} />`;
