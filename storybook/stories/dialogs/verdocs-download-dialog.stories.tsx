import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

const FAKE_DOCS_PROCESSING = [
  {id: 'doc1', name: 'Fields Test (1).pdf', type: 'attachment', order: 1, created_at: '2025-01-01'},
  {id: 'doc2', name: 'Enerack UL 467 Certificate (US).pdf', type: 'attachment', order: 2, created_at: '2025-01-02'},
];

const FAKE_DOCS_WITH_CERT = [...FAKE_DOCS_PROCESSING, {id: 'cert1', name: 'Certificate', type: 'certificate', order: 99, created_at: '2025-01-03'}];

const STATES = {
  // Envelope not yet signed, no cert
  processing: {signed: false, documents: FAKE_DOCS_PROCESSING},
  // Envelope signed, cert not yet generated
  attachmentsSigned: {signed: true, documents: FAKE_DOCS_PROCESSING},
  // Cert generated and signed
  certificateSigned: {signed: true, documents: FAKE_DOCS_WITH_CERT},
};

export default {
  title: 'Dialogs/Download Dialog',
  component: 'verdocs-download-dialog',
  args: {
    state: 'processing',
    polling: true,
  },
  argTypes: {
    state: {control: 'radio', options: ['processing', 'attachmentsSigned', 'certificateSigned']},
    polling: {control: 'boolean'},
    onDownload: {
      action: 'download',
      table: {disable: true},
    },
    onExit: {
      action: 'exit',
      table: {disable: true},
    },
  },
} as Meta;

export const DownloadDialog = ({state, polling, onDownload, onExit}) => {
  const {signed, documents} = STATES[state] || STATES.processing;
  return html`<div style="width: 600px; height: 500px;">
    <verdocs-download-dialog .signed=${signed} .polling=${polling} .documents=${documents} @download=${onDownload} @exit=${onExit} />
  </div>`;
};
