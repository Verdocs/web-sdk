import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';
import {TemplateSenderTypes} from '@verdocs/js-sdk/Templates/Types';

export default {
  title: 'Dialogs/Template Sender Dialog',
  component: 'verdocs-template-sender-dialog',
  args: {
    value: 'everyone',
  },
  argTypes: {
    value: {
      options: [
        TemplateSenderTypes.CREATOR,
        TemplateSenderTypes.ORGANIZATION_MEMBER,
        TemplateSenderTypes.ORGANIZATION_MEMBER_AS_CREATOR,
        TemplateSenderTypes.EVERYONE,
        TemplateSenderTypes.EVERYONE_AS_CREATOR,
      ],
      mapping: {
        [TemplateSenderTypes.CREATOR]: 'creator',
        [TemplateSenderTypes.ORGANIZATION_MEMBER]: 'organization_member',
        [TemplateSenderTypes.ORGANIZATION_MEMBER_AS_CREATOR]: 'organization_member_as_creator',
        [TemplateSenderTypes.EVERYONE]: 'everyone',
        [TemplateSenderTypes.EVERYONE_AS_CREATOR]: 'everyone_as_creator',
      },
      control: {
        type: 'select',
        labels: {
          [TemplateSenderTypes.CREATOR]: 'creator',
          [TemplateSenderTypes.ORGANIZATION_MEMBER]: 'organization_member',
          [TemplateSenderTypes.ORGANIZATION_MEMBER_AS_CREATOR]: 'organization_member_as_creator',
          [TemplateSenderTypes.EVERYONE]: 'everyone',
          [TemplateSenderTypes.EVERYONE_AS_CREATOR]: 'everyone_as_creator',
        },
      },
    },
    onNext: {
      action: 'next',
      table: {disable: true},
    },
    onCancel: {
      action: 'cancel',
      table: {disable: true},
    },
  },
} as Meta;

export const TemplateSenderDialog = ({value, onCancel, onNext}) => html`<verdocs-template-sender-dialog .value=${value} @cancel=${onCancel} @next=${onNext} />`;
