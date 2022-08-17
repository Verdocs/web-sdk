import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

/**
 * Render a document page.
 */
export default {
  title: 'Fields/Document Page',
  component: 'verdocs-document-page',
  args: {},
  argTypes: {
    // type: {defaultValue: 'recent'},
    // entrySelected: {action: 'entrySelected'},
  },
} as Meta;

export const VerdocsDocumentPage = () => html`<verdocs-document-page />`;
