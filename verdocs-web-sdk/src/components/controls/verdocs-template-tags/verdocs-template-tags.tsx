import {Component, Prop, h, Host} from '@stencil/core';

/**
 * Displays a message listing a template's tags.
 */
@Component({
  tag: 'verdocs-template-tags',
  styleUrl: 'verdocs-template-tags.scss',
})
export class VerdocsTemplateTags {
  /**
   * The tags to display
   */
  @Prop() tags: any[];

  render() {
    return (
      <Host>
        {this.tags?.map(tag => (
          <span>{tag}</span>
        ))}
      </Host>
    );
  }
}
