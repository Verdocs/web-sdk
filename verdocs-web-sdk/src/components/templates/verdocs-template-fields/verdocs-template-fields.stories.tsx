import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Templates/Fields',
  component: 'verdocs-template-fields',
  args: {
    templateId: 'ea7a792f-7e46-4662-a0ff-db6bd389306e',
    // templateId: 'd2338742-f3a1-465b-8592-806587413cc1',
  },
  argTypes: {
    onCancel: {action: 'cancel'},
    onNext: {action: 'next'},
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const Fields = ({templateId, onCancel, onNext}) => html`<div style="height: 600px">
  <verdocs-template-fields .templateId=${templateId} @cancel=${onCancel} @next=${onNext} />
</div>`;
