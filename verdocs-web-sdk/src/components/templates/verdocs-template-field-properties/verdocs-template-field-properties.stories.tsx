import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Templates/Field Properties',
  component: 'verdocs-template-field-properties',
  args: {
    templateId: 'd2338742-f3a1-465b-8592-806587413cc1',
    fieldName: 'textboxP1-2',
  },
  argTypes: {
    onClose: {action: 'close'},
  },
} as Meta;

export const FieldProperties = ({onClose, templateId, fieldName}) =>
  templateId
    ? html`
        <div style="width: 360px; background: #ffffff; padding: 20px; box-sizing: border-box">
          <verdocs-template-field-properties .templateId=${templateId} .fieldName=${fieldName} @close=${onClose} />
        </div>
      `
    : html`<img src="https://verdocs-public-assets.s3.amazonaws.com/storybook-placeholders/template-name.png" alt="Placeholder" />`;
