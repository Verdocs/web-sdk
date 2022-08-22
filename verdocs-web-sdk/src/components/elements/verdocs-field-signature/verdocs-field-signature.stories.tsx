import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Document Fields/Signature',
  component: 'verdocs-field-signature',
  args: {
    required: false,
    field: {},
  },
  argTypes: {},
} as Meta;

export const Signature = ({required, field}) => html`<verdocs-field-signature .field=${field} .required=${required} />`;
