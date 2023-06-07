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
  argTypes: {
    onViewEnvelope: {action: 'viewEnvelope'},
    onViewAll: {action: 'viewAll'},
  },
} as Meta;

export const ActivityBox = ({items, view, header, onViewEnvelope, onViewAll}) =>
  html`<verdocs-activity-box .items="${items}" .view="${view}" .header="${header}" @viewEnvelope=${onViewEnvelope} @viewAll=${onViewAll} />`;
