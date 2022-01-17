import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';
// import {action} from '@storybook/addon-actions';

// const templateId = "c3fc6310-bf9d-47a1-b0ad-daf2bbf657c2";
// const documentId = "ed117472-4d4e-4c62-9386-af047a3373a2";
// const pdfurl = `https://api.verdocs.com/templates/${templateId}/documents/${documentId}?file=true`;
const source = '/i-9-paper-version.pdf';

export default {
  title: 'Embeds/View',
  component: 'verdocs-view',
  args: {
    source,
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
