import {html} from 'lit-html';
import {Meta} from '@storybook/web-components-vite';

export default {
  title: 'Controls/Menu Panel',
  component: 'verdocs-menu-panel',
  args: {
    side: 'left',
    width: 300,
  },
  argTypes: {},
} as Meta;

let open = false;

const handleClose = () => {
  open = false;
};

export const Portal = ({side, width}) =>
  open
    ? html`
<div><button @click=${() => (open = true)}>Show Panel</button>
  <verdocs-menu-panel .side=${side} .width=${width} .overlay=${true} ?open=${open} @close=${handleClose}>
</div>`
    : html`<div><button @click=${() => (open = true)}>Show Panel</button></div>`;
