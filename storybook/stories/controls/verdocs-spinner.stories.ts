import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Controls/Spinner',
  component: 'verdocs-spinner',
  parameters: {},
  args: {
    size: 32,
    mode: 'light',
  },
} as Meta;

export const Spinner = ({size, mode}) => html`<verdocs-spinner .size=${size} .mode=${mode} />`;
