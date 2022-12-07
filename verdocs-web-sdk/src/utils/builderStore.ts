import {createStore} from '@stencil/store';
import {ITemplate, ITemplateField} from '@verdocs/js-sdk/Templates/Types';

const {state, onChange} = createStore({
  dirty: false,
  templateId: '',
  template: null as ITemplate | null,
  roleNames: [] as string[],
  fields: [] as ITemplateField[],
});

// onChange('fields', value => {
onChange('fields', () => {
  state.dirty = true;
});

export default state;
