import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Templates/Fields',
  component: 'verdocs-template-fields',
  args: {
    templateId: '93535477-7c15-4363-9e53-78a018148ecd',
  },
  argTypes: {},
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Fields = ({templateId}) => html`<div style="height: 600px">
  <verdocs-template-fields .templateId=${templateId} />
</div>`;
