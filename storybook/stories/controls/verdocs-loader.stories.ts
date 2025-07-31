import {html} from 'lit-html';
import {Meta} from '@storybook/web-components-vite';

export default {
  title: 'Controls/Loader',
  component: 'verdocs-loader',
  parameters: {},
  args: {},
  argTypes: {},
} as Meta;

export const Loader = ({}) => html`<div style="width: 200px; height: 200px;"><verdocs-loader /></div>`;
