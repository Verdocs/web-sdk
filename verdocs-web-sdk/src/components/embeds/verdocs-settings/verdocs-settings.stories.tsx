import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/Settings',
  component: 'verdocs-settings',
  args: {},
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Settings = ({}) => html`<verdocs-settings />`;
