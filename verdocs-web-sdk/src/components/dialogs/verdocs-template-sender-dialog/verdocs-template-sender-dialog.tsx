import {createPopper, Instance} from '@popperjs/core';
import {FileWithData} from '@verdocs/js-sdk/Utils/Files';
import {TemplateSenderTypes} from '@verdocs/js-sdk/Templates/Types';
import {Component, Prop, h, Event, EventEmitter, Host, State} from '@stencil/core';

const helpIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M11.925 18q.55 0 .938-.387.387-.388.387-.938 0-.55-.387-.925-.388-.375-.938-.375-.55 0-.925.375t-.375.925q0 .55.375.938.375.387.925.387Zm-.95-3.85h1.95q0-.8.2-1.287.2-.488 1.025-1.288.65-.625 1.025-1.213.375-.587.375-1.437 0-1.425-1.025-2.175Q13.5 6 12.1 6q-1.425 0-2.35.775t-1.275 1.85l1.775.7q.125-.45.55-.975.425-.525 1.275-.525.725 0 1.1.412.375.413.375.888 0 .475-.287.9-.288.425-.713.775-1.075.95-1.325 1.475-.25.525-.25 1.875ZM12 22.2q-2.125 0-3.988-.8-1.862-.8-3.237-2.175Q3.4 17.85 2.6 15.988 1.8 14.125 1.8 12t.8-3.988q.8-1.862 2.175-3.237Q6.15 3.4 8.012 2.6 9.875 1.8 12 1.8t3.988.8q1.862.8 3.237 2.175Q20.6 6.15 21.4 8.012q.8 1.863.8 3.988t-.8 3.988q-.8 1.862-2.175 3.237Q17.85 20.6 15.988 21.4q-1.863.8-3.988.8Zm0-2.275q3.325 0 5.625-2.3t2.3-5.625q0-3.325-2.3-5.625T12 4.075q-3.325 0-5.625 2.3T4.075 12q0 3.325 2.3 5.625t5.625 2.3ZM12 12Z"/></svg>';

const helpTexts: Record<TemplateSenderTypes, string> = {
  [TemplateSenderTypes.EVERYONE]:
    "Anyone on the web can create a Verdoc. This document's visibility setting must be 'Public on the web' or 'Shared to your organization, and public on the web.",
  [TemplateSenderTypes.EVERYONE_AS_CREATOR]:
    "Anyone on the web can create a Verdoc on your behalf. This document's visibility setting must be 'Public on the web' or 'Shared to your organization, and public on the web'.",
  [TemplateSenderTypes.ORGANIZATION_MEMBER]:
    "Anyone in your organization can create a Verdoc. This document's visibility setting must be 'Shared to your organization' or 'Shared to your organization, and " +
    "public on the web' and your Organization app settings must allow 'preview and use rights' for all members",
  [TemplateSenderTypes.ORGANIZATION_MEMBER_AS_CREATOR]:
    "Anyone in your organization can create a Verdoc. This document's visibility setting must be 'Shared to your organization' or 'Shared to your organization, and " +
    "public on the web' and your Organization app settings must allow 'preview and use rights' for all members",
  [TemplateSenderTypes.CREATOR]: 'Only you can create documents from this template.',
};

/**
 * Display a dialog that allows a template sender to be selected.
 */
@Component({
  tag: 'verdocs-template-sender-dialog',
  styleUrl: 'verdocs-template-sender-dialog.scss',
})
export class VerdocsTemplateSenderDialog {
  popperInstance: Instance;

  /**
   * Whether the dialog is currently being displayed. This allows it to be added to the DOM before being displayed.
   */
  @Prop() open: boolean = false;

  /**
   * Event fired when the dialog is closed. The event data will contain the closure reason.
   */
  @Event({composed: true}) cancel: EventEmitter;

  /**
   * Event fired when the dialog is closed. The event data will contain the closure reason.
   */
  @Event({composed: true}) done: EventEmitter<FileWithData[]>;

  @State() draggingOver = false;

  @State() helpText = helpTexts.creator;

  handleCancel() {
    this.cancel.emit();
    this.open = false;
  }

  // We need a separate event handler for clicking the background because it can receive events "through" other child components
  handleDismiss(e: any) {
    if (e.target.className === 'background-overlay') {
      e.preventDefault();
      this.handleCancel();
    }
  }

  handleDone() {
    // this.done.emit(this.decodedFiles);
    this.open = false;
  }

  handleSelectSetting(e: any) {
    console.log('Selected', e.detail);
    this.helpText = helpTexts[e.detail.value];
  }

  showPopper(refElement: string, contentElement: string) {
    this.popperInstance = createPopper(document.querySelector(refElement), document.querySelector(contentElement), {
      placement: 'bottom-start',
      modifiers: [{name: 'offset', options: {offset: [0, 10]}}],
    });
  }

  hidePopper() {
    this.popperInstance?.destroy();
  }

  render() {
    return (
      <Host style={{display: this.open ? 'block' : 'none'}}>
        <div class="background-overlay" onClick={e => this.handleDismiss(e)}>
          <div class="dialog">
            <div class="options">
              <div class="option">
                <verdocs-radio-button checked={false} name="template-sender" value={TemplateSenderTypes.EVERYONE} onSelect={e => this.handleSelectSetting(e)} />
                <div class="description">
                  <div class="name">Anyone on the Web</div>
                  <div
                    id="verdocs-template-sender-everyone-bubble"
                    class="help-bubble"
                    innerHTML={helpIcon}
                    onMouseEnter={() => this.showPopper('#verdocs-template-sender-everyone-bubble', '#verdocs-template-sender-everyone-tip')}
                    onMouseLeave={() => this.hidePopper()}
                    aria-describedby="tooltip"
                  />
                  <div id="verdocs-template-sender-everyone-tip" class="help-tip" role="tooltip">
                    Anyone on the web can create a Verdoc. This document's visibility setting must be 'Public on the web' or 'Shared to your organization, and public on the web.
                    <div id="arrow" data-popper-arrow></div>
                  </div>
                </div>
              </div>
              <div class="option">
                <verdocs-radio-button checked={false} name="template-sender" value={TemplateSenderTypes.EVERYONE_AS_CREATOR} onSelect={e => this.handleSelectSetting(e)} />
                <div class="description">
                  <div class="name">Anyone on the Web as me</div>
                  <div class="help"></div>
                </div>
              </div>
              <div class="option">
                <verdocs-radio-button checked={false} name="template-sender" value={TemplateSenderTypes.ORGANIZATION_MEMBER} onSelect={e => this.handleSelectSetting(e)} />
                <div class="description">
                  <div class="name">Anyone in my organization</div>
                  <div class="help"></div>
                </div>
              </div>
              <div class="option">
                <verdocs-radio-button
                  checked={false}
                  name="template-sender"
                  value={TemplateSenderTypes.ORGANIZATION_MEMBER_AS_CREATOR}
                  onSelect={e => this.handleSelectSetting(e)}
                />
                <div class="description">
                  <div class="name">Anyone in my organization as me</div>
                  <div class="help"></div>
                </div>
              </div>
              <div class="option">
                <verdocs-radio-button checked={false} name="template-sender" value={TemplateSenderTypes.CREATOR} onSelect={e => this.handleSelectSetting(e)} />
                <div class="description">
                  Me
                  <div class="help">Only you can create documents from this template.</div>
                </div>
              </div>
            </div>

            <div class="help">{this.helpText}</div>

            <div class="buttons">
              <verdocs-button label="Cancel" variant="outline" onPress={() => this.handleCancel()} />
              <verdocs-button label="Done" onPress={() => this.handleDone()} />
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
