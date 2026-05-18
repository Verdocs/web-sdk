import type {IRole} from '@verdocs/js-sdk';

export interface FormattedRoleLine {
  name: string;
  type: string;
  sequence: number;
  order: number;
}

export const formatRolesForDisplay = (roles: IRole[] | undefined): FormattedRoleLine[] => {
  if (!roles?.length) {
    return [];
  }

  return [...roles]
    .sort((a, b) => (a.sequence === b.sequence ? a.order - b.order : a.sequence - b.sequence))
    .map(role => ({
      name: role.name,
      type: role.type ?? 'signer',
      sequence: role.sequence,
      order: role.order,
    }));
};

export const formatRolesAsText = (roles: IRole[] | undefined): string => {
  const lines = formatRolesForDisplay(roles);
  if (!lines.length) {
    return '(no roles on template yet)';
  }

  return lines.map(r => `${r.name} (${r.type}) — sequence ${r.sequence}, order ${r.order}`).join('\n');
};
