// NOTE: Do not attempt to convert this to a named-export module. It triggers compilation issues in Rollup that I spent days trying to
// resolve. This needs to export a single default value of the store's state. Any helper functions should go in Templates.ts here.

import {createStore} from '@stencil/store';
import {IEnvelope} from '@verdocs/js-sdk/Envelopes/Types';
import {ITemplate} from '@verdocs/js-sdk/Templates/Types';

const {state, onChange} = createStore({
  envelope: null as IEnvelope | null,
  template: null as ITemplate | null,
  loadProgress: 0,
  loading: true,
  error: '',

  roleNames: [] as string[],
  dirty: false,
});

onChange('envelope', async newEnvelope => {
  if (!newEnvelope) {
    console.log('[ENVELOPESTORE] Clearing envelope');
    state.roleNames = [];
    state.dirty = false;
    state.loading = false;
    state.error = '';
    state.loadProgress = 0;
    return;
  }

  console.log('[ENVELOPESTORE] Loaded envelope', newEnvelope);

  state.roleNames = newEnvelope.recipients.map(recipient => recipient.role_name);
  newEnvelope.recipients;
  console.log('[ENVELOPESTORE] Loaded roles', state.roleNames);
});

export default state;
