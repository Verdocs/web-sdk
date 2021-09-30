import {Component, Prop, h} from '@stencil/core';
import {icon} from '@fortawesome/fontawesome-svg-core';

@Component({
  tag: 'org-popup',
  styleUrl: 'org-popup.css',
  shadow: true,
})
export class OrgPopup {
  /**
   * The organization to display
   */
  @Prop() organization: any;

  /**
   * The "theme" to be used
   */
  @Prop() theme: "light" | "dark";

  render() {
    return (
      <div class="container">
        <span class="icon" innerHTML={icon({prefix: 'fas', iconName: 'users'}).html[0]}/>
        <span class="content">{this.organization?.name}</span>
        <div class="popup">
          <div class="popup-header">
            <span class="status"></span>
            <span class="title">{this.organization?.name}</span>
          </div>
          <div class="popup-body">
            <span class="joined"><b>Joined</b> {this.organization?.created_at}</span>
            <span class="followers"><b>Followers</b> {this.organization?.followers}</span>
            <span class="website"><b>Website</b></span>
            <span class="templates"><b>Templates</b> {this.organization?.templates}</span>
            <span>{this.organization?.website}</span>
          </div>
        </div>
      </div>);
  }
}
