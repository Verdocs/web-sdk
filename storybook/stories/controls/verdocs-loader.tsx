import * as React from 'react';
import {Meta} from '@storybook/react';
import {VerdocsLoader} from '@verdocs/web-sdk-react';

import '../common.css';

export default {
  title: 'Controls/Loader',
  component: VerdocsLoader,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Animated loader placeholder. There are currently no configuration options for this control.',
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
  render: (Story) => (
    <div style={{height: 300}}>
      <VerdocsLoader />
    </div>
  ),
} as Meta;

export const Loader = {};
