import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Templates/Templates List',
  component: 'verdocs-templates-list',
  args: {
    items: 10,
    sharing: 'all',
    starred: 'all',
    sortBy: 'updated_at',
  },
  argTypes: {
    onClose: {action: 'close'},
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const TemplatesList = ({onClose, templateId}) => html` <verdocs-templates-list .templateId=${templateId} @close=${onClose} /> `;
