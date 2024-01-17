import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Templates/Fields',
  component: 'verdocs-template-fields',
  args: {
    templateId: 'd2338742-f3a1-465b-8592-806587413cc1',
  },
  argTypes: {},
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Fields = ({templateId}) => html`<div style="height: 600px">
  <verdocs-template-fields .templateId=${templateId} />
</div>`;
