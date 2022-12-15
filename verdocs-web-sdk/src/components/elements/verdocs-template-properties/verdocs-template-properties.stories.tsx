import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Elements/Template Properties',
  component: 'verdocs-template-properties',
  args: {
    templateId: '951016b0-c5ef-450d-b628-9a0c5b84b163',
  },
  argTypes: {
    cancel: {action: 'cancel'},
    settingsUpdated: {action: 'settingsUpdated'},
  },
} as Meta;

export const TemplateProperties = ({cancel, settingsUpdated, templateId}) =>
  html`<verdocs-template-properties .templateId=${templateId} @cancel=${cancel} @settingsUpdated=${settingsUpdated} />`;
