import {createStore} from '@stencil/store';
import {ObservableMap} from '@stencil/store';
import {IEnvelope, IEnvelopeField} from '@verdocs/js-sdk/Envelopes/Types';
import {ITemplate, ITemplateField} from '@verdocs/js-sdk/Templates/Types';

export type TTemplateFieldMap = Record<string, ITemplateField | IEnvelopeField>;

export type TTemplateFieldStore = ObservableMap<TTemplateFieldMap>;

const templateFieldStores: Record<string, TTemplateFieldStore> = {};

export const getTemplateFieldStore = (templateId: string) => templateFieldStores[templateId];

export const createTemplateFieldStore = (template: ITemplate) => {
  let store = getTemplateFieldStore(template.id);
  if (!store) {
    console.log('Creating template field store for template', template.id);
    store = createStore<TTemplateFieldMap>({});
    templateFieldStores[template.id] = store;
  } else {
    console.log('Resetting template field store for template', template.id);
    store.reset();
  }

  template.fields.forEach(field => {
    store.set(field.name, field);
  });

  return store;
};

export const createTemplateFieldStoreFromEnvelope = (envelope: IEnvelope) => {
  let store = getTemplateFieldStore(envelope.template_id);
  if (!store) {
    console.log('Creating field store for envelope', envelope.id, envelope.template_id);
    store = createStore<TTemplateFieldMap>({});
    templateFieldStores[envelope.template_id] = store;
  } else {
    console.log('Resetting field store for envelope', envelope.id, envelope.template_id);
    store.reset();
  }

  envelope.fields.forEach(field => {
    store.set(field.name, field);
  });

  return store;
};
