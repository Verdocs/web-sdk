import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Settings/Api Keys',
  component: 'verdocs-settings-api-keys',
  args: {},
  argTypes: {},
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const ApiKeys = () => html` <verdocs-settings-api-keys /> `;
