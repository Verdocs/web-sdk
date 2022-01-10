import {Component, Prop, h, Event, EventEmitter, State} from '@stencil/core';

/**
 * Display a text input field. This adds a partially-transparent overlay and screen-centered dialog
 * box with a message and optional header/title. An OK button is shown that will dismiss the message.
 * It can also be dismissed by clicking the background overlay.
 */
@Component({
  tag: 'verdocs-ok-dialog',
  styleUrl: 'verdocs-ok-dialog.scss',
})
export class VerdocsOkDialog {
  /**
   * The title of the dialog. "title" is a reserved word, so we use heading.
   */
  @Prop() heading: string = '';

  /**
   * The message content to display.
   */
  @Prop() message: string = '';

  /**
   * Whether the dialog is currently being displayed. This allows it to be added to the DOM before being displayed.
   */
  @Prop() open: boolean = false;

  /**
   * Event fired when the dialog is closed. The event data will contain the closure reason.
   */
  @Event({composed: true}) closed: EventEmitter<'cancel' | 'ok'>;

  @State() addDummy: boolean = false;

  componentWillLoad() {
    // If we are running in Storybook, we need some fake extra rendering height to display properly.
    if (!!window?.['STORYBOOK_ENV']) {
      this.addDummy = true;
    }
  }

  componentDidLoad() {}

  handleClose(reason: 'cancel' | 'ok') {
    this.closed.emit(reason);
    this.open = false;
  }

  // We need a separate event handler for clicking the background because it can receive events "through" other child components
  handleDismiss(e: any) {
    if (e.target.className === 'background-overlay') {
      e.preventDefault();
      this.handleClose('cancel');
    }
  }

  render() {
    return (
      <div style={{display: this.open ? 'block' : 'none'}}>
        {this.addDummy ? <div style={{minHeight: '400px'}}>&nbsp;</div> : <div />}
        <div class="background-overlay" onClick={e => this.handleDismiss(e)}>
          <div class="dialog">
            <div class="heading">{this.heading}</div>
            <div class="content">
              {this.message}

              <div class="buttons">
                <verdocs-button label="OK" onPress={() => this.handleClose('ok')} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
