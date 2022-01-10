import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Embeds/Auth',
  component: 'verdocs-auth',
  args: {
    debug: true,
    visible: true,
    source: 'verdocs-user',
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

export const Default = ({visible, source, debug, authenticated}) => html`<verdocs-auth .visible=${visible} .source=${source} .debug=${debug} @authenticated=${authenticated} />`;
