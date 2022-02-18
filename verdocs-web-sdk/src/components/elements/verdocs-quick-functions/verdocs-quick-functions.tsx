import {Component, h, Event, EventEmitter} from '@stencil/core';
import TemplateIcon from './template-icon.svg';
import DocumentIcon from './document-icon.svg';

/**
 * Display quick-function buttons for creating templates and documents.
 *
 * Authentication is required to demonstrate this Element. You may do this in Storybook by using the Auth
 * embed. This Element will reuse the same session produced by logging in via that Embed.
 */
@Component({
  tag: 'verdocs-quick-functions',
  styleUrl: 'verdocs-quick-functions.scss',
})
export class VerdocsQuickFunctions {
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
      <div class="container">
        <p class="title">Quick Create</p>
        <button onClick={() => this.handleCreateTemplate()} innerHTML={TemplateIcon}>
          Template
        </button>
        <button onClick={() => this.handleCreateDocument()} innerHTML={DocumentIcon}>
          Document
        </button>
      </div>
    );
  }
}
