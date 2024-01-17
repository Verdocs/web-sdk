import {createStore} from '@stencil/store';
import {ObservableMap} from '@stencil/store';
import {IEnvelope} from '@verdocs/js-sdk/Envelopes/Types';
import {ITemplate, ITemplateField} from '@verdocs/js-sdk/Templates/Types';

export type TTemplateFieldStore = ObservableMap<{fields: ITemplateField[]}>;

const templateFieldStores: Record<string, TTemplateFieldStore> = {};

export const getTemplateFieldStore = (templateId: string) => templateFieldStores[templateId];

export const createTemplateFieldStore = (template: ITemplate) => {
  let store = getTemplateFieldStore(template.id);
  if (!store) {
    console.log('Creating template field store for template', template);
    store = createStore({fields: []});
    templateFieldStores[template.id] = store;
  } else {
    console.log('Resetting template field store for template', template);
    store.reset();
  }

  store.set('fields', [...template.fields]);

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

export const updateStoreField = (store: TTemplateFieldStore, name: string, newFieldData: Record<string, any>) => {
  const newFields = [
    ...store.get('fields').map(field => {
      if (field.name !== name) {
        return field;
      }
      return {...field, ...newFieldData};
    }),
  ];

  store.set('fields', newFields);
};

export const deleteStoreField = (store: TTemplateFieldStore, name: string) => {
  const newFields = [...store.get('fields').filter(field => field.name !== name)];
  store.set('fields', newFields);
};
