import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Templates/Reminders',
  component: 'verdocs-template-reminders',
  args: {
    // templateId: '',
    templateId: '951016b0-c5ef-450d-b628-9a0c5b84b163',
  },
  argTypes: {
    onClose: {action: 'close'},
  },
} as Meta;

export const Reminders = ({onClose, templateId}) =>
  templateId
    ? html`
        <div style="width: 360px; background: #ffffff; padding: 20px; box-sizing: border-box">
          <verdocs-template-reminders .templateId=${templateId} @close=${onClose} />
        </div>
      `
    : html`<img src="https://verdocs-public-assets.s3.amazonaws.com/storybook-placeholders/template-name.png" alt="Placeholder" />`;
