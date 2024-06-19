import * as React from 'react';
import {Meta} from '@storybook/react';
import {VerdocsFloatingMenu} from '@verdocs/web-sdk-react';

import '../common.css';

export default {
  title: 'Controls/Floating Menu',
  component: VerdocsFloatingMenu,
  tags: ['autodocs', '!dev'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          '"Floating Action Button" style menu. For proper placement, this should be added to the DOM inside a container that is set ' +
          'to `overflow-y: scroll;`. The component will detect that placement and position itself in the bottom-right corner on top ' +
          'of the container. It will be absolutely positioned so it will be unaffected by scrolling the container.',
      },
    },
  },

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
    <div style={{width: 400, height: 700, overflowY: 'scroll', backgroundColor: 'white'}}>
      <VerdocsFloatingMenu options={Story.options} />
    </div>
  ),
} as Meta;

export const FloatingMenu = {};
