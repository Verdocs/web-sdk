// These should probably all move to JS-SDK
import {rescale} from '@verdocs/js-sdk/Utils/Fields';
// import {getRGBA} from '@verdocs/js-sdk/Utils/Colors';
import {ITemplateField} from '@verdocs/js-sdk/Templates/Types';
import {IDocumentField} from '@verdocs/js-sdk/Envelopes/Types';
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

export const setControlStyles = (el: HTMLElement, field: ITemplateField | IDocumentField, xScale: number, yScale: number, option?: number) => {
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
  // el.style.backgroundColor = field['rgba'] || getRGBA(roleIndex);
};

export const getFieldId = (field: ITemplateField | IDocumentField) => {
  return `verdocs-doc-fld-${field.name}`;
};

export const getFieldOptionId = (field: ITemplateField | IDocumentField, index: number) => {
  return `verdocs-doc-fld-${field.name}-${index}`;
};

interface IFieldOptions {
  disabled?: boolean;
  editable?: boolean;
  draggable?: boolean;
}

export const renderDocumentField = (field: ITemplateField | IDocumentField, docPage: IDocumentPageInfo, roleIndex: number, fieldOptions: IFieldOptions) => {
  const {disabled = false, editable = false, draggable = false} = fieldOptions;
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
    case 'textbox': {
      const id = getFieldId(field);
      const existingField = document.getElementById(id);
      if (existingField) {
        setControlStyles(existingField, field, docPage.xScale, docPage.yScale);
        return;
      }

      const el: any = document.createElement(`verdocs-field-${field.type}`);
      el.field = field;
      el.setAttribute('id', id);
      el.setAttribute('roleindex', roleIndex);
      if (disabled) {
        el.setAttribute('disabled', true);
      }
      if (editable) {
        el.setAttribute('editable', true);
      }
      if (draggable) {
        el.setAttribute('draggable', true);
      }
      setControlStyles(el, field, docPage.xScale, docPage.yScale);
      controlsDiv.appendChild(el);

      return el;
    }

    case 'checkbox_group':
      ((field as any).settings || (field as any).setting || {}).options.forEach((_, checkboxIndex) => {
        const id = getFieldOptionId(field, checkboxIndex);
        const existingField = document.getElementById(id);
        if (existingField) {
          setControlStyles(existingField, field, docPage.xScale, docPage.yScale);
          return;
        }

        const cbEl: any = document.createElement(`verdocs-field-checkbox`);
        cbEl.field = field;
        cbEl.setAttribute('id', id);
        cbEl.setAttribute('roleindex', roleIndex);
        cbEl.setAttribute('option', checkboxIndex);
        if (disabled) {
          cbEl.setAttribute('disabled', true);
        }
        setControlStyles(cbEl, field, docPage.xScale, docPage.yScale, checkboxIndex);
        controlsDiv.appendChild(cbEl);

        return cbEl;
      });

      break;

    case 'radio_button_group':
      ((field as any).settings || (field as any).setting || {}).options.forEach((_, buttonIndex) => {
        const id = getFieldOptionId(field, buttonIndex);
        const existingField = document.getElementById(id);
        if (existingField) {
          setControlStyles(existingField, field, docPage.xScale, docPage.yScale);
          return;
        }

        const cbEl: any = document.createElement(`verdocs-field-radio-button`);
        cbEl.field = field;
        cbEl.setAttribute('id', id);
        cbEl.setAttribute('roleindex', roleIndex);
        cbEl.setAttribute('option', buttonIndex);
        if (disabled) {
          cbEl.setAttribute('disabled', true);
        }
        setControlStyles(cbEl, field, docPage.xScale, docPage.yScale, buttonIndex);
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

/**
 * Helper function to safely set/update components in a CSS transform attribute. Transform is normally set as a string of
 * `operation1(param) operation2(param) ...` components, which makes updating them a bit of a pain. This will remove the
 * specified component if it's already set and replace it with the new value, without touching the other components that
 * may already be set. Note that this operation moves the component to the end of the transform chain so it's not meant
 * to be used for order-sensitive components e.g. translate-then-rotate.
 */
export const updateCssTransform = (el: HTMLElement, key: string, value: string) => {
  // e.g. 'scale(1.87908, 1.87908) translate(0px, 0px);'
  const currentTransform = el.style.transform;
  // e.g. ['scale(1.87908, 1.87908)', 'scale', '1.87908, 1.87908', ...], [ 'translate(0px, 0px)', 'translate', '0px, 0px']]
  const components = [...currentTransform.matchAll(/(\w+)\(([^)]*)\)/gi)];
  el.style.transform = [
    components //
      .filter(component => component[1] !== key) // Remove the entry if it's already set
      .map(component => component[0]), // Convert back the remaining entries
    `${key}(${value})`,
  ].join(' ');
};
