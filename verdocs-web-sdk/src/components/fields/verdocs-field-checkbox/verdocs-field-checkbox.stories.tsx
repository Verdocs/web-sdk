import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Controls/Document Fields',
  component: 'verdocs-field-checkbox',
  args: {},
  argTypes: {},
} as Meta;

export const Checkbox = ({}) => html`<verdocs-field-checkbox />`;
