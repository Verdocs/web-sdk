import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Controls/Document Fields',
  component: 'verdocs-field-dropdown',
  args: {},
  argTypes: {},
} as Meta;

export const Dropdown = ({}) => html`<verdocs-field-dropdown />`;
