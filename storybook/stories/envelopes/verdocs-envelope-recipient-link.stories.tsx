import {Meta} from '@storybook/web-components';
import {html} from 'lit-html';

export default {
  title: 'Envelopes/Recipient Link',
  component: 'verdocs-envelope-recipient-link',
  args: {
    envelopeId: '',
    roleName: '',
  },
  argTypes: {
    next: {action: 'next'},
  },
} as Meta;

export const recipientLink = ({envelopeId, roleName, next}) =>
  html`<verdocs-envelope-recipient-link .envelopeId="${envelopeId}" .roleName="${roleName}" @next=${next} />`;
