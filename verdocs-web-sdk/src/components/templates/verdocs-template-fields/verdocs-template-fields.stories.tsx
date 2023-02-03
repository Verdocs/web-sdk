import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Templates/Template Fields',
  component: 'verdocs-template-fields',
  args: {
    templateId: 'd2338742-f3a1-465b-8592-806587413cc1',
  },
  argTypes: {
    onCancel: {action: 'cancel'},
    onNext: {action: 'next'},
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

//export const TemplateFields = ({templateId, cancel, save}) => html`<div style="height: 600px; transform: translateZ(0);">
export const TemplateFields = ({templateId, onCancel, onNext}) => html`<div style="height: 600px">
  <verdocs-template-fields .templateId=${templateId} @cancel=${onCancel} @next=${onNext} />
</div>`;
