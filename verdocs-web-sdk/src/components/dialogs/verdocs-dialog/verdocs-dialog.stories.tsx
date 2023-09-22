import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Dialogs/Default',
  component: 'verdocs-dialog',
  args: {},
  argTypes: {
    onExit: {action: 'exit', table: {disable: true}},
    onNext: {action: 'next', table: {disable: true}},
  },
} as Meta;

export const Default = ({onExit, onNext}) =>
  html`<verdocs-dialog @exit=${onExit}>
    <h1 slot="heading">Test Dialog</h1>
    <p>Test dialog box.</p>
    <div class="buttons">
      <verdocs-button label="OK" size="small" onClick=${onNext} />
    </div>
  </verdocs-dialog>`;
