import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {getEnvelope} from '@verdocs/js-sdk/Envelopes/Envelopes';
import EnvelopeStore, {resetEnvelopeStore} from './envelopeStore';

// Allows envelope data to be cached for reuse between components, without parent components having to prop-drill entire envelopes into
// child elements.
export const getEnvelopeById = async (endpoint: VerdocsEndpoint, envelopeId: string, forceReload: boolean = false) => {
  console.log(`[ENVELOPES] getEnvelopeById`, {envelopeId, forceReload});

  if (!envelopeId) {
    console.log(`[ENVELOPES] Missing required envelope ID`);
    return;
  }

  if (EnvelopeStore.envelope?.id === envelopeId && !forceReload) {
    console.log(`[ENVELOPES] Skipping load for already-loaded envelope ID`);
    return;
  }

  resetEnvelopeStore();

  try {
    console.log(`[ENVELOPES] Loading envelope ${envelopeId}`);
    const envelope = await getEnvelope(endpoint, envelopeId, true);
    if (!envelope) {
      console.log('[ENVELOPES] Unable to load envelope');
      return;
    }

    EnvelopeStore.envelope = envelope;
    EnvelopeStore.loading = false;
  } catch (e) {
    EnvelopeStore.loading = false;
    EnvelopeStore.error = e?.response?.status === 401 ? 'Authentication required' : e.message;
    console.log('[ENVELOPES] Error loading envelope', e);
    throw e;
  }
};
