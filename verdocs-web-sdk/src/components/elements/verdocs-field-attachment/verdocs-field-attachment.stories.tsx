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
    disabled: false,
  },
  argTypes: {},
} as Meta;

export const Attachment = ({field, disabled}) => html`<verdocs-field-attachment .field=${field} .disabled=${disabled} />`;
