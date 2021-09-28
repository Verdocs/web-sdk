import {Component, Prop, h} from '@stencil/core';

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

  render() {
    return <div>{this.organization?.name}</div>;
  }
}
