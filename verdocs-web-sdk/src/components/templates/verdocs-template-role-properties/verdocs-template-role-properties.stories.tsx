import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Templates/Role Properties',
  component: 'verdocs-template-role-properties',
  args: {
    templateId: '',
  },
  argTypes: {
    onClose: {action: 'close'},
  },
} as Meta;

export const RoleProperties = ({value, onClose}) => html`<verdocs-template-role-properties .value=${value} @close=${onClose} />`;
