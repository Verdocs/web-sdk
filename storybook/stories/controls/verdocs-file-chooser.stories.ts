import {html} from 'lit-html';
import {Meta} from '@storybook/web-components';

export default {
  title: 'Controls/File Chooser',
  component: 'verdocs-file-chooser',
  parameters: {},
  args: {},
  argTypes: {
    onFileSelected: {action: 'fileSelected'},
  },
} as Meta;

export const FileChooser = ({onFileSelected}) => html`<verdocs-file-chooser @fileSelected=${onFileSelected} />`;
