import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Elements/View Envelope Document',
  component: 'verdocs-view-envelope-document',
  args: {
    envelopeId: '',
    documentId: '',
  },
  argTypes: {},
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const ViewEnvelopeDocument = ({envelopeId, documentId}) => html`<verdocs-view-envelope-document .envelopeId=${envelopeId} .documentId=${documentId} />`;
