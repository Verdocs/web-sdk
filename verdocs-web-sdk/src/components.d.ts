/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { TDocumentStatus } from "@verdocs/js-sdk/Documents/Documents";
import { ISearchEvent, TContentType } from "./components/elements/search-box/search-box";
import { IRecentSearch, ISavedSearch } from "@verdocs/js-sdk/Search/Types";
import { IToggleIconButtons } from "./components/controls/toggle-icon-buttons/toggle-icon-buttons";
import { IAuthStatus } from "./components/embeds/verdocs-auth/verdocs-auth";
import { IMenuOption } from "./components/controls/verdocs-dropdown/verdocs-dropdown";
export namespace Components {
    interface DocumentStatusIndicator {
        /**
          * The status to display
         */
        "status": TDocumentStatus;
    }
    interface OrgPopup {
        /**
          * The organization to display
         */
        "organization": any;
        /**
          * The "theme" to be used
         */
        "theme": "light" | "dark";
    }
    interface SearchBox {
        /**
          * The placeholder to display in the input field.
         */
        "placeholder": string;
        /**
          * The text search string entered by the user.
         */
        "query": string;
        /**
          * If set to a value other than 'all', a removeable filter indicator will be displayed.
         */
        "type": TContentType;
    }
    interface SearchQuickFunctions {
    }
    interface SearchRecent {
        /**
          * If set, limits the number of entries that will be shown. Note that there is a server-imposed limit of 20 entries that cannot currently be increased (only reduced).
         */
        "limit": number;
    }
    interface SearchSaved {
        /**
          * If set, limits the number of entries that will be shown. Note that there is a server-imposed limit of 20 entries that cannot currently be increased (only reduced).
         */
        "limit": number;
    }
    interface SearchStarred {
        "options": any;
    }
    interface SearchTabs {
    }
    interface TagsIndicator {
        /**
          * The tags to display
         */
        "tags": any[];
        /**
          * The "theme" to be used
         */
        "theme": "light" | "dark";
    }
    interface TemplateCard {
        /**
          * The template whose information is gonna be displayed
         */
        "template": any;
        /**
          * The "theme" to be used
         */
        "theme": 'light' | 'dark';
    }
    interface ToggleIconButtons {
        /**
          * The tags to display
         */
        "options": IToggleIconButtons;
        /**
          * The "theme" to be used
         */
        "theme": "light" | "dark";
    }
    interface VerdocsAuth {
        /**
          * If the user is authenticated, this embed will normally render invisibly. If debug is set true, a summary if the user's session details will be displayed instead. This may be useful while debugging authentication flows in new applications.
         */
        "debug": boolean;
        /**
          * By default, a Verdocs logo will be displayed above the login/signup forms. This may be used to override its source. (Alternatively, you may simply hide it via CSS overrides.) Logos should be in SVG format for best results.
         */
        "logo": string;
        /**
          * Normally, if the user has a valid session, this embed will be invisible, otherwise it will display login / signup forms. If this is set to false, this embed will be invisible in both cases. Apps may use this to verify if a user has a valid session without needing a separate call to Verdocs JS SDK.
         */
        "visible": boolean;
    }
    interface VerdocsButton {
        /**
          * Whether the button should be disabled.
         */
        "disabled": boolean;
        /**
          * The label for the  button.
         */
        "label": string;
        /**
          * The type of the button.
         */
        "type": 'button' | 'submit' | 'reset';
    }
    interface VerdocsDropdown {
        /**
          * If set, the component will be open by default. This is primarily intended to be used for testing.
         */
        "open": boolean;
        /**
          * The menu options to display.
         */
        "options": IMenuOption[];
    }
    interface VerdocsOkDialog {
        /**
          * The title of the dialog. "title" is a reserved word, so we use heading.
         */
        "heading": string;
        /**
          * The message content to display.
         */
        "message": string;
        /**
          * Whether the dialog is currently being displayed. This allows it to be added to the DOM before being displayed.
         */
        "open": boolean;
    }
    interface VerdocsSearch {
    }
    interface VerdocsSign {
        /**
          * If `source` is set to `verdocs-sign`, this should be set to a valid invitation code to activate a signing session.
         */
        "documentid": string | null;
        /**
          * If `source` is set to `verdocs-sign`, this should be set to a valid invitation code to activate a signing session.
         */
        "invitecode": string | null;
        /**
          * If `source` is set to `verdocs-sign`, this should be set to a valid invitation code to activate a signing session.
         */
        "roleid": string | null;
    }
    interface VerdocsTextButton {
        /**
          * Whether the button should be disabled.
         */
        "disabled": boolean;
        /**
          * The label for the  button.
         */
        "label": string;
        /**
          * The type of the button.
         */
        "type": 'button' | 'submit' | 'reset';
    }
    interface VerdocsTextInput {
        /**
          * If desired, the autocomplete attribute to set.
         */
        "autocomplete": string;
        /**
          * Should the field be disabled?
         */
        "disabled": boolean;
        /**
          * The label for the field.
         */
        "label": string;
        /**
          * The placeholder for the field.
         */
        "placeholder": string;
        /**
          * The type of field to render. Only text-type fields are allowed here for the current styling. Additional types (e.g. a date picker) will be supported by other controls in the future.
         */
        "type": 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url';
        /**
          * The value for the input field.
         */
        "value": string;
    }
    interface VerdocsView {
        /**
          * Rotate the PDF in degrees {number}
         */
        "rotation": 0 | 90 | 180 | 270;
        /**
          * Src of the PDF to load and render
         */
        "source": string;
        /**
          * Access token to use. This component is a wrapper for PDF.js which does not use a VerdocsEndpoint, so the token must be supplied directly.
         */
        "token": string | null;
    }
}
declare global {
    interface HTMLDocumentStatusIndicatorElement extends Components.DocumentStatusIndicator, HTMLStencilElement {
    }
    var HTMLDocumentStatusIndicatorElement: {
        prototype: HTMLDocumentStatusIndicatorElement;
        new (): HTMLDocumentStatusIndicatorElement;
    };
    interface HTMLOrgPopupElement extends Components.OrgPopup, HTMLStencilElement {
    }
    var HTMLOrgPopupElement: {
        prototype: HTMLOrgPopupElement;
        new (): HTMLOrgPopupElement;
    };
    interface HTMLSearchBoxElement extends Components.SearchBox, HTMLStencilElement {
    }
    var HTMLSearchBoxElement: {
        prototype: HTMLSearchBoxElement;
        new (): HTMLSearchBoxElement;
    };
    interface HTMLSearchQuickFunctionsElement extends Components.SearchQuickFunctions, HTMLStencilElement {
    }
    var HTMLSearchQuickFunctionsElement: {
        prototype: HTMLSearchQuickFunctionsElement;
        new (): HTMLSearchQuickFunctionsElement;
    };
    interface HTMLSearchRecentElement extends Components.SearchRecent, HTMLStencilElement {
    }
    var HTMLSearchRecentElement: {
        prototype: HTMLSearchRecentElement;
        new (): HTMLSearchRecentElement;
    };
    interface HTMLSearchSavedElement extends Components.SearchSaved, HTMLStencilElement {
    }
    var HTMLSearchSavedElement: {
        prototype: HTMLSearchSavedElement;
        new (): HTMLSearchSavedElement;
    };
    interface HTMLSearchStarredElement extends Components.SearchStarred, HTMLStencilElement {
    }
    var HTMLSearchStarredElement: {
        prototype: HTMLSearchStarredElement;
        new (): HTMLSearchStarredElement;
    };
    interface HTMLSearchTabsElement extends Components.SearchTabs, HTMLStencilElement {
    }
    var HTMLSearchTabsElement: {
        prototype: HTMLSearchTabsElement;
        new (): HTMLSearchTabsElement;
    };
    interface HTMLTagsIndicatorElement extends Components.TagsIndicator, HTMLStencilElement {
    }
    var HTMLTagsIndicatorElement: {
        prototype: HTMLTagsIndicatorElement;
        new (): HTMLTagsIndicatorElement;
    };
    interface HTMLTemplateCardElement extends Components.TemplateCard, HTMLStencilElement {
    }
    var HTMLTemplateCardElement: {
        prototype: HTMLTemplateCardElement;
        new (): HTMLTemplateCardElement;
    };
    interface HTMLToggleIconButtonsElement extends Components.ToggleIconButtons, HTMLStencilElement {
    }
    var HTMLToggleIconButtonsElement: {
        prototype: HTMLToggleIconButtonsElement;
        new (): HTMLToggleIconButtonsElement;
    };
    interface HTMLVerdocsAuthElement extends Components.VerdocsAuth, HTMLStencilElement {
    }
    var HTMLVerdocsAuthElement: {
        prototype: HTMLVerdocsAuthElement;
        new (): HTMLVerdocsAuthElement;
    };
    interface HTMLVerdocsButtonElement extends Components.VerdocsButton, HTMLStencilElement {
    }
    var HTMLVerdocsButtonElement: {
        prototype: HTMLVerdocsButtonElement;
        new (): HTMLVerdocsButtonElement;
    };
    interface HTMLVerdocsDropdownElement extends Components.VerdocsDropdown, HTMLStencilElement {
    }
    var HTMLVerdocsDropdownElement: {
        prototype: HTMLVerdocsDropdownElement;
        new (): HTMLVerdocsDropdownElement;
    };
    interface HTMLVerdocsOkDialogElement extends Components.VerdocsOkDialog, HTMLStencilElement {
    }
    var HTMLVerdocsOkDialogElement: {
        prototype: HTMLVerdocsOkDialogElement;
        new (): HTMLVerdocsOkDialogElement;
    };
    interface HTMLVerdocsSearchElement extends Components.VerdocsSearch, HTMLStencilElement {
    }
    var HTMLVerdocsSearchElement: {
        prototype: HTMLVerdocsSearchElement;
        new (): HTMLVerdocsSearchElement;
    };
    interface HTMLVerdocsSignElement extends Components.VerdocsSign, HTMLStencilElement {
    }
    var HTMLVerdocsSignElement: {
        prototype: HTMLVerdocsSignElement;
        new (): HTMLVerdocsSignElement;
    };
    interface HTMLVerdocsTextButtonElement extends Components.VerdocsTextButton, HTMLStencilElement {
    }
    var HTMLVerdocsTextButtonElement: {
        prototype: HTMLVerdocsTextButtonElement;
        new (): HTMLVerdocsTextButtonElement;
    };
    interface HTMLVerdocsTextInputElement extends Components.VerdocsTextInput, HTMLStencilElement {
    }
    var HTMLVerdocsTextInputElement: {
        prototype: HTMLVerdocsTextInputElement;
        new (): HTMLVerdocsTextInputElement;
    };
    interface HTMLVerdocsViewElement extends Components.VerdocsView, HTMLStencilElement {
    }
    var HTMLVerdocsViewElement: {
        prototype: HTMLVerdocsViewElement;
        new (): HTMLVerdocsViewElement;
    };
    interface HTMLElementTagNameMap {
        "document-status-indicator": HTMLDocumentStatusIndicatorElement;
        "org-popup": HTMLOrgPopupElement;
        "search-box": HTMLSearchBoxElement;
        "search-quick-functions": HTMLSearchQuickFunctionsElement;
        "search-recent": HTMLSearchRecentElement;
        "search-saved": HTMLSearchSavedElement;
        "search-starred": HTMLSearchStarredElement;
        "search-tabs": HTMLSearchTabsElement;
        "tags-indicator": HTMLTagsIndicatorElement;
        "template-card": HTMLTemplateCardElement;
        "toggle-icon-buttons": HTMLToggleIconButtonsElement;
        "verdocs-auth": HTMLVerdocsAuthElement;
        "verdocs-button": HTMLVerdocsButtonElement;
        "verdocs-dropdown": HTMLVerdocsDropdownElement;
        "verdocs-ok-dialog": HTMLVerdocsOkDialogElement;
        "verdocs-search": HTMLVerdocsSearchElement;
        "verdocs-sign": HTMLVerdocsSignElement;
        "verdocs-text-button": HTMLVerdocsTextButtonElement;
        "verdocs-text-input": HTMLVerdocsTextInputElement;
        "verdocs-view": HTMLVerdocsViewElement;
    }
}
declare namespace LocalJSX {
    interface DocumentStatusIndicator {
        /**
          * The status to display
         */
        "status"?: TDocumentStatus;
    }
    interface OrgPopup {
        /**
          * The organization to display
         */
        "organization"?: any;
        /**
          * The "theme" to be used
         */
        "theme"?: "light" | "dark";
    }
    interface SearchBox {
        /**
          * Event fired when the user changes the query string.
         */
        "onQueryChanged"?: (event: CustomEvent<string>) => void;
        /**
          * Event fired when the user changes the type.
         */
        "onSearchClicked"?: (event: CustomEvent<ISearchEvent>) => void;
        /**
          * Event fired when the user changes the type.
         */
        "onTypeChanged"?: (event: CustomEvent<TContentType>) => void;
        /**
          * The placeholder to display in the input field.
         */
        "placeholder"?: string;
        /**
          * The text search string entered by the user.
         */
        "query"?: string;
        /**
          * If set to a value other than 'all', a removeable filter indicator will be displayed.
         */
        "type"?: TContentType;
    }
    interface SearchQuickFunctions {
        /**
          * Event fired when an entry is clicked.
         */
        "onCreateDocument"?: (event: CustomEvent<any>) => void;
        /**
          * Event fired when an entry is clicked.
         */
        "onCreateTemplate"?: (event: CustomEvent<any>) => void;
    }
    interface SearchRecent {
        /**
          * If set, limits the number of entries that will be shown. Note that there is a server-imposed limit of 20 entries that cannot currently be increased (only reduced).
         */
        "limit"?: number;
        /**
          * Event fired when an entry is clicked.
         */
        "onEntrySelected"?: (event: CustomEvent<IRecentSearch>) => void;
    }
    interface SearchSaved {
        /**
          * If set, limits the number of entries that will be shown. Note that there is a server-imposed limit of 20 entries that cannot currently be increased (only reduced).
         */
        "limit"?: number;
        /**
          * Event fired when an entry is clicked.
         */
        "onEntrySelected"?: (event: CustomEvent<ISavedSearch>) => void;
    }
    interface SearchStarred {
        /**
          * Event fired when an entry is clicked.
         */
        "onEntrySelected"?: (event: CustomEvent<IRecentSearch>) => void;
        "options"?: any;
    }
    interface SearchTabs {
    }
    interface TagsIndicator {
        /**
          * The tags to display
         */
        "tags"?: any[];
        /**
          * The "theme" to be used
         */
        "theme"?: "light" | "dark";
    }
    interface TemplateCard {
        /**
          * The template whose information is gonna be displayed
         */
        "template"?: any;
        /**
          * The "theme" to be used
         */
        "theme"?: 'light' | 'dark';
    }
    interface ToggleIconButtons {
        /**
          * The tags to display
         */
        "options"?: IToggleIconButtons;
        /**
          * The "theme" to be used
         */
        "theme"?: "light" | "dark";
    }
    interface VerdocsAuth {
        /**
          * If the user is authenticated, this embed will normally render invisibly. If debug is set true, a summary if the user's session details will be displayed instead. This may be useful while debugging authentication flows in new applications.
         */
        "debug"?: boolean;
        /**
          * By default, a Verdocs logo will be displayed above the login/signup forms. This may be used to override its source. (Alternatively, you may simply hide it via CSS overrides.) Logos should be in SVG format for best results.
         */
        "logo"?: string;
        /**
          * Event fired when session authentication process has completed. Check the event contents for completion status.
         */
        "onAuthenticated"?: (event: CustomEvent<IAuthStatus>) => void;
        /**
          * Normally, if the user has a valid session, this embed will be invisible, otherwise it will display login / signup forms. If this is set to false, this embed will be invisible in both cases. Apps may use this to verify if a user has a valid session without needing a separate call to Verdocs JS SDK.
         */
        "visible"?: boolean;
    }
    interface VerdocsButton {
        /**
          * Whether the button should be disabled.
         */
        "disabled"?: boolean;
        /**
          * The label for the  button.
         */
        "label"?: string;
        /**
          * Event fired when the button is pressed.
         */
        "onPress"?: (event: CustomEvent<string>) => void;
        /**
          * The type of the button.
         */
        "type"?: 'button' | 'submit' | 'reset';
    }
    interface VerdocsDropdown {
        /**
          * Event fired when a menu option is clicked. Web Component events need to be "composed" to cross the Shadow DOM and be received by parent frameworks.
         */
        "onOptionSelected"?: (event: CustomEvent<IMenuOption>) => void;
        /**
          * If set, the component will be open by default. This is primarily intended to be used for testing.
         */
        "open"?: boolean;
        /**
          * The menu options to display.
         */
        "options"?: IMenuOption[];
    }
    interface VerdocsOkDialog {
        /**
          * The title of the dialog. "title" is a reserved word, so we use heading.
         */
        "heading"?: string;
        /**
          * The message content to display.
         */
        "message"?: string;
        /**
          * Event fired when the dialog is closed. The event data will contain the closure reason.
         */
        "onClosed"?: (event: CustomEvent<'cancel' | 'ok'>) => void;
        /**
          * Whether the dialog is currently being displayed. This allows it to be added to the DOM before being displayed.
         */
        "open"?: boolean;
    }
    interface VerdocsSearch {
    }
    interface VerdocsSign {
        /**
          * If `source` is set to `verdocs-sign`, this should be set to a valid invitation code to activate a signing session.
         */
        "documentid"?: string | null;
        /**
          * If `source` is set to `verdocs-sign`, this should be set to a valid invitation code to activate a signing session.
         */
        "invitecode"?: string | null;
        /**
          * Event fired when a signing session has been obtained.
         */
        "onAuthenticated"?: (event: CustomEvent<any>) => void;
        /**
          * If `source` is set to `verdocs-sign`, this should be set to a valid invitation code to activate a signing session.
         */
        "roleid"?: string | null;
    }
    interface VerdocsTextButton {
        /**
          * Whether the button should be disabled.
         */
        "disabled"?: boolean;
        /**
          * The label for the  button.
         */
        "label"?: string;
        /**
          * Event fired when the button is clicked.
         */
        "onPress"?: (event: CustomEvent<string>) => void;
        /**
          * The type of the button.
         */
        "type"?: 'button' | 'submit' | 'reset';
    }
    interface VerdocsTextInput {
        /**
          * If desired, the autocomplete attribute to set.
         */
        "autocomplete"?: string;
        /**
          * Should the field be disabled?
         */
        "disabled"?: boolean;
        /**
          * The label for the field.
         */
        "label"?: string;
        /**
          * Event fired when the field loses focus.
         */
        "onTblur"?: (event: CustomEvent<any>) => void;
        /**
          * Event fired when the field receives focus.
         */
        "onTfocus"?: (event: CustomEvent<any>) => void;
        /**
          * Event fired when the input value changes.
         */
        "onTinput"?: (event: CustomEvent<string>) => void;
        /**
          * The placeholder for the field.
         */
        "placeholder"?: string;
        /**
          * The type of field to render. Only text-type fields are allowed here for the current styling. Additional types (e.g. a date picker) will be supported by other controls in the future.
         */
        "type"?: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url';
        /**
          * The value for the input field.
         */
        "value"?: string;
    }
    interface VerdocsView {
        "onPageChange"?: (event: CustomEvent<number>) => void;
        "onPageRendered"?: (event: CustomEvent<number>) => void;
        /**
          * Rotate the PDF in degrees {number}
         */
        "rotation"?: 0 | 90 | 180 | 270;
        /**
          * Src of the PDF to load and render
         */
        "source"?: string;
        /**
          * Access token to use. This component is a wrapper for PDF.js which does not use a VerdocsEndpoint, so the token must be supplied directly.
         */
        "token"?: string | null;
    }
    interface IntrinsicElements {
        "document-status-indicator": DocumentStatusIndicator;
        "org-popup": OrgPopup;
        "search-box": SearchBox;
        "search-quick-functions": SearchQuickFunctions;
        "search-recent": SearchRecent;
        "search-saved": SearchSaved;
        "search-starred": SearchStarred;
        "search-tabs": SearchTabs;
        "tags-indicator": TagsIndicator;
        "template-card": TemplateCard;
        "toggle-icon-buttons": ToggleIconButtons;
        "verdocs-auth": VerdocsAuth;
        "verdocs-button": VerdocsButton;
        "verdocs-dropdown": VerdocsDropdown;
        "verdocs-ok-dialog": VerdocsOkDialog;
        "verdocs-search": VerdocsSearch;
        "verdocs-sign": VerdocsSign;
        "verdocs-text-button": VerdocsTextButton;
        "verdocs-text-input": VerdocsTextInput;
        "verdocs-view": VerdocsView;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "document-status-indicator": LocalJSX.DocumentStatusIndicator & JSXBase.HTMLAttributes<HTMLDocumentStatusIndicatorElement>;
            "org-popup": LocalJSX.OrgPopup & JSXBase.HTMLAttributes<HTMLOrgPopupElement>;
            "search-box": LocalJSX.SearchBox & JSXBase.HTMLAttributes<HTMLSearchBoxElement>;
            "search-quick-functions": LocalJSX.SearchQuickFunctions & JSXBase.HTMLAttributes<HTMLSearchQuickFunctionsElement>;
            "search-recent": LocalJSX.SearchRecent & JSXBase.HTMLAttributes<HTMLSearchRecentElement>;
            "search-saved": LocalJSX.SearchSaved & JSXBase.HTMLAttributes<HTMLSearchSavedElement>;
            "search-starred": LocalJSX.SearchStarred & JSXBase.HTMLAttributes<HTMLSearchStarredElement>;
            "search-tabs": LocalJSX.SearchTabs & JSXBase.HTMLAttributes<HTMLSearchTabsElement>;
            "tags-indicator": LocalJSX.TagsIndicator & JSXBase.HTMLAttributes<HTMLTagsIndicatorElement>;
            "template-card": LocalJSX.TemplateCard & JSXBase.HTMLAttributes<HTMLTemplateCardElement>;
            "toggle-icon-buttons": LocalJSX.ToggleIconButtons & JSXBase.HTMLAttributes<HTMLToggleIconButtonsElement>;
            "verdocs-auth": LocalJSX.VerdocsAuth & JSXBase.HTMLAttributes<HTMLVerdocsAuthElement>;
            "verdocs-button": LocalJSX.VerdocsButton & JSXBase.HTMLAttributes<HTMLVerdocsButtonElement>;
            "verdocs-dropdown": LocalJSX.VerdocsDropdown & JSXBase.HTMLAttributes<HTMLVerdocsDropdownElement>;
            "verdocs-ok-dialog": LocalJSX.VerdocsOkDialog & JSXBase.HTMLAttributes<HTMLVerdocsOkDialogElement>;
            "verdocs-search": LocalJSX.VerdocsSearch & JSXBase.HTMLAttributes<HTMLVerdocsSearchElement>;
            "verdocs-sign": LocalJSX.VerdocsSign & JSXBase.HTMLAttributes<HTMLVerdocsSignElement>;
            "verdocs-text-button": LocalJSX.VerdocsTextButton & JSXBase.HTMLAttributes<HTMLVerdocsTextButtonElement>;
            "verdocs-text-input": LocalJSX.VerdocsTextInput & JSXBase.HTMLAttributes<HTMLVerdocsTextInputElement>;
            "verdocs-view": LocalJSX.VerdocsView & JSXBase.HTMLAttributes<HTMLVerdocsViewElement>;
        }
    }
}
