import {Component, Element, Prop, Host, h} from '@stencil/core';
import {VerdocsToast} from '../../../utils/Toast';

const ClearIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.881 122.88"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M61.44,0c33.933,0,61.441,27.507,61.441,61.439 c0,33.933-27.508,61.44-61.441,61.44C27.508,122.88,0,95.372,0,61.439C0,27.507,27.508,0,61.44,0L61.44,0z M81.719,36.226 c1.363-1.363,3.572-1.363,4.936,0c1.363,1.363,1.363,3.573,0,4.936L66.375,61.439l20.279,20.278c1.363,1.363,1.363,3.573,0,4.937 c-1.363,1.362-3.572,1.362-4.936,0L61.44,66.376L41.162,86.654c-1.362,1.362-3.573,1.362-4.936,0c-1.363-1.363-1.363-3.573,0-4.937 l20.278-20.278L36.226,41.162c-1.363-1.363-1.363-3.573,0-4.936c1.363-1.363,3.573-1.363,4.936,0L61.44,56.504L81.719,36.226 L81.719,36.226z"/></g></svg>`;
const CopyIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M15.988 3.012A2.25 2.25 0 0118 5.25v6.5A2.25 2.25 0 0115.75 14H13.5V7A2.5 2.5 0 0011 4.5H8.128a2.252 2.252 0 011.884-1.488A2.25 2.25 0 0112.25 1h1.5a2.25 2.25 0 012.238 2.012zM11.5 3.25a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v.25h-3v-.25z" clip-rule="evenodd" /><path fill-rule="evenodd" d="M2 7a1 1 0 011-1h8a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V7zm2 3.25a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75zm0 3.5a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75z" clip-rule="evenodd" /></svg>`;

/**
 * Display a text input field. This is just a standard HTML input field with minimal markup to fit the
 * visual styles of the other components. Note that events "bubble" from the input field to the container,
 * so you can subscribe to the same DOM events (input, blur, etc) that a normal input would emmit.
 */
@Component({
  tag: 'verdocs-text-input',
  styleUrl: 'verdocs-text-input.scss',
})
export class VerdocsTextInput {
  private inputEl: HTMLInputElement;

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
   * If desired, the autocomplete attribute to set.
   */
  @Prop() autocomplete: string = '';

  /**
   * If supplied, a help icon will be displayed to provide the user more information.
   */
  @Prop() helpText: string = '';

  /**
   * If set, a clear button will be displayed.
   */
  @Prop() clearable = false;

  /**
   * If set, a copy-to-clipboard button will be displayed. NOTE: A field may not be
   * both clearable and copyable. If both properties are set to true, copyable will
   * be ignored.
   */
  @Prop() copyable = false;

  /**
   * The type of field to render. Only text-type fields are allowed here for the current styling. Additional types
   * (e.g. a date picker) will be supported by other controls in the future.
   */
  @Prop() type: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url' = 'text';

  /**
   * Should the field be disabled?
   */
  @Prop() disabled: boolean = false;

  /**
   * Should the field be required?
   */
  @Prop() required: boolean = false;

  copyToClipboard() {
    this.inputEl.select();
    navigator.clipboard
      .writeText(this.value)
      .then(() => VerdocsToast('Copied!'))
      .catch(e => console.log('Error copying to clipboard', e));
  }

  render() {
    return (
      <Host class={`input-field ${this.clearable ? 'clearable' : ''} ${this.copyable ? 'copyable' : ''}`}>
        <label>
          {this.label && (
            <div class="input-label">
              {this.label + ':'}
              {this.required && <span class="required">*</span>}
            </div>
          )}

          <div class="input-container">
            <input
              type={this.type}
              value={this.value}
              required={this.required}
              class="input-element"
              data-lpignore="true"
              disabled={this.disabled}
              placeholder={this.placeholder}
              autoComplete={this.autocomplete}
              ref={el => (this.inputEl = el as HTMLInputElement)}
              onInput={(e: any) => (this.value = e.target.value)}
            />
            {this.clearable && this.value && (
              <span
                innerHTML={ClearIcon}
                class="clear"
                onClick={() => {
                  // We need to allow the onInput event to fire first in case
                  // the user was focused on this field before clicking clear.
                  setTimeout(() => {
                    this.value = '';
                    this.inputEl?.setAttribute('value', '');
                    // We need to allow the value to "settle"
                    setTimeout(() => {
                      this.inputEl?.dispatchEvent(new Event('focusout'));
                      this.inputEl?.blur();
                    }, 50);
                  }, 50);
                }}
              />
            )}

            {!this.clearable && this.copyable && this.value && <span innerHTML={CopyIcon} class="copy" onClick={() => this.copyToClipboard()} />}
          </div>

          {this.helpText && <verdocs-help-icon text={this.helpText} />}
        </label>
      </Host>
    );
  }
}
