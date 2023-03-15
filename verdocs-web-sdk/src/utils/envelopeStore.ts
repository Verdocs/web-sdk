// NOTE: Do not attempt to convert this to a named-export module. It triggers compilation issues in Rollup that I spent days trying to
// resolve. This needs to export a single default value of the store's state. Any helper functions should go in Templates.ts here.

import {createStore} from '@stencil/store';
import {IEnvelope} from '@verdocs/js-sdk/Envelopes/Types';

console.log('[ENVELOPESTORE] Creating store');
const {state, onChange, reset} = createStore({
  envelope: null as IEnvelope | null,
  loadProgress: 0,
  loading: true,
  error: '',

  // This can be used as a data field on components that need to force re-rendering when the underlying data has changed. Stencil stores
  // are handy but not very sophisticated. They don't re-render on "deep" changes.
  updateCount: 1,

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

export const resetEnvelopeStore = () => reset();
