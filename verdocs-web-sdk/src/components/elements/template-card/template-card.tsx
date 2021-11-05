import {Component, Prop, h, getAssetPath} from '@stencil/core';
import EmailIcon from './email-icon.svg';
import ActionsIcon from './actions-icon.svg';
import PagesIcon from './pages-icon.svg';
import StarIcon from './star-icon.svg';

/**
 * Displays the overview of a template
 *
 * ```typescript
 *
 * ```
 */
@Component({
  tag: 'template-card',
  styleUrl: 'template-card.scss',
  assetsDirs: ['template-card'],
})
export class TemplateCard {
  /**
   * The template whose information is gonna be displayed
   */
  @Prop() template: any;

  /**
   * The "theme" to be used
   */
  @Prop() theme: 'light' | 'dark';

  render() {
    return (
      <div class="container">
        <div class="template-img">
          <img src={getAssetPath('template-card/dummy-image.png')} alt="Dummy Image" />
        </div>
        <span class="template-name">{this.template.name}</span>
        <span class="template-org-bname">{this.template.organization_business_name}</span>
        <div class="template-org-name">
          <input type="checkbox" id="org-name" name="org-name" checked />
          <label htmlFor="org-name">{this.template.organization_name}</label>
        </div>
        <hr />
        <div class="template-controls">
          <span class="star-counter" innerHTML={StarIcon}>
            {this.template.star_counter}
          </span>
          <span class="pages" innerHTML={PagesIcon}>
            {this.template.pages}
          </span>
          <span class="counter" innerHTML={EmailIcon}>
            {this.template.counter}
          </span>
          <span class="additional-controls" innerHTML={ActionsIcon} />
        </div>
      </div>
    );
  }
}
