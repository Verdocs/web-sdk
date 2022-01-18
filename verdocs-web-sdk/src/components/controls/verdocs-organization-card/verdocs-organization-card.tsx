import {Component, Prop, h, Host} from '@stencil/core';
import {IOrganization} from '@verdocs/js-sdk/Organizations/Types';
import UserGroup from './user-group.svg';

/**
 * Display a pop-up describing the company that was hovered over
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
    console.log('org', JSON.stringify(this.organization, null, 2));
    return (
      <Host>
        <span class="icon" innerHTML={UserGroup} />

        <span class="content">{this.organization.name}</span>

        <div class="popup">
          <div class="popup-header">
            <span class="status" />
            <span class="title">{this.organization.name}</span>
          </div>
          <div class="popup-body">
            <span class="joined">
              <b>Joined</b> {'Jan 1 2022'}
            </span>
            <span class="followers">
              <b>Followers</b> 57
            </span>
            <span class="website">
              <b>Website</b>
            </span>
            <span class="templates">
              <b>Templates</b> 7
            </span>
            <span>https://www.google.com</span>
          </div>
        </div>
      </Host>
    );
  }
}
