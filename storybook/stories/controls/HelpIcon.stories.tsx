import {Meta} from '@storybook/react';
import {VerdocsHelpIcon} from '@verdocs/web-sdk-react';

import '../common.css';

export default {
  title: 'Controls/Help Icon',
  component: VerdocsHelpIcon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Displays a simple help icon. Upon hover or focus, a tooltip will be displayed with help text.',
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

export const HelpIcon = {};
