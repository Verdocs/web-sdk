import {Component, Prop, Host, h, State, Event, EventEmitter} from '@stencil/core';

export interface ITab {
  id?: string;
  label: string;
  disabled?: boolean;
  // TODO: Tooltips?
}

/**
 * Display a simple row of selectable tabs.
 */
@Component({
  tag: 'verdocs-tabs',
  styleUrl: 'verdocs-tabs.scss',
})
export class VerdocsTabs {
  /**
   * The tabs to display
   */
  @Prop() tabs: ITab[] = [];

  /**
   * The index of the initial tab to select.
   */
  @Prop() defaultTab: number = 0;

  @State() selectedTab = 0;

  /**
   * Event fired when the user clicks a template to view it. Typically the host application will use this to navigate
   * to the template preview. This is also fired when the user selects "Preview/Send" fropm the dropdown menu.
   */
  @Event({composed: true}) selectTab: EventEmitter<{tab: ITab; index: number}>;

  componentWillLoad() {
    this.selectedTab = this.defaultTab || 0;
  }

  handleSelectTab(index: number) {
    this.selectedTab = index;
    this.selectTab?.emit({tab: this.tabs[index], index});
  }

  render() {
    return (
      <Host>
        {this.tabs.map((tab, index) => (
          <div class={`tab ${index === this.selectedTab ? 'active' : ''} ${tab.disabled ? 'disabled' : ''}`} onClick={tab.disabled ? () => {} : () => this.handleSelectTab(index)}>
            {tab.label}
          </div>
        ))}

        <div class="flex flex-1" />

        <slot>
          <div />
        </slot>
      </Host>
    );
  }
}
