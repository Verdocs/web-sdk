import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Templates/Role Properties',
  component: 'verdocs-template-role-properties',
  args: {
    templateId: '056b837f-b183-4039-b50a-d68acbf81b67',
    // templateId: 'd2338742-f3a1-465b-8592-806587413cc1',
  },
  argTypes: {
    onClose: {action: 'close'},
  },
} as Meta;

export const RoleProperties = ({value, onClose}) => html`<verdocs-template-role-properties .value=${value} @close=${onClose} />`;
