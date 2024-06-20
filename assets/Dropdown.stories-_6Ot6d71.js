import{a as s}from"./components-DKG9T8RJ.js";/* empty css               */import"./index-DDbAvNeQ.js";import"./_commonjsHelpers-Cpj98o6Y.js";const d={title:"Controls/Dropdown",component:s,tags:["autodocs","!dev"],parameters:{layout:"centered",docs:{description:{story:`Display a drop-down menu button. A menu of the specified options will be displayed when the button is pressed.
The menu will be hidden when the button is pressed again, or an option is selected. Separators may be created
by supplying an entry with an empty label.

\`options\` should be an array of entries conforming to the following shape:

\`\`\`ts
interface IDropdownItem {
  // Required. The label to show in the dropown list.
  label: string;

  // Optional identifier, will be included in the change event. If not set, "label" will be used.
  id?: any;

  // If true, the option will not be selectable by the uesr.
  disabled?: boolean;
}
\`\`\`

<div className="tip-wrapper">
<span className="warning">NOTE</span> This control is meant to be used in application UI's. It is not for document
signing. Use \`<verdocs-field-dropdown />\` for that.
</div>`}}},args:{options:[{label:"Option 1"},{label:"Disabled Option",disabled:!0},{label:""},{label:"Option 2"}]},argTypes:{}},e={};var n,o,t;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:"{}",...(t=(o=e.parameters)==null?void 0:o.docs)==null?void 0:t.source}}};const p=["Dropdown"];export{e as Dropdown,p as __namedExportsOrder,d as default};
