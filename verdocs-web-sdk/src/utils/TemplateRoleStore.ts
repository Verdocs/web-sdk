import {createStore, ObservableMap} from '@stencil/store';
import {IRole, ITemplate} from '@verdocs/js-sdk';

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

  const roles = [...(template.roles || [])];
  roles.sort((a, b) => {
    if (a.sequence !== b.sequence) {
      return a.sequence - b.sequence;
    }
    return a.order - b.order;
  });
  store.set('roles', roles);

  return store;
};

export const updateStoreRole = (store: TTemplateRoleStore, name: string, newRoleData: Record<string, any>) => {
  console.log('[ROLES] Updating store role', name, newRoleData);
  const newRoles = [
    ...(store.get('roles') || []).map(role => {
      if (role.name !== name) {
        return role;
      }
      return {...role, ...newRoleData};
    }),
  ];

  store.set('roles', newRoles);
};

export const deleteStoreRole = (store: TTemplateRoleStore, name: string) => {
  console.log('[ROLES] Deleting store role', name);
  const newRoles = [...(store?.get('roles') || []).filter(field => field.name !== name)];
  store.set('roles', newRoles);
};

export const getRoleNames = (store: TTemplateRoleStore) => (store?.get('roles') || []).map(role => role.name);

export const getRoleIndex = (store: TTemplateRoleStore, name: string) => {
  return Math.max(
    getRoleNames(store).findIndex(roleName => roleName === name),
    0,
  );
};
