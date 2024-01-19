import {createStore, ObservableMap} from '@stencil/store';
import {IRole, ITemplate} from '@verdocs/js-sdk/Templates/Types';

export type TTemplateRoleStore = ObservableMap<{roles: IRole[]}>;

const templateRoleStores: Record<string, TTemplateRoleStore> = {};

export const getTemplateRoleStore = (templateId: string) => {
  if (!templateRoleStores[templateId]) {
    templateRoleStores[templateId] = createStore({roles: []});
  }

  return templateRoleStores[templateId];
};

export const createTemplateRoleStore = (template: ITemplate) => {
  let store = getTemplateRoleStore(template.id);
  if (!store) {
    console.log('Creating template role store for template', template);
    store = createStore({roles: []});
    templateRoleStores[template.id] = store;
  }

  store.set('roles', [...template.roles]);

  return store;
};

export const updateStoreRole = (store: TTemplateRoleStore, name: string, newRoleData: Record<string, any>) => {
  const newRoles = [
    ...store.get('roles').map(role => {
      if (role.name !== name) {
        return role;
      }
      return {...role, ...newRoleData};
    }),
  ];

  store.set('roles', newRoles);
};

export const deleteStoreRole = (store: TTemplateRoleStore, name: string) => {
  const newRoles = [...store.get('roles').filter(field => field.name !== name)];
  store.set('roles', newRoles);
};

export const getRoleNames = (store: TTemplateRoleStore) => store.get('roles').map(role => role.name);
export const getRoleIndex = (store: TTemplateRoleStore, name: string) => {
  console.log(
    'gri',
    name,
    getRoleNames(store),
    getRoleNames(store).findIndex(roleName => roleName === name),
  );
  return getRoleNames(store).findIndex(roleName => roleName === name);
};
