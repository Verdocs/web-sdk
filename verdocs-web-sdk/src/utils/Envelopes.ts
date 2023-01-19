import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {getEnvelope} from '@verdocs/js-sdk/Envelopes/Envelopes';
import EnvelopeStore from './envelopeStore';
import {getTemplate} from '@verdocs/js-sdk/Templates/Templates';

// Allows envelope data to be cached for reuse between components, without parent components having to prop-drill entire envelopes into
// child elements.
export const getEnvelopeById = async (endpoint: VerdocsEndpoint, envelopeId: string) => {
  if (!envelopeId) {
    console.log(`[ENVELOPES] Missing required envelope ID`);
    return;
  }

  if (EnvelopeStore.envelope?.id === envelopeId) {
    console.log(`[ENVELOPES] Skipping load for already-loaded envelope ID`);
    return;
  }

  EnvelopeStore.error = '';
  EnvelopeStore.loading = true;
  EnvelopeStore.envelope = null;

  try {
    console.log(`[ENVELOPES] Loading envelope ${envelopeId}`);
    const envelope = await getEnvelope(endpoint, envelopeId, true);
    if (!envelope) {
      console.log('[ENVELOPES] Unable to load envelope');
      return;
    }

    EnvelopeStore.envelope = envelope;

    const template = await getTemplate(endpoint, envelope.template_id, true);
    if (!envelope) {
      console.log('[ENVELOPES] Unable to load template');
      return;
    }

    EnvelopeStore.template = template;
    EnvelopeStore.loading = false;
  } catch (e) {
    EnvelopeStore.loading = false;
    EnvelopeStore.error = e?.response?.status === 401 ? 'Authentication required' : e.message;
    console.log('[ENVELOPES] Error loading envelope', e);
    throw e;
  }
};
