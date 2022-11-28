import {createStore} from '@stencil/store';
import {ITemplate, ITemplateField} from '@verdocs/js-sdk/Templates/Types';

const {state} = createStore({
  // const {state, onChange} = createStore({
  templateId: '',
  template: null as ITemplate | null,
  roleNames: [] as string[],
  fields: [] as ITemplateField[],
});

// onChange('clicks', value => {
//   state.squaredClicks = value ** 2;
// });

export default state;
