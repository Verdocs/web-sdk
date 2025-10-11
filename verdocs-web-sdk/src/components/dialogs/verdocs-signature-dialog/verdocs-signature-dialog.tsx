import {Component, Prop, h, Event, EventEmitter, State} from '@stencil/core';

const Keyboard = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 8h.01"/><path d="M12 12h.01"/><path d="M14 8h.01"/><path d="M16 12h.01"/><path d="M18 8h.01"/><path d="M6 8h.01"/><path d="M7 16h10"/><path d="M8 12h.01"/><rect width="20" height="16" x="2" y="4" rx="2"/></svg>`;
const Pencil = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>`;
const Upload = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21"/><path d="m14 19.5 3-3 3 3"/><path d="M17 22v-5.5"/><circle cx="9" cy="9" r="2"/></svg>`;

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
  private drawingContext?: CanvasRenderingContext2D;
  private fileInputElement?: HTMLInputElement;

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

  // Drawing state
  @State() isDrawing = false;

  @State() hasDrawnSignature = false;

  // Upload state
  @State() hasUploadedImage = false;

  @State() uploadedFileName: string = '';

  private currentStroke: Array<{x: number; y: number}> = [];
  private allStrokes: Array<Array<{x: number; y: number}>> = [];
  private lastPoint: {x: number; y: number} | null = null;
  private uploadedImage: HTMLImageElement | null = null;

  componentWillLoad() {
    this.enteredName = this.name;

    const ds = new FontFace('Dancing Script', 'url(https://fonts.gstatic.com/s/dancingscript/v19/If2cXTr6YS-zF4S-kcSWSVi_sxjsohD9F50Ruu7BMSo3Sup6hNX6plRP.woff)');
    ds.load().then(font => {
      document.fonts.add(font);
      this.fontLoaded = true;
    });
  }

  componentDidLoad() {
    this.redrawSignature();
    this.setupDrawingCanvas();
  }

  componentDidUpdate() {
    this.redrawSignature();
    this.setupDrawingCanvas();

    // Redraw uploaded image when in upload mode
    if (this.mode === 'upload' && this.hasUploadedImage) {
      this.drawUploadedImage();
    }

    // Redraw drawn signature when in draw mode
    if (this.mode === 'draw' && this.allStrokes.length > 0) {
      this.redrawDrawnSignature();
    }
  }

  redrawSignature() {
    if (!this.canvasElement || this.mode !== 'type') {
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

  redrawDrawnSignature() {
    if (!this.canvasElement || !this.drawingContext || this.allStrokes.length === 0) {
      return;
    }

    // Clear the canvas first
    this.drawingContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

    // Redraw all strokes
    for (const stroke of this.allStrokes) {
      if (stroke.length === 0) {
        continue;
      }

      // Start the path at the first point
      this.drawingContext.beginPath();
      this.drawingContext.moveTo(stroke[0].x, stroke[0].y);

      // Draw smooth curves through all points in the stroke
      for (let i = 1; i < stroke.length; i++) {
        const currentPoint = stroke[i];
        const previousPoint = stroke[i - 1];

        // Use quadratic curves for smooth lines
        const midPoint = {
          x: (previousPoint.x + currentPoint.x) / 2,
          y: (previousPoint.y + currentPoint.y) / 2,
        };

        this.drawingContext.quadraticCurveTo(previousPoint.x, previousPoint.y, midPoint.x, midPoint.y);
      }

      // Draw to the last point
      if (stroke.length > 1) {
        const lastPoint = stroke[stroke.length - 1];
        this.drawingContext.lineTo(lastPoint.x, lastPoint.y);
      }

      this.drawingContext.stroke();
    }
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

  isAdoptButtonDisabled(): boolean {
    switch (this.mode) {
      case 'type':
        // Disable if no name has been entered
        return !this.enteredName || this.enteredName.trim().length === 0;
      case 'draw':
        // Disable if nothing has been drawn
        return !this.hasDrawnSignature || this.allStrokes.length === 0;
      case 'upload':
        // Disable if no file has been uploaded
        return !this.hasUploadedImage;
      default:
        return true;
    }
  }

  setupDrawingCanvas() {
    if (!this.canvasElement) {
      return;
    }

    // Set up drawing context when in draw mode
    if (this.mode === 'draw') {
      // Always get fresh context from the current canvas element
      const ctx = this.canvasElement.getContext('2d');

      // Only initialize if we don't have a context or it's different
      if (ctx && ctx !== this.drawingContext) {
        this.drawingContext = ctx;

        // Configure drawing style for smooth signatures
        this.drawingContext.strokeStyle = '#000000';
        this.drawingContext.lineWidth = 2;
        this.drawingContext.lineCap = 'round';
        this.drawingContext.lineJoin = 'round';

        // Clear canvas only if there are no existing strokes
        if (this.allStrokes.length === 0) {
          this.drawingContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        }
      }
    }

    // Reset drawing context when switching away from draw mode
    // NOTE: We don't clear allStrokes here so drawing persists when returning to draw mode
    if (this.mode !== 'draw' && this.drawingContext) {
      this.drawingContext = null;
      this.currentStroke = [];
      this.lastPoint = null;
    }
  }

  clearDrawingCanvas() {
    if (!this.canvasElement || !this.drawingContext) {
      return;
    }

    this.drawingContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    this.currentStroke = [];
    this.allStrokes = [];
    this.lastPoint = null;
    this.hasDrawnSignature = false;
  }

  handleClearDrawing(e: any) {
    e.stopPropagation();
    e.preventDefault();
    this.clearDrawingCanvas();
  }

  getCanvasCoordinates(e: PointerEvent): {x: number; y: number} {
    if (!this.canvasElement) {
      return {x: 0, y: 0};
    }

    const rect = this.canvasElement.getBoundingClientRect();

    // Calculate the scale factor between canvas size and display size
    const scaleX = this.canvasElement.width / rect.width;
    const scaleY = this.canvasElement.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  handlePointerDown = (e: PointerEvent) => {
    e.preventDefault();

    if (!this.canvasElement || !this.drawingContext) {
      return;
    }

    this.isDrawing = true;
    this.hasDrawnSignature = true;

    const point = this.getCanvasCoordinates(e);
    this.currentStroke = [point];
    this.lastPoint = point;

    // Start a new path
    this.drawingContext.beginPath();
    this.drawingContext.moveTo(point.x, point.y);

    // Capture pointer to ensure we get all events even if pointer leaves canvas
    this.canvasElement.setPointerCapture(e.pointerId);
  };

  handlePointerMove = (e: PointerEvent) => {
    e.preventDefault();

    if (!this.isDrawing || !this.drawingContext || !this.lastPoint) {
      return;
    }

    const point = this.getCanvasCoordinates(e);
    this.currentStroke.push(point);

    // Use quadratic curves for smooth drawing
    // The control point is the last point, and we draw to the midpoint
    const midPoint = {
      x: (this.lastPoint.x + point.x) / 2,
      y: (this.lastPoint.y + point.y) / 2,
    };

    this.drawingContext.quadraticCurveTo(this.lastPoint.x, this.lastPoint.y, midPoint.x, midPoint.y);
    this.drawingContext.stroke();

    this.lastPoint = point;
  };

  handlePointerUp = (e: PointerEvent) => {
    e.preventDefault();

    if (!this.isDrawing || !this.drawingContext) {
      return;
    }

    // Complete the stroke
    if (this.lastPoint && this.currentStroke.length > 0) {
      this.drawingContext.lineTo(this.lastPoint.x, this.lastPoint.y);
      this.drawingContext.stroke();
    }

    // Save the completed stroke
    if (this.currentStroke.length > 0) {
      this.allStrokes.push([...this.currentStroke]);
    }

    this.isDrawing = false;
    this.currentStroke = [];
    this.lastPoint = null;

    // Release pointer capture
    if (this.canvasElement) {
      this.canvasElement.releasePointerCapture(e.pointerId);
    }
  };

  handlePointerCancel = (e: PointerEvent) => {
    // Handle cases where drawing is interrupted (e.g., phone call, notification)
    this.isDrawing = false;
    this.currentStroke = [];
    this.lastPoint = null;

    if (this.canvasElement) {
      this.canvasElement.releasePointerCapture(e.pointerId);
    }
  };

  handleSelectFile = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    this.fileInputElement?.click();
  };

  handleFileChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/png')) {
      alert('Please select a PNG image file.');
      input.value = '';
      return;
    }

    // Load and display the image
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.onload = () => {
        this.uploadedImage = img;
        this.uploadedFileName = file.name;
        this.hasUploadedImage = true;
        this.drawUploadedImage();
      };
      img.onerror = () => {
        alert('Failed to load image. Please try a different file.');
        input.value = '';
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      alert('Failed to read file. Please try again.');
      input.value = '';
    };
    reader.readAsDataURL(file);
  };

  drawUploadedImage() {
    if (!this.canvasElement || !this.uploadedImage) {
      return;
    }

    const ctx = this.canvasElement.getContext('2d');
    if (!ctx) {
      return;
    }

    // Clear the canvas
    ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

    // Calculate scaling to fit image within canvas while maintaining aspect ratio
    const canvasWidth = this.canvasElement.width;
    const canvasHeight = this.canvasElement.height;
    const imageWidth = this.uploadedImage.width;
    const imageHeight = this.uploadedImage.height;

    // Calculate scale to fit within canvas (with some padding)
    const padding = 10;
    const availableWidth = canvasWidth - padding * 2;
    const availableHeight = canvasHeight - padding * 2;

    const scaleX = availableWidth / imageWidth;
    const scaleY = availableHeight / imageHeight;
    const scale = Math.min(scaleX, scaleY);

    // Calculate dimensions and position to center the image
    const scaledWidth = imageWidth * scale;
    const scaledHeight = imageHeight * scale;
    const x = (canvasWidth - scaledWidth) / 2;
    const y = (canvasHeight - scaledHeight) / 2;

    // Draw the image centered and scaled
    ctx.drawImage(this.uploadedImage, x, y, scaledWidth, scaledHeight);
  }

  handleClearUpload = (e: any) => {
    e.stopPropagation();
    e.preventDefault();

    this.uploadedImage = null;
    this.uploadedFileName = '';
    this.hasUploadedImage = false;

    // Clear the file input
    if (this.fileInputElement) {
      this.fileInputElement.value = '';
    }

    // Clear the canvas
    if (this.canvasElement) {
      const ctx = this.canvasElement.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
      }
    }
  };

  render() {
    return (
      <verdocs-dialog>
        <div slot="heading" class="heading">
          <div class="icon">
            <svg width="22" height="19" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_34208_4881)">
                <path
                  d="M3.125 0.75C1.88398 0.75 0.875 1.75898 0.875 3V16.5C0.875 17.741 1.88398 18.75 3.125 18.75H12.125C13.366 18.75 14.375 17.741 14.375 16.5V15.8215C14.2801 15.8602 14.1852 15.8918 14.0867 15.9164L11.9738 16.4437C11.8684 16.4684 11.7629 16.4859 11.6574 16.493C11.6258 16.4965 11.5941 16.5 11.5625 16.5H9.3125C9.09805 16.5 8.90469 16.3805 8.80977 16.1906L8.50039 15.5684C8.44062 15.4488 8.32109 15.375 8.19102 15.375C8.06094 15.375 7.93789 15.4488 7.88164 15.5684L7.57227 16.1906C7.47031 16.398 7.24883 16.5211 7.02031 16.5C6.7918 16.4789 6.59492 16.3207 6.53164 16.1027L5.9375 14.1445L5.59297 15.2977C5.37852 16.0113 4.72109 16.5 3.97578 16.5H3.6875C3.37812 16.5 3.125 16.2469 3.125 15.9375C3.125 15.6281 3.37812 15.375 3.6875 15.375H3.97578C4.22539 15.375 4.44336 15.2133 4.51367 14.9742L5.0375 13.234C5.15703 12.8367 5.52266 12.5625 5.9375 12.5625C6.35234 12.5625 6.71797 12.8367 6.8375 13.234L7.24531 14.591C7.50547 14.373 7.83594 14.25 8.1875 14.25C8.74648 14.25 9.25625 14.5664 9.50586 15.0656L9.66055 15.375H9.97344C9.86445 15.0656 9.84336 14.7281 9.92422 14.3977L10.4516 12.2848C10.55 11.8875 10.7539 11.5289 11.0422 11.2406L14.375 7.90781V6.375H9.875C9.25273 6.375 8.75 5.87227 8.75 5.25V0.75H3.125ZM9.875 0.75V5.25H14.375L9.875 0.75ZM20.2039 5.66133C19.6555 5.11289 18.766 5.11289 18.2141 5.66133L17.1805 6.69492L19.6766 9.19102L20.7102 8.15742C21.2586 7.60898 21.2586 6.71953 20.7102 6.16758L20.2039 5.66133ZM11.8402 12.0352C11.6961 12.1793 11.5941 12.3586 11.5449 12.559L11.0176 14.6719C10.9684 14.8652 11.0246 15.0656 11.1652 15.2063C11.3059 15.3469 11.5062 15.4031 11.6996 15.3539L13.8125 14.8266C14.0094 14.7773 14.1922 14.6754 14.3363 14.5312L18.8785 9.98555L16.3824 7.48945L11.8402 12.0352Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_34208_4881">
                  <path d="M0.875 0.75H21.125V18.75H0.875V0.75Z" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>

          <div class="title">Adopt Signature</div>
        </div>

        <div slot="content" class="content">
          <div class="tabs">
            <div class={{tab: true, active: this.mode === 'type'}} onClick={() => (this.mode = 'type')}>
              <div innerHTML={Keyboard} class="icon" />
              <div>Type</div>
            </div>
            <div class={{tab: true, active: this.mode === 'draw'}} onClick={() => (this.mode = 'draw')}>
              <div innerHTML={Pencil} class="icon" />
              <div>Draw</div>
            </div>
            <div class={{tab: true, active: this.mode === 'upload'}} onClick={() => (this.mode = 'upload')}>
              <div innerHTML={Upload} class="icon" />
              <div>Upload</div>
            </div>
          </div>

          <div class={{type: true, active: this.mode === 'type'}}>
            <verdocs-text-input
              label="Full Name"
              value={this.enteredName}
              placeholder="Full Name..."
              description="As shown on driver's license or govt. ID card."
              onInput={e => this.handleNameChange(e)}
              onClick={e => e.stopPropagation()}
            />
          </div>

          <div class={{draw: true, active: this.mode === 'draw'}}>
            <div class="draw-instructions">Draw your signature below using your mouse or finger</div>
            <div class="draw-actions">
              <button class="clear-button" onClick={e => this.handleClearDrawing(e)} disabled={!this.hasDrawnSignature}>
                Clear
              </button>
            </div>
          </div>

          <div class={{upload: true, active: this.mode === 'upload'}}>
            <div class="upload-instructions">Upload a PNG image of your signature</div>
            <input ref={el => (this.fileInputElement = el as HTMLInputElement)} type="file" accept="image/png" onChange={this.handleFileChange} style={{display: 'none'}} />
            <div class="upload-actions">
              <button class="upload-button" onClick={this.handleSelectFile}>
                {this.hasUploadedImage ? 'Change Image' : 'Select PNG File'}
              </button>
              {this.hasUploadedImage && (
                <button class="clear-button" onClick={this.handleClearUpload}>
                  Clear
                </button>
              )}
            </div>
            {this.uploadedFileName && <div class="upload-filename">{this.uploadedFileName}</div>}
          </div>

          <canvas
            ref={el => (this.canvasElement = el as HTMLCanvasElement)}
            width="300"
            height="79"
            onPointerDown={this.handlePointerDown}
            onPointerMove={this.handlePointerMove}
            onPointerUp={this.handlePointerUp}
            onPointerCancel={this.handlePointerCancel}
            style={{touchAction: 'none', cursor: 'crosshair'}}
          />

          <div class="disclaimer">
            By clicking Adopt, I agree that the signature will be the electronic representation of my signature for all purposes when I (or my agent) use them on documents,
            including legally binding contracts &mdash; just the same as a pen-and-paper signature or initial.
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
