import {Component, Host, h, Event, EventEmitter} from '@stencil/core';
import TemplateIcon from './template-icon.svg';
import DocumentIcon from './document-icon.svg';

/**
 * Display quick-function buttons for creating templates and documents.
 */
@Component({
  tag: 'search-quick-functions',
  styleUrl: 'search-quick-functions.css',
  shadow: true,
})
export class SearchQuickFunctions {
  /**
   * Event fired when an entry is clicked.
   */
  @Event({composed: true}) createTemplate: EventEmitter;

  /**
   * Event fired when an entry is clicked.
   */
  @Event({composed: true}) createDocument: EventEmitter;

  handleCreateTemplate() {
    this.createTemplate.emit();
  }

  handleCreateDocument() {
    this.createDocument.emit();
  }

  render() {
    return (
      <Host>
        <div class="container">
          <p class="title">Quick Create</p>
          <button onClick={() => this.handleCreateTemplate()} innerHTML={TemplateIcon} class="buttons">
            Template
          </button>
          <button onClick={() => this.handleCreateDocument()} innerHTML={DocumentIcon} class="buttons">
            Document
          </button>
        </div>
      </Host>
    );
  }
}
