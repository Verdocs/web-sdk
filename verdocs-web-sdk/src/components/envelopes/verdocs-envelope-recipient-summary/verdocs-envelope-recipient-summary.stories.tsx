import {Meta} from '@storybook/web-components';
import {html} from 'lit-html';

export default {
  title: 'Envelopes/Recipient Summary',
  component: 'verdocs-envelope-recipient-summary',
  args: {
    envelopeId: '498c2404-3d8c-4325-bdd3-e8c7c70e63b1',
  },
  argTypes: {
    another: {action: 'another'},
    view: {action: 'view'},
    next: {action: 'next'},
  },
} as Meta;

export const RecipientSummary = ({envelopeId, another, view, next}) => html`<verdocs-envelope-recipient-summary
  .envelopeId="${envelopeId}"
  @another=${another}
  @view=${view}
  @next=${next}
/>`;
