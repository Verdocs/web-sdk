import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, h, Event, EventEmitter, Prop} from '@stencil/core';

const DocumentIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>`;

const TemplateIcon = `<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><rect fill="none" height="24" width="24"/><g><path d="M19,5v14H5V5H19 M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3L19,3z"/></g><path d="M14,17H7v-2h7V17z M17,13H7v-2h10V13z M17,9H7V7h10V9z"/></g></svg>`;

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
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

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
