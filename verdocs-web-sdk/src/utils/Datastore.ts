import {createStore, Row} from 'tinybase';
import type {IEnvelope, ITemplate} from '@verdocs/js-sdk';
import {getTemplate, VerdocsEndpoint} from '@verdocs/js-sdk';

const store = createStore();

// For now, we clear the database every page load to keep it clean and small.
// We're only using it to synchronize data between isolated components. e-Signing
// flows don't really benefit from "offline-first" approaches anyway, since most
// of a user's interactions need to go through our servers anyway.
store.delTables();
store.delValues();
console.log('[STORE] Data store initialized.');

export const safeJsonParse = (val: any, fallback?: any) => {
  try {
    return JSON.parse(val);
  } catch (e) {
    return fallback || null;
  }
};

export const objectToRow = (obj: Object): Row => {
  const row: Row = {};
  for (let key in obj) {
    if (typeof obj[key] === 'string' || typeof obj[key] === 'number' || typeof obj[key] === 'boolean') {
      row[key] = obj[key];
    } else if (obj[key] === null) {
      row[`__null__${key}`] = '';
    } else if (Array.isArray(obj[key])) {
      row[`__array__${key}`] = JSON.stringify(obj[key]);
    } else if (typeof obj[key] === 'object') {
      row[`__object__${key}`] = JSON.stringify(obj[key]);
    }
  }

  return row;
};

export const rowToObject = <T extends {}>(row: Row): T => {
  const obj = {} as T;

  for (let key in row) {
    if (key.startsWith('__null__')) {
      obj[key.replace('__null__', '')] = null;
    } else if (typeof row[key] === 'string' && key.startsWith('__array__')) {
      obj[key.replace('__array__', '')] = safeJsonParse(row[key]);
    } else if (typeof row[key] === 'string' && key.startsWith('__object__')) {
      obj[key.replace('__object__', '')] = safeJsonParse(row[key]);
    } else {
      obj[key] = row[key];
    }
  }

  return obj;
};

export type TRowUpdatedCallback<T> = (row: T) => void;
export type TRowGetter<T> = () => Promise<T>;

export const Store = {
  store,

  // Extends the store's listener mechanism with two features:
  // 1. Apply typing to the return result, and pass the whole updated value to the callback instead
  //    of just the "changes".
  // 2. Fire the callback immediately with the current value, so that the component can initialize.
  subscribe<T extends object>(tableId: string, rowId: string, getter: TRowGetter<T>, forceReload: boolean, callback: TRowUpdatedCallback<T>): string {
    // We call the callback immediately if the row exists so we get an SWR-like behavior.
    if (store.hasRow(tableId, rowId)) {
      callback(rowToObject<T>(store.getRow(tableId, rowId)));
    }

    const listenerId = store.addRowListener(tableId, rowId, () => {
      const row = store.getRow(tableId, rowId);
      callback(rowToObject<T>(row));
    });

    if (!store.hasRow(tableId, rowId) || forceReload) {
      console.log('[STORE] Reloading', {tableId, rowId});
      getter()
        .then(result => {
          // We don't need to call the callback because it's already listening
          console.log('[STORE] Loaded row', {tableId, rowId, forceReload}, result);
          store.setRow(tableId, rowId, objectToRow(result));
        })
        .catch(e => {
          console.error('[STORE] Error getting row', {tableId, rowId, forceReload}, e);
        });
    }

    return listenerId;
  },

  unsubscribe(listenerId: string) {
    store.delListener(listenerId);
  },

  async getTemplate(endpoint: VerdocsEndpoint, templateId: string, reload: boolean = false): Promise<ITemplate | null> {
    if (!reload) {
      if (!store.hasRow('templates', templateId)) {
        return null;
      }

      const row = store.getRow('templates', templateId);
      return rowToObject<ITemplate>(row);
    }

    const template = await getTemplate(endpoint, templateId);
    store.setRow('templates', templateId, objectToRow(template));
    return template;
  },

  updateTemplate(templateId: string, template: ITemplate) {
    store.setRow('templates', templateId, objectToRow(template));
    return template;
  },

  async getEnvelope(endpoint: VerdocsEndpoint, envelopeId: string, reload: boolean = false): Promise<ITemplate | null> {
    if (!reload) {
      if (!store.hasRow('envelopes', envelopeId)) {
        return null;
      }

      const row = store.getRow('envelopes', envelopeId);
      return rowToObject<ITemplate>(row);
    }

    const envelope = await getTemplate(endpoint, envelopeId);
    store.setRow('envelopes', envelopeId, objectToRow(envelope));
    return envelope;
  },

  updateEnvelope(envelopeId: string, envelope: IEnvelope) {
    store.setRow('envelopes', envelopeId, objectToRow(envelope));
    return envelope;
  },

  // Get a field from an already-loaded envelope or template. Intended to be
  // called by the verdocs-field-* components themselves which are only rendered
  // after a template or envelope is already loaded and cached in the store, so
  // no attempt is made to load the parent record if it isn't already known.
  getField(source: 'template' | 'envelope', sourceId: string, fieldName: string) {
    if (source === 'template') {
      const row = store.getRow('templates', sourceId);
      const template = rowToObject<ITemplate>(row);
      const field = (template.fields || []).find(field => field.name === fieldName);

      const roleNames = (template.roles || []).map(role => role.name);
      const index = roleNames.findIndex(name => name === field.role_name);

      return {index: Math.max(index, 0), field};
    } else {
      const row = store.getRow('envelopes', sourceId);
      const envelope = rowToObject<IEnvelope>(row);
      const field = (envelope.fields || []).find(field => field.name === fieldName);

      const roleNames = (envelope.recipients || []).map(recipient => recipient.role_name);
      const index = roleNames.findIndex(name => name === field.role_name);

      return {index, field};
    }
  },
};
