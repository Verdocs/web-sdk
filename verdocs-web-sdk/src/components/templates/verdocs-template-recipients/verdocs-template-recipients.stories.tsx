import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Templates/Template Recipients',
  component: 'verdocs-template-recipients',
  args: {
    templateId: '951016b0-c5ef-450d-b628-9a0c5b84b163',
  },
  argTypes: {
    cancel: {action: 'cancel'},
  },
} as Meta;

export const TemplateRecipients = ({templateId, cancel}) => html`<verdocs-template-recipients .templateId=${templateId} @cancel=${cancel} />`;
