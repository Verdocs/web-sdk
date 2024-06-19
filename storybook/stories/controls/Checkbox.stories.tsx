import {Meta} from '@storybook/react';
import {VerdocsCheckbox} from '@verdocs/web-sdk-react';
import {fn} from '@storybook/test';

import '../common.css';

export default {
  title: 'Controls/Checkbox',
  component: VerdocsCheckbox,
  tags: ['autodocs', '!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story:
          'Displays a check box. Note that this is different from the `verdocs-field-checkbox` component, which is designed\n' +
          'to be used in signing experiences and contains settings that connect to template fields. This is just a simple check\n' +
          'box for UI displays e.g. dialog boxes.\n' +
          '\n' +
          'This control encapsulates a standard HTML checkbox. To subscribe to change events, connect an `onChange`\n' +
          'handler.\n' +
          '\n' +
          '<div className="tip-wrapper">\n' +
          '<span className="warning">NOTE</span> This control is meant to be used in application UIs. Use ' +
          '`<verdocs-field-checkbox />` for document signing.</div>',
      },
    },
  },
  args: {
    checked: false,
    disabled: false,
    name: 'checkbox-1',
    label: 'Yes',
    theme: 'light',
    onInput: fn(),
  },
  argTypes: {
    label: {type: 'string'},
    name: {type: 'string'},
    theme: {control: 'select', options: ['light', 'dark'], description: 'Use "dark" when rendering on a dark background.'},
  },
} as Meta;

export const Checkbox = {};
