import './style.css';
import { defineCustomElements } from '../../../verdocs-web-sdk/dist/esm/loader.js';

defineCustomElements();

const ENVELOPE_ID = "<YOUR_ENVELOPE_ID>";
const ROLE_ID = "<YOUR_ROLE_ID>";
const INVITE_CODE = "<YOUR_INVITE_CODE>";

document.querySelector('#app').innerHTML = `
  <h2>Verdocs Web SDK Vanilla JS Example</h2>
  <p style="color: red;">
    Note: You must provide real values for <code>envelope-id</code>, <code>role-id</code>, and <code>invite-code</code> for the component to render anything.
  </p>
  <div>
    <!-- Example usage of the Verdocs web component: -->
    <verdocs-sign envelope-id="${ENVELOPE_ID}" role-id="${ROLE_ID}" invite-code="${INVITE_CODE}"></verdocs-sign>
  </div>
`;
