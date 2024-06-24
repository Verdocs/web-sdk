import {format} from 'date-fns';
import {Component, Prop, h, Host} from '@stencil/core';
import {IOrganization} from '@verdocs/js-sdk';

// TODO: See what was done in Storybook. Move all SVG icons to a common file that both projects can share
//  and reduce duplication between components for re-used icons. Also bring icons into Figma for reuse there.

const UserIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><rect fill="none" height="24" width="24"/><g><path d="M4,13c1.1,0,2-0.9,2-2c0-1.1-0.9-2-2-2s-2,0.9-2,2C2,12.1,2.9,13,4,13z M5.13,14.1C4.76,14.04,4.39,14,4,14 c-0.99,0-1.93,0.21-2.78,0.58C0.48,14.9,0,15.62,0,16.43V18l4.5,0v-1.61C4.5,15.56,4.73,14.78,5.13,14.1z M20,13c1.1,0,2-0.9,2-2 c0-1.1-0.9-2-2-2s-2,0.9-2,2C18,12.1,18.9,13,20,13z M24,16.43c0-0.81-0.48-1.53-1.22-1.85C21.93,14.21,20.99,14,20,14 c-0.39,0-0.76,0.04-1.13,0.1c0.4,0.68,0.63,1.46,0.63,2.29V18l4.5,0V16.43z M16.24,13.65c-1.17-0.52-2.61-0.9-4.24-0.9 c-1.63,0-3.07,0.39-4.24,0.9C6.68,14.13,6,15.21,6,16.39V18h12v-1.61C18,15.21,17.32,14.13,16.24,13.65z M8.07,16 c0.09-0.23,0.13-0.39,0.91-0.69c0.97-0.38,1.99-0.56,3.02-0.56s2.05,0.18,3.02,0.56c0.77,0.3,0.81,0.46,0.91,0.69H8.07z M12,8 c0.55,0,1,0.45,1,1s-0.45,1-1,1s-1-0.45-1-1S11.45,8,12,8 M12,6c-1.66,0-3,1.34-3,3c0,1.66,1.34,3,3,3s3-1.34,3-3 C15,7.34,13.66,6,12,6L12,6z"/></g></svg>';

const BusinessIcon =
  '<svg xmlns="http://www.w3.org/2000/svg"  focusable="false" aria-hidden="true" height="24px" viewBox="0 0 24 24" width="24px"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"></path></svg>';

/**
 * Display a small summary card describing an organization
 */
@Component({
  tag: 'verdocs-organization-card',
  styleUrl: 'verdocs-organization-card.scss',
})
export class VerdocsOrganizationCard {
  /**
   * The organization to display
   */
  @Prop() organization: IOrganization;

  render() {
    console.log('Rendering org card', this.organization.thumbnail_url, this.organization);
    const fallbackIcon = this.organization?.is_business ? BusinessIcon : UserIcon;

    return (
      <Host>
        {this.organization.thumbnail_url ? <img class="icon" src={this.organization.thumbnail_url} alt="Logo" /> : <span class="icon" innerHTML={fallbackIcon} />}

        <span class="content">{this.organization?.name}</span>

        <div class="popup">
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
      </Host>
    );
  }
}
