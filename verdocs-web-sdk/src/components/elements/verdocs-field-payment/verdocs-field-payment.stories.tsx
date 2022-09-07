import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Document Fields/Payment',
  component: 'verdocs-field-payment',
  args: {
    field: {
      settings: {
        x: 0,
        y: 0,
      },
    },
  },
  argTypes: {},
} as Meta;

export const Payment = ({field}) => html`<verdocs-field-payment .field=${field} />`;
