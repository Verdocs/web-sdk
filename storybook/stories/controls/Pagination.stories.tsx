import {Meta} from '@storybook/react';
import {VerdocsPagination} from '@verdocs/web-sdk-react';

import '../common.css';

export default {
  title: 'Controls/Pagination',
  component: VerdocsPagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Display one or more buttons to indicate to the user which page they are on, and allow them to select ' + 'new pages in a paginated list or table.',
      },
    },
  },
  tags: ['autodocs', '!dev'],

  args: {
    options: [
      {id: 'attachment', tooltip: 'Attachment', icon: 'A'},
      {id: 'checkbox', tooltip: 'Check Box', icon: 'C'},
      {id: 'date', tooltip: 'Date', icon: 'D'},
      {id: 'dropdown', tooltip: 'Dropdown', icon: 'O'},
      {id: 'initial', tooltip: 'Initials', icon: 'I'},
      {id: 'payment', tooltip: 'Payment', icon: 'P'},
      {id: 'radio', tooltip: 'Radio Button', icon: 'R'},
      {id: 'signature', tooltip: 'Signature', icon: 'S'},
      {id: 'textarea', tooltip: 'Text Area', icon: 'M'},
      {id: 'textbox', tooltip: 'Text Box', icon: 'T'},
      {id: 'timestamp', tooltip: 'Timestamp', icon: 'X'},
    ],
  },
  argTypes: {},
} as Meta;

export const Pagination = {};
