import {html} from 'lit';
import {Meta} from '@storybook/web-components-vite';

export default {
  title: 'Embeds/Auth',
  component: 'verdocs-auth',
  args: {
    visible: true,
    logo: 'https://app.verdocs.com/assets/blue-logo.svg',
    displayMode: 'login',
    showSocialLogins: false,
  },
  argTypes: {
    displayMode: {control: 'select', options: ['login', 'signup', 'forgot', 'reset', 'verify', 'mfa']},
    // NOTE: We expose this control so you can see the visual, but the social auth buttons will only work in a real
    // Web app on a Verdocs-owned property.
    showSocialLogins: {control: 'boolean'},
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

export const Auth = ({visible, logo, displayMode, showSocialLogins, authenticated, sdkError}) =>
  html`<verdocs-auth
    .visible=${visible}
    .logo=${logo}
    .displayMode=${displayMode}
    .showSocialLogins=${showSocialLogins}
    @authenticated=${authenticated}
    @sdkError=${sdkError}
  />`;
