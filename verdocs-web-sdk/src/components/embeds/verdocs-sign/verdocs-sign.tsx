import {Host} from '@stencil/core';
import {IActiveSession} from '@verdocs/js-sdk/Users/Types';
// import {setActiveEndpoint} from '@verdocs/js-sdk/HTTP/Transport';
// import {getSigningSession} from '@verdocs/js-sdk/Documents/Documents';
import {Component, Prop, State, h, Event, EventEmitter} from '@stencil/core';
import {VerdocsEndpoint} from '@verdocs/js-sdk/HTTP';
import {getEndpoint, setActiveEndpoint} from '@verdocs/js-sdk/HTTP/Transport';
import {getSigningSession, getDocument, getDocumentFile, IDocument} from '@verdocs/js-sdk/Documents/Documents';
import {updateRecipientStatus} from '@verdocs/js-sdk/Documents/Recipients';
// import {getSession} from '../../../api/session';

const BASE_URL = 'https://stage-api.verdocs.com';

/**
 * Display a document signing experience.
 */
@Component({
  tag: 'verdocs-sign',
  styleUrl: 'verdocs-sign.scss',
})
export class VerdocsSign {
  /**
   * If `source` is set to `verdocs-sign`, this should be set to a valid invitation code to activate a
   * signing session.
   */
  @Prop() documentid: string | null = null;

  /**
   * If `source` is set to `verdocs-sign`, this should be set to a valid invitation code to activate a
   * signing session.
   */
  @Prop() roleid: string | null = null;

  /**
   * If `source` is set to `verdocs-sign`, this should be set to a valid invitation code to activate a
   * signing session.
   */
  @Prop() invitecode: string | null = null;

  @State() endpoint = null;

  /**
   * Event fired when a signing session has been obtained.
   */
  @Event({composed: true}) authenticated: EventEmitter<any>;

  @State() isAuthenticated: boolean = false;
  @State() displayMode: string = 'login';
  @State() username: string = '';
  @State() password: string = '';
  @State() loggingIn: boolean = false;
  @State() activeSession: IActiveSession | null = null;
  @State() loginError: string | null = null;
  @State() recipient = null;
  @State() signerToken = null;
  @State() pdfUrl = null;
  @State() document: IDocument | null = null;

  componentWillLoad() {
    const endpoint = new VerdocsEndpoint({baseURL: BASE_URL});
    setActiveEndpoint(endpoint);
  }

  async componentDidLoad() {
    try {
      console.log('[SIGN] Processing invite code', this.documentid, this.roleid, this.invitecode);
      const {session, recipient, signerToken} = await getSigningSession({
        documentId: this.documentid,
        roleId: this.roleid,
        inviteCode: this.invitecode,
      });
      console.log('[SIGN] Got signing session', session, recipient);
      this.recipient = recipient;
      this.signerToken = signerToken;
      getEndpoint().setAuthorization(signerToken);

      console.log('Getting document details');
      const document = await getDocument(this.documentid);
      this.document = document;
      console.log('got document details', document);

      this.pdfUrl = `${BASE_URL}/documents/${this.documentid}/envelope_documents/${document.envelope_document_id}?file=true`;
      console.log('Got PDF url', this.pdfUrl);
      // https://stage-api.verdocs.com/documents/f484a296-4f4c-4783-9adf-a3302915a503/envelope_documents/e7968994-b859-40ad-8577-c7b3a1fe76bd?file=true
      // https://stage-api.verdocs.com/envelopes/f484a296-4f4c-4783-9adf-a3302915a503/envelope_documents/e7968994-b859-40ad-8577-c7b3a1fe76bd?file=true
      //   // const session = getSession(this.source);
      //   // if (session) {
      //   //   this.isAuthenticated = true;
      //   //   this.activeSession = session;
      //   //   this.authenticated.emit({authenticated: true, session});
      //   // } else {
      //   //   this.authenticated.emit({authenticated: false, session: null});
      //   // }
    } catch (e) {
      console.log('Error with signing session', e);
    }
  }

  handleClearError() {
    this.loginError = null;
  }

  handleClickAgree() {
    console.log('agree clicked');
    updateRecipientStatus(this.documentid, this.roleid, 'update', {agreed: true})
      .then(r => {
        console.log('update result', r);
        this.recipient = r;
      })
      .catch(e => {
        console.log('update failure', e);
      });
  }

  async savePDF() {
    const fileName = `${this.document.name} - ${this.document.updated_at.split('T')[0]}.pdf`;
    const data = await getDocumentFile(this.documentid, this.document.envelope_document_id);

    // This is better in React than doing window.href= or similar to trigger a download. For a description of the technique
    // see https://stackoverflow.com/questions/8126623/downloading-canvas-element-to-an-image
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function () {
      let a = document.createElement('a');
      a.href = window.URL.createObjectURL(xhr.response);
      a.download = fileName;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();
    };

    const url = `data:application/pdf;base64,${data}`;
    console.log('url', url.length, url);
    xhr.open('GET', `data:application/pdf;base64,${data}`);
    xhr.send();
  }

  async handleOptionSelected(e) {
    switch (e.detail.id) {
      case 'later':
        break;
      case 'claim':
        break;
      case 'decline':
        break;
      case 'print':
        break;
      case 'download':
        this.savePDF().catch(() => {});
        break;
    }
  }

  render() {
    const menuOptions = [
      {id: 'later', label: 'Finish Later'}, //
      {id: 'claim', label: 'Claim the Document', disabled: true},
      {id: 'decline', label: 'Decline to Sign'},
      {id: 'print', label: 'Print Without Signing'},
      {id: 'download', label: 'Download'},
    ];

    return (
      <Host class={{storybook: !!window?.['STORYBOOK_ENV'], agreed: this.recipient?.agreed}}>
        <div class="header">
          <div class="intro">Please review and act on these documents.</div>
          <div class="toolbar">
            <div class="tools">
              <verdocs-dropdown options={menuOptions} onOptionSelected={e => this.handleOptionSelected(e)} />
              <div class="agree-checkbox">
                <input
                  type="checkbox"
                  value="None"
                  id="agree-checkbox-element"
                  name="agree"
                  disabled={this.recipient?.agreed}
                  checked={this.recipient?.agreed}
                  onChange={() => this.handleClickAgree()}
                />
                <label htmlFor="agree-checkbox-element" />
              </div>
              I agree to use electronic records and signatures.
              <div style={{flex: '1'}} />
              <verdocs-button label="Start" disabled={!this.recipient?.agreed} />
            </div>
          </div>
        </div>

        {!this.recipient?.agreed ? <div class="cover" /> : <div style={{display: 'none'}} />}

        <div class="document">{this.pdfUrl ? <verdocs-view source={this.pdfUrl} token={this.signerToken} /> : <div>Authenticating...</div>}</div>
      </Host>
    );
  }
}
