import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';
// import {action} from '@storybook/addon-actions';

// const templateId = "c3fc6310-bf9d-47a1-b0ad-daf2bbf657c2";
// const documentId = "ed117472-4d4e-4c62-9386-af047a3373a2";
// const pdfurl = `https://api.verdocs.com/templates/${templateId}/documents/${documentId}?file=true`;
const localSource = 'https://verdocs-public-assets.s3.amazonaws.com/i-9-paper-version.pdf';
// const localSource = '/i-9-paper-version.pdf';

export default {
  title: 'Embeds/View',
  component: 'verdocs-view',
  args: {
    source: localSource,
    // source: 'https://stage-api.verdocs.com/envelopes/9f514766-e86e-46d0-9c31-a95eacc40c2e/envelope_documents/e2dea8fa-8a86-4d52-9aa9-28c263120190?file=true',
  },
  argTypes: {},
} as Meta;

// const listener = {
//   handleEvent(e) {
//     action('selected', e);
//   },
//   capture: true,
// };

export const View = ({source}) => html`<verdocs-view .source=${source} />`;
