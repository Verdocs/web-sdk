import {html} from 'lit';
import {Meta} from '@storybook/web-components-vite';

export default {
  title: 'Controls/File Chooser',
  component: 'verdocs-file-chooser',
  args: {},
  argTypes: {
    onFileSelected: {action: 'fileSelected'},
  },
} as Meta;

export const FileChooser = ({onFileSelected}) => html`<verdocs-file-chooser @fileSelected=${onFileSelected} />`;
