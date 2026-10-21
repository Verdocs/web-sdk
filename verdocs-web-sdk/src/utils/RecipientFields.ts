import {ITemplate, ITemplateField, TFieldType} from '@verdocs/js-sdk';
import {LockIcon} from './Icons';

export const FIELD_TYPES: {type: TFieldType; label: string; icon: string}[] = [
  {
    type: 'signature',
    label: 'Signature',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m9.225 21.225 4.65-4.65h8.45v4.65Zm-5.35-2.2H5.05l8.5-8.5-1.175-1.175-8.5 8.5Zm14.25-9.95L13.8 4.8l1.325-1.325q.625-.65 1.525-.663.9-.012 1.6.663l1.225 1.175q.675.675.663 1.562-.013.888-.663 1.513ZM16.7 10.55 6 21.225H1.675V16.9L12.35 6.225Z"/></svg>',
  },
  {
    type: 'initial',
    label: 'Initials',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M6.225 20.775V7h-5V3.225H15V7h-5v13.775Zm9.775 0v-8h-3V9h9.775v3.775h-3v8Z"/></svg>',
  },
  {
    type: 'textbox',
    label: 'Text box',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M3.425 16.15V13h11.15v3.15Zm0-5.15V7.85h17.15V11Z"/></svg>',
  },
  {
    type: 'date',
    label: 'Date',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M5.3 22.85q-1.325 0-2.238-.912-.912-.913-.912-2.238V6.3q0-1.325.912-2.238.913-.912 2.238-.912H6v-2h2.575v2h6.85v-2H18v2h.7q1.325 0 2.238.912.912.913.912 2.238v13.4q0 1.325-.912 2.238-.913.912-2.238.912Zm0-3.15h13.4V10H5.3v9.7ZM5.3 8h13.4V6.3H5.3Z"/></svg>',
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m10.55 16.55 7.275-7.275L16.05 7.5l-5.5 5.45-2.675-2.65L6.1 12.075Zm-5.375 4.925q-1.125 0-1.887-.763-.763-.762-.763-1.887V5.175q0-1.125.763-1.888.762-.762 1.887-.762h13.65q1.125 0 1.888.762.762.763.762 1.888v13.65q0 1.125-.762 1.887-.763.763-1.888.763Zm0-2.65h13.65V5.175H5.175v13.65Z"/></svg>',
  },
  {
    type: 'radio',
    label: 'Radio button',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17q2.075 0 3.538-1.463Q17 14.075 17 12t-1.462-3.538Q14.075 7 12 7 9.925 7 8.463 8.462 7 9.925 7 12q0 2.075 1.463 3.537Q9.925 17 12 17Zm0 5.85q-2.275 0-4.25-.85t-3.438-2.312Q2.85 18.225 2 16.25q-.85-1.975-.85-4.25T2 7.75q.85-1.975 2.312-3.438Q5.775 2.85 7.75 2q1.975-.85 4.25-.85t4.25.85q1.975.85 3.438 2.312Q21.15 5.775 22 7.75q.85 1.975.85 4.25T22 16.25q-.85 1.975-2.312 3.438Q18.225 21.15 16.25 22q-1.975.85-4.25.85Zm0-3.15q3.25 0 5.475-2.225Q19.7 15.25 19.7 12q0-3.25-2.225-5.475Q15.25 4.3 12 4.3q-3.25 0-5.475 2.225Q4.3 8.75 4.3 12q0 3.25 2.225 5.475Q8.75 19.7 12 19.7Z"/></svg>',
  },
  {
    type: 'dropdown',
    label: 'Dropdown',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25" /></svg>',
  },
  {
    type: 'attachment',
    label: 'Attachment',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" /></svg>',
  },
];

// A radio's group is every radio with the same group and recipient, in reading order. A radio without a group stands alone.
export const radioGroup = (fields: ITemplateField[] | null | undefined, field: ITemplateField) =>
  field.type !== 'radio' || !field.group
    ? [field]
    : (fields || [])
        .filter(other => other.type === 'radio' && other.group === field.group && other.role_name === field.role_name)
        .sort((a, b) => (a.page || 0) - (b.page || 0) || (b.y || 0) - (a.y || 0) || (a.x || 0) - (b.x || 0));

// Recipients take their color from the role's position in the template, repeating after eight.
export const recipientNumber = (roles: {name: string}[] | null | undefined, roleName: string) =>
  (Math.max((roles || []).findIndex(role => role.name === roleName), 0) % 8) + 1;

/**
 * Draws a field in its recipient's color with its icon, label, badges, and recipient number (shown in high contrast), in
 * place of the signing theme. The field component's own content stays underneath, invisible, so its resize edges and
 * pointer handling keep working. Leave out the scale to keep the one already set.
 */
export const drawRecipientField = (el: HTMLElement, field: ITemplateField, template: Pick<ITemplate, 'roles' | 'fields'> | null | undefined, scale?: number) => {
  const n = recipientNumber(template?.roles, field.role_name);
  const toggle = field.type === 'checkbox' || field.type === 'radio';
  const fieldType = FIELD_TYPES.find(fieldType => fieldType.type === field.type) || FIELD_TYPES.find(fieldType => fieldType.type === 'textbox');
  const label = toggle ? '' : field.label || field.placeholder || fieldType.label;
  // A radio group shows its recipient number once, on its first option.
  const marker = radioGroup(template?.fields, field)[0]?.name === field.name;
  const key = [n, field.type, label, field.required, field.readonly, marker].join('|');

  el.classList.add('vb-field');
  el.style.setProperty('--vb-color', `var(--verdocs-recipient-${n})`);
  el.style.setProperty('--vb-text', `var(--verdocs-recipient-${n}-text)`);
  if (scale) {
    el.style.setProperty('--vb-scale', String(scale));
  }

  let face = el.querySelector<HTMLElement>('.vb-face');
  if (face?.dataset.key === key) {
    return;
  }

  if (!face) {
    face = document.createElement('span');
    face.className = 'vb-face';
    el.appendChild(face);
  }

  face.dataset.key = key;
  face.classList.toggle('has-badges', !!field.readonly);
  face.textContent = '';

  if (!toggle) {
    const icon = document.createElement('span');
    icon.className = 'vb-icon';
    icon.innerHTML = fieldType.icon;
    const text = document.createElement('span');
    text.className = 'vb-label';
    text.textContent = label;
    face.append(icon, text);
  }

  if (marker) {
    const number = document.createElement('span');
    number.className = 'vb-marker';
    number.textContent = String(n);
    face.append(number);
  }

  if (field.required) {
    const req = document.createElement('span');
    req.className = 'vb-req';
    req.textContent = '*';
    face.append(req);
  }

  if (field.readonly) {
    const badges = document.createElement('span');
    badges.className = 'vb-badges';
    badges.innerHTML = `<i title="Read-only">${LockIcon}</i>`;
    face.append(badges);
  }

  const handle = document.createElement('span');
  handle.className = 'vb-handle';
  face.append(handle);
};
