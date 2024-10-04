import {createStore} from '@stencil/store';
import {ObservableMap} from '@stencil/store';
import {getTemplate, ITemplate, VerdocsEndpoint} from '@verdocs/js-sdk';
import {createTemplateRoleStore, getTemplateRoleStore} from './TemplateRoleStore';
import {createTemplateFieldStore, getTemplateFieldStore} from './TemplateFieldStore';
import {undefined} from 'zod';

export interface ITemplateStore extends ITemplate {
  isLoading: boolean;
  isLoaded: boolean;
  isError: boolean;
  error: any | null;
  roleNames: string[];

  pages: {sequence: number; template_id: string; document_id: string}[];
}

export type TTemplateStore = ObservableMap<ITemplateStore>;

const createTemplateStore = (templateId: string) => {
  const now = new Date().toISOString();
  return createStore<ITemplateStore>({
    isLoading: true,
    isLoaded: false,
    isError: false,
    error: null,
    roleNames: [],

    id: templateId,
    name: '',
    description: '',
    sender: 'envelope_creator',
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
    initial_reminder: 0,
    followup_reminders: 0,
    organization: null,
    roles: [],
    data: {},
    documents: [],
    fields: [],
    profile: null,
    search_key: '',
    tags: [],

    pages: [],
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

  if (created || forceReload) {
    console.debug('[TEMPLATES] Loading template', {templateId, created, forceReload});

    store.state.isLoading = true;
    store.state.isLoaded = false;
    store.state.isError = false;
    store.state.error = undefined;

    try {
      const template = await getTemplate(endpoint, templateId);

      // Post-process the template to upgrade to new data fields
      if (!template.documents && template.template_documents) {
        template.documents = template.template_documents;
      }

      template.documents?.forEach(document => {
        if (!document.order) {
          document.order = 0;
        }

        if (document.page_numbers) {
          document.pages = document.page_numbers;
        }
      });

      console.debug('[TEMPLATES] Got template', template);
      Object.assign(store.state, template);

      store.state.isLoaded = true;
      store.state.isError = false;
      store.state.error = undefined;
      createTemplateRoleStore(template);
      createTemplateFieldStore(template);
    } catch (e) {
      console.error('[TEMPLATES] Error loading template', e);

      store.state.isLoaded = false;
      store.state.isError = true;
      store.state.error = e;

      throw e;
    }

    store.state.isLoading = false;
  } else {
    // Just make sure they exist
    getTemplateRoleStore(templateId);
    getTemplateFieldStore(templateId);
  }

  return store;
};
