import {Meta} from '@storybook/web-components-vite';
import {html} from 'lit-html';

export default {
  title: 'Envelopes/Recipient Summary',
  component: 'verdocs-envelope-recipient-summary',
  args: {
    envelopeId: '',
    canView: true,
    canDone: true,
    canSendAnother: true,
  },
  argTypes: {
    another: {action: 'another'},
    view: {action: 'view'},
    next: {action: 'next'},
  },
} as Meta;

export const RecipientSummary = ({envelopeId, another, view, next, canView, canDone, canSendAnother}) => html`<verdocs-envelope-recipient-summary
  .envelopeId="${envelopeId}"
  .canView="${canView}"
  .canDone="${canDone}"
  .canSendAnother="${canSendAnother}"
  @another=${another}
  @view=${view}
  @next=${next}
/>`;
