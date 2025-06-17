import {Meta} from '@storybook/web-components';
import {html} from 'lit-html';

export default {
  title: 'Envelopes/Update Recipient',
  component: 'verdocs-envelope-update-recipient',
  args: {
    envelopeId: '',
    roleName: '',
  },
  argTypes: {
    next: {action: 'next'},
  },
} as Meta;

export const updateRecipient = ({envelopeId, roleName, next}) =>
  html`
    <div style="width:600px; height:400px; margin: 0 auto;">
      <verdocs-envelope-update-recipient .envelopeId="${envelopeId}" .roleName="${roleName}" @next=${next} />
    </div>
  `;
