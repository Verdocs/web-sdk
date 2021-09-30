import {Meta} from '@storybook/web-components';
import {html} from 'lit-html';

export default {
  title: 'Elements/Org Popup',
  component: 'org-popup',
  args: {
    organization: {
      name: 'Acme Organization',
      created_at: '2014',
      followers: '123',
      website: 'www.acmeorganization.com',
      templates: '9'
    }
  },
  argTypes: {
    organization: {type: 'object', control: 'object'},
    theme: {type: 'string', control: 'radio', options:['light', 'dark'], defaultValue: 'light'}
  },
} as Meta;

export const Default = ({organization, theme}) => html`<org-popup .organization="${organization}" .theme="${theme}"></org-popup>`;
export const Test = () => html`<org-popup></org-popup>`
