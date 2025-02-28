/* eslint-disable */
/* tslint:disable */
/* auto-generated vue proxies */
import { defineContainer } from '@stencil/vue-output-target/runtime';

import type { JSX } from '@verdocs/web-sdk';




export const VerdocsAuth = /*@__PURE__*/ defineContainer<JSX.VerdocsAuth>('verdocs-auth', undefined, [
  'endpoint',
  'visible',
  'logo',
  'displayMode',
  'authenticated',
  'sdkError'
], [
  'authenticated',
  'sdkError'
]);


export const VerdocsBuild = /*@__PURE__*/ defineContainer<JSX.VerdocsBuild>('verdocs-build', undefined, [
  'endpoint',
  'templateId',
  'step',
  'cancel',
  'sdkError',
  'stepChanged',
  'send',
  'templateUpdated',
  'templateCreated',
  'rolesUpdated'
], [
  'cancel',
  'sdkError',
  'stepChanged',
  'send',
  'templateUpdated',
  'templateCreated',
  'rolesUpdated'
]);


export const VerdocsButton = /*@__PURE__*/ defineContainer<JSX.VerdocsButton>('verdocs-button', undefined, [
  'label',
  'startIcon',
  'endIcon',
  'size',
  'type',
  'variant',
  'disabled'
]);


export const VerdocsButtonPanel = /*@__PURE__*/ defineContainer<JSX.VerdocsButtonPanel>('verdocs-button-panel', undefined, [
  'icon'
]);


export const VerdocsCheckbox = /*@__PURE__*/ defineContainer<JSX.VerdocsCheckbox>('verdocs-checkbox', undefined, [
  'checked',
  'name',
  'label',
  'value',
  'theme',
  'size',
  'disabled'
]);


export const VerdocsComponentError = /*@__PURE__*/ defineContainer<JSX.VerdocsComponentError>('verdocs-component-error', undefined, [
  'message'
]);


export const VerdocsContactPicker = /*@__PURE__*/ defineContainer<JSX.VerdocsContactPicker>('verdocs-contact-picker', undefined, [
  'endpoint',
  'templateRole',
  'contactSuggestions',
  'searchContacts',
  'exit',
  'next'
], [
  'searchContacts',
  'exit',
  'next'
]);


export const VerdocsDateInput = /*@__PURE__*/ defineContainer<JSX.VerdocsDateInput>('verdocs-date-input', undefined, [
  'value',
  'label',
  'placeholder',
  'helpText',
  'disabled',
  'required'
]);


export const VerdocsDialog = /*@__PURE__*/ defineContainer<JSX.VerdocsDialog>('verdocs-dialog', undefined, [
  'exit'
], [
  'exit'
]);


export const VerdocsDropdown = /*@__PURE__*/ defineContainer<JSX.VerdocsDropdown>('verdocs-dropdown', undefined, [
  'options',
  'optionSelected'
], [
  'optionSelected'
]);


export const VerdocsEnvelopeDocumentPage = /*@__PURE__*/ defineContainer<JSX.VerdocsEnvelopeDocumentPage>('verdocs-envelope-document-page', undefined, [
  'endpoint',
  'envelopeId',
  'documentId',
  'pageNumber',
  'virtualWidth',
  'virtualHeight',
  'layers',
  'type',
  'pageRendered'
], [
  'pageRendered'
]);


export const VerdocsEnvelopeRecipientLink = /*@__PURE__*/ defineContainer<JSX.VerdocsEnvelopeRecipientLink>('verdocs-envelope-recipient-link', undefined, [
  'endpoint',
  'envelopeId',
  'roleName',
  'next',
  'sdkError'
], [
  'next',
  'sdkError'
]);


export const VerdocsEnvelopeRecipientSummary = /*@__PURE__*/ defineContainer<JSX.VerdocsEnvelopeRecipientSummary>('verdocs-envelope-recipient-summary', undefined, [
  'endpoint',
  'envelopeId',
  'canSendAnother',
  'canView',
  'canDone',
  'another',
  'view',
  'next',
  'sdkError'
], [
  'another',
  'view',
  'next',
  'sdkError'
]);


export const VerdocsEnvelopeSidebar = /*@__PURE__*/ defineContainer<JSX.VerdocsEnvelopeSidebar>('verdocs-envelope-sidebar', undefined, [
  'endpoint',
  'envelopeId',
  'sdkError',
  'envelopeUpdated',
  'toggle',
  'another'
], [
  'sdkError',
  'envelopeUpdated',
  'toggle',
  'another'
]);


export const VerdocsEnvelopesList = /*@__PURE__*/ defineContainer<JSX.VerdocsEnvelopesList>('verdocs-envelopes-list', undefined, [
  'endpoint',
  'view',
  'status',
  'sort',
  'match',
  'showPagination',
  'rowsPerPage',
  'selectedPage',
  'changeView',
  'changeStatus',
  'changeSort',
  'changeMatch',
  'sdkError',
  'viewEnvelope',
  'finishEnvelope'
], [
  'changeView',
  'changeStatus',
  'changeSort',
  'changeMatch',
  'sdkError',
  'viewEnvelope',
  'finishEnvelope'
]);


export const VerdocsFieldAttachment = /*@__PURE__*/ defineContainer<JSX.VerdocsFieldAttachment>('verdocs-field-attachment', undefined, [
  'endpoint',
  'source',
  'sourceid',
  'fieldname',
  'field',
  'disabled',
  'editable',
  'moveable',
  'done',
  'xscale',
  'yscale',
  'pagenumber',
  'settingsChanged',
  'attached',
  'deleted'
], [
  'settingsChanged',
  'attached',
  'deleted'
]);


export const VerdocsFieldCheckbox = /*@__PURE__*/ defineContainer<JSX.VerdocsFieldCheckbox>('verdocs-field-checkbox', undefined, [
  'source',
  'sourceid',
  'fieldname',
  'field',
  'disabled',
  'done',
  'editable',
  'moveable',
  'xscale',
  'yscale',
  'pagenumber',
  'settingsChanged',
  'deleted'
], [
  'settingsChanged',
  'deleted'
]);


export const VerdocsFieldDate = /*@__PURE__*/ defineContainer<JSX.VerdocsFieldDate>('verdocs-field-date', undefined, [
  'source',
  'sourceid',
  'fieldname',
  'disabled',
  'editable',
  'moveable',
  'done',
  'xscale',
  'yscale',
  'pagenumber',
  'field',
  'settingsPress',
  'settingsChanged',
  'deleted'
], [
  'settingsPress',
  'settingsChanged',
  'deleted'
]);


export const VerdocsFieldDropdown = /*@__PURE__*/ defineContainer<JSX.VerdocsFieldDropdown>('verdocs-field-dropdown', undefined, [
  'source',
  'sourceid',
  'fieldname',
  'field',
  'disabled',
  'editable',
  'moveable',
  'done',
  'xscale',
  'yscale',
  'pagenumber',
  'fieldChange',
  'settingsChanged',
  'deleted'
], [
  'fieldChange',
  'settingsChanged',
  'deleted'
]);


export const VerdocsFieldInitial = /*@__PURE__*/ defineContainer<JSX.VerdocsFieldInitial>('verdocs-field-initial', undefined, [
  'source',
  'sourceid',
  'fieldname',
  'field',
  'disabled',
  'initials',
  'editable',
  'moveable',
  'done',
  'xscale',
  'yscale',
  'pagenumber',
  'adopt',
  'exit',
  'fieldChange',
  'settingsChanged',
  'settingsPress',
  'deleted'
], [
  'adopt',
  'exit',
  'fieldChange',
  'settingsChanged',
  'settingsPress',
  'deleted'
]);


export const VerdocsFieldPayment = /*@__PURE__*/ defineContainer<JSX.VerdocsFieldPayment>('verdocs-field-payment', undefined, [
  'source',
  'sourceid',
  'fieldname',
  'field',
  'disabled',
  'done',
  'editable',
  'moveable',
  'xscale',
  'yscale',
  'pagenumber',
  'fields',
  'pageNum',
  'roleName',
  'fieldId',
  'recipients',
  'selectedRoleName',
  'pdfPages',
  'currentSignature',
  'currentSignatureId',
  'currentInitial',
  'currentInitialId',
  'signed',
  'roleindex',
  'settingsChanged',
  'deleted'
], [
  'settingsChanged',
  'deleted'
]);


export const VerdocsFieldRadio = /*@__PURE__*/ defineContainer<JSX.VerdocsFieldRadio>('verdocs-field-radio', undefined, [
  'source',
  'sourceid',
  'fieldname',
  'field',
  'disabled',
  'required',
  'done',
  'editable',
  'moveable',
  'xscale',
  'yscale',
  'pagenumber',
  'settingsChanged',
  'deleted'
], [
  'settingsChanged',
  'deleted'
]);


export const VerdocsFieldSignature = /*@__PURE__*/ defineContainer<JSX.VerdocsFieldSignature>('verdocs-field-signature', undefined, [
  'source',
  'sourceid',
  'fieldname',
  'field',
  'name',
  'disabled',
  'editable',
  'moveable',
  'done',
  'xscale',
  'yscale',
  'pagenumber',
  'fieldChange',
  'settingsPress',
  'settingsChanged',
  'deleted'
], [
  'fieldChange',
  'settingsPress',
  'settingsChanged',
  'deleted'
]);


export const VerdocsFieldTextarea = /*@__PURE__*/ defineContainer<JSX.VerdocsFieldTextarea>('verdocs-field-textarea', undefined, [
  'endpoint',
  'source',
  'sourceid',
  'fieldname',
  'field',
  'disabled',
  'editable',
  'moveable',
  'done',
  'xscale',
  'yscale',
  'pagenumber',
  'settingsChanged',
  'deleted'
], [
  'settingsChanged',
  'deleted'
]);


export const VerdocsFieldTextbox = /*@__PURE__*/ defineContainer<JSX.VerdocsFieldTextbox>('verdocs-field-textbox', undefined, [
  'source',
  'sourceid',
  'fieldname',
  'field',
  'disabled',
  'multiline',
  'editable',
  'moveable',
  'done',
  'xscale',
  'yscale',
  'pagenumber',
  'settingsChanged',
  'deleted'
], [
  'settingsChanged',
  'deleted'
]);


export const VerdocsFieldTimestamp = /*@__PURE__*/ defineContainer<JSX.VerdocsFieldTimestamp>('verdocs-field-timestamp', undefined, [
  'source',
  'sourceid',
  'fieldname',
  'field',
  'disabled',
  'editable',
  'moveable',
  'done',
  'xscale',
  'yscale',
  'pagenumber',
  'settingsChanged',
  'deleted'
], [
  'settingsChanged',
  'deleted'
]);


export const VerdocsFileChooser = /*@__PURE__*/ defineContainer<JSX.VerdocsFileChooser>('verdocs-file-chooser', undefined, [
  'endpoint',
  'fileSelected'
], [
  'fileSelected'
]);


export const VerdocsHelpIcon = /*@__PURE__*/ defineContainer<JSX.VerdocsHelpIcon>('verdocs-help-icon', undefined, [
  'text',
  'icon'
]);


export const VerdocsInitialDialog = /*@__PURE__*/ defineContainer<JSX.VerdocsInitialDialog>('verdocs-initial-dialog', undefined, [
  'initials',
  'next',
  'exit'
], [
  'next',
  'exit'
]);


export const VerdocsKbaDialog = /*@__PURE__*/ defineContainer<JSX.VerdocsKbaDialog>('verdocs-kba-dialog', undefined, [
  'step',
  'steps',
  'helptitle',
  'helptext',
  'mode',
  'label',
  'placeholder',
  'recipient',
  'choices',
  'exit',
  'pinEntered',
  'next'
], [
  'exit',
  'pinEntered',
  'next'
]);


export const VerdocsLoader = /*@__PURE__*/ defineContainer<JSX.VerdocsLoader>('verdocs-loader', undefined);


export const VerdocsMenuPanel = /*@__PURE__*/ defineContainer<JSX.VerdocsMenuPanel>('verdocs-menu-panel', undefined, [
  'side',
  'overlay',
  'width',
  'close'
], [
  'close'
]);


export const VerdocsMultiselect = /*@__PURE__*/ defineContainer<JSX.VerdocsMultiselect>('verdocs-multiselect', undefined, [
  'label',
  'placeholder',
  'options',
  'selectedOptions',
  'selectionChanged'
], [
  'selectionChanged'
]);


export const VerdocsOkDialog = /*@__PURE__*/ defineContainer<JSX.VerdocsOkDialog>('verdocs-ok-dialog', undefined, [
  'heading',
  'message',
  'buttonLabel',
  'showCancel',
  'next',
  'exit'
], [
  'next',
  'exit'
]);


export const VerdocsOrganizationCard = /*@__PURE__*/ defineContainer<JSX.VerdocsOrganizationCard>('verdocs-organization-card', undefined, [
  'organization'
]);


export const VerdocsPagination = /*@__PURE__*/ defineContainer<JSX.VerdocsPagination>('verdocs-pagination', undefined, [
  'selectedPage',
  'itemCount',
  'perPage',
  'selectPage'
], [
  'selectPage'
]);


export const VerdocsPortal = /*@__PURE__*/ defineContainer<JSX.VerdocsPortal>('verdocs-portal', undefined, [
  'anchor',
  'voffset',
  'clickAway'
], [
  'clickAway'
]);


export const VerdocsPreview = /*@__PURE__*/ defineContainer<JSX.VerdocsPreview>('verdocs-preview', undefined, [
  'endpoint',
  'templateId',
  'sdkError'
], [
  'sdkError'
]);


export const VerdocsProgressBar = /*@__PURE__*/ defineContainer<JSX.VerdocsProgressBar>('verdocs-progress-bar', undefined, [
  'label',
  'showPercent',
  'percent'
]);


export const VerdocsQuickFilter = /*@__PURE__*/ defineContainer<JSX.VerdocsQuickFilter>('verdocs-quick-filter', undefined, [
  'options',
  'label',
  'value',
  'placeholder',
  'optionSelected'
], [
  'optionSelected'
]);


export const VerdocsQuickFunctions = /*@__PURE__*/ defineContainer<JSX.VerdocsQuickFunctions>('verdocs-quick-functions', undefined, [
  'endpoint',
  'createTemplate',
  'createDocument'
], [
  'createTemplate',
  'createDocument'
]);


export const VerdocsRadioButton = /*@__PURE__*/ defineContainer<JSX.VerdocsRadioButton>('verdocs-radio-button', undefined, [
  'checked',
  'name',
  'value',
  'disabled'
]);


export const VerdocsSearchBox = /*@__PURE__*/ defineContainer<JSX.VerdocsSearchBox>('verdocs-search-box', undefined, [
  'endpoint',
  'placeholder',
  'type',
  'query',
  'grabsFocus',
  'searchClicked',
  'typeChanged',
  'queryChanged'
], [
  'searchClicked',
  'typeChanged',
  'queryChanged'
]);


export const VerdocsSearchTabs = /*@__PURE__*/ defineContainer<JSX.VerdocsSearchTabs>('verdocs-search-tabs', undefined);


export const VerdocsSelectInput = /*@__PURE__*/ defineContainer<JSX.VerdocsSelectInput>('verdocs-select-input', undefined, [
  'value',
  'label',
  'options',
  'disabled'
]);


export const VerdocsSend = /*@__PURE__*/ defineContainer<JSX.VerdocsSend>('verdocs-send', undefined, [
  'endpoint',
  'templateId',
  'environment',
  'beforeSend',
  'send',
  'exit',
  'sdkError',
  'searchContacts'
], [
  'beforeSend',
  'send',
  'exit',
  'sdkError',
  'searchContacts'
]);


export const VerdocsSign = /*@__PURE__*/ defineContainer<JSX.VerdocsSign>('verdocs-sign', undefined, [
  'endpoint',
  'envelopeId',
  'roleId',
  'inviteCode',
  'headerTargetId',
  'sdkError',
  'envelopeLoaded',
  'envelopeUpdated'
], [
  'sdkError',
  'envelopeLoaded',
  'envelopeUpdated'
]);


export const VerdocsSignatureDialog = /*@__PURE__*/ defineContainer<JSX.VerdocsSignatureDialog>('verdocs-signature-dialog', undefined, [
  'name',
  'next',
  'exit'
], [
  'next',
  'exit'
]);


export const VerdocsSpinner = /*@__PURE__*/ defineContainer<JSX.VerdocsSpinner>('verdocs-spinner', undefined, [
  'size',
  'mode'
]);


export const VerdocsStatusIndicator = /*@__PURE__*/ defineContainer<JSX.VerdocsStatusIndicator>('verdocs-status-indicator', undefined, [
  'size',
  'theme',
  'status',
  'envelope'
]);


export const VerdocsSwitch = /*@__PURE__*/ defineContainer<JSX.VerdocsSwitch>('verdocs-switch', undefined, [
  'checked',
  'theme',
  'disabled',
  'checkedChange'
], [
  'checkedChange'
]);


export const VerdocsTable = /*@__PURE__*/ defineContainer<JSX.VerdocsTable>('verdocs-table', undefined, [
  'columns',
  'data',
  'colHeaderClick',
  'rowClick'
], [
  'colHeaderClick',
  'rowClick'
]);


export const VerdocsTabs = /*@__PURE__*/ defineContainer<JSX.VerdocsTabs>('verdocs-tabs', undefined, [
  'tabs',
  'selectedTab',
  'selectTab'
], [
  'selectTab'
]);


export const VerdocsTemplateAttachments = /*@__PURE__*/ defineContainer<JSX.VerdocsTemplateAttachments>('verdocs-template-attachments', undefined, [
  'endpoint',
  'templateId',
  'exit',
  'next',
  'templateUpdated',
  'sdkError'
], [
  'exit',
  'next',
  'templateUpdated',
  'sdkError'
]);


export const VerdocsTemplateBuildTabs = /*@__PURE__*/ defineContainer<JSX.VerdocsTemplateBuildTabs>('verdocs-template-build-tabs', undefined, [
  'endpoint',
  'templateId',
  'step',
  'sdkError',
  'stepChanged'
], [
  'sdkError',
  'stepChanged'
]);


export const VerdocsTemplateCard = /*@__PURE__*/ defineContainer<JSX.VerdocsTemplateCard>('verdocs-template-card', undefined, [
  'template'
]);


export const VerdocsTemplateCreate = /*@__PURE__*/ defineContainer<JSX.VerdocsTemplateCreate>('verdocs-template-create', undefined, [
  'endpoint',
  'maxSize',
  'exit',
  'next',
  'sdkError',
  'templateCreated'
], [
  'exit',
  'next',
  'sdkError',
  'templateCreated'
]);


export const VerdocsTemplateDocumentPage = /*@__PURE__*/ defineContainer<JSX.VerdocsTemplateDocumentPage>('verdocs-template-document-page', undefined, [
  'endpoint',
  'editable',
  'disabled',
  'done',
  'templateId',
  'documentId',
  'pageNumber',
  'virtualWidth',
  'virtualHeight',
  'layers',
  'pageRendered'
], [
  'pageRendered'
]);


export const VerdocsTemplateFieldProperties = /*@__PURE__*/ defineContainer<JSX.VerdocsTemplateFieldProperties>('verdocs-template-field-properties', undefined, [
  'endpoint',
  'templateId',
  'fieldName',
  'helpText',
  'close',
  'delete',
  'settingsChanged',
  'sdkError'
], [
  'close',
  'delete',
  'settingsChanged',
  'sdkError'
]);


export const VerdocsTemplateFields = /*@__PURE__*/ defineContainer<JSX.VerdocsTemplateFields>('verdocs-template-fields', undefined, [
  'endpoint',
  'templateId',
  'toolbarTargetId',
  'sdkError',
  'templateUpdated',
  'fieldsUpdated'
], [
  'sdkError',
  'templateUpdated',
  'fieldsUpdated'
]);


export const VerdocsTemplateRoleProperties = /*@__PURE__*/ defineContainer<JSX.VerdocsTemplateRoleProperties>('verdocs-template-role-properties', undefined, [
  'endpoint',
  'templateId',
  'roleName',
  'close',
  'delete',
  'sdkError'
], [
  'close',
  'delete',
  'sdkError'
]);


export const VerdocsTemplateRoles = /*@__PURE__*/ defineContainer<JSX.VerdocsTemplateRoles>('verdocs-template-roles', undefined, [
  'endpoint',
  'templateId',
  'next',
  'exit',
  'sdkError',
  'rolesUpdated'
], [
  'next',
  'exit',
  'sdkError',
  'rolesUpdated'
]);


export const VerdocsTemplateSettings = /*@__PURE__*/ defineContainer<JSX.VerdocsTemplateSettings>('verdocs-template-settings', undefined, [
  'endpoint',
  'templateId',
  'next',
  'exit',
  'sdkError',
  'templateUpdated'
], [
  'next',
  'exit',
  'sdkError',
  'templateUpdated'
]);


export const VerdocsTemplateStar = /*@__PURE__*/ defineContainer<JSX.VerdocsTemplateStar>('verdocs-template-star', undefined, [
  'endpoint',
  'template',
  'starChange',
  'sdkError'
], [
  'starChange',
  'sdkError'
]);


export const VerdocsTemplateTags = /*@__PURE__*/ defineContainer<JSX.VerdocsTemplateTags>('verdocs-template-tags', undefined, [
  'tags'
]);


export const VerdocsTemplatesList = /*@__PURE__*/ defineContainer<JSX.VerdocsTemplatesList>('verdocs-templates-list', undefined, [
  'endpoint',
  'visibility',
  'starred',
  'sort',
  'name',
  'allowedActions',
  'showPagination',
  'rowsPerPage',
  'selectedPage',
  'sdkError',
  'viewTemplate',
  'signNow',
  'submittedData',
  'editTemplate',
  'templateDeleted',
  'changeSort',
  'changeVisibility',
  'changeStarred',
  'changeName'
], [
  'sdkError',
  'viewTemplate',
  'signNow',
  'submittedData',
  'editTemplate',
  'templateDeleted',
  'changeSort',
  'changeVisibility',
  'changeStarred',
  'changeName'
]);


export const VerdocsTextInput = /*@__PURE__*/ defineContainer<JSX.VerdocsTextInput>('verdocs-text-input', undefined, [
  'value',
  'label',
  'placeholder',
  'autocomplete',
  'helpText',
  'clearable',
  'copyable',
  'type',
  'disabled',
  'required'
]);


export const VerdocsToggle = /*@__PURE__*/ defineContainer<JSX.VerdocsToggle>('verdocs-toggle', undefined, [
  'options',
  'theme'
]);


export const VerdocsToggleButton = /*@__PURE__*/ defineContainer<JSX.VerdocsToggleButton>('verdocs-toggle-button', undefined, [
  'active',
  'icon',
  'label',
  'size',
  'toggle'
], [
  'toggle'
]);


export const VerdocsToolbarIcon = /*@__PURE__*/ defineContainer<JSX.VerdocsToolbarIcon>('verdocs-toolbar-icon', undefined, [
  'text',
  'icon',
  'placement'
]);


export const VerdocsUploadDialog = /*@__PURE__*/ defineContainer<JSX.VerdocsUploadDialog>('verdocs-upload-dialog', undefined, [
  'maxSize',
  'existingFile',
  'exit',
  'next',
  'remove'
], [
  'exit',
  'next',
  'remove'
]);


export const VerdocsView = /*@__PURE__*/ defineContainer<JSX.VerdocsView>('verdocs-view', undefined, [
  'endpoint',
  'envelopeId',
  'headerTargetId',
  'sdkError',
  'envelopeUpdated',
  'another',
  'view',
  'next'
], [
  'sdkError',
  'envelopeUpdated',
  'another',
  'view',
  'next'
]);

