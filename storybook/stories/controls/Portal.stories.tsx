import {Meta} from '@storybook/react';
import {VerdocsPortal} from '@verdocs/web-sdk-react';

import '../common.css';

export default {
  title: 'Controls/Portal',
  component: VerdocsPortal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Display a child component in a "portal", popping it out of the main DOM tree to allow it to escape the bounds ' +
          'set by its parent. @credit https://github.com/tomas-teston/stencil-portal for the basic * technique. This has been ' +
          'altered in a few ways to make it more friendly to cases where there may be multiple portals on the page and provide ' +
          'more alignment options for the child to be displayed.',
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

export const Portal = {};
