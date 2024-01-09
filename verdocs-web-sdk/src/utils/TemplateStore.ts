import {createStore} from '@stencil/store';
import {ObservableMap} from '@stencil/store';
import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {getTemplate} from '@verdocs/js-sdk/Templates/Templates';
import {ITemplate, TemplateSenderTypes} from '@verdocs/js-sdk/Templates/Types';

export interface ITemplateStore extends ITemplate {
  isLoading: boolean;
  isLoaded: boolean;
  isError: boolean;
  error: any | null;
  updateCount: number;
  roleNames: string[];
}

export type TTemplateStore = ObservableMap<ITemplateStore>;

const createTemplateStore = (templateId: string) => {
  const now = new Date().toISOString();
  return createStore<ITemplateStore>({
    isLoading: true,
    isLoaded: false,
    isError: false,
    error: null,
    updateCount: 0,
    roleNames: [],

    id: templateId,
    name: '',
    description: '',
    sender: TemplateSenderTypes.CREATOR,
    profile_id: '',
    organization_id: '',
    counter: 0,
    star_counter: 0,
    is_sendable: false,
    is_personal: true,
    is_public: false,
    created_at: now,
    updated_at: now,
    last_used_at: now,
    token: '',
    reminder_id: '',
    reminder: undefined,
    processed: false,
    organization: undefined,
    roles: [],
    pages: [],
    template_document: undefined,
    template_documents: [],
  });
};

const templateStores: Record<string, TTemplateStore> = {};

export const getTemplateStore = async (endpoint: VerdocsEndpoint, templateId: string, forceReload: boolean = false) => {
  let created = false;
  if (!templateStores[templateId]) {
    console.debug('[TEMPLATES] No template store found for ID, creating', templateId);
    templateStores[templateId] = createTemplateStore(templateId);
    created = true;
  }

  const store = templateStores[templateId];

  // NOTE: If we need it, store.use() returns an unsubcribe function
  // See https://github.com/ionic-team/stencil-store#storeusesubscriptions
  store.use({
    // get: key => console.log(`Someone's reading prop ${key}`),
    // set: (key, newValue, oldValue) => console.log(`Prop ${key} changed from ${oldValue} to ${newValue}`),
    reset: () => console.debug('[TEMPLATES] Store got reset'),
    dispose: () => console.debug('[TEMPLATES] Store got disposed'),
  });

  // TODO: This can create a race condition if two components call this at the same time.
  //  For now we can probably defer doing something smart here because it's only a
  //  double-load issue.
  if (created || forceReload) {
    console.debug('[TEMPLATES] Reloading template', {templateId, created, forceReload});

    store.state.isLoading = true;
    store.state.isLoaded = false;
    store.state.isError = false;
    store.state.error = undefined;

    try {
      const template = await getTemplate(endpoint, templateId);
      console.debug('[TEMPLATES] Got template', template);
      Object.assign(store.state, template);

      store.state.isLoaded = true;
      store.state.isError = false;
      store.state.error = undefined;
    } catch (e) {
      console.error('[TEMPLATES] Error loading template', e);

      store.state.isLoaded = false;
      store.state.isError = true;
      store.state.error = e;

      throw e;
    }

    store.state.isLoading = false;
    store.state.updateCount++;
  }

  return store;
};

export const getRoleNames = (store?: TTemplateStore) => (store?.state?.roles || []).map(role => role.name);
