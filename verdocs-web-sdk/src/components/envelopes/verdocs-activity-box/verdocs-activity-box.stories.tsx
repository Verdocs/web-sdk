import {Meta} from '@storybook/web-components';
import {html} from 'lit-html';

export default {
  title: 'Envelopes/Activity Box',
  component: 'verdocs-activity-box',
  args: {
    items: 5,
    view: 'completed',
    header: undefined,
  },
} as Meta;

export const ActivityBox = ({items, view, header}) => html`<verdocs-activity-box .items="${items}" .view="${view}" .header="${header}" />`;
