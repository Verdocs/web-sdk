import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Templates/Settings',
  component: 'verdocs-template-settings',
  args: {
    templateId: 'c15776e9-f9a8-4c6c-a9b2-076eb2ec45ff',
  },
  argTypes: {
    onClose: {action: 'close'},
  },
} as Meta;

export const Name = ({onClose, templateId}) =>
  templateId
    ? html`
        <div style="width: 360px; background: #ffffff; padding: 20px; box-sizing: border-box">
          <verdocs-template-settings .templateId=${templateId} @close=${onClose} />
        </div>
      `
    : html`<img src="https://verdocs-public-assets.s3.amazonaws.com/storybook-placeholders/template-name.png" alt="Placeholder" />`;
