import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Controls/Spinner',
  component: 'verdocs-spinner',
  parameters: {},
  args: {
    size: 32,
    mode: 'dark',
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ['dark', 'light'],
      description: 'Use dark spinners on light backgrounds, and vice-versa.',
    },
  },
} as Meta;

export const Spinner = ({size, mode}) => html`
  <div style="height: 100px; padding: 20px 80px; display: flex; justify-content: center; align-items: center; background-color: ${mode === 'dark' ? '#ffffff' : '#000000'}">
    <verdocs-spinner .size=${size} .mode=${mode} />
  </div>
`;
