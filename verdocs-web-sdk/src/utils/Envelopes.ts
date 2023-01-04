import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {getEnvelope} from '@verdocs/js-sdk/Envelopes/Envelopes';
import EnvelopeStore from './envelopeStore';

// Allows envelope data to be cached for reuse between components, without parent components having to prop-drill entire envelopes into
// child elements.
export const getEnvelopeById = async (endpoint: VerdocsEndpoint, envelopeId: string) => {
  EnvelopeStore.envelope = null;

  if (!envelopeId) {
    console.log(`[ENVELOPES] Missing required envelope ID`);
    return;
  }

  EnvelopeStore.error = '';
  EnvelopeStore.loading = true;

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
