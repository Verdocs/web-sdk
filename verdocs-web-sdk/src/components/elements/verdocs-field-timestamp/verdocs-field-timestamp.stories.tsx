import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Fields/Timestamp',
  component: 'verdocs-field-timestamp',
  args: {
    field: {
      name: 'timestampP1-8',
      recipient_role: 'Recipient 2',
      envelope_id: '96ccc2e9-1bb8-4be8-9dbd-7113107383ee',
      page: 1,
      type: 'timestamp',
      required: true,
      settings: {
        x: 426.99999999999994,
        y: 493.25,
        width: 64,
        height: 15,
      },
      validator: null,
      label: null,
      prepared: false,
      recipients: [],
    },
  },
  argTypes: {},
} as Meta;

export const Timestamp = ({field}) => html`<verdocs-field-timestamp .field=${field} />`;
