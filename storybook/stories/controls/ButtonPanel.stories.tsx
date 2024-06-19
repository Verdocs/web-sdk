import * as React from 'react';
import {Meta} from '@storybook/react';
import {VerdocsButtonPanel} from '@verdocs/web-sdk-react';
import {IconOptions, Icons} from '../icons';

import '../common.css';

export default {
  title: 'Controls/Button Panel',
  component: VerdocsButtonPanel,
  tags: ['autodocs', '!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story:
          'Displays a clickable icon suitable for display in a toolbar. When clicked, a customizable drop-down panel will be displayed.' +
          'Children passed to the component will be displayed in the drop-down, when open. A click-away listener will also be installed,' +
          'so if the user clicks away from the panel, it will be automatically closed.',
      },
    },
  },
  args: {icon: Icons.CalendarIcon},
  argTypes: {
    icon: {...IconOptions, description: 'Set to an SVG to set the icon displayed.'},
  },
  render: (Story) => (
    <VerdocsButtonPanel icon={Story.icon}>
      <div>
        <h6>Field Settings</h6>
        <div className="row">
          <label>Field 1</label>
          <input type="text" placeholder="Field 1..." />
        </div>
      </div>
    </VerdocsButtonPanel>
  ),
} as Meta;

export const ButtonPanel = {};
