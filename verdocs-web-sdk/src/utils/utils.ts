import jszip from 'jszip';
import {format} from 'date-fns';
import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Envelopes} from '@verdocs/js-sdk/Envelopes';
import {rescale} from '@verdocs/js-sdk/Utils/Fields';
import {downloadBlob} from '@verdocs/js-sdk/Utils/Files';
import {ITemplateField} from '@verdocs/js-sdk/Templates/Types';
import {IEnvelopeField, IEnvelope, TDocumentFieldType} from '@verdocs/js-sdk/Envelopes/Types';
import {IDocumentPageInfo} from './Types';

export const defaultWidth = (type: TDocumentFieldType) => {
  // checkbox was a legacy field type
  switch (type as TDocumentFieldType | 'checkbox' | string) {
    case 'textarea':
      return 150;
    case 'textbox':
      return 150;
    case 'timestamp':
      return 64;
    case 'date':
      return 84;
    case 'dropdown':
      return 85;
    case 'attachment':
    case 'payment':
      return 24;
    case 'checkbox':
    case 'checkbox_group':
    case 'radio_button_group':
      return 14;
    case 'signature':
    case 'initial':
      // TODO: Review this. 71 seems to line up better with the final render.
      return 71;
    // return 82;
  }

  return 150;
};

export const defaultHeight = (type: TDocumentFieldType) => {
  switch (type as TDocumentFieldType | 'checkbox' | string) {
    case 'textarea':
      return 41;
    case 'textbox':
      return 15;
    case 'timestamp':
      return 15;
    case 'date':
      return 15;
    case 'dropdown':
      return 20;
    case 'attachment':
    case 'payment':
      return 24;
    case 'checkbox':
    case 'checkbox_group':
    case 'radio_button_group':
      return 14;
    case 'signature':
    case 'initial':
      // TODO: Review this. 71 seems to line up better with the final render.
      return 36;
    // return 41;
  }

  return 50;
};

export const setControlStyles = (el: HTMLElement, field: ITemplateField | IEnvelopeField, xScale: number, yScale: number, option?: number) => {
  const settings = (field as ITemplateField).setting || (field as IEnvelopeField).settings;
  let {x = 0, y = 0, width = defaultWidth(field.type), height = defaultHeight(field.type)} = settings;

  const optionSettings = settings.options && option !== undefined && settings.options[option] ? settings.options[option] : null;
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

export const getFieldId = (field: ITemplateField | IEnvelopeField) => {
  return `verdocs-doc-fld-${field.name}`;
};

export const getFieldOptionId = (field: ITemplateField | IEnvelopeField, index: number) => {
  return `verdocs-doc-fld-${field.name}-${index}`;
};

interface IFieldOptions {
  disabled?: boolean;
  editable?: boolean;
  draggable?: boolean;
  done?: boolean;
}

export const updateDocumentFieldValue = (field: ITemplateField | IEnvelopeField) => {
  const id = getFieldId(field);
  const existingField = document.getElementById(id) as any;
  if (existingField) {
    existingField.field = field;
    existingField.setAttribute('id', id); // We need this to trigger a re-render
    existingField.setAttribute('disabled', true); // We need this to trigger a re-render
    existingField.setAttribute('disabled', false); // We need this to trigger a re-render
  }
};

export const renderDocumentField = (field: ITemplateField | IEnvelopeField, docPage: IDocumentPageInfo, roleIndex: number, fieldOptions: IFieldOptions) => {
  const {disabled = false, editable = false, draggable = false, done = false} = fieldOptions;
  const controlsDiv = document.getElementById(docPage.containerId + '-controls');
  if (!controlsDiv) {
    console.log('[renderDocumentField] No controls DIV found', docPage.containerId + '-controls', docPage);
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
        return existingField;
      }

      let {type} = field;
      if (type === 'textbox') {
        console.log('Rendering text box', field);
        if (field['setting']?.leading > 0 || field['settings']?.leading > 0) {
          console.log('Switching to text area', field);
          type = 'textarea';
        }
      }

      const el: any = document.createElement(`verdocs-field-${type}`);
      el.field = field;
      el.setAttribute('id', id);
      el.setAttribute('roleIndex', roleIndex);

      if (disabled) {
        el.setAttribute('tabindex', -1);
        el.setAttribute('disabled', true);
      } else {
        el.setAttribute('tabIndex', 1);
      }

      if (editable) {
        el.setAttribute('editable', true);
      }

      if (draggable) {
        el.setAttribute('draggable', true);
      }

      if (done) {
        el.setAttribute('done', true);
      }

      setControlStyles(el, field, docPage.xScale, docPage.yScale);
      controlsDiv.appendChild(el);

      return el;
    }

    // @ts-ignore
    case 'checkbox':
      const id = getFieldOptionId(field, 0);
      const existingField = document.getElementById(id);
      if (existingField) {
        setControlStyles(existingField, field, docPage.xScale, docPage.yScale, 0);
        return existingField;
      }

      const cbEl: any = document.createElement(`verdocs-field-checkbox`);
      cbEl.field = field;
      cbEl.setAttribute('id', id);
      cbEl.setAttribute('roleIndex', roleIndex);
      cbEl.setAttribute('option', 0);
      if (disabled) {
        cbEl.setAttribute('disabled', true);
      }
      if (done) {
        cbEl.setAttribute('done', true);
      }
      if (editable) {
        cbEl.setAttribute('editable', true);
      }
      if (draggable) {
        cbEl.setAttribute('draggable', true);
      }
      setControlStyles(cbEl, field, docPage.xScale, docPage.yScale, 0);
      controlsDiv.appendChild(cbEl);

      return cbEl;

    case 'checkbox_group':
      return ((field as any).settings || (field as any).setting || {}).options.map((_, checkboxIndex) => {
        const id = getFieldOptionId(field, checkboxIndex);
        const existingField = document.getElementById(id);
        if (existingField) {
          setControlStyles(existingField, field, docPage.xScale, docPage.yScale, checkboxIndex);
          return existingField;
        }

        const cbEl: any = document.createElement(`verdocs-field-checkbox`);
        cbEl.field = field;
        cbEl.setAttribute('id', id);
        cbEl.setAttribute('roleIndex', roleIndex);
        cbEl.setAttribute('option', checkboxIndex);
        if (disabled) {
          cbEl.setAttribute('disabled', true);
        }
        if (done) {
          cbEl.setAttribute('done', true);
        }
        if (editable) {
          cbEl.setAttribute('editable', true);
        }
        if (draggable) {
          cbEl.setAttribute('draggable', true);
        }
        setControlStyles(cbEl, field, docPage.xScale, docPage.yScale, checkboxIndex);
        controlsDiv.appendChild(cbEl);

        return cbEl;
      });

    case 'radio_button_group':
      return ((field as any).settings || (field as any).setting || {}).options.map((_, buttonIndex) => {
        const id = getFieldOptionId(field, buttonIndex);
        const existingField = document.getElementById(id);
        if (existingField) {
          setControlStyles(existingField, field, docPage.xScale, docPage.yScale, buttonIndex);
          return existingField;
        }

        const radioEl: any = document.createElement(`verdocs-field-radio-button`);
        radioEl.field = field;
        radioEl.setAttribute('id', id);
        radioEl.setAttribute('roleIndex', roleIndex);
        radioEl.setAttribute('option', buttonIndex);
        if (disabled) {
          radioEl.setAttribute('disabled', true);
        }
        if (done) {
          radioEl.setAttribute('done', true);
        }
        if (editable) {
          radioEl.setAttribute('editable', true);
        }
        if (draggable) {
          radioEl.setAttribute('draggable', true);
        }

        setControlStyles(radioEl, field, docPage.xScale, docPage.yScale, buttonIndex);
        controlsDiv.appendChild(radioEl);

        return radioEl;
      });

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
export const getFieldSettings = (field: ITemplateField | IEnvelopeField) => {
  if ((field as ITemplateField).setting) {
    return (field as ITemplateField).setting;
  }

  if ((field as IEnvelopeField).settings) {
    return (field as IEnvelopeField).settings;
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
  // console.log('update', key, value, el.style.transform);
  // e.g. 'scale(1.87908, 1.87908) translate(0px, 0px);'

  const currentTransform = el.style.transform || '';

  const newValue = `${key}(${value})`;
  if (currentTransform.includes(key)) {
    // console.log('updating', currentTransform, currentTransform.replace(new RegExp(`${key}\(.+?\)`), newValue));
    el.style.transform = currentTransform.replace(new RegExp(`${key}\\(.+?\\)`), newValue);
  } else {
    // console.log('appending', currentTransform, currentTransform + ' ' + newValue);
    el.style.transform = currentTransform + ' ' + newValue;
  }

  // console.log('now', el.style.transform);
};

export const formatLocalDate = (date: Date) => format(date, 'P').replace(/\//g, '-');

const formatEnvelopeDate = (envelope: IEnvelope) => formatLocalDate(new Date(envelope.updated_at));

export const saveAttachment = async (endpoint: VerdocsEndpoint, envelope: IEnvelope, documentId: string) => {
  // e.g. "Colorado-Motor-Vehicle-Bill-of-Sale.pdf"
  const fileName = `${envelope.name} - ${formatEnvelopeDate(envelope)}.pdf`;
  const data = await Envelopes.getEnvelopeFile(endpoint, envelope.id, documentId);
  downloadBlob(data, fileName);
};

export const saveCertificate = async (endpoint: VerdocsEndpoint, envelope: IEnvelope, documentId: string) => {
  // e.g "Colorado Motor Vehicle Bill of Sale_certificate.pdf"
  const fileName = `${envelope.name} - ${formatEnvelopeDate(envelope)}_certificate.pdf`;
  const data = await Envelopes.getEnvelopeFile(endpoint, envelope.id, documentId);
  downloadBlob(data, fileName);
};

export const saveEnvelopesAsZip = async (endpoint: VerdocsEndpoint, envelopes: IEnvelope[]) => {
  const zip = new jszip();

  for await (let envelope of envelopes) {
    // e.g. "98a13bc0-8861-4408-86fc-8f9af51e867a-TheSwanBrothers Phase 1 Agreement - 11-02-22"
    const subFolder = envelopes.length > 0 ? zip.folder(`${envelope.id} - ${envelope.name} - ${formatEnvelopeDate(envelope)}`) : null;
    for await (let document of envelope.documents) {
      // TODO: When attachments are added to envelopes, add a field that reflects the full, original filename (including extension)
      const documentFileName = document.type === 'certificate' ? `${envelope.name}_certificate.pdf` : `${document.name}.pdf`;
      const data = await Envelopes.getEnvelopeFile(endpoint, envelope.id, document.id);

      if (subFolder) {
        subFolder.file(documentFileName, data, {compression: 'DEFLATE'});
      } else {
        zip.file(documentFileName, data, {compression: 'DEFLATE'});
      }

      const attachFields = envelope.fields.filter(field => field.type === 'attachment' && field.settings['name']);
      if (attachFields.length > 0) {
        const attachmentsFolder = subFolder ? subFolder.folder('attachments') : zip.folder('attachments');
        for await (let attachField of attachFields) {
          const attachData = await Envelopes.getFieldAttachment(endpoint, envelope.id, attachField.name);
          attachmentsFolder.file(attachField.settings.name, attachData, {compression: 'DEFLATE'});
        }
      }
    }
  }

  // e.g. "Colorado Motor Vehicle Bill of Sale - 01-18-23.zip" or "Verdocs-Envelopes-02-13-23.zip"
  const zipFileName = envelopes.length === 1 ? `${envelopes[0].name} - ${formatEnvelopeDate(envelopes[0])}.zip` : `Verdocs-Envelopes-${formatLocalDate(new Date())}`;
  const zipped = await zip.generateAsync({type: 'blob', compression: 'DEFLATE'});
  downloadBlob(zipped, zipFileName);
};

/**
 * Throttle a given function by a delay value. Useful for things like resizeObserver.
 */
export const throttle = (f, delay) => {
  let timer: any = 0;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => f.apply(this, args), delay);
  };
};

/**
 * Convert a browser File object's data into a base64-encoded string.
 */
export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result?.toString() || '');
    reader.onerror = error => reject(error);
  });
