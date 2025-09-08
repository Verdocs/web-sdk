import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { defineCustomElement as defineVerdocsSign } from '../../../../verdocs-web-sdk/dist/components/verdocs-sign.js';

defineVerdocsSign();

const ENVELOPE_ID = "<YOUR_ENVELOPE_ID>";
const ROLE_ID = "<YOUR_ROLE_ID>";
const INVITE_CODE = "<YOUR_INVITE_CODE>";
@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <h2>Verdocs Sign Demo</h2>
    <verdocs-sign envelope-id="${ENVELOPE_ID}" role-id="${ROLE_ID}" invite-code="${INVITE_CODE}"></verdocs-sign>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class App {}
