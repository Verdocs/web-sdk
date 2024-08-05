import jszip from 'jszip';
import {format} from 'date-fns';
import {downloadBlob, getEnvelopeFile, getFieldAttachment, IEnvelope, IEnvelopeField, ITemplateField, rescale, TFieldType, VerdocsEndpoint} from '@verdocs/js-sdk';
import {FORMAT_DATE, IDocumentPageInfo} from './Types';

export const defaultWidth = (type: TFieldType) => {
  // checkbox was a legacy field type
  switch (type as any) {
    case 'textarea':
      return 150;
    case 'textbox':
      return 150;
    case 'timestamp':
      return 105;
    case 'date':
      return 75;
    case 'dropdown':
      return 85;
    case 'attachment':
    case 'payment':
      return 24;
    case 'radio':
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

export const defaultHeight = (type: TFieldType) => {
  switch (type as any) {
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
    case 'radio':
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
  let {x = 0, y = 0, width = defaultWidth(field.type), height = defaultHeight(field.type)} = field;
  const settings = (field as ITemplateField).settings || (field as IEnvelopeField).settings;

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

export const getControlStyles = (field: ITemplateField | IEnvelopeField, xScale: number, yScale: number, option?: number) => {
  let {x = 0, y = 0, width = defaultWidth(field.type), height = defaultHeight(field.type)} = field;
  const settings = (field as ITemplateField).settings || (field as IEnvelopeField).settings;

  const optionSettings = settings.options && option !== undefined && settings.options[option] ? settings.options[option] : null;
  if (optionSettings) {
    x = optionSettings.x ?? x;
    y = optionSettings.y ?? y;
    width = optionSettings.width ?? width;
    height = optionSettings.height ?? height;
  }

  return {
    width: `${width}px`,
    height: `${height}px`,
    position: 'absolute',
    left: `${rescale(xScale, x)}px`,
    bottom: `${rescale(yScale, y)}px`,
    transform: `scale(${xScale}, ${yScale})`,
  };
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

export const renderDocumentField = (field: ITemplateField | IEnvelopeField, docPage: IDocumentPageInfo, fieldOptions: IFieldOptions, tabIndex: number = 1) => {
  const {disabled = false, editable = false, draggable = false, done = false} = fieldOptions;
  const controlsDiv = document.getElementById(docPage.containerId + '-controls');
  if (!controlsDiv) {
    console.log('[renderDocumentField] No controls DIV found', docPage.containerId + '-controls', docPage);
    return;
  }

  switch (field.type as any) {
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
        if (field['setting']?.leading > 0 || field['settings']?.leading > 0) {
          type = 'textarea';
        }
      }

      const el: any = document.createElement(`verdocs-field-${type}`);
      el.field = field;
      el.setAttribute('id', id);
      el.setAttribute('fieldname', field.name);
      el.setAttribute('templateid', 'template_id' in field ? field.template_id : 'PREVIEW');

      if (disabled) {
        el.setAttribute('tabindex', -1);
        el.setAttribute('disabled', true);
      } else {
        el.setAttribute('tabIndex', tabIndex);
      }

      console.log(field.name, 'editable', editable);
      el.setAttribute('editable', editable);
      el.setAttribute('draggable', draggable);
      el.setAttribute('done', done);

      setControlStyles(el, field, docPage.xScale, docPage.yScale);
      controlsDiv.appendChild(el);

      return el;
    }

    case 'checkbox': {
      const id = getFieldOptionId(field, 0);
      const existingField = document.getElementById(id);
      if (existingField) {
        setControlStyles(existingField, field, docPage.xScale, docPage.yScale, 0);
        return existingField;
      }

      const cbEl: any = document.createElement(`verdocs-field-checkbox`);
      cbEl.field = field;
      cbEl.setAttribute('id', id);
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
    }

    case 'radio': {
      const id = getFieldOptionId(field, 0);
      const existingField = document.getElementById(id);
      if (existingField) {
        setControlStyles(existingField, field, docPage.xScale, docPage.yScale, 0);
        return existingField;
      }

      const radioEl: any = document.createElement(`verdocs-field-radio`);
      radioEl.field = field;
      radioEl.setAttribute('id', id);
      radioEl.setAttribute('option', 0);
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
      setControlStyles(radioEl, field, docPage.xScale, docPage.yScale, 0);
      controlsDiv.appendChild(radioEl);

      return radioEl;
    }

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

    default:
      console.log('[PREVIEW] Skipping unsupported field type', field);
      return null;
  }
};

export const getFieldSettings = (field: ITemplateField | IEnvelopeField | undefined) => field?.settings || {};

/**
 * Helper function to safely set/update components in a CSS transform attribute. Transform is normally set as a string of
 * `operation1(param) operation2(param) ...` components, which makes updating them a bit of a pain. This will remove the
 * specified component if it's already set and replace it with the new value, without touching the other components that
 * may already be set. Note that this operation moves the component to the end of the transform chain so it's not meant
 * to be used for order-sensitive components e.g. translate-then-rotate.
 */
export const updateCssTransform = (el: HTMLElement, key: string, value: string) => {
  const currentTransform = el.style.transform || '';

  const newValue = `${key}(${value})`;
  if (currentTransform.includes(key)) {
    el.style.transform = currentTransform.replace(new RegExp(`${key}\\(.+?\\)`), newValue);
  } else {
    el.style.transform = currentTransform + ' ' + newValue;
  }
};

export const removeCssTransform = (el: HTMLElement) => {
  // const currentTransform = el.style.transform || '';
  el.style.transform = el.style.transform.split(')')[0] + ')';
  // TODO: This is not working
  // el.style.transform = currentTransform.replace(new RegExp(`\(${key}\\(.+?\\)\)`), '');
};

export const saveAttachment = async (endpoint: VerdocsEndpoint, envelope: IEnvelope, documentId: string) => {
  // e.g. "Colorado-Motor-Vehicle-Bill-of-Sale.pdf"
  const date = format(new Date(envelope.updated_at), FORMAT_DATE);
  const fileName = `${envelope.name} - ${date}.pdf`;
  const data = await getEnvelopeFile(endpoint, envelope.id, documentId);
  downloadBlob(data, fileName);
};

export const saveEnvelopesAsZip = async (endpoint: VerdocsEndpoint, envelopes: IEnvelope[]) => {
  const zip = new jszip();

  for await (let envelope of envelopes) {
    const date = format(new Date(envelope.updated_at), FORMAT_DATE);
    const subFolder = envelopes.length > 0 ? zip.folder(`${envelope.id} - ${envelope.name} - ${date}`) : null;
    for await (let document of envelope.documents) {
      // TODO: When attachments are added to envelopes, add a field that reflects the full, original filename (including extension)
      const documentFileName = document.type === 'certificate' ? `${envelope.name}_certificate.pdf` : `${document.name}.pdf`;
      const data = await getEnvelopeFile(endpoint, envelope.id, document.id);

      if (subFolder) {
        subFolder.file(documentFileName, data, {compression: 'DEFLATE'});
      } else {
        zip.file(documentFileName, data, {compression: 'DEFLATE'});
      }

      // TODO: fields needs to be added to envelope search result entries
      const attachFields = envelope.fields?.filter(field => field.type === 'attachment' && field.settings['name']) || [];
      if (attachFields.length > 0) {
        const attachmentsFolder = subFolder ? subFolder.folder('attachments') : zip.folder('attachments');
        for await (let attachField of attachFields) {
          const attachData = await getFieldAttachment(endpoint, envelope.id, attachField.name);
          attachmentsFolder.file(attachField.settings['name'], attachData, {compression: 'DEFLATE'});
        }
      }
    }
  }

  // e.g. "Colorado Motor Vehicle Bill of Sale - 01-18-23.zip" or "Verdocs-Envelopes-02-13-23.zip"
  const formattedDate = format(envelopes.length === 1 ? new Date(envelopes[0].updated_at) : new Date(), FORMAT_DATE);
  const zipFileName = envelopes.length === 1 ? `${envelopes[0].name} - ${formattedDate}.zip` : `Verdocs-Envelopes-${formattedDate}`;
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
 * Compute the rendered width of a given text string, using a given font.
 */
export const renderedTextWidth = (text: string, font: string = '16px Arial') => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = font;
  return ctx.measureText(text).width;
};

// "(212) 555-1212" => +12125551212
// "+46766861004" => "+46766861004"
// "212-555-1212" => +12125551212
// "212.555.1212" => +12125551212
// "212 555 1212" => +12125551212
// @see https://46elks.com/kb/e164
export const convertToE164 = (input: string) => {
  let temp = (input || '').trim();
  // If we are already prefixed, assume the user did it deliberately and attempt to use what they entered. We also short-circuit blanks.
  if (!temp || temp.startsWith('+')) {
    return temp;
  }

  // Remove any spaces, parenthesis or other punctuation.
  temp = temp.replace(/[^0-9]/g, '');

  // If the number begins with a zero, remove the leading zero. Do not combine this with the previous step because it needs to be removed
  // whether it's the actual first character e.g. `0(5)` or just the first digit e.g. `(05`.
  temp = temp.replace(/^0/g, '');

  // Prepend the country code and +. We're assuming US in this case given the target demographic. Users in other countries would/should be
  // already entering a prefix so they'd shortcut out of this routine via the + prefix check.
  return `+1${temp}`;
};
