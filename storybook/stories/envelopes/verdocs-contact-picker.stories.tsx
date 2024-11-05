import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Envelopes/Contact Picker',
  component: 'verdocs-contact-picker',
  args: {
    templateRole: {
      template_id: '',
      name: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      type: 'signer',
      sequence: 1,
      message: '',
    },
    contactSuggestions: [
      {first_name: 'Me', last_name: '', email: 'myuser@nomail.com', phone: '212-555-6664'},
      {first_name: 'Will', last_name: 'Power', email: 'will.power@nomail.com', avatar: 'https://i.pravatar.cc/48?img=59'},
      {first_name: 'Paige', last_name: 'Turner', email: 'paige.turner@nomail.com', phone: '212-555-6664', avatar: 'https://i.pravatar.cc/48?img=41'},
      {first_name: 'Bill', last_name: 'Board', phone: '212-555-6664'},
    ],
  },
  argTypes: {
    searchContacts: {action: 'searchContacts'},
    onExit: {action: 'exit'},
    onNext: {action: 'next'},
  },
} as Meta;

export const ContactPicker = ({templateRole, contactSuggestions, searchContacts, onExit, onNext}) =>
  html`<verdocs-contact-picker .templateRole=${templateRole} .contactSuggestions=${contactSuggestions} @searchContacts=${searchContacts} @exit=${onExit} @next=${onNext} />`;
