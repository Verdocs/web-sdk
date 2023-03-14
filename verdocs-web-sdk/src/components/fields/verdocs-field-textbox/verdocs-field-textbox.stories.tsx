import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Fields/Textbox',
  component: 'verdocs-field-textbox',
  args: {
    disabled: false,
    editable: true,
    moveable: true,
    done: false,
    roleindex: 0,
    field: {
      name: 'textbox-1',
      role_name: 'Recipient 1',
      template_id: '0239fe5f-1b89-499a-bd83-098a2e1b4b9c',
      type: 'textbox',
      required: false,
      setting: {
        x: 0,
        y: 0,
      },
      page_sequence: 1,
    },
  },
  argTypes: {
    input: {
      action: 'input',
      description: 'Fired for each character entered in the field. e.target.value will contain the current text value.',
    },
  },
} as Meta;

export const Textbox = ({field, disabled, editable, moveable, done, roleindex, input}) => html`<verdocs-field-textbox
  style="transform: scale(1.5); width: 150px; height: 15px;"
  .field=${field}
  .disabled=${disabled}
  .editable=${editable}
  .moveable=${moveable}
  .done=${done}
  .roleindex=${roleindex}
  @input=${input}
/>`;
