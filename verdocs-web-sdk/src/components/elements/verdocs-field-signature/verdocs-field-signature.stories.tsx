import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Document Fields/Signature',
  component: 'verdocs-field-signature',
  args: {
    required: false,
  },
  argTypes: {},
} as Meta;

export const Signature = ({required}) => html`<verdocs-field-signature .required=${required} />`;
