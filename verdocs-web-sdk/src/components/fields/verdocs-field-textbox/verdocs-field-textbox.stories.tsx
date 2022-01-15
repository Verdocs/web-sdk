import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Controls/Document Fields',
  component: 'verdocs-field-textbox',
  args: {},
  argTypes: {},
} as Meta;

export const Textbox = ({}) => html`<verdocs-field-textbox />`;
