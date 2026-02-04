import {Component, Prop, h, Event, EventEmitter} from '@stencil/core';

@Component({
  tag: 'verdocs-signing-progress',
  styleUrl: 'verdocs-signing-progress.scss',
})
export class VerdocsSigningProgress {
  /**
   * Current field index (1-based)
   */
  @Prop() current: number = 0;

  /**
   * Total number of fields
   */
  @Prop() total: number = 0;

  /**
   * Display mode
   */
  @Prop() mode: 'start' | 'signing' | 'completed' = 'start';

  /**
   * Label to display for the current field
   */
  @Prop() fieldLabel: string = '';

  /**
   * Whether the current field has been completed (shows success message)
   */
  @Prop() fieldCompleted: boolean = false;

  /**
   * Emitted when user clicks Start
   */
  @Event({composed: true}) started: EventEmitter;

  /**
   * Emitted when user clicks Next
   */
  @Event({composed: true}) next: EventEmitter;

  /**
   * Emitted when user clicks Previous
   */
  @Event({composed: true}) previous: EventEmitter;

  /**
   * Emitted when user clicks Submit
   */
  @Event({composed: true}) exit: EventEmitter;

  /**
   * List of remaining fields to complete
   */
  @Prop() remainingFields: any[] = [];

  /**
   * Detailed progress counts for required and optional fields
   */
  @Prop() progress: {required: {remaining: number; total: number}; optional: {remaining: number; total: number}} | null = null;

  renderSuccessIcon() {
    return (
      <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2ZM10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17C13.866 17 17 13.866 17 10C17 6.13401 13.866 3 10 3ZM13.3584 7.64645C13.532 7.82001 13.5513 8.08944 13.4163 8.28431L13.3584 8.35355L9.35355 12.3584C9.17999 12.532 8.91056 12.5513 8.71569 12.4163L8.64645 12.3584L6.64645 10.3584C6.45118 10.1632 6.45118 9.84658 6.64645 9.65131C6.82001 9.47775 7.08944 9.45846 7.28431 9.59346L7.35355 9.65131L9 11.298L12.6513 7.64645C12.8466 7.45118 13.1632 7.45118 13.3584 7.64645Z"
          fill="#107C10"
        />
      </svg>
    );
  }

  renderContent() {
    if (this.mode === 'start') {
      return <div class="field-label">{this.fieldLabel}</div>;
    }

    if (this.fieldCompleted) {
      return (
        <div class="field-completed">
          <div class="icon">{this.renderSuccessIcon()}</div>
          <span class="text">Ready to submit.</span>
        </div>
      );
    }

    return <div class="field-label">{this.fieldLabel}</div>;
  }

  renderFooter() {
    if (this.mode === 'start') {
      return (
        <button class="btn start" onClick={() => this.started.emit()}>
          Start Signing
        </button>
      );
    }

    return (
      <div class="nav-buttons">
        {this.progress && this.progress.required.remaining === 0 ? (
          <button class="btn submit" onClick={() => this.exit.emit()}>
            Submit
          </button>
        ) : (
          [
            <button class="btn previous" disabled={this.current <= 1} onClick={() => this.previous.emit()}>
              Previous
            </button>,
            <button class="btn next" disabled={this.current >= this.total} onClick={() => this.next.emit()}>
              Next
            </button>,
          ]
        )}
      </div>
    );
  }

  renderCompleted() {
    return (
      <div class="card completed">
        <div class="header-completed">
          <div class="icon">{this.renderSuccessIcon()}</div>
          Ready to Submit
        </div>
        <div class="description">You have entered all requested signatures. Select Submit to complete the signing process.</div>
        <div class="separator" />
        <button class="btn submit" onClick={() => this.exit.emit()}>
          Submit
        </button>
      </div>
    );
  }

  render() {
    if (this.mode === 'completed') {
      return this.renderCompleted();
    }

    return (
      <div class="card">
        <div class="header">
          {this.progress
            ? [
                <div class="progress-line">
                  {this.progress.required.remaining} of {this.progress.required.total} required fields remaining
                </div>,
                this.progress.optional.total > 0 ? (
                  <div class="progress-line optional">
                    {this.progress.optional.remaining} of {this.progress.optional.total} optional fields remaining
                  </div>
                ) : null,
              ]
            : this.remainingFields && this.remainingFields.length > 0
              ? `${this.remainingFields.length} fields remaining`
              : `${this.current} of ${this.total} fields`}
        </div>

        <div class="body">{this.renderContent()}</div>

        <div class="separator" />

        {this.renderFooter()}
      </div>
    );
  }
}
