import {Component, Prop, h, Event, EventEmitter, State, Host} from '@stencil/core';

/**
 * Display a dialog that allows the user to specify a signature image, either by using a signature-font-generated image
 * based on their full name, or by hand-drawing their signature with a mouse or tablet.
 */
@Component({
  tag: 'verdocs-signature-dialog',
  styleUrl: 'verdocs-signature-dialog.scss',
})
export class VerdocsSignatureDialog {
  private canvasElement?: HTMLCanvasElement;

  /**
   * Initial signature text
   */
  @Prop() name: string = '';

  /**
   * Fired when the user completes the dialog and clicks Adopt. The event detail will contain a base64-encoded string
   * representation of the signature adopted.
   */
  @Event({composed: true}) next: EventEmitter<string>;

  /**
   * Event fired when the step is cancelled. This is called exit to avoid conflicts with the JS-reserved "cancel" event name.
   */
  @Event({composed: true}) exit: EventEmitter;

  @State() fontLoaded = false;

  @State() enteredName: string = '';

  @State() mode: string = 'type';

  componentWillLoad() {
    this.enteredName = this.name;

    // TODO
    // const ds = new FontFace('Dancing Script', 'url(https://fonts.gstatic.com/s/dancingscript/v19/If2cXTr6YS-zF4S-kcSWSVi_sxjsohD9F50Ruu7BMSo3Sup6hNX6plRP.woff)');
    // ds.load().then(font => {
    //   document.fonts.add(font);
    //   this.fontLoaded = true;
    // });
  }

  componentDidLoad() {
    this.redrawSignature();
  }

  componentDidUpdate() {
    this.redrawSignature();
  }

  redrawSignature() {
    if (!this.canvasElement) {
      return;
    }

    const canvasWidth = this.canvasElement.width;

    const context = this.canvasElement.getContext('2d');
    context.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

    let fontSize = 100;
    do {
      fontSize -= 2;
      context.font = `${fontSize}px Dancing Script`;
    } while (context.measureText(this.enteredName).width > canvasWidth - 32); // 32px padding each side

    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = `${fontSize}px Dancing Script`;
    context.fillText(this.enteredName, this.canvasElement.width / 2, this.canvasElement.height / 2);
  }

  handleNameChange(e: any) {
    this.enteredName = e.target.value;
  }

  handleCancel(e: any) {
    e.stopPropagation();
    e.preventDefault();
    this.exit.emit();
  }

  handleAdopt(e: any) {
    e.stopPropagation();
    e.preventDefault();
    const data = this.canvasElement.toDataURL('image/png');
    this.next.emit(data);
  }

  /*
  selColor(hex: string) {
    this.color = hex;
    this.animateDraw();
  }

  stopDraw() {
    this.paint = false;
    this.adoptedAndSigned = !this.hasSignature();
  }

  draw(e) {
    this.paint = true;
    this.addPoints(e, false);
    this.animateDraw();
  }

  recordPoints(e) {
    if (this.paint) {
      this.addPoints(e, true);
      this.animateDraw();
    }
  }

  animateDraw() {
    this.canvas.clearRect(0, 0, this.canvas.canvas.offsetWidth, this.canvas.canvas.offsetHeight);

    this.canvas.strokeStyle = this.color || '#000000';
    this.canvas.lineJoin = 'round';
    this.canvas.lineWidth = 3;

    for (let i = 0; i < this.points.length; i++) {
      this.canvas.beginPath();
      if (this.points[i].drag && i) {
        this.canvas.moveTo(this.points[i - 1].x, this.points[i - 1].y);
        // this.canvas.arc(this.points[i - 1].x, this.points[i - 1].y, 2, 0, 2 * Math.PI, false);
      } else {
        this.canvas.moveTo(this.points[i].x - 1, this.points[i].y);
        // this.canvas.arc(this.points[i].x, this.points[i].y, 2, 0, 2 * Math.PI, false);
      }

      this.canvas.lineTo(this.points[i].x, this.points[i].y);
      this.canvas.closePath();
      this.canvas.stroke();
    }
  }

  drawCurve(color: string, curve: number) {
    this.canvas.beginPath();
  }



  addPoints(e, drag: boolean) {
    if (window) {
      let x;
      let y;
      e.preventDefault();
      if (e.touches && e.touches.length > 0) {
        x = e.touches[0].clientX;
      } else {
        x = e.clientX;
      }

      if (e.touches && e.touches.length > 0) {
        y = e.touches[0].clientY;
      } else {
        y = e.clientY;
      }
      const rect = this.signatureCanvas.nativeElement.getBoundingClientRect();
      this.points.push({
        x: x - rect.left,
        y: y - rect.top,
        drag: drag
      });
    }
  }

  clearPad() {
    this.canvas.clearRect(0, 0, this.canvas.canvas.offsetWidth, this.canvas.canvas.offsetHeight);
    this.points = [];
    this.adoptedAndSigned = !this.hasSignature();
  }

    async adoptAndSign() {
    try {
      this.adoptedAndSigned = true;
      await this.updateFullName();
      await this.captureSignatureFromCanvas();
      const message = this.signatureMode === 'Signature' ? 'Saving Signature' : 'Saving Initial';
      this.snackbarService.open(message, 'OK', this.snackbarService.initConfig(null, 'bottom'));
      this.handleMode();
    } catch (err) {
      this.snackbarService.open('Failed to apply signature', 'OK', this.snackbarService.initConfig(null, 'bottom'));
    }
  }

  handleMode() {
    let currentField;
    switch (this.mode) {
      case 'signerview':
        if (this.signatureMode === 'Signature') {
          this.signatureService.postSignatureBlob().then(result => {
            if (result && result.id && result.url) {
              currentField = this.signatureService.currField;
              this.signatureService.updateSigned(currentField.fName, true);
              this.signatureService.toggleSig(false);
              this.signatureService.setSignatureId(result.id);
              this.signatureService.putSignatureField(this.envelopeId, this.fieldName, result.id).then(res => {
                this.eventTracker.createEvent({
                  category: 'verdoc',
                  action: 'verdoc signed',
                  label: `verdoc id: ${this.envelopeId}`
                })
                if (res && res.settings) {
                  this.signatureService.setSignatureData(res.settings.base64);
                  this.signatureService.setSignatureId(res.settings.signature_id);
                }
                this.snackbarService.dismiss();
                this.dialog.close({ status: 'saved', temp_sig: res.settings.base64, sig_id: res.settings.signature_id });
              }).catch(err => {
                this.snackbarService.open('Failed to save signature. Please try again.', 'DISMISS', {
                  duration: 3000
                });
                this.adoptedAndSigned = false;
                return err;
              });
            }
          });
        } else {
          this.signatureService.postInitialBlob().then(result => {
            if (result && result.id && result.url) {
              currentField = this.signatureService.currField;
              this.signatureService.updateInitialed(currentField.fName, true);
              this.signatureService.setInitialId(result.id);
              this.signatureService.toggleSig(false);
              this.signatureService.putInitialField(this.envelopeId, this.fieldName, result.id).then(res => {
                if (res && res.settings) {
                  this.signatureService.setInitialData(res.settings.base64);
                  this.signatureService.setInitialId(res.settings.initial_id);
                }
                this.snackbarService.dismiss();
                this.dialog.close({ status: 'saved', temp_int: res.settings.base64, int_id: res.settings.initial_id });
              }).catch(err => {
                this.snackbarService.open('Failed to save initial. Please try again.', 'DISMISS', {
                  duration: 3000
                });
                this.adoptedAndSigned = false;
                return err;
              });
            }
          });
        }
        break;
    }
  }
   */

  render() {
    return (
      <Host onClick={e => this.handleCancel(e)}>
        <div class="dialog">
          <div class="heading">Create Your Signature</div>

          <div class="content">
            <verdocs-text-input placeholder="Full Name..." label="Full Name" value={this.enteredName} onInput={e => this.handleNameChange(e)} onClick={e => e.stopPropagation()} />
            <div class="as-shown">As shown on driver's license or govt. ID card.</div>

            {/*<div class="tabs">*/}
            {/*  <div class={{tab: true, active: this.mode === 'type'}} onClick={() => (this.mode = 'type')}>*/}
            {/*    Type*/}
            {/*  </div>*/}
            {/*<div class={{tab: true, active: this.mode === 'draw'}} onClick={() => (this.mode = 'draw')}>*/}
            {/*  Draw*/}
            {/*</div>*/}
            {/*</div>*/}

            {this.fontLoaded ? <canvas ref={el => (this.canvasElement = el as HTMLCanvasElement)} /> : <div style={{display: 'none'}} />}

            <div class="disclaimer">
              By clicking Adopt, I agree that the signature will be the electronic representation of my signature for all purposes when I (or my agent) use them on documents,
              including legally binding contracts &mdash; just the same as a pen-and-paper signature or initial.
            </div>

            <div class="buttons">
              <verdocs-button label="CANCEL" size="normal" variant="outline" onClick={e => this.handleCancel(e)} />
              <verdocs-button label="Adopt & Sign" size="normal" onClick={e => this.handleAdopt(e)} />
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
