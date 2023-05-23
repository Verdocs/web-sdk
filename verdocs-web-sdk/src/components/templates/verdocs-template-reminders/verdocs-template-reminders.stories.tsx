import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Templates/Reminders',
  component: 'verdocs-template-reminders',
  args: {
    templateId: '8337af06-3b5a-4e1b-98be-67d82bc7ecd1',
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
