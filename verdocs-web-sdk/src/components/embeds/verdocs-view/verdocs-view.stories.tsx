import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

const localSource = 'https://stage-api.verdocs.com/envelopes/64d7eb5a-a4fb-4044-accf-a0b9ba530e42/envelope_documents/bd92fcfa-63fd-4b94-856e-e7f4c7c0b2e1?file=true';

export default {
  title: 'Embeds/View',
  component: 'verdocs-view',
  args: {
    source: localSource,
  },
  argTypes: {},
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

export const View = ({source}) => html`<verdocs-view .source=${source} />`;
