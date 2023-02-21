import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Templates/Recipients',
  component: 'verdocs-template-recipients',
  args: {
    // templateId: 'ea7a792f-7e46-4662-a0ff-db6bd389306e',
    templateId: '951016b0-c5ef-450d-b628-9a0c5b84b163',
  },
  argTypes: {
    onSave: {action: 'save'},
    onCancel: {action: 'cancel'},
  },
} as Meta;

export const Recipients = ({templateId, onCancel, onSave}) => html`<verdocs-template-recipients .templateId=${templateId} @cancel=${onCancel} @save=${onSave} />`;
