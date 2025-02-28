import AirDatepicker from 'air-datepicker';
import {Component, Element, Prop, Host, h, State, Method} from '@stencil/core';
import {VerdocsToast} from '../../../utils/Toast';
import localeEn from 'air-datepicker/locale/en';

/**
 * Display a date input field.
 *
 * ```ts
 * <verdocs-date-input type="text" label="DOB" placeholder="Date of Birth..." value="" />
 * ```
 */
@Component({
  tag: 'verdocs-date-input',
  styleUrl: 'verdocs-date-input.scss',
})
export class VerdocsDateInput {
  private inputEl: HTMLInputElement;
  private picker: AirDatepicker<HTMLElement> | null = null;

  @Element()
  hostEl: HTMLElement;

  /**
   * The initial value for the input field.
   */
  @Prop({mutable: true, reflect: true}) value: string = '';

  /**
   * The label for the field.
   */
  @Prop() label: string = '';

  /**
   * The placeholder for the field.
   */
  @Prop() placeholder: string = '';

  /**
   * If supplied, a help icon will be displayed to provide the user more information.
   */
  @Prop() helpText: string = '';

  /**
   * Should the field be disabled?
   */
  @Prop() disabled: boolean = false;

  /**
   * Should the field be required?
   */
  @Prop() required: boolean = false;

  @State() showingPw: boolean = false;
  @State() focused?: boolean = false;
  @State() containerId = `verdocs-date-input-${Math.random().toString(36).substring(2, 11)}`;

  @Method()
  async focusField() {
    // Our input field is fake, so we fake the flash too
    this.focused = true;
    this.picker?.show();
    setTimeout(() => {
      this.focused = false;
    }, 500);
  }

  componentDidLoad() {
    this.picker = new AirDatepicker<HTMLElement>(`#${this.containerId}`, {
      locale: localeEn,
      isMobile: true,
      autoClose: true,
      onShow: () => (this.focused = true),
      onHide: () => (this.focused = false),
      onSelect: ({date, formattedDate}) => {
        const event = new CustomEvent('input', {detail: {date, formattedDate}});
        this.hostEl.dispatchEvent(event);
      },
    });
  }

  copyToClipboard() {
    this.inputEl.select();
    navigator.clipboard
      .writeText(this.value)
      .then(() => VerdocsToast('Copied!'))
      .catch(e => console.log('Error copying to clipboard', e));
  }

  render() {
    return (
      <Host class={`input-field`}>
        <label>
          {this.label && (
            <div class="input-label">
              {this.label + ':'}
              {this.required && <span class="required">*</span>}
            </div>
          )}

          <div class="input-container">
            <input
              type="text"
              value={this.value}
              required={this.required}
              class="input-element"
              data-lpignore="true"
              id={this.containerId}
              disabled={this.disabled}
              placeholder={this.placeholder}
              // onBlur={(e: any) => this.blur?.emit(e.target.value)}
              ref={el => (this.inputEl = el as HTMLInputElement)}
              onInput={(e: any) => (this.value = e.target.value)}
            />
          </div>

          {this.helpText && <verdocs-help-icon text={this.helpText} />}
        </label>
      </Host>
    );
  }
}
