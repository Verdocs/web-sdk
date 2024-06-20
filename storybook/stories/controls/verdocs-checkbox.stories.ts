import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Controls/Checkbox',
  component: 'verdocs-checkbox',
  parameters: {},
  args: {
    label: 'Sample checkbox',
    name: 'test',
    theme: 'light',
    checked: false,
    disabled: false,
    value: '1',
  },
  argTypes: {
    input: {
      action: 'input',
      description: 'Fired when the checkbox is clicked. e.target.checked will indicate the current status (true if checked).',
    },
  },
} as Meta;

export const Checkbox = ({checked, label, name, value, disabled, theme, input}) => html`
  <verdocs-checkbox .checked=${checked} .label=${label} .name=${name} .value=${value} .disabled=${disabled} .theme=${theme} @input=${input} />
`;
