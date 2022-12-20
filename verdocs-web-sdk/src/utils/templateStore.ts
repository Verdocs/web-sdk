// NOTE: Do not attempt to convert this to a named-export module. It triggers compilation issues in Rollup that I spent days trying to
// resolve. This needs to export a single default value of the store's state. Any helper functions should go in Templates.ts here.

import {createStore} from '@stencil/store';
import {ITemplate, ITemplateField} from '@verdocs/js-sdk/Templates/Types';
// import {VerdocsEndpoint} from '@verdocs/js-sdk';
// import {getTemplate} from '@verdocs/js-sdk/Templates/Templates';
import {integerSequence} from './utils';
// import {getPageImage} from '@verdocs/js-sdk/Templates/Pages';

const {state, onChange} = createStore({
  template: null as ITemplate | null,
  loadProgress: 0,
  loading: true,

  pageNumbers: [] as number[],
  pageUris: {} as Record<number, string>,
  roleNames: [] as string[],
  fields: [] as ITemplateField[],
  dirty: false,
});

onChange('template', async newTemplate => {
  if (!newTemplate) {
    console.log('[TEMPLATESTORE] Clearing template');
    state.fields = [];
    state.roleNames = [];
    state.pageNumbers = [];
    state.dirty = false;
    state.loading = false;
    state.loadProgress = 0;
    return;
  }

  console.log('[TEMPLATESTORE] Template loaded', newTemplate);

  state.roleNames = newTemplate.roles.map(role => role.name);
  console.log('[TEMPLATESTORE] Loaded roles', state.roleNames);

  state.fields = [];
  newTemplate.roles.forEach(role => {
    state.fields.push(...role.fields);
  });

  console.log('[TEMPLATESTORE] Loaded fields', state.fields);

  state.pageNumbers = integerSequence(1, newTemplate.pages.length);
});

onChange('fields', newField => {
  console.log('[TEMPLATESTORE] Field changed', newField);
  state.dirty = true;
});

export default state;
