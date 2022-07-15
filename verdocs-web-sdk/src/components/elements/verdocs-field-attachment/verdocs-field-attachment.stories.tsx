import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Document Fields/Attachment',
  component: 'verdocs-field-attachment',
  args: {},
  argTypes: {},
} as Meta;

export const Attachment = ({}) => html`<verdocs-field-attachment />`;
