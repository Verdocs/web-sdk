import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Templates/Recipients',
  component: 'verdocs-template-recipients',
  args: {
    templateId: '056b837f-b183-4039-b50a-d68acbf81b67',
    // templateId: 'd2338742-f3a1-465b-8592-806587413cc1',
  },
  argTypes: {
    close: {action: 'cancel'},
  },
} as Meta;

export const Recipients = ({templateId, cancel}) => html`<verdocs-template-recipients .templateId=${templateId} @cancel=${cancel} />`;
