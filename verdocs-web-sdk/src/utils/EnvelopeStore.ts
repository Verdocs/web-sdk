import {undefined} from 'zod';
import {createStore} from '@stencil/store';
import {ObservableMap} from '@stencil/store/dist/types';
import {getEnvelope, IEnvelope, VerdocsEndpoint} from '@verdocs/js-sdk';

export interface IEnvelopeStore extends IEnvelope {
  isLoading: boolean;
  isLoaded: boolean;
  isError: boolean;
  error: any | null;
  roleNames: string[];
}

export type TEnvelopeStore = ObservableMap<IEnvelopeStore>;

const createEnvelopeStore = (envelopeId: string) => {
  const now = new Date().toISOString();
  return createStore<IEnvelopeStore>({
    isLoading: true,
    isLoaded: false,
    isError: false,
    error: null,
    roleNames: [],

    id: envelopeId,
    template_id: '',
    name: '',
    status: 'pending',
    profile_id: '',
    organization_id: '',
    no_contact: false,
    created_at: now,
    updated_at: now,
    canceled_at: null,
    visibility: 'private',
    recipients: [],
    access_keys: [],
    data: undefined,
    search_key: '',
    initial_reminder: null,
    followup_reminders: null,
    next_reminder: null,

    profile: null,
    organization: null,
    template: null,
    history_entries: [],
    documents: [],
    fields: [],
  });
};

const envelopeStores: Record<string, TEnvelopeStore> = {};

export const getEnvelopeStore = async (endpoint: VerdocsEndpoint, envelopeId: string, forceReload: boolean = false) => {
  let created = false;
  if (!envelopeStores[envelopeId]) {
    console.debug('[ENVELOPES] No envelope store found for ID, creating', envelopeId);
    envelopeStores[envelopeId] = createEnvelopeStore(envelopeId);
    created = true;
  }

  const store = envelopeStores[envelopeId];

  // NOTE: If we need it, store.use() returns an unsubcribe function
  // See https://github.com/ionic-team/stencil-store#storeusesubscriptions
  store.use({
    reset: () => console.debug('[ENVELOPES] Store got reset'),
    dispose: () => console.debug('[ENVELOPES] Store got disposed'),
  });

  // TODO: This can create a race condition if two components call this at the same time.
  //  For now we can probably defer doing something smart here because it's only a
  //  double-load issue.
  if (created || forceReload) {
    console.debug('[ENVELOPES] Reloading envelope', {envelopeId, created, forceReload});

    store.state.isLoading = true;
    store.state.isLoaded = false;
    store.state.isError = false;
    store.state.error = undefined;

    try {
      const envelope = await getEnvelope(endpoint, envelopeId);

      // Post-process the envelope to upgrade to new data fields
      envelope.documents?.forEach(document => {
        if (!document.order) {
          document.order = 0;
        }
      });

      console.debug('[ENVELOPES] Got envelope', envelope);
      Object.assign(store.state, envelope);

      store.state.isLoaded = true;
      store.state.isError = false;
      store.state.error = undefined;
    } catch (e) {
      console.error('[ENVELOPES] Error loading envelope', e);

      store.state.isLoaded = false;
      store.state.isError = true;
      store.state.error = e;

      throw e;
    }

    store.state.isLoading = false;
  }

  return store;
};

export const updateStoreEnvelope = (store: TEnvelopeStore, envelope: IEnvelope) => {
  Object.assign(store.state, envelope);
};
