import { newSpecPage } from '@stencil/core/testing';
import { VerdocsEnvelopeSidebar } from './verdocs-envelope-sidebar';

const qualifiedRecipient = {role_name: 'Signer', first_name: 'Ada', last_name: 'Lovelace', signature_level: 'qualified'};

const createEnvelope = (event: string, event_detail?: string | null) => ({
  id: 'env-1',
  status: 'pending',
  created_at: '2026-10-01T00:00:00Z',
  updated_at: '2026-10-02T00:00:00Z',
  recipients: [qualifiedRecipient],
  history_entries: [{event, event_detail, role_name: 'Signer', created_at: '2026-10-02T00:00:00Z'}],
});

// The history entry for the envelope's one event, skipping the "Envelope created." entry every envelope gets
const getHistoryEntry = async (event: string, event_detail?: string | null) => {
  const page = await newSpecPage({
    components: [VerdocsEnvelopeSidebar],
    html: '<verdocs-envelope-sidebar></verdocs-envelope-sidebar>',
  });
  const instance = page.rootInstance as VerdocsEnvelopeSidebar;
  instance.envelope = createEnvelope(event, event_detail) as any;

  const entries = instance.prepareHistoryEntries();
  return entries.find(entry => entry.message !== 'Envelope created.');
};

describe('verdocs-envelope-sidebar', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsEnvelopeSidebar],
      html: '<verdocs-envelope-sidebar></verdocs-envelope-sidebar>',
    });
    expect(page.root).toBeTruthy();
  });

  describe('prepareHistoryEntries', () => {
    describe('QES events', () => {
      it('describes a QES invitation', async () => {
        const expected = {icon: 'mail', message: 'Ada Lovelace has been invited to sign with a qualified electronic signature.'};

        expect(await getHistoryEntry('recipient:qes_invited')).toMatchObject(expected);
      });

      it('describes a started QES session', async () => {
        const expected = {icon: 'send', message: 'QES session started by Ada Lovelace.'};

        expect(await getHistoryEntry('recipient:qes_started')).toMatchObject(expected);
      });

      it('describes a successful QES', async () => {
        const expected = {icon: 'verified_user', message: 'QES signature successful for Ada Lovelace.'};

        expect(await getHistoryEntry('recipient:qes_signed')).toMatchObject(expected);
      });

      it.each([
        ['prepare_failed', {reason: 'prepare_failed'}, 'QES session failed for Ada Lovelace: the signing session could not be started.'],
        ['not_qualified', {reason: 'not_qualified'}, 'QES session failed for Ada Lovelace: the signature was not a qualified electronic signature.'],
        [
          'not_qualified with a signature level',
          {reason: 'not_qualified', signature_level: 'advanced'},
          'QES session failed for Ada Lovelace: the signature was not a qualified electronic signature (advanced).',
        ],
        ['download_failed', {reason: 'download_failed'}, 'QES session failed for Ada Lovelace: the signed documents could not be retrieved.'],
        [
          'a signature level on another reason',
          {reason: 'prepare_failed', signature_level: 'advanced'},
          'QES session failed for Ada Lovelace: the signing session could not be started.',
        ],
        ['an unknown reason', {reason: 'something_else'}, 'QES session failed for Ada Lovelace.'],
      ])('describes a QES error for %s', async (_label, detail, expected) => {
        const entry = await getHistoryEntry('recipient:qes_error', JSON.stringify(detail));

        expect(entry).toMatchObject({icon: 'cancel', message: expected});
      });

      it.each([
        ['no detail', null],
        ['detail that is not JSON', 'not json'],
      ])('describes a QES error with %s', async (_label, detail) => {
        const expected = {icon: 'cancel', message: 'QES session failed for Ada Lovelace.'};

        expect(await getHistoryEntry('recipient:qes_error', detail)).toMatchObject(expected);
      });
    });
  });
});
