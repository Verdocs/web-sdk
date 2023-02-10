import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Templates/Recipients',
  component: 'verdocs-template-recipients',
  args: {
    templateId: 'f0678dfe-1d72-4ef7-a2ce-21d12f8c456c',
    // templateId: '056b837f-b183-4039-b50a-d68acbf81b67',
  },
  argTypes: {
    onSave: {action: 'save'},
    onCancel: {action: 'cancel'},
  },
} as Meta;

export const Recipients = ({templateId, onCancel, onSave}) => html`<verdocs-template-recipients .templateId=${templateId} @cancel=${onCancel} @save=${onSave} />`;
