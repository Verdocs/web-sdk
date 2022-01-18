import {Component, Prop, h, Host} from '@stencil/core';
import {ITemplate} from '@verdocs/js-sdk/Templates/Types';
import ActionsIcon from './actions.svg';
import EmailIcon from './email.svg';
import PagesIcon from './pages.svg';
import StarIcon from './star.svg';

/**
 * Displays a summary of a template
 */
@Component({
  tag: 'verdocs-template-card',
  styleUrl: 'verdocs-template-card.scss',
  shadow: false,
})
export class VerdocsTemplateCard {
  /**
   * The template for which the card will be rendered.
   */
  @Prop() template: ITemplate;

  render() {
    return (
      <Host>
        <img src={this.template?.template_document?.thumbnail_url || ''} alt="Template Thumbnail" class="thumbnail" />

        <span class="name">{this.template.name}</span>
        <span class="org-name">{this.template.organization?.name || 'Public'}</span>

        <hr />

        <div class="controls">
          <div class="control">
            <span class="icon" innerHTML={StarIcon} />
            <span class="value">{this.template.star_counter}</span>
          </div>

          <div class="control secondary">
            <span class="icon" innerHTML={PagesIcon} />
            <span class="value">{this.template?.template_document?.page_numbers || 1}</span>
          </div>

          <div class="control secondary">
            <span class="icon" innerHTML={EmailIcon} />
            <span class="value">{this.template.counter}</span>
          </div>

          <span class="additional-controls" innerHTML={ActionsIcon} />
        </div>
      </Host>
    );
  }
}
