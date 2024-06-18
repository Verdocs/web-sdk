import * as React from 'react';
import {Meta} from '@storybook/react';
import {VerdocsButtonPanel} from '@verdocs/web-sdk-react';
import {IconOptions, Icons} from '../icons';

import '../common.css';

export default {
  title: 'Controls/Button Panel',
  component: VerdocsButtonPanel,
  parameters: {
    layout: 'centered',
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
