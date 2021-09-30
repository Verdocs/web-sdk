import {Meta} from '@storybook/web-components';
import {html} from 'lit-html';

export default {
  title: 'Elements/Org Popup',
  argTypes: {
    organization: {type: 'object', control: 'object', description: 'Organization to display', defaultValue: {
      name: 'Acme Organization',
      created_at: '2014',
      followers: '123',
      website: 'www.acmeorganization.com',
      templates: '9'
    }},
    theme: {type: 'string', control: 'radio', options:['light', 'dark'], description: 'Theme to be used', defaultValue: 'light'}
  },
} as Meta;

export const OrgPopup = ({organization, theme}) => html`<org-popup .organization="${organization}" .theme="${theme}"></org-popup>`;
