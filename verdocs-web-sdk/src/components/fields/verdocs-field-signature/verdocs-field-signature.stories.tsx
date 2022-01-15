import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Controls/Document Fields',
  component: 'verdocs-field-signature',
  args: {},
  argTypes: {},
} as Meta;

export const Signature = ({}) => html`<verdocs-field-signature />`;
