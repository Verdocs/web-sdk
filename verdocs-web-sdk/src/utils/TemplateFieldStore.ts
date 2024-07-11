import {createStore} from '@stencil/store';
import {ObservableMap} from '@stencil/store';
import {IEnvelope, ITemplate, ITemplateField} from '@verdocs/js-sdk';

export type TTemplateFieldStore = ObservableMap<{fields: ITemplateField[]}>;

const templateFieldStores: Record<string, TTemplateFieldStore> = {};

export const getTemplateFieldStore = (templateId: string) => {
  if (!templateFieldStores[templateId]) {
    console.log('Creating template field store', templateId);
    templateFieldStores[templateId] = createStore({fields: []});
  }

  return templateFieldStores[templateId];
};

export const createTemplateFieldStore = (template: ITemplate) => {
  let store = getTemplateFieldStore(template.id);
  store.set('fields', [...template.fields.map(field => ({...field, page: field.page || (field as any).page_sequence}))]);

  return store;
};

export const createTemplateFieldStoreFromEnvelope = (envelope: IEnvelope) => {
  let store = getTemplateFieldStore(envelope.template_id);
  if (!store) {
    console.log('Creating field store for envelope', envelope.id, envelope.template_id);
    store = createStore({fields: [] as ITemplateField[]});
    templateFieldStores[envelope.template_id] = store;
  } else {
    console.log('Resetting field store for envelope', envelope.id, envelope.template_id);
    store.reset();
  }

  store.set('fields', [...(envelope.fields as any[])]);

  return store;
};

export const updateStoreField = (store: TTemplateFieldStore, oldName: string, newFieldData: ITemplateField) => {
  const oldFields = store.get('fields') || [];
  if (oldName !== newFieldData.name) {
    console.log('Renaming', oldName, newFieldData.name);
    const withoutOldField = oldFields.filter(field => field.name !== oldName);
    store.set('fields', [...withoutOldField, newFieldData]);
  } else {
    console.log('Updating', oldName);
    store.set(
      'fields',
      oldFields.map(field => (field.name === oldName ? {...field, ...newFieldData} : {...field})),
    );
  }
};
