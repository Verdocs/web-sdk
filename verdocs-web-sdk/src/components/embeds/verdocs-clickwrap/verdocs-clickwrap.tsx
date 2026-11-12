import {Component, Element, Event, EventEmitter, Host, Prop, State, h} from '@stencil/core';
import {
  acceptClickwrap,
  declineClickwrap,
  getClickwrapSession,
  IClickwrapOutcomeResult,
  IClickwrapPublicSession,
  IClickwrapSessionAgreement,
  ISendClickwrapEventRequest,
  sendClickwrapEvent,
  VerdocsEndpoint,
} from '@verdocs/js-sdk';
import {capturePresentation} from '../../../utils/ClickwrapCapture';
import {runConspicuousnessChecks} from '../../../utils/ClickwrapChecks';
import {SDKError} from '../../../utils/errors';

// How close to the bottom (in px) counts as scrolled to the end. Browsers report fractional scroll positions.
const SCROLL_END_SLACK = 4;

/**
 * Show clickwrap terms and record the person's acceptance or decline. Your server creates the session with
 * createClickwrapSession and hands the token to the page; this component does the rest. When the person is already
 * current there's no token, so pass an empty string and the component emits `current` and renders nothing.
 *
 * ```ts
 * <verdocs-clickwrap
 *   token={session.token ?? ''}
 *   onAccepted={({detail}) => console.log('Accepted', detail.acceptance_id)}
 *   onSdkError={({detail}) => console.log('SDK error', detail)}
 *   />
 * ```
 */
@Component({
  tag: 'verdocs-clickwrap',
  styleUrl: 'verdocs-clickwrap.scss',
  shadow: false,
})
export class VerdocsClickwrap {
  @Element() component: HTMLElement;

  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint | null = null;

  /**
   * The session token from createClickwrapSession. Empty means the person is already current: the component emits
   * `current` and renders nothing.
   */
  @Prop() token: string = '';

  /**
   * Where the component runs. The Verdocs hosted page sets 'hosted'; everything else uses the default.
   */
  @Prop() surface: 'component' | 'hosted' = 'component';

  /**
   * The accept button's label. Keep "agree" or "accept" in it; a console warning flags labels without either.
   */
  @Prop() acceptLabel: string = 'Agree and continue';

  /**
   * The decline button's label.
   */
  @Prop() declineLabel: string = 'Decline';

  /**
   * Each agreement checkbox's label. {name} becomes the agreement's name. In inline mode, the text from {name} to the
   * end of the label links to the agreement's full text.
   */
  @Prop() checkboxLabel: string = 'I have read and agree to the {name}';

  /**
   * The heading shown above the terms in modal mode.
   */
  @Prop() heading: string = 'Please review and accept';

  /**
   * Event fired when there's nothing to accept (the token is empty). Nothing is rendered.
   */
  @Event({composed: true}) current: EventEmitter<void>;

  /**
   * Event fired once the terms are on screen.
   */
  @Event({composed: true}) shown: EventEmitter<IClickwrapPublicSession>;

  /**
   * Event fired when the person accepts and the record is saved.
   */
  @Event({composed: true}) accepted: EventEmitter<IClickwrapOutcomeResult>;

  /**
   * Event fired when the person declines and the record is saved.
   */
  @Event({composed: true}) declined: EventEmitter<IClickwrapOutcomeResult>;

  /**
   * Event fired if an error occurs, such as an expired token or a failed save. The component stays usable after a
   * failed save, so the person can try again.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  @State() session: IClickwrapPublicSession | null = null;
  @State() checked: Record<string, boolean> = {};
  @State() scrolled: Record<string, boolean> = {};
  @State() openVersionId: string | null = null;
  @State() submitting = false;
  @State() finished = false;

  // The endpoint prop is immutable, so the default endpoint (when none is given) lives here
  private api: VerdocsEndpoint;
  private scrollDepth = 0;
  private reportedScrollEnd = false;
  private reportedShown = false;

  async componentWillLoad() {
    this.api = this.endpoint || VerdocsEndpoint.getDefault();

    if (!this.token) {
      this.current?.emit();
      return;
    }

    try {
      this.session = await getClickwrapSession(this.api, this.token);
      this.applyBrand();
    } catch (e) {
      console.log('[CLICKWRAP] Unable to load session', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  componentDidRender() {
    if (!this.session || this.finished) {
      return;
    }

    // Terms short enough to fit without scrolling count as read to the end
    this.component.querySelectorAll<HTMLElement>('.cw-terms').forEach(box => this.checkScroll(box));

    if (!this.reportedShown) {
      this.reportedShown = true;
      this.report({event: 'shown'});
      this.shown?.emit(this.session);
      try {
        runConspicuousnessChecks(this.component);
      } catch (e) {
        console.warn('[CLICKWRAP] Unable to run the conspicuousness checks', e);
      }
    }
  }

  // The session's brand colors fill in only what the host page hasn't set, so the customer's own CSS still wins
  private applyBrand() {
    const brand = this.session?.brand;
    if (!brand) {
      return;
    }

    const computed = getComputedStyle(this.component);
    const apply = (name: string, value: string | null) => {
      if (value && !computed.getPropertyValue(name).trim()) {
        this.component.style.setProperty(name, value);
      }
    };
    apply('--verdocs-primary-color', brand.primary_color);
    apply('--verdocs-link-color', brand.primary_color);
    apply('--verdocs-primary-color-hover', brand.secondary_color);
  }

  // Events are fire-and-forget: a lost event shouldn't stop someone from accepting
  private report(event: ISendClickwrapEventRequest) {
    sendClickwrapEvent(this.api, this.token, {...event, client_at: new Date().toISOString()}).catch(e =>
      console.warn('[CLICKWRAP] Unable to record event', event.event, e),
    );
  }

  private labelFor(agreement: IClickwrapSessionAgreement) {
    return this.checkboxLabel.replace('{name}', agreement.name);
  }

  private versionsIn(box: HTMLElement) {
    return (box.dataset.versions || '').split(',').filter(Boolean);
  }

  private checkScroll(box: HTMLElement) {
    // A box that hasn't been laid out yet reports no height at all, which isn't the same as short terms
    if (!box.scrollHeight) {
      return;
    }

    const max = box.scrollHeight - box.clientHeight;
    const depth = max <= 0 ? 1 : Math.min(1, box.scrollTop / max);
    this.scrollDepth = Math.max(this.scrollDepth, depth);

    if (max - box.scrollTop > SCROLL_END_SLACK) {
      return;
    }

    const unread = this.versionsIn(box).filter(id => !this.scrolled[id]);
    if (!unread.length) {
      return;
    }

    this.scrolled = {...this.scrolled, ...Object.fromEntries(unread.map(id => [id, true]))};
    if (!this.reportedScrollEnd && this.session.agreements.every(a => this.scrolled[a.version_id])) {
      this.reportedScrollEnd = true;
      this.report({event: 'scrolled_to_end'});
    }
  }

  private isLocked(agreement: IClickwrapSessionAgreement) {
    return this.session.require_scroll && !this.scrolled[agreement.version_id];
  }

  private toggle(agreement: IClickwrapSessionAgreement, value: boolean) {
    this.checked = {...this.checked, [agreement.version_id]: value};
    this.report({event: value ? 'checked' : 'unchecked', version_id: agreement.version_id});
  }

  private get allChecked() {
    return !!this.session && this.session.agreements.every(a => this.checked[a.version_id]);
  }

  private async finish(outcome: 'accept' | 'decline') {
    const {session} = this;
    const linkedTerms = session.mode === 'inline' ? session.agreements.map(a => ({name: a.name, content: a.content})) : [];
    const params = {
      surface: this.surface,
      labels: {
        agreements: session.agreements.map(a => ({version_id: a.version_id, label: this.labelFor(a)})),
        button: outcome === 'accept' ? this.acceptLabel : this.declineLabel,
      },
      presentation: capturePresentation(this.component, linkedTerms),
      scroll_depth: this.scrollDepth,
      viewport: {width: window.innerWidth, height: window.innerHeight, device_pixel_ratio: window.devicePixelRatio || 1},
      locale: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    this.submitting = true;
    try {
      if (outcome === 'accept') {
        const result = await acceptClickwrap(this.api, this.token, params);
        this.finished = true;
        this.accepted?.emit(result);
      } else {
        const result = await declineClickwrap(this.api, this.token, params);
        this.finished = true;
        this.declined?.emit(result);
      }
    } catch (e) {
      console.log('[CLICKWRAP] Unable to record outcome', outcome, e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    } finally {
      this.submitting = false;
    }
  }

  private renderLabel(agreement: IClickwrapSessionAgreement, linked: boolean) {
    const label = this.labelFor(agreement);
    const start = this.checkboxLabel.indexOf('{name}');
    if (!linked || start < 0) {
      return <span class="cw-check-label">{label}</span>;
    }

    // The link runs from the name to the end of the label. The api's text check puts a space at every tag boundary,
    // so text after a closing link tag would no longer match the label we send.
    return (
      <span class="cw-check-label">
        {label.slice(0, start)}
        <a
          href="#"
          class="cw-link"
          data-cw-link
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            this.openVersionId = agreement.version_id;
          }}
        >
          {label.slice(start)}
        </a>
      </span>
    );
  }

  private renderChecks(linked: boolean) {
    return (
      <div class="cw-checks" data-cw-notice>
        {this.session.agreements.map(agreement => (
          <label class={{'cw-check': true, 'locked': this.isLocked(agreement)}} key={agreement.version_id}>
            <input
              type="checkbox"
              checked={!!this.checked[agreement.version_id]}
              disabled={this.isLocked(agreement) || this.submitting}
              onChange={e => this.toggle(agreement, (e.target as HTMLInputElement).checked)}
            />
            {this.renderLabel(agreement, linked)}
          </label>
        ))}
      </div>
    );
  }

  private renderButtons() {
    return (
      <div class="cw-buttons">
        <button type="button" class="cw-decline" disabled={this.submitting} onClick={() => this.finish('decline')}>
          {this.declineLabel}
        </button>
        <button type="button" class="cw-accept" data-cw-accept disabled={!this.allChecked || this.submitting} onClick={() => this.finish('accept')}>
          {this.acceptLabel}
        </button>
      </div>
    );
  }

  private renderScrollHint() {
    const unread = this.session.require_scroll && this.session.agreements.some(a => !this.scrolled[a.version_id]);
    return unread ? <div class="cw-scroll-hint">Scroll to the end of the terms to continue.</div> : null;
  }

  private renderModal() {
    const versions = this.session.agreements.map(a => a.version_id).join(',');
    return (
      <div class="cw-overlay">
        <div class="cw-dialog" role="dialog" aria-modal="true" aria-label={this.heading}>
          <div class="cw-heading">{this.heading}</div>
          <div class="cw-terms" data-versions={versions} tabindex="0" onScroll={e => this.checkScroll(e.target as HTMLElement)}>
            {this.session.agreements.map(agreement => (
              <section class="cw-agreement" key={agreement.version_id}>
                <h2 class="cw-agreement-name">{agreement.name}</h2>
                <div class="cw-agreement-content" innerHTML={agreement.content} />
              </section>
            ))}
          </div>
          {this.renderScrollHint()}
          {this.renderChecks(false)}
          {this.renderButtons()}
        </div>
      </div>
    );
  }

  private renderInline() {
    const open = this.session.agreements.find(a => a.version_id === this.openVersionId);
    return [
      this.renderChecks(true),
      this.renderScrollHint(),
      this.renderButtons(),
      open && (
        <div class="cw-overlay" onClick={e => (e.target as HTMLElement).classList.contains('cw-overlay') && (this.openVersionId = null)}>
          <div class="cw-dialog" role="dialog" aria-modal="true" aria-label={open.name}>
            <div class="cw-heading">{open.name}</div>
            <div class="cw-terms" data-versions={open.version_id} tabindex="0" onScroll={e => this.checkScroll(e.target as HTMLElement)}>
              <div class="cw-agreement-content" innerHTML={open.content} />
            </div>
            <div class="cw-buttons">
              <button type="button" class="cw-close" onClick={() => (this.openVersionId = null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      ),
    ];
  }

  render() {
    if (!this.session || this.finished) {
      return <Host class="empty" />;
    }

    return <Host class={this.session.mode}>{this.session.mode === 'inline' ? this.renderInline() : this.renderModal()}</Host>;
  }
}
