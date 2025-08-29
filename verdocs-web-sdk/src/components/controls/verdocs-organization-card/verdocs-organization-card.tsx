import {format} from 'date-fns';
import {Component, Prop, h, Host, Listen, State} from '@stencil/core';
import type {IOrganization} from '@verdocs/js-sdk';

// TODO: See what was done in Storybook. Move all SVG icons to a common file that both projects can share
//  and reduce duplication between components for re-used icons. Also bring icons into Figma for reuse there.

const BusinessIcon =
  '<svg xmlns="http://www.w3.org/2000/svg"  focusable="false" aria-hidden="true" height="24px" viewBox="0 0 24 24" width="24px"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"></path></svg>';

/**
 * Display a small summary card describing an organization.
 *
 * ```ts
 * <verdocs-organization-card organization={organization} />
 * ```
 */
@Component({
  tag: 'verdocs-organization-card',
  styleUrl: 'verdocs-organization-card.scss',
})
export class VerdocsOrganizationCard {
  /**
   * The organization to display
   */
  @Prop() organization: Partial<IOrganization>;

  @State()
  hovered: boolean = false;

  @Listen('mouseover')
  onMouseOver() {
    this.hovered = true;
  }

  @Listen('mouseout')
  onMouseOut() {
    this.hovered = false;
  }

  render() {
    console.log('Rendering org card', this.organization.thumbnail_url, this.organization);
    const fallbackIcon = BusinessIcon;
    const portalId = `verdocs-org-card-${this.organization.id}`;

    return (
      <Host id={portalId}>
        {this.organization.thumbnail_url ? <img class="icon" src={this.organization.thumbnail_url} alt="Logo" /> : <span class="icon" innerHTML={fallbackIcon} />}

        <span class="content">{this.organization?.name}</span>

        <verdocs-portal anchor={portalId}>
          <div class="verdocs-org-card-popup" style={{display: this.hovered ? 'block' : 'none'}}>
            {this.organization.full_logo_url ? (
              <div class="popup-header-with-logo">
                <img src={this.organization.full_logo_url} alt="Logo" />
                <div class="title">{this.organization?.name}</div>
              </div>
            ) : (
              <div class="popup-header">
                <span class="status">
                  <span class="icon" innerHTML={fallbackIcon} />
                </span>
                <span class="title">{this.organization?.name}</span>
              </div>
            )}

            <div class="popup-body">
              <div class="field">
                <strong>Joined</strong>
                {format(new Date(this.organization?.created_at || undefined), 'LLL d, Y')}
              </div>
              {this.organization.url && (
                <div class="field">
                  <strong>Website</strong>
                  <a href={this.organization?.url} target="_blank" rel="nofollow">
                    {this.organization?.url}
                  </a>
                </div>
              )}
            </div>
          </div>
        </verdocs-portal>
      </Host>
    );
  }
}
