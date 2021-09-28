import {Meta} from '@storybook/web-components';
import {html} from 'lit-html';

export default {
  title: 'Elements/Org Popup',
  argTypes: {
    organization: {type: 'object', control: 'object', description: 'Organization to display', defaultValue: {name: 'Test'}},
  },
} as Meta;

export const OrgPopup = ({organization}) => html`<org-popup .organization="${organization}"></org-popup>`;
