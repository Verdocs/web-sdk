import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Controls/Portal',
  component: 'verdocs-portal',
  args: {
    align: 'left',
    voffset: 0,
  },
  argTypes: {},
} as Meta;

export const Portal = ({align, voffset}) => html`
  <div style="padding: 40px">
    <div id="sample-tooltip" style="border: 1px solid green; padding: 3px 10px;">
      Tooltip Anchor
      <verdocs-portal anchor="sample-tooltip" .align=${align} .voffset=${voffset}>
        <div style="border: 1px solid red; padding: 3px 10px;">Tooltip</div>
      </verdocs-portal>
    </div>
  </div>
`;
