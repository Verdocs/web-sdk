import {createStore, ObservableMap} from '@stencil/store';
import {IRole, ITemplate} from '@verdocs/js-sdk/Templates/Types';

export type TTemplateRoleMap = Record<string, IRole>;

export type TTemplateRoleStore = ObservableMap<TTemplateRoleMap>;

const templateRoleStores: Record<string, TTemplateRoleStore> = {};

export const getTemplateRoleStore = (templateId: string) => templateRoleStores[templateId];

export const createTemplateRoleStore = (template: ITemplate) => {
  let store = getTemplateRoleStore(template.id);
  if (!store) {
    console.log('Creating template role store for template', template.id);
    store = createStore<TTemplateRoleMap>({});
    templateRoleStores[template.id] = store;
  } else {
    console.log('Resetting template role store for template', template.id);
    store.reset();
  }

  template.roles.forEach(role => {
    store.set(role.name, role);
  });

  return store;
};
