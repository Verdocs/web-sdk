import {Meta} from '@storybook/react';
import {VerdocsFileChooser} from '@verdocs/web-sdk-react';

export default {
  title: 'Controls/File Chooser',
  component: VerdocsFileChooser,
  tags: ['autodocs', '!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story:
          'Displays a file picker to upload an attachment. This component is just the picker - the host application or component should\n' +
          'provide the actual upload functionality.',
      },
    },
  },
  args: {},
  argTypes: {},
} as Meta;

export const FileChooser = {};
