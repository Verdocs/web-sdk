import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Elements/View Template Document',
  component: 'verdocs-view-template-document',
  args: {
    templateId: '056b837f-b183-4039-b50a-d68acbf81b67',
    documentId: '5c7ae8d0-faf6-4059-a0e8-58b60c85b7ca',
  },
  argTypes: {},
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const ViewTemplateDocument = ({templateId, documentId}) => html`<verdocs-view-template-document .templateId=${templateId} .documentId=${documentId} />`;
