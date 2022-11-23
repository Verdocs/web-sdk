import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Elements/Template Properties',
  component: 'verdocs-template-properties',
  args: {
    template: {
      template_id: '65cbba07-d0ac-4b62-afe3-25d186238938',
      name: 'Recipient 1',
      full_name: '',
      email: '',
      phone: '',
      type: 'signer',
      sequence: 1,
      message: '',
    },
  },
  argTypes: {
    cancel: {action: 'cancel'},
    contactSelected: {action: 'contactSelected'},
  },
} as Meta;

export const TemplateProperties = ({template, cancel, contactSelected}) =>
  html`<verdocs-template-properties .template=${template} @cancel=${cancel} @contactSelected=${contactSelected} />`;
