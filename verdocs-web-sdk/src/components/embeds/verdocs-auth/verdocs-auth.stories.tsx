import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/Auth',
  component: 'verdocs-auth',
  args: {
    debug: true,
    visible: true,
    logo: 'https://verdocs.com/assets/blue-logo.svg',
  },
  argTypes: {
    authenticated: {
      action: 'authenticated',
      table: {
        disable: true,
      },
    },
  },
} as Meta;

export const Default = ({visible, logo, debug, authenticated}) => html`<verdocs-auth .visible=${visible} .logo=${logo} .debug=${debug} @authenticated=${authenticated} />`;
