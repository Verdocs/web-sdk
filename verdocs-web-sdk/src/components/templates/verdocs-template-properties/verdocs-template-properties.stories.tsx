import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Templates/Properties',
  component: 'verdocs-template-properties',
  args: {
    templateId: '951016b0-c5ef-450d-b628-9a0c5b84b163',
  },
  argTypes: {
    onCancel: {action: 'cancel'},
    onNext: {action: 'next'},
  },
} as Meta;

export const Properties = ({onCancel, onNext, templateId}) => html`<verdocs-template-properties .templateId=${templateId} @cancel=${onCancel} @next=${onNext} />`;
