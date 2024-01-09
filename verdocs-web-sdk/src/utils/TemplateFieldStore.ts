import {createStore} from '@stencil/store';
import {ObservableMap} from '@stencil/store';
import {ITemplate, ITemplateField} from '@verdocs/js-sdk/Templates/Types';

export type TTemplateFieldMap = Record<string, ITemplateField>;

export type TTemplateFieldStore = ObservableMap<TTemplateFieldMap>;

const templateFieldStores: Record<string, TTemplateFieldStore> = {};

export const getTemplateFieldStore = (templateId: string) => templateFieldStores[templateId];

export const createTemplateFieldStore = (template: ITemplate) => {
  console.log('Creating template field store for template: ', template);
  let store = getTemplateFieldStore(template.id);
  if (!store) {
    store = createStore<TTemplateFieldMap>({});
    templateFieldStores[template.id] = store;
  } else {
    store.reset();
  }

  template.fields.forEach(field => {
    store.set(field.name, field);
  });

  return store;
};
