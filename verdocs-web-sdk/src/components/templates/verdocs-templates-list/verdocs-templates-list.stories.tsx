import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Templates/Templates List',
  component: 'verdocs-templates-list',
  args: {
    templateId: '',
  },
  argTypes: {
    onClose: {action: 'close'},
  },
} as Meta;

export const TemplateList = ({onClose, templateId}) =>
  html`
    <div style="width: 360px; background: #ffffff; padding: 20px; box-sizing: border-box">
      <verdocs-templates-list .templateId=${templateId} @close=${onClose} />
    </div>
  `;
