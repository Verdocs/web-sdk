// NOTE: Do not attempt to convert this to a named-export module. It triggers compilation issues in Rollup that I spent days trying to
// resolve. This needs to export a single default value of the store's state. Any helper functions should go in Templates.ts here.

import {createStore} from '@stencil/store';
import {integerSequence} from '@verdocs/js-sdk/Utils/Primitives';
import {ITemplate, ITemplateField} from '@verdocs/js-sdk/Templates/Types';

const {state, onChange} = createStore({
  templateId: '',
  template: null as ITemplate | null,
  loadProgress: 0,
  loading: false,

  // This can be used as a data field on components that need to force re-rendering when the underlying data has changed. Stencil stores
  // are handy but not very sophisticated. They don't re-render on "deep" changes.
  updateCount: 1,

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
  state.updateCount++;
});

// TODO: Do not rely on this, it doesn't appear to be working
onChange('fields', newField => {
  console.log('[TEMPLATESTORE] Field changed', newField);
  state.dirty = true;
});

export default state;
