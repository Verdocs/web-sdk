import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Templates/Roles',
  component: 'verdocs-template-roles',
  args: {
    templateId: '6a3b3095-84f1-40c4-9676-b8fd651bd427',
  },
  argTypes: {
    onSave: {action: 'save'},
    onExit: {action: 'exit'},
  },
} as Meta;

export const Roles = ({templateId, onExit, onSave}) => html`<verdocs-template-roles .templateId=${templateId} @exit=${onExit} @save=${onSave} />`;
