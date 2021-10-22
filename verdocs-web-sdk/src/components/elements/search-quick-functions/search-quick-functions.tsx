import { Component, Host, h, Prop } from '@stencil/core';
import TemplateIcon from './template-icon.svg';
import DocumentIcon from './document-icon.svg';

@Component({
  tag: 'search-quick-functions',
  styleUrl: 'search-quick-functions.css',
  shadow: true,
})
export class SearchQuickFunctions {
  @Prop() options: any

  createTemplate() {
    console.log('create template') //probably gonna be an API call
  }

  createDocument() {
    console.log('create document') //probably gonna be an API call
  }

  render() {
    return (
      <Host>
        <div class="container">
          <p class="title">{this.options.title}</p>
          <button onClick={() => this.createTemplate()} innerHTML={TemplateIcon} class="buttons">Template</button>
          <button onClick={() => this.createDocument()} innerHTML={DocumentIcon} class="buttons">Document</button>
        </div>
      </Host>
    );
  }

}
