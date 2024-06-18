import {Meta} from '@storybook/web-components';
import {html} from 'lit-html';

export default {
  title: 'Envelopes/Recipient Summary',
  component: 'verdocs-envelope-recipient-summary',
  args: {
    envelopeId: 'af083350-0202-4c00-ac90-5346914fa6ff',
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
