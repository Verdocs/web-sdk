import {Meta} from '@storybook/web-components';
import {html} from 'lit-html';

const SampleDocument = {
  // Skipping non-essential fields 9that the widget doesn't care about). But this is an IDocument.
  id: '1234',
  status: 'complete',
  recipients: [
    {role_name: 'Tax Preparer', status: 'submitted', first_name: 'Bill', last_name: 'Board', sequence: 1, type: 'signer'},
    {role_name: 'Recipient 1', status: 'submitted', first_name: 'Ante', last_name: 'Bellum', sequence: 2, type: 'signer'},
    {role_name: 'Recipient 2', status: 'opened', first_name: 'Sarah', last_name: 'Bellum', sequence: 2, type: 'signer'},
    {role_name: 'Office Manager', status: 'pending', first_name: 'Paige', last_name: 'Turner', sequence: 3, type: 'approver'},
  ],
};

export default {
  title: 'Envelopes/Status Indicator',
  component: 'verdocs-status-indicator',
  args: {
    document: 0,
    status: 'complete',
    theme: 'light',
    size: 'normal',
  },
  argTypes: {
    document: {
      options: [0, 1],
      mapping: {0: SampleDocument, 1: null},
      control: {
        type: 'select',
        labels: {
          0: 'Sample Document',
          1: 'Not Set',
        },
      },
    },
    status: {
      defaultValue: '',
      options: [0, 'complete', 'pending', 'in progress', 'declined', 'canceled', 'invited', 'opened', 'accepted', 'signed', 'submitted'],
      mapping: {
        0: null,
        'complete': 'complete',
        'pending': 'pending',
        'in progress': 'in progress',
        'declined': 'declined',
        'canceled': 'canceled',
        'invited': 'invited',
        'opened': 'opened',
        'accepted': 'accepted',
        'signed': 'signed',
        'submitted': 'submitted',
      },
      control: {
        type: 'select',
        labels: {
          0: 'Not Set',
          'complete': 'Complete',
          'pending': 'Pending',
          'in progress': 'In Progress',
          'declined': 'Declined',
          'canceled': 'Canceled',
          'invited': 'Invited',
          'opened': 'Opened',
          'accepted': 'Accepted',
          'signed': 'Signed',
          'submitted': 'Submitted',
        },
      },
    },
  },
} as Meta;

export const StatusIndicator = ({theme, size, status, envelope}) =>
  html`<verdocs-status-indicator .theme="${theme}" .size="${size}" .status="${status}" .envelope="${envelope}" />`;
