import {Meta} from '@storybook/web-components';
import {html} from 'lit-html';

export default {
  title: 'Envelopes/Recipient Link',
  component: 'verdocs-envelope-recipient-link',
  args: {
    envelopeId: 'c64b09c1-23d8-4612-bc66-86723ab7ede3',
    roleName: 'Buyer',
  },
  argTypes: {
    next: {action: 'next'},
  },
} as Meta;

export const recipientLink = ({envelopeId, roleName, next}) =>
  html`<verdocs-envelope-recipient-link .envelopeId="${envelopeId}" .roleName="${roleName}" @next=${next} />`;
