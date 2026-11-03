import {newSpecPage} from '@stencil/core/testing';
import {Store} from './Datastore';
import {VerdocsTemplateSettings} from '../components/templates/verdocs-template-settings/verdocs-template-settings';
import {VerdocsTemplateRoleProperties} from '../components/templates/verdocs-template-role-properties/verdocs-template-role-properties';
import {VerdocsTemplateDocumentPage} from '../components/templates/verdocs-template-document-page/verdocs-template-document-page';
import {VerdocsTemplateRoles} from '../components/templates/verdocs-template-roles/verdocs-template-roles';
import {VerdocsTemplateFieldProperties} from '../components/templates/verdocs-template-field-properties/verdocs-template-field-properties';
import {VerdocsTemplateBuildTabs} from '../components/templates/verdocs-template-build-tabs/verdocs-template-build-tabs';
import {VerdocsTemplateAttachments} from '../components/templates/verdocs-template-attachments/verdocs-template-attachments';
import {VerdocsSend} from '../components/embeds/verdocs-send/verdocs-send';
import {VerdocsView} from '../components/embeds/verdocs-view/verdocs-view';
import {VerdocsPreview} from '../components/embeds/verdocs-preview/verdocs-preview';
import {VerdocsBuild} from '../components/embeds/verdocs-build/verdocs-build';
import {VerdocsEnvelopeRecipientSummary} from '../components/envelopes/verdocs-envelope-recipient-summary/verdocs-envelope-recipient-summary';
import {VerdocsEnvelopeSidebar} from '../components/envelopes/verdocs-envelope-sidebar/verdocs-envelope-sidebar';
import {VerdocsSignFooter} from '../components/envelopes/verdocs-sign-footer/verdocs-sign-footer';
import {VerdocsEnvelopeRecipientLink} from '../components/envelopes/verdocs-envelope-recipient-link/verdocs-envelope-recipient-link';
import {VerdocsEnvelopeUpdateRecipient} from '../components/envelopes/verdocs-envelope-update-recipient/verdocs-envelope-update-recipient';

const template = {id: 'T1', name: 'Template', roles: [{name: 'Signer', sequence: 1, type: 'signer'}], documents: [], fields: []};
const recipient = {envelope_id: 'E1', role_name: 'Signer', sequence: 1, type: 'signer', status: 'pending', first_name: 'A', last_name: 'B', email: 'a@example.com'};
const envelope = {id: 'E1', name: 'Envelope', status: 'pending', created_at: '2026-10-20T00:00:00Z', updated_at: '2026-10-20T00:00:00Z', recipients: [recipient], documents: [], fields: [], history_entries: []};

const CASES: [string, any, string][] = [
  ['verdocs-template-settings', VerdocsTemplateSettings, 'template-id="T1"'],
  ['verdocs-template-role-properties', VerdocsTemplateRoleProperties, 'template-id="T1" role-name="Signer"'],
  ['verdocs-template-document-page', VerdocsTemplateDocumentPage, 'template-id="T1" document-id="D1" page-number="1"'],
  ['verdocs-template-roles', VerdocsTemplateRoles, 'template-id="T1"'],
  ['verdocs-template-field-properties', VerdocsTemplateFieldProperties, 'template-id="T1" field-name="f1"'],
  ['verdocs-template-build-tabs', VerdocsTemplateBuildTabs, 'template-id="T1"'],
  ['verdocs-template-attachments', VerdocsTemplateAttachments, 'template-id="T1"'],
  ['verdocs-send', VerdocsSend, 'template-id="T1"'],
  ['verdocs-view', VerdocsView, 'envelope-id="E1"'],
  ['verdocs-preview', VerdocsPreview, 'template-id="T1"'],
  ['verdocs-build', VerdocsBuild, 'template-id="T1"'],
  ['verdocs-envelope-recipient-summary', VerdocsEnvelopeRecipientSummary, 'envelope-id="E1"'],
  ['verdocs-envelope-sidebar', VerdocsEnvelopeSidebar, 'envelope-id="E1"'],
  ['verdocs-sign-footer', VerdocsSignFooter, 'envelope-id="E1"'],
  ['verdocs-envelope-recipient-link', VerdocsEnvelopeRecipientLink, 'envelope-id="E1" role-name="Signer"'],
  ['verdocs-envelope-update-recipient', VerdocsEnvelopeUpdateRecipient, 'envelope-id="E1" role-name="Signer"'],
];

describe('Store listeners', () => {
  // Stencil's mock DOM has no toggleAttribute, which verdocs-send uses.
  beforeAll(() => {
    const proto = Object.getPrototypeOf(document.createElement('div'));
    proto.toggleAttribute ??= function (name: string, force?: boolean) {
      const on = force ?? !this.hasAttribute(name);
      on ? this.setAttribute(name, '') : this.removeAttribute(name);
      return on;
    };
  });

  afterEach(() => jest.restoreAllMocks());

  it.each(CASES)('%s stops listening when removed and listens again when reattached', async (tag, component, attrs) => {
    const subscribe = jest.spyOn(Store, 'subscribe').mockImplementation((table, _row, _getter, _force, callback: any) => {
      callback(table === 'envelopes' ? envelope : template);
      return `listener-${subscribe.mock.calls.length}`;
    });
    const delListener = jest.spyOn(Store.store, 'delListener');

    const page = await newSpecPage({components: [component], html: `<${tag} ${attrs}></${tag}>`});
    const el = page.root;
    expect(subscribe).toHaveBeenCalledTimes(1);

    el.remove();
    await page.waitForChanges();
    expect(delListener).toHaveBeenCalledWith('listener-1');

    page.body.appendChild(el);
    await page.waitForChanges();
    expect(subscribe).toHaveBeenCalledTimes(2);
  });

  it('verdocs-build keeps one template listener across step changes', async () => {
    const subscribe = jest.spyOn(Store, 'subscribe').mockImplementation((_table, _row, _getter, _force, callback: any) => {
      callback(template);
      return `listener-${subscribe.mock.calls.length}`;
    });
    const delListener = jest.spyOn(Store.store, 'delListener');

    const page = await newSpecPage({components: [VerdocsBuild], html: '<verdocs-build template-id="T1" step="preview"></verdocs-build>'});
    page.root.step = 'roles';
    await page.waitForChanges();

    expect(subscribe).toHaveBeenCalledTimes(2);
    expect(delListener).toHaveBeenCalledWith('listener-1');
  });
});
