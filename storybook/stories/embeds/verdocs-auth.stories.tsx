import {html} from 'lit-html';
import {Meta} from '@storybook/web-components-vite';

export default {
  title: 'Embeds/Auth',
  component: 'verdocs-auth',
  args: {
    visible: true,
    logo: 'https://app.verdocs.com/assets/blue-logo.svg',
  },
  argTypes: {
    sdkError: {
      action: 'error',
      table: {
        disable: true,
      },
    },
    authenticated: {
      action: 'authenticated',
      table: {
        disable: true,
      },
    },
  },
} as Meta;

export const Auth = ({visible, logo, authenticated, sdkError}) => html`<verdocs-auth .visible=${visible} .logo=${logo} @authenticated=${authenticated} @sdkError=${sdkError} />`;
