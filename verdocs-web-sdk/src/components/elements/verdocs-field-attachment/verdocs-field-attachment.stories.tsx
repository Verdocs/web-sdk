import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Document Fields/Attachment',
  component: 'verdocs-field-attachment',
  args: {
    field: {
      x: 0,
      y: 0,
    },
  },
  argTypes: {},
} as Meta;

export const Attachment = ({field}) => html`<verdocs-field-attachment .field="${field}" />`;
