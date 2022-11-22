// These should probably all move to JS-SDK
import {rescale} from '@verdocs/js-sdk/Utils/Fields';
import {getRGBA} from '@verdocs/js-sdk/Utils/Colors';
import {ITemplateField} from '@verdocs/js-sdk/Templates/Types';
import {IDocumentField} from '@verdocs/js-sdk/Documents/Types';
import {IDocumentPageInfo} from './Types';

export const integerSequence = (start: number, count: number): number[] =>
  Array(count)
    .fill(1)
    .map((_, index) => index + start);

export const fullNameToInitials = (name: string) =>
  name
    .split(' ')
    .map(word => word[0])
    .join('');

export const defaultWidth = (field: ITemplateField | IDocumentField) => {
  switch (field.type) {
    case 'attachment':
    case 'payment':
      return 24;
    case 'checkbox':
    case 'checkbox_group':
    case 'radio_button_group':
      return 14;
    case 'signature':
    case 'initial':
      return 82;
  }

  return 150;
};

export const defaultHeight = (field: ITemplateField | IDocumentField) => {
  switch (field.type) {
    case 'attachment':
    case 'payment':
      return 24;
    case 'checkbox':
    case 'checkbox_group':
    case 'radio_button_group':
      return 14;
    case 'signature':
    case 'initial':
      return 41;
  }

  return 50;
};

export const setControlStyles = (el: HTMLElement, field: ITemplateField | IDocumentField, xScale: number, yScale: number, roleIndex: number, option?: number) => {
  const settings = (field as ITemplateField).setting || (field as IDocumentField).settings;
  let {x = 0, y = 0, width = defaultWidth(field), height = defaultHeight(field)} = settings;

  const optionSettings = option !== undefined && settings.options[option] ? settings.options[option] : null;
  if (optionSettings) {
    x = optionSettings.x ?? x;
    y = optionSettings.y ?? y;
    width = optionSettings.width ?? width;
    height = optionSettings.height ?? height;
  }

  el.style.width = `${width}px`;
  el.style.height = `${height}px`;
  el.style.position = 'absolute';
  el.style.left = `${rescale(xScale, x)}px`;
  el.style.bottom = `${rescale(yScale, y)}px`;
  el.style.transform = `scale(${xScale}, ${yScale})`;
  el.style.backgroundColor = field['rgba'] || getRGBA(roleIndex);
};

export const getFieldId = (field: ITemplateField | IDocumentField) => {
  return `verdocs-doc-fld-${field.name}`;
};

export const getFieldOptionId = (field: ITemplateField, index: number) => {
  return `verdocs-doc-fld-${field.name}-${index}`;
};

export const renderDocumentField = (
  field: ITemplateField,
  docPage: IDocumentPageInfo,
  roleIndex: number,
  handleFieldChange: (field: ITemplateField, e: any, optionId?: string) => void,
  disabled: boolean,
  editable: boolean = false,
  draggable: boolean = false,
) => {
  const controlsDiv = document.getElementById(docPage.containerId + '-controls');
  if (!controlsDiv) {
    return;
  }

  switch (field.type) {
    case 'attachment':
    case 'date':
    case 'dropdown':
    case 'initial':
    case 'payment':
    case 'signature':
    case 'timestamp':
    case 'textarea':
    case 'textbox':
      {
        const id = getFieldId(field);
        const existingField = document.getElementById(id);
        if (existingField) {
          setControlStyles(existingField, field, docPage.xScale, docPage.yScale, roleIndex);
          return;
        }

        const el: any = document.createElement(`verdocs-field-${field.type}`);
        el.field = field;
        el.setAttribute('id', id);
        if (disabled) {
          el.setAttribute('disabled', true);
        }
        if (editable) {
          el.setAttribute('editable', true);
        }
        if (draggable) {
          el.setAttribute('draggable', true);
        }
        el.addEventListener('fieldChange', e => handleFieldChange(field, e));
        setControlStyles(el, field, docPage.xScale, docPage.yScale, roleIndex);
        controlsDiv.appendChild(el);

        return el;
      }

    case 'checkbox_group':
      field.setting.options.forEach((_, checkboxIndex) => {
        const id = getFieldOptionId(field, checkboxIndex);
        const existingField = document.getElementById(id);
        if (existingField) {
          setControlStyles(existingField, field, docPage.xScale, docPage.yScale, roleIndex, checkboxIndex);
          return;
        }

        const cbEl: any = document.createElement(`verdocs-field-checkbox`);
        cbEl.field = field;
        cbEl.setAttribute('id', id);
        cbEl.setAttribute('option', checkboxIndex);
        if (disabled) {
          cbEl.setAttribute('disabled', true);
        }
        cbEl.addEventListener('fieldChange', e => handleFieldChange(field, e));
        setControlStyles(cbEl, field, docPage.xScale, docPage.yScale, roleIndex, checkboxIndex);
        controlsDiv.appendChild(cbEl);

        return cbEl;
      });

      break;

    case 'radio_button_group':
      field.setting.options.forEach((_, buttonIndex) => {
        const id = getFieldOptionId(field, buttonIndex);
        const existingField = document.getElementById(id);
        if (existingField) {
          setControlStyles(existingField, field, docPage.xScale, docPage.yScale, roleIndex, buttonIndex);
          return;
        }

        const cbEl: any = document.createElement(`verdocs-field-radio-button`);
        cbEl.field = field;
        cbEl.setAttribute('id', id);
        cbEl.setAttribute('option', buttonIndex);
        if (disabled) {
          cbEl.setAttribute('disabled', true);
        }
        cbEl.addEventListener('fieldChange', e => handleFieldChange(field, e));
        setControlStyles(cbEl, field, docPage.xScale, docPage.yScale, roleIndex, buttonIndex);
        controlsDiv.appendChild(cbEl);

        return cbEl;
      });

      break;

    // case 'attachment':
    //   el = document.createElement('verdocs-field-attachment');
    //   el.setAttribute('value', result || '');
    //   break;
    // case 'payment':
    //   el = document.createElement('verdocs-field-payment');
    //   break;
    default:
      console.log('[PREVIEW] Skipping unsupported field type', field);
      return null;
  }
};

export const getRoleIndex = (roles: string[], role: string) => roles.indexOf(role) || 0;

// TODO: We can clean this up a lot if we alter the API to emit both setting and settings regardless of the source type,
//   but then merge the SDK types to encourage developers to use just `settings`.
export const getFieldSettings = (field: ITemplateField | IDocumentField) => {
  if ((field as ITemplateField).setting) {
    return (field as ITemplateField).setting;
  }

  if ((field as IDocumentField).settings) {
    return (field as IDocumentField).settings;
  }

  return {x: 0, y: 0, required: false, disabled: false, result: '', value: ''};
};
