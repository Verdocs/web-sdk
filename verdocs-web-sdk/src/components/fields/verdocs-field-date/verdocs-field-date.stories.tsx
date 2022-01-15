import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Controls/Document Fields',
  component: 'verdocs-field-date',
  args: {},
  argTypes: {},
} as Meta;

export const Date = ({}) => html`<verdocs-field-date />`;
