import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Templates/Visibility',
  component: 'verdocs-template-visibility',
  args: {
    templateId: '',
  },
  argTypes: {
    onClose: {action: 'close'},
  },
} as Meta;

export const Visibility = ({onClose, templateId}) =>
  templateId
    ? html`
        <div style="width: 360px; background: #ffffff; padding: 20px; box-sizing: border-box">
          <verdocs-template-visibility .templateId=${templateId} @close=${onClose} />
        </div>
      `
    : html`<img src="https://verdocs-public-assets.s3.amazonaws.com/storybook-placeholders/template-name.png" alt="Placeholder" />`;
