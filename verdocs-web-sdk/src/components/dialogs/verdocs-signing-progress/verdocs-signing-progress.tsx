import {IEnvelopeField, isFieldFilled} from '@verdocs/js-sdk';
import {Component, Prop, h, Event, EventEmitter} from '@stencil/core';
import {getFieldLabel} from '../../../utils/utils';

@Component({
  tag: 'verdocs-signing-progress',
  styleUrl: 'verdocs-signing-progress.scss',
})
export class VerdocsSigningProgress {
  /**
   * Display mode
   */
  @Prop() mode: 'start' | 'signing' | 'completed' = 'start';

  /**
   * The name of the currently focused field (to highlight it and show its label)
   */
  @Prop() focusedField: string = '';

  /**
   * All fillable fields for the current recipient
   */
  @Prop() fields: IEnvelopeField[] = [];

  /**
   * All fields for the recipient, used to check filled status (may include non-fillable)
   */
  @Prop() recipientFields: IEnvelopeField[] = [];

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

  renderContent(fieldLabel: string, fieldCompleted: boolean) {
    if (this.mode === 'start') {
      return <div class="field-label">{fieldLabel}</div>;
    }

    if (fieldCompleted) {
      return (
        <div class="field-completed">
          <div class="icon">{this.renderSuccessIcon()}</div>
          <span class="text">Ready to submit.</span>
        </div>
      );
    }

    return <div class="field-label">{fieldLabel}</div>;
  }

  renderFooter(current: number, total: number, requiredRemaining: number) {
    if (this.mode === 'start') {
      return (
        <button class="btn start" onClick={() => this.started.emit()}>
          Start Signing
        </button>
      );
    }

    return (
      <div class="nav-buttons">
        {requiredRemaining === 0 ? (
          <button class="btn submit" onClick={() => this.exit.emit()}>
            Submit
          </button>
        ) : (
          [
            <button class="btn previous" disabled={current <= 1} onClick={() => this.previous.emit()}>
              Previous
            </button>,
            <button class="btn next" disabled={current >= total} onClick={() => this.next.emit()}>
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

    const isFilled = (f: IEnvelopeField) =>
      isFieldFilled(f, this.recipientFields) && (f.type !== 'dropdown' || !!f.value) && (f.type !== 'radio' || f.value === 'true') && (f.type !== 'checkbox' || f.value === 'true');

    const requiredFields = this.fields.filter(f => f.required);
    const requiredRemaining = requiredFields.filter(f => !isFilled(f)).length;

    const optionalFields = this.fields.filter(f => !f.required);
    const optionalRemaining = optionalFields.filter(f => !isFilled(f)).length;

    const focusedFieldObj = this.fields.find(f => f.name === this.focusedField);
    const currentIndex = this.fields.findIndex(f => f.name === this.focusedField) + 1;
    const totalFields = this.fields.length;

    return (
      <div class="card">
        <div class="header">
          <div class="progress-line">
            {requiredRemaining} of {requiredFields.length} required fields remaining
          </div>
          {optionalFields.length > 0 && (
            <div class="progress-line optional">
              {optionalRemaining} of {optionalFields.length} optional fields remaining
            </div>
          )}
        </div>

        <div class="body">{this.renderContent(getFieldLabel(focusedFieldObj), focusedFieldObj ? !!isFilled(focusedFieldObj) : false)}</div>

        <div class="separator" />

        {this.renderFooter(Math.max(1, currentIndex), totalFields, requiredRemaining)}
      </div>
    );
  }
}
