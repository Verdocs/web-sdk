import {VerdocsEndpoint, toggleTemplateStar, ITemplate} from '@verdocs/js-sdk';
import {Component, Prop, h, Host, Event, EventEmitter, State} from '@stencil/core';
import {SDKError} from '../../../utils/errors';

const OutlineStarIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>`;

const SolidStarIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" /></svg>`;

/**
 * Displays a clickable star that allows users to mark frequently-used templates.
 */
@Component({
  tag: 'verdocs-template-star',
  styleUrl: 'verdocs-template-star.scss',
})
export class VerdocsTemplateStar {
  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * The template to display the star for.
   */
  @Prop({mutable: true}) template: ITemplate;

  /**
   * Event fired when the user toggles the star on or off. The event detail will contain
   * the new "starred" status and count.
   */
  @Event({composed: true}) starChange: EventEmitter<{templateId: string; starred: boolean; count: number}>;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  @State() updating = false;

  async componentWillLoad() {
    this.endpoint.loadSession();

    if (!this.endpoint.session) {
      console.log('[TEMPLATES] Must be authenticated');
      return;
    }
  }

  toggle(e: any) {
    e.stopPropagation();
    this.updating = true;
    toggleTemplateStar(VerdocsEndpoint.getDefault(), this.template.id)
      .then(r => {
        this.updating = false;
        this.template.star_counter = r.star_counter;
        this.starChange.emit({
          templateId: this.template.id,
          starred: r.star_counter > 0,
          count: r.star_counter,
        });
      })
      .catch(e => {
        this.updating = false;
        console.log('[STAR] Error toggling template star', e.message);
        this.sdkError.emit(e);
      });
  }

  render() {
    return (
      <Host>
        <div class={`star ${this.updating ? 'updating' : ''}`} innerHTML={this.template.star_counter ? SolidStarIcon : OutlineStarIcon} onClick={e => this.toggle(e)} />
        <div class="count">{this.template.star_counter || '--'}</div>
      </Host>
    );
  }
}
