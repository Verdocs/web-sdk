import {Component, Prop, h} from '@stencil/core';

/**
 * Displays a message describing a document's status of completion
 *
 * ```typescript
 *
 * ```
 */
@Component({
  tag: 'tags-indicator',
  styleUrl: 'tags-indicator.css',
  shadow: true,
})
export class TagsIndicator {
  /**
   * The tags to display
   */
  @Prop() tags: any[]; 

  /**
   * The "theme" to be used
   */
  @Prop() theme: "light" | "dark";

  render() {
    return (
      <div class="container">
        {this.tags?.map(tag => (
          <span class="tags">{tag}</span>
        ))}
      </div>);
  }
}
