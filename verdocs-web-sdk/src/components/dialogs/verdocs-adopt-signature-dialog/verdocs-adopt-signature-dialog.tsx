import {Component, Prop, h, Event, EventEmitter, State} from '@stencil/core';
import {SignatureXIcon} from '../../../utils/Icons';

/**
 * Display a dialog that allows the user to specify a signature image, either by using a signature-font-generated image
 * based on their full name, or by hand-drawing their signature with a mouse or tablet.
 */
@Component({
  tag: 'verdocs-adopt-signature-dialog',
  styleUrl: 'verdocs-adopt-signature-dialog.scss',
})
export class VerdocsAdoptSignatureDialog {
  private signatureElement?: HTMLCanvasElement;
  private initialsElement?: HTMLCanvasElement;
  private sigDrawingContext?: CanvasRenderingContext2D;
  private initialsDrawingContext?: CanvasRenderingContext2D;

  /**
   * Initial signature text
   */
  @Prop() name: string = '';

  /**
   * If true, the name fields will be read-only. Used when the sender has locked the recipient's name.
   */
  @Prop() nameLocked: boolean = false;

  /**
   * Fired when the user completes the dialog and clicks Adopt. The event detail will contain a base64-encoded string
   * representation of the signature adopted.
   */
  @Event({composed: true}) next: EventEmitter<{signature: string; initials: string}>;

  /**
   * Event fired when the step is cancelled. This is called exit to avoid conflicts with the JS-reserved "cancel" event name.
   */
  @Event({composed: true}) exit: EventEmitter;

  @State() fontLoaded = false;
  @State() enteredName: string = '';
  @State() enteredInitials: string = '';
  @State() mode: 'type' | 'draw' = 'type';
  @State() isDrawing = false;
  @State() hasDrawnSignature = false;
  @State() hasDrawnInitials = false;

  private currentSigStroke: Array<{x: number; y: number}> = [];
  private allSigStrokes: Array<Array<{x: number; y: number}>> = [];
  private lastSigPoint: {x: number; y: number} | null = null;

  private currentInitialsStroke: Array<{x: number; y: number}> = [];
  private allInitialsStrokes: Array<Array<{x: number; y: number}>> = [];
  private lastInitialsPoint: {x: number; y: number} | null = null;

  componentWillLoad() {
    this.enteredName = this.name;
    this.computeEnteredInitials(this.name);

    const ds = new FontFace('Dancing Script', 'url(https://fonts.gstatic.com/s/dancingscript/v19/If2cXTr6YS-zF4S-kcSWSVi_sxjsohD9F50Ruu7BMSo3Sup6hNX6plRP.woff)');
    ds.load().then(font => {
      document.fonts.add(font);
      this.fontLoaded = true;
    });
  }

  componentDidLoad() {
    this.drawSignatureText();
    this.drawInitialsText();
    this.setupSignatureCanvas();
    this.setupInitialsCanvas();
  }

  componentDidUpdate() {
    this.drawSignatureText();
    this.drawInitialsText();
    this.setupSignatureCanvas();
    this.setupInitialsCanvas();

    // Redraw drawn signature when in draw mode
    if (this.mode === 'draw' && this.allSigStrokes.length > 0) {
      this.redrawDrawnSignature();
    }
    if (this.mode === 'draw' && this.allInitialsStrokes.length > 0) {
      this.redrawDrawnInitials();
    }
  }

  drawSignatureText() {
    if (!this.signatureElement || this.mode !== 'type') {
      return;
    }

    const sigCanvasWidth = this.signatureElement.width;
    const sigCanvasHeight = this.signatureElement.height;
    const sigContext = this.signatureElement.getContext('2d');
    sigContext.clearRect(0, 0, this.signatureElement.width, this.signatureElement.height);

    let fontSize = 100;
    let metrics: TextMetrics = sigContext.measureText(this.enteredName);
    do {
      fontSize -= 2;
      sigContext.font = `${fontSize}px Dancing Script`;
      metrics = sigContext.measureText(this.enteredName);
    } while (metrics.width > sigCanvasWidth - 24 || metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent + 24 > sigCanvasHeight);

    sigContext.textAlign = 'center';
    sigContext.textBaseline = 'middle';
    sigContext.font = `${fontSize}px Dancing Script`;
    sigContext.fillText(this.enteredName, this.signatureElement.width / 2, this.signatureElement.height / 2);
  }

  drawInitialsText() {
    if (!this.initialsElement || this.mode !== 'type') {
      return;
    }

    const initialsCanvasWidth = this.initialsElement.width;
    const initialsCanvasHeight = this.initialsElement.height;
    const context = this.initialsElement.getContext('2d');
    context.clearRect(0, 0, this.initialsElement.width, this.initialsElement.height);

    let fontSize = 100;
    let metrics: TextMetrics = context.measureText(this.enteredInitials);
    do {
      fontSize -= 2;
      context.font = `${fontSize}px Dancing Script`;
      metrics = context.measureText(this.enteredInitials);
    } while (metrics.width > initialsCanvasWidth - 24 || metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent + 24 > initialsCanvasHeight);

    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = `${fontSize}px Dancing Script`;
    context.fillText(this.enteredInitials, this.initialsElement.width / 2, this.initialsElement.height / 2);
  }

  redrawDrawnSignature() {
    if (!this.signatureElement || !this.sigDrawingContext || this.allSigStrokes.length === 0) {
      return;
    }

    // Clear the canvas first
    this.sigDrawingContext.clearRect(0, 0, this.signatureElement.width, this.signatureElement.height);

    // Redraw all strokes
    for (const stroke of this.allSigStrokes) {
      if (stroke.length === 0) {
        continue;
      }

      // Start the path at the first point
      this.sigDrawingContext.beginPath();
      this.sigDrawingContext.moveTo(stroke[0].x, stroke[0].y);

      // Draw smooth curves through all points in the stroke
      for (let i = 1; i < stroke.length; i++) {
        const currentPoint = stroke[i];
        const previousPoint = stroke[i - 1];

        // Use quadratic curves for smooth lines
        const midPoint = {
          x: (previousPoint.x + currentPoint.x) / 2,
          y: (previousPoint.y + currentPoint.y) / 2,
        };

        this.sigDrawingContext.quadraticCurveTo(previousPoint.x, previousPoint.y, midPoint.x, midPoint.y);
      }

      // Draw to the last point
      if (stroke.length > 1) {
        const lastPoint = stroke[stroke.length - 1];
        this.sigDrawingContext.lineTo(lastPoint.x, lastPoint.y);
      }

      this.sigDrawingContext.stroke();
    }
  }

  redrawDrawnInitials() {
    if (!this.initialsElement || !this.initialsDrawingContext || this.allInitialsStrokes.length === 0) {
      return;
    }

    // Clear the canvas first
    this.initialsDrawingContext.clearRect(0, 0, this.initialsElement.width, this.initialsElement.height);

    // Redraw all strokes
    for (const stroke of this.allInitialsStrokes) {
      if (stroke.length === 0) {
        continue;
      }

      // Start the path at the first point
      this.initialsDrawingContext.beginPath();
      this.initialsDrawingContext.moveTo(stroke[0].x, stroke[0].y);

      // Draw smooth curves through all points in the stroke
      for (let i = 1; i < stroke.length; i++) {
        const currentPoint = stroke[i];
        const previousPoint = stroke[i - 1];

        // Use quadratic curves for smooth lines
        const midPoint = {
          x: (previousPoint.x + currentPoint.x) / 2,
          y: (previousPoint.y + currentPoint.y) / 2,
        };

        this.initialsDrawingContext.quadraticCurveTo(previousPoint.x, previousPoint.y, midPoint.x, midPoint.y);
      }

      // Draw to the last point
      if (stroke.length > 1) {
        const lastPoint = stroke[stroke.length - 1];
        this.initialsDrawingContext.lineTo(lastPoint.x, lastPoint.y);
      }

      this.initialsDrawingContext.stroke();
    }
  }

  handleNameChange(e: any) {
    this.enteredName = e.target.value;
    this.computeEnteredInitials(e.target.value);
  }

  computeEnteredInitials(name: string) {
    const nameComponents = name
      .trim()
      .split(' ')
      .filter(part => part.length > 0);

    this.enteredInitials = nameComponents.length > 1 ? nameComponents.map(word => word.charAt(0).toUpperCase()).join('') : nameComponents[0].toUpperCase();
  }

  handleCancel(e: any) {
    e.stopPropagation();
    e.preventDefault();
    this.exit.emit();
  }

  handleAdopt(e: any) {
    e.stopPropagation();
    e.preventDefault();
    const signature = this.signatureElement.toDataURL('image/png');
    const initials = this.initialsElement.toDataURL('image/png');
    this.next.emit({signature, initials});
  }

  isAdoptButtonDisabled(): boolean {
    switch (this.mode) {
      case 'type':
        // Disable if no name has been entered
        return !this.enteredName || this.enteredName.trim().length === 0;
      case 'draw':
        // Disable if nothing has been drawn
        return (!this.hasDrawnSignature && !this.hasDrawnInitials) || this.allSigStrokes.length === 0 || this.allInitialsStrokes.length === 0;
      default:
        return true;
    }
  }

  setupSignatureCanvas() {
    if (!this.signatureElement) {
      return;
    }

    // Set up drawing context when in draw mode
    if (this.mode === 'draw') {
      // Always get fresh context from the current canvas element
      const sigContext = this.signatureElement.getContext('2d');

      // Only initialize if we don't have a context or it's different
      if (sigContext && sigContext !== this.sigDrawingContext) {
        this.sigDrawingContext = sigContext;

        // Configure drawing style for smooth signatures
        this.sigDrawingContext.strokeStyle = '#000000';
        this.sigDrawingContext.lineWidth = 2;
        this.sigDrawingContext.lineCap = 'round';
        this.sigDrawingContext.lineJoin = 'round';

        // Clear canvas only if there are no existing strokes
        if (this.allSigStrokes.length === 0) {
          this.sigDrawingContext.clearRect(0, 0, this.signatureElement.width, this.signatureElement.height);
        }
      }
    }

    // Reset drawing context when switching away from draw mode
    // NOTE: We don't clear allStrokes here so drawing persists when returning to draw mode
    if (this.mode !== 'draw' && this.sigDrawingContext) {
      this.sigDrawingContext = null;
      this.currentSigStroke = [];
      this.lastSigPoint = null;
    }
  }

  setupInitialsCanvas() {
    if (!this.initialsElement) {
      return;
    }

    // Set up drawing context when in draw mode
    if (this.mode === 'draw') {
      // Always get fresh context from the current canvas element
      const initialsContext = this.initialsElement.getContext('2d');

      // Only initialize if we don't have a context or it's different
      if (initialsContext && initialsContext !== this.initialsDrawingContext) {
        this.initialsDrawingContext = initialsContext;

        // Configure drawing style for smooth signatures
        this.initialsDrawingContext.strokeStyle = '#000000';
        this.initialsDrawingContext.lineWidth = 2;
        this.initialsDrawingContext.lineCap = 'round';
        this.initialsDrawingContext.lineJoin = 'round';

        // Clear canvas only if there are no existing strokes
        if (this.allInitialsStrokes.length === 0) {
          this.initialsDrawingContext.clearRect(0, 0, this.initialsElement.width, this.initialsElement.height);
        }
      }
    }

    // Reset drawing context when switching away from draw mode
    // NOTE: We don't clear allStrokes here so drawing persists when returning to draw mode
    if (this.mode !== 'draw' && this.initialsDrawingContext) {
      this.initialsDrawingContext = null;
      this.currentInitialsStroke = [];
      this.lastInitialsPoint = null;
    }
  }

  clearSignatureCanvas() {
    if (!this.signatureElement || !this.sigDrawingContext) {
      return;
    }

    this.sigDrawingContext.clearRect(0, 0, this.signatureElement.width, this.signatureElement.height);
    this.currentSigStroke = [];
    this.allSigStrokes = [];
    this.lastSigPoint = null;
    this.hasDrawnSignature = false;
  }

  clearInitialsCanvas() {
    if (!this.initialsElement || !this.initialsDrawingContext) {
      return;
    }

    this.initialsDrawingContext.clearRect(0, 0, this.initialsElement.width, this.initialsElement.height);
    this.currentInitialsStroke = [];
    this.allInitialsStrokes = [];
    this.lastInitialsPoint = null;
    this.hasDrawnInitials = false;
  }

  handleClearDrawing(e: any, type: 'signature' | 'initials' | 'all' = 'all') {
    e.stopPropagation();
    e.preventDefault();
    if (type === 'all' || type === 'signature') this.clearSignatureCanvas();
    if (type === 'all' || type === 'initials') this.clearInitialsCanvas();
  }

  getSigCanvasCoordinates(e: PointerEvent): {x: number; y: number} {
    if (!this.signatureElement) {
      return {x: 0, y: 0};
    }

    const rect = this.signatureElement.getBoundingClientRect();

    // Calculate the scale factor between canvas size and display size
    const scaleX = this.signatureElement.width / rect.width;
    const scaleY = this.signatureElement.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  getInitialsCanvasCoordinates(e: PointerEvent): {x: number; y: number} {
    if (!this.initialsElement) {
      return {x: 0, y: 0};
    }

    const rect = this.initialsElement.getBoundingClientRect();

    // Calculate the scale factor between canvas size and display size
    const scaleX = this.initialsElement.width / rect.width;
    const scaleY = this.initialsElement.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  handleSigPointerDown = (e: PointerEvent) => {
    e.preventDefault();

    if (!this.signatureElement || !this.sigDrawingContext) {
      return;
    }

    this.isDrawing = true;
    this.hasDrawnSignature = true;

    const point = this.getSigCanvasCoordinates(e);
    this.currentSigStroke = [point];
    this.lastSigPoint = point;

    // Start a new path
    this.sigDrawingContext.beginPath();
    this.sigDrawingContext.moveTo(point.x, point.y);

    // Capture pointer to ensure we get all events even if pointer leaves canvas
    this.signatureElement.setPointerCapture(e.pointerId);
  };

  handleSigPointerMove = (e: PointerEvent) => {
    e.preventDefault();

    if (!this.isDrawing || !this.sigDrawingContext || !this.lastSigPoint) {
      return;
    }

    const point = this.getSigCanvasCoordinates(e);
    this.currentSigStroke.push(point);

    // Use quadratic curves for smooth drawing
    // The control point is the last point, and we draw to the midpoint
    const midPoint = {
      x: (this.lastSigPoint.x + point.x) / 2,
      y: (this.lastSigPoint.y + point.y) / 2,
    };

    this.sigDrawingContext.quadraticCurveTo(this.lastSigPoint.x, this.lastSigPoint.y, midPoint.x, midPoint.y);
    this.sigDrawingContext.stroke();

    this.lastSigPoint = point;
  };

  handleSigPointerUp = (e: PointerEvent) => {
    e.preventDefault();

    if (!this.isDrawing || !this.sigDrawingContext) {
      return;
    }

    // Complete the stroke
    if (this.lastSigPoint && this.currentSigStroke.length > 0) {
      this.sigDrawingContext.lineTo(this.lastSigPoint.x, this.lastSigPoint.y);
      this.sigDrawingContext.stroke();
    }

    // Save the completed stroke
    if (this.currentSigStroke.length > 0) {
      this.allSigStrokes.push([...this.currentSigStroke]);
    }

    this.isDrawing = false;
    this.currentSigStroke = [];
    this.lastSigPoint = null;

    // Release pointer capture
    if (this.signatureElement) {
      this.signatureElement.releasePointerCapture(e.pointerId);
    }
  };

  handleSigPointerCancel = (e: PointerEvent) => {
    // Handle cases where drawing is interrupted (e.g., phone call, notification)
    this.isDrawing = false;
    this.currentSigStroke = [];
    this.lastSigPoint = null;

    if (this.signatureElement) {
      this.signatureElement.releasePointerCapture(e.pointerId);
    }
  };

  handleInitialsPointerDown = (e: PointerEvent) => {
    e.preventDefault();

    if (!this.initialsElement || !this.initialsDrawingContext) {
      return;
    }

    this.isDrawing = true;
    this.hasDrawnInitials = true;

    const point = this.getInitialsCanvasCoordinates(e);
    this.currentInitialsStroke = [point];
    this.lastInitialsPoint = point;

    // Start a new path
    this.initialsDrawingContext.beginPath();
    this.initialsDrawingContext.moveTo(point.x, point.y);

    // Capture pointer to ensure we get all events even if pointer leaves canvas
    this.initialsElement.setPointerCapture(e.pointerId);
  };

  handleInitialsPointerMove = (e: PointerEvent) => {
    e.preventDefault();

    if (!this.isDrawing || !this.initialsDrawingContext || !this.lastInitialsPoint) {
      return;
    }

    const point = this.getInitialsCanvasCoordinates(e);
    this.currentInitialsStroke.push(point);

    // Use quadratic curves for smooth drawing
    // The control point is the last point, and we draw to the midpoint
    const midPoint = {
      x: (this.lastInitialsPoint.x + point.x) / 2,
      y: (this.lastInitialsPoint.y + point.y) / 2,
    };

    this.initialsDrawingContext.quadraticCurveTo(this.lastInitialsPoint.x, this.lastInitialsPoint.y, midPoint.x, midPoint.y);
    this.initialsDrawingContext.stroke();

    this.lastInitialsPoint = point;
  };

  handleInitialsPointerUp = (e: PointerEvent) => {
    e.preventDefault();

    if (!this.isDrawing || !this.initialsDrawingContext) {
      return;
    }

    // Complete the stroke
    if (this.lastInitialsPoint && this.currentInitialsStroke.length > 0) {
      this.initialsDrawingContext.lineTo(this.lastInitialsPoint.x, this.lastInitialsPoint.y);
      this.initialsDrawingContext.stroke();
    }

    // Save the completed stroke
    if (this.currentInitialsStroke.length > 0) {
      this.allInitialsStrokes.push([...this.currentInitialsStroke]);
    }

    this.isDrawing = false;
    this.currentInitialsStroke = [];
    this.lastInitialsPoint = null;

    // Release pointer capture
    if (this.initialsElement) {
      this.initialsElement.releasePointerCapture(e.pointerId);
    }
  };

  handleInitialsPointerCancel = (e: PointerEvent) => {
    // Handle cases where drawing is interrupted (e.g., phone call, notification)
    this.isDrawing = false;
    this.currentInitialsStroke = [];
    this.lastInitialsPoint = null;

    if (this.initialsElement) {
      this.initialsElement.releasePointerCapture(e.pointerId);
    }
  };

  render() {
    return (
      <verdocs-dialog>
        <div slot="heading" class="heading">
          Adopt Your Signature
        </div>

        <div slot="content" class="content">
          <div style={{fontWeight: '300', color: '#242424', fontSize: '13px'}}>Confirm your name, initials, and signature.</div>

          <div class={{type: true, active: this.mode === 'type'}}>
            <verdocs-text-input
              label="Full Name"
              value={this.enteredName}
              disabled={this.nameLocked}
              onInput={e => this.handleNameChange(e)}
              onClick={e => e.stopPropagation()}
            />
            {this.nameLocked && <div class="name-locked-hint">Your name has been set by the sender and cannot be changed.</div>}
          </div>

          <div style={{fontWeight: '400', color: '#242424', fontSize: '13px'}}>Select a signature style</div>

          <div style={{display: 'flex', flexDirection: 'row', gap: '10px', marginBottom: '6px', alignItems: 'center', fontSize: '13px'}}>
            <verdocs-radio-button checked={this.mode === 'type'} value="type" name="mode" onClick={() => (this.mode = 'type')} />
            <label>Typed with a keyboard</label>
          </div>
          <div style={{display: 'flex', flexDirection: 'row', gap: '10px', marginBottom: '6px', alignItems: 'center', fontSize: '13px'}}>
            <verdocs-radio-button checked={this.mode === 'draw'} value="draw" name="mode" onClick={() => (this.mode = 'draw')} />
            <label>Drawn with touch, mouse, or stylus</label>
          </div>

          <div class="preview-header">
            <div style={{fontSize: '13px', fontWeight: '400'}}>Signature Preview</div>
            {this.mode === 'draw' && (
              <button class="clear-button-text" onClick={e => this.handleClearDrawing(e, 'signature')} disabled={!this.hasDrawnSignature}>
                Clear
              </button>
            )}
          </div>
          <div class="canvas-container signature-container">
            <div class="signing-indicator">
              <div class="x-icon" innerHTML={SignatureXIcon}></div>
              <div class="signing-line"></div>
            </div>
            <canvas
              ref={el => (this.signatureElement = el as HTMLCanvasElement)}
              // width="300"
              height="79"
              class="signature-canvas"
              onPointerDown={this.handleSigPointerDown}
              onPointerMove={this.handleSigPointerMove}
              onPointerUp={this.handleSigPointerUp}
              onPointerCancel={this.handleSigPointerCancel}
              style={{touchAction: 'none', cursor: 'crosshair'}}
            />
          </div>

          <div class="preview-header">
            <div style={{fontSize: '13px', fontWeight: '400'}}>Initials Preview</div>
            {this.mode === 'draw' && (
              <button class="clear-button-text" onClick={e => this.handleClearDrawing(e, 'initials')} disabled={!this.hasDrawnInitials}>
                Clear
              </button>
            )}
          </div>
          <div class="canvas-container initials-container">
            <div class="signing-indicator">
              <div class="x-icon" innerHTML={SignatureXIcon}></div>
              <div class="signing-line"></div>
            </div>
            <canvas
              ref={el => (this.initialsElement = el as HTMLCanvasElement)}
              // width="300"
              height="79"
              class="initials-canvas"
              onPointerDown={this.handleInitialsPointerDown}
              onPointerMove={this.handleInitialsPointerMove}
              onPointerUp={this.handleInitialsPointerUp}
              onPointerCancel={this.handleInitialsPointerCancel}
              style={{touchAction: 'none', cursor: 'crosshair'}}
            />
          </div>

          <div class="disclaimer">
            By clicking «Adopt Signature», I agree that the signature and initials above will be the electronic representation of my signature and initials for all purposes when I
            use them to sign documents. Applying them to a document is legally equivalent to signing with a pen on paper.
          </div>
        </div>

        <div class="footer" slot="footer">
          <div class="buttons">
            <button class="cancel" onClick={e => this.handleCancel(e)}>
              Cancel
            </button>
            <button class="proceed" onClick={e => this.handleAdopt(e)} disabled={this.isAdoptButtonDisabled()}>
              Adopt & Sign
            </button>
          </div>
        </div>
      </verdocs-dialog>
    );
  }
}
