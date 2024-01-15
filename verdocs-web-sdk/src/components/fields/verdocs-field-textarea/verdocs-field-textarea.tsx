import interact from 'interactjs';
import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {getRGBA} from '@verdocs/js-sdk/Utils/Colors';
import {updateField} from '@verdocs/js-sdk/Templates/Fields';
import {ITemplateField, ITemplateFieldSetting} from '@verdocs/js-sdk/Templates/Types';
import {Component, h, Host, Prop, Method, Event, EventEmitter, Element, Fragment, State} from '@stencil/core';
import {getFieldSettings} from '../../../utils/utils';
import {getTemplateFieldStore, TTemplateFieldStore} from '../../../utils/TemplateFieldStore';

const settingsIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="m7.5 18.5-.312-2.667q-.188-.125-.396-.25-.209-.125-.396-.229l-2.479 1.063-2.521-4.334 2.125-1.625q.021-.104.021-.229v-.458q0-.125-.021-.229L1.396 7.917l2.521-4.313 2.5 1.042q.166-.104.375-.229.208-.125.396-.229L7.5 1.5h5l.312 2.688q.188.104.396.229.209.125.396.229l2.479-1.042 2.521 4.313-2.125 1.625v.916l2.125 1.625-2.521 4.334-2.5-1.063q-.166.104-.375.229-.208.125-.396.25L12.5 18.5Zm2.479-5.521q1.229 0 2.104-.875T12.958 10q0-1.229-.875-2.104t-2.104-.875q-1.208 0-2.094.875Q7 8.771 7 10t.885 2.104q.886.875 2.094.875Zm0-1.75q-.5 0-.864-.364Q8.75 10.5 8.75 10t.365-.865q.364-.364.864-.364t.865.364q.364.365.364.865t-.364.865q-.365.364-.865.364ZM10.021 10Zm-.792 6.521h1.542l.25-2.146q.625-.167 1.198-.51.573-.344 1.031-.823l2.021.854.771-1.271-1.771-1.354q.104-.292.156-.615.052-.323.052-.656 0-.292-.052-.604-.052-.313-.135-.646l1.77-1.375-.77-1.271-2.021.875q-.479-.5-1.042-.833-.562-.334-1.187-.5l-.271-2.167H9.208l-.25 2.167q-.625.166-1.187.5-.563.333-1.042.812l-2-.854-.771 1.271 1.73 1.354q-.084.333-.136.656Q5.5 9.708 5.5 10t.052.604q.052.313.136.667l-1.73 1.354.771 1.271 2-.834q.479.459 1.042.792.562.334 1.187.5Z"/></svg>';

/**
 * Display a multi-line text input field.
 */
@Component({
  tag: 'verdocs-field-textarea',
  styleUrl: 'verdocs-field-textarea.scss',
  shadow: false,
})
export class VerdocsFieldTextarea {
  @Element() el: HTMLElement;
  private inputEl: HTMLTextAreaElement;

  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   * This component self-manages its resize (width) behavior when in edit-template mode, and uses
   * this endpoint to save changes.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * The template the field is for/from. Only required in Builder mode, to support the Field Properties dialog.
   */
  @Prop() templateid: string = '';

  /**
   * The name of the field to display.
   */
  @Prop() fieldname: string = '';

  /**
   * If set, overrides the field's settings object. Primarily used to support "preview" modes where all fields are disabled.
   */
  @Prop() disabled?: boolean = false;

  /**
   * If set, a settings icon will be displayed on hover. The settings shown allow the field's recipient and other settings to be
   * changed, so it should typically only be enabled in the Builder.
   */
  @Prop() editable?: boolean = false;

  /**
   * If set, the field may be dragged to a new location. This should only be enabled in the Builder, or for self-placed fields.
   */
  @Prop() moveable?: boolean = false;

  /**
   * If set, the field is considered "done" and is drawn in a display-final-value state.
   */
  @Prop() done?: boolean = false;

  /**
   * If set, the field will be colored using this index value to select the background color.
   */
  @Prop() roleindex?: number = 0;

  /**
   * If set, the field will be be scaled horizontally by this factor.
   */
  @Prop() xscale?: number = 1;

  /**
   * If set, the field will be be scaled vertically by this factor.
   */
  @Prop() yscale?: number = 1;

  /**
   * May be used to force the field to re-render.
   */
  @Prop() rerender?: number = 0;

  @Method()
  async focusField() {
    this.inputEl.focus();
  }

  /**
   * Event fired when the field's settings are changed.
   */
  @Event({composed: true}) settingsChanged: EventEmitter<{fieldName: string; settings: ITemplateFieldSetting; field: ITemplateField}>;

  /**
   * Event fired when the field is deleted.
   */
  @Event({composed: true}) deleted: EventEmitter<{fieldName: string}>;

  @State() showingProperties?: boolean = false;

  @Method()
  async showSettingsPanel() {
    const settingsPanel = document.getElementById(`verdocs-settings-panel-${this.fieldname}`) as any;
    if (settingsPanel && settingsPanel.showPanel) {
      settingsPanel.showPanel();
    }
  }

  @Method()
  async hideSettingsPanel() {
    const settingsPanel = document.getElementById(`verdocs-settings-panel-${this.fieldname}`) as any;
    if (settingsPanel && settingsPanel.hidePanel) {
      settingsPanel.hidePanel();
    }
  }

  fieldStore: TTemplateFieldStore = null;

  async componentWillLoad() {
    this.fieldStore = getTemplateFieldStore(this.templateid);
  }

  componentDidRender() {
    interact.dynamicDrop(true);

    if (this.editable) {
      interact(this.el).resizable({
        edges: {top: true, bottom: true, left: true, right: true},
        listeners: {
          start: this.handleResizeStart.bind(this),
          move: this.handleResize.bind(this),
          end: this.handleResizeEnd.bind(this),
        },
      });
    }
  }

  handleResizeStart(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  handleResize(e) {
    let {x = 0, y = 0, h = 0} = e.target.dataset;
    let {width, height} = e.rect;

    x = (parseFloat(x) || 0) + e.deltaRect.left;
    y = (parseFloat(y) || 0) + e.deltaRect.top;
    h = (parseFloat(h) || 0) + e.deltaRect.height;

    Object.assign(e.target.style, {
      width: `${width}px`,
      height: `${height}px`,
      transform: `translate(${x}px, ${y + h}px)`,
    });

    Object.assign(e.target.dataset, {x, y, h});
  }

  handleResizeEnd(e) {
    const field = this.fieldStore.get(this.fieldname);
    const newSettings = {...getFieldSettings(field)};
    const [translateX, translateY] = e.target.style.transform.split('(')[1].split(')')[0].split(',').map(parseFloat);

    newSettings.width = Math.round(parseFloat(e.target.style.width) / this.xscale);
    newSettings.height = Math.round(parseFloat(e.target.style.height) / this.yscale);
    newSettings.x = Math.round(newSettings.x + translateX / this.xscale);
    newSettings.y = Math.round(newSettings.y - translateY / this.yscale);

    updateField(this.endpoint, this.templateid, this.fieldname, {setting: newSettings})
      .then(field => {
        this.settingsChanged?.emit({fieldName: this.fieldname, settings: newSettings, field});
        Object.assign(e.target.dataset, {x: 0, y: 0, h: 0});
      })
      .catch(e => console.log('Field update failed', e));
  }

  render() {
    const field = this.fieldStore.get(this.fieldname);
    if (!field) {
      return <Fragment />;
    }

    const settings = getFieldSettings(field);
    const disabled = this.disabled ?? settings.disabled ?? false;
    const value = settings?.result || '';
    const backgroundColor = field['rgba'] || getRGBA(this.roleindex);

    if (this.done) {
      return <Host class={{done: this.done}}>{settings.value}</Host>;
    }

    return (
      <Host class={{required: field?.required, disabled, done: this.done}} style={{backgroundColor}}>
        <textarea
          placeholder={settings.placeholder || ''}
          tabIndex={settings.order}
          disabled={disabled}
          name={field.name}
          required={field?.required}
          ref={el => (this.inputEl = el)}
        >
          {value}
        </textarea>

        {this.editable && (
          <Fragment>
            <div
              id={`verdocs-settings-panel-trigger-${field.name}`}
              style={{transform: `scale(${Math.floor((1 / this.xscale) * 1000) / 1000}, ${Math.floor((1 / this.yscale) * 1000) / 1000})`}}
              class="settings-icon"
              innerHTML={settingsIcon}
              onClick={(e: any) => {
                e.stopPropagation();
                this.showingProperties = !this.showingProperties;
              }}
            />

            {this.showingProperties && (
              <verdocs-portal anchor={`verdocs-settings-panel-trigger-${this.fieldname}`} onClickAway={() => (this.showingProperties = false)}>
                <verdocs-template-field-properties
                  templateId={this.templateid}
                  fieldName={field.name}
                  onClose={() => (this.showingProperties = false)}
                  onDelete={() => {
                    this.deleted?.emit({fieldName: field.name});
                    return this.hideSettingsPanel();
                  }}
                  onSettingsChanged={e => {
                    this.settingsChanged?.emit(e.detail);
                    return this.hideSettingsPanel();
                  }}
                  helpText={'Text areas may be used to create multi-line text fields.'}
                />
              </verdocs-portal>
            )}
          </Fragment>
        )}
      </Host>
    );
  }
}
