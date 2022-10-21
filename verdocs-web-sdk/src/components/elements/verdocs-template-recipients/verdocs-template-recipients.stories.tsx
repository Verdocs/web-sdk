import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Elements/Template Recipients',
  component: 'verdocs-template-recipients',
  args: {
    templateRole: {
      template_id: '65cbba07-d0ac-4b62-afe3-25d186238938',
      name: 'Recipient 1',
      full_name: '',
      email: '',
      phone: '',
      type: 'signer',
      sequence: 1,
      message: '',
    },
    contactSuggestions: [
      {name: 'Me', email: 'myuser@nomail.com', phone: '212-555-6664'},
      {name: 'Will Power', email: 'will.power@nomail.com', avatar: 'https://i.pravatar.cc/48?img=59'},
      {name: 'Paige Turner', email: 'paige.turner@nomail.com', phone: '212-555-6664', avatar: 'https://i.pravatar.cc/48?img=41'},
      {name: 'Bill Board', phone: '212-555-6664'},
    ],
  },
  argTypes: {
    searchContacts: {action: 'searchContacts'},
    cancel: {action: 'cancel'},
    contactSelected: {action: 'contactSelected'},
  },
} as Meta;

export const TemplateRecipients = ({templateRole, contactSuggestions, searchContacts, cancel, contactSelected}) =>
  html`<verdocs-template-recipients
    .templateRole=${templateRole}
    .contactSuggestions=${contactSuggestions}
    @searchContacts=${searchContacts}
    @cancel=${cancel}
    @contactSelected=${contactSelected}
  />`;
