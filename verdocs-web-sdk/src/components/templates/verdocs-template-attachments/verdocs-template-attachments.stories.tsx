import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Templates/Attachments',
  component: 'verdocs-template-attachments',
  args: {
    templateId: '',
  },
  argTypes: {
    onClose: {action: 'close'},
  },
} as Meta;

export const Attachments = ({onClose, templateId}) =>
  templateId
    ? html`
        <div style="width: 400px; background: #ffffff; padding: 20px; box-sizing: border-box">
          <verdocs-template-attachments .templateId=${templateId} @close=${onClose} />
        </div>
      `
    : html`<img src="https://verdocs-public-assets.s3.amazonaws.com/storybook-placeholders/template-name.png" alt="Placeholder" />`;
