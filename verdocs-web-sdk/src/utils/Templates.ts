import {ITemplate} from '@verdocs/js-sdk';

export const getRoleNames = (template: ITemplate | null) => (template?.roles || []).map(role => role.name);

export const getRoleIndex = (template: ITemplate | null, role_name: string) =>
  Math.max(
    getRoleNames(template).findIndex(name => name === role_name),
    0,
  );
