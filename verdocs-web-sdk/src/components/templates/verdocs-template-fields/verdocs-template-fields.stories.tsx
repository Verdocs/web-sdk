import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Templates/Fields',
  component: 'verdocs-template-fields',
  args: {
    templateId: '8337af06-3b5a-4e1b-98be-67d82bc7ecd1',
  },
  argTypes: {},
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Fields = ({templateId}) => html`<div style="height: 600px">
  <verdocs-template-fields .templateId=${templateId} />
</div>`;
