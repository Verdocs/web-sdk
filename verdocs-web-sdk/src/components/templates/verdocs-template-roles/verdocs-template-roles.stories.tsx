import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Templates/Roles',
  component: 'verdocs-template-roles',
  args: {
    templateId: '',
  },
  argTypes: {
    onSave: {action: 'save'},
    onExit: {action: 'exit'},
  },
} as Meta;

export const Roles = ({templateId, onExit, onSave}) => html`<verdocs-template-roles .templateId=${templateId} @exit=${onExit} @save=${onSave} />`;
