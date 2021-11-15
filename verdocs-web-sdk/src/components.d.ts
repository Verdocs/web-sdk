/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { TDocumentStatus } from "@verdocs/js-sdk/Documents/Documents";
import { IMenuOption } from "./components/controls/dropdown-menu/dropdown-menu";
import { ISearchEvent, TContentType } from "./components/elements/search-box/search-box";
import { IRecentSearch, ISavedSearch } from "@verdocs/js-sdk/Search/Types";
import { IToggleIconButtons } from "./components/controls/toggle-icon-buttons/toggle-icon-buttons";
export namespace Components {
    interface DocumentStatusIndicator {
        /**
          * The status to display
         */
        "status": TDocumentStatus;
    }
    interface DropdownMenu {
        /**
          * If set, the component will be open by default. This is primarily intended to be used for testing.
         */
        "open": boolean;
        /**
          * The menu options to display.
         */
        "options": IMenuOption[];
        /**
          * If set, the component will reserve space for Storybook-display purposes.
         */
        "tall": boolean;
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
    interface PdfViewer {
        /**
          * Rotate the PDF in degrees {number}
         */
        "rotation": 0 | 90 | 180 | 270 | 360;
        /**
          * Src of the PDF to load and render {number}
         */
        "src": string;
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
    interface SearchEmbed {
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
}
declare global {
    interface HTMLDocumentStatusIndicatorElement extends Components.DocumentStatusIndicator, HTMLStencilElement {
    }
    var HTMLDocumentStatusIndicatorElement: {
        prototype: HTMLDocumentStatusIndicatorElement;
        new (): HTMLDocumentStatusIndicatorElement;
    };
    interface HTMLDropdownMenuElement extends Components.DropdownMenu, HTMLStencilElement {
    }
    var HTMLDropdownMenuElement: {
        prototype: HTMLDropdownMenuElement;
        new (): HTMLDropdownMenuElement;
    };
    interface HTMLOrgPopupElement extends Components.OrgPopup, HTMLStencilElement {
    }
    var HTMLOrgPopupElement: {
        prototype: HTMLOrgPopupElement;
        new (): HTMLOrgPopupElement;
    };
    interface HTMLPdfViewerElement extends Components.PdfViewer, HTMLStencilElement {
    }
    var HTMLPdfViewerElement: {
        prototype: HTMLPdfViewerElement;
        new (): HTMLPdfViewerElement;
    };
    interface HTMLSearchBoxElement extends Components.SearchBox, HTMLStencilElement {
    }
    var HTMLSearchBoxElement: {
        prototype: HTMLSearchBoxElement;
        new (): HTMLSearchBoxElement;
    };
    interface HTMLSearchEmbedElement extends Components.SearchEmbed, HTMLStencilElement {
    }
    var HTMLSearchEmbedElement: {
        prototype: HTMLSearchEmbedElement;
        new (): HTMLSearchEmbedElement;
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
    interface HTMLElementTagNameMap {
        "document-status-indicator": HTMLDocumentStatusIndicatorElement;
        "dropdown-menu": HTMLDropdownMenuElement;
        "org-popup": HTMLOrgPopupElement;
        "pdf-viewer": HTMLPdfViewerElement;
        "search-box": HTMLSearchBoxElement;
        "search-embed": HTMLSearchEmbedElement;
        "search-quick-functions": HTMLSearchQuickFunctionsElement;
        "search-recent": HTMLSearchRecentElement;
        "search-saved": HTMLSearchSavedElement;
        "search-starred": HTMLSearchStarredElement;
        "search-tabs": HTMLSearchTabsElement;
        "tags-indicator": HTMLTagsIndicatorElement;
        "template-card": HTMLTemplateCardElement;
        "toggle-icon-buttons": HTMLToggleIconButtonsElement;
    }
}
declare namespace LocalJSX {
    interface DocumentStatusIndicator {
        /**
          * The status to display
         */
        "status"?: TDocumentStatus;
    }
    interface DropdownMenu {
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
        /**
          * If set, the component will reserve space for Storybook-display purposes.
         */
        "tall"?: boolean;
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
    interface PdfViewer {
        "onPageChange"?: (event: CustomEvent<number>) => void;
        "onPageRendered"?: (event: CustomEvent<number>) => void;
        /**
          * Rotate the PDF in degrees {number}
         */
        "rotation"?: 0 | 90 | 180 | 270 | 360;
        /**
          * Src of the PDF to load and render {number}
         */
        "src"?: string;
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
    interface SearchEmbed {
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
    interface IntrinsicElements {
        "document-status-indicator": DocumentStatusIndicator;
        "dropdown-menu": DropdownMenu;
        "org-popup": OrgPopup;
        "pdf-viewer": PdfViewer;
        "search-box": SearchBox;
        "search-embed": SearchEmbed;
        "search-quick-functions": SearchQuickFunctions;
        "search-recent": SearchRecent;
        "search-saved": SearchSaved;
        "search-starred": SearchStarred;
        "search-tabs": SearchTabs;
        "tags-indicator": TagsIndicator;
        "template-card": TemplateCard;
        "toggle-icon-buttons": ToggleIconButtons;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "document-status-indicator": LocalJSX.DocumentStatusIndicator & JSXBase.HTMLAttributes<HTMLDocumentStatusIndicatorElement>;
            "dropdown-menu": LocalJSX.DropdownMenu & JSXBase.HTMLAttributes<HTMLDropdownMenuElement>;
            "org-popup": LocalJSX.OrgPopup & JSXBase.HTMLAttributes<HTMLOrgPopupElement>;
            "pdf-viewer": LocalJSX.PdfViewer & JSXBase.HTMLAttributes<HTMLPdfViewerElement>;
            "search-box": LocalJSX.SearchBox & JSXBase.HTMLAttributes<HTMLSearchBoxElement>;
            "search-embed": LocalJSX.SearchEmbed & JSXBase.HTMLAttributes<HTMLSearchEmbedElement>;
            "search-quick-functions": LocalJSX.SearchQuickFunctions & JSXBase.HTMLAttributes<HTMLSearchQuickFunctionsElement>;
            "search-recent": LocalJSX.SearchRecent & JSXBase.HTMLAttributes<HTMLSearchRecentElement>;
            "search-saved": LocalJSX.SearchSaved & JSXBase.HTMLAttributes<HTMLSearchSavedElement>;
            "search-starred": LocalJSX.SearchStarred & JSXBase.HTMLAttributes<HTMLSearchStarredElement>;
            "search-tabs": LocalJSX.SearchTabs & JSXBase.HTMLAttributes<HTMLSearchTabsElement>;
            "tags-indicator": LocalJSX.TagsIndicator & JSXBase.HTMLAttributes<HTMLTagsIndicatorElement>;
            "template-card": LocalJSX.TemplateCard & JSXBase.HTMLAttributes<HTMLTemplateCardElement>;
            "toggle-icon-buttons": LocalJSX.ToggleIconButtons & JSXBase.HTMLAttributes<HTMLToggleIconButtonsElement>;
        }
    }
}
