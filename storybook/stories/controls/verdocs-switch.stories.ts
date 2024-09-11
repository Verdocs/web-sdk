import {Meta} from '@storybook/web-components';
import {html} from 'lit-html';

export default {
  title: 'Controls/Switch',
  component: 'verdocs-switch',
  parameters: {},
  args: {
    checked: false,
    theme: 'primary',
  },
  argTypes: {
    checked: {type: 'boolean'},
    theme: {type: 'string', control: 'radio', options: ['primary', 'secondary'], defaultValue: 'primary'},
  },
} as Meta;

export const Switch = ({checked, theme}) => html`<verdocs-switch .checked=${checked} .theme=${theme}></verdocs-switch>`;
