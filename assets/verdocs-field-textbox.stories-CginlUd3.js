import{x as b}from"./lit-html-DH549LZe.js";const p={title:"Fields/Textbox",component:"verdocs-field-textbox",args:{disabled:!1,editable:!0,moveable:!0,done:!1,roleindex:0,field:{name:"textbox-1",role_name:"Recipient 1",template_id:"0239fe5f-1b89-499a-bd83-098a2e1b4b9c",type:"textbox",required:!1,setting:{x:0,y:0},page_sequence:1}},argTypes:{input:{action:"input",description:"Fired for each character entered in the field. e.target.value will contain the current text value."}}},e=({field:i,disabled:o,editable:a,moveable:l,done:r,roleindex:s,input:x})=>b`<verdocs-field-textbox
  style="transform: scale(1.5); width: 150px; height: 15px;"
  .field=${i}
  .disabled=${o}
  .editable=${a}
  .moveable=${l}
  .done=${r}
  .roleindex=${s}
  @input=${x}
/>`;var t,d,n;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`({
  field,
  disabled,
  editable,
  moveable,
  done,
  roleindex,
  input
}) => html\`<verdocs-field-textbox
  style="transform: scale(1.5); width: 150px; height: 15px;"
  .field=\${field}
  .disabled=\${disabled}
  .editable=\${editable}
  .moveable=\${moveable}
  .done=\${done}
  .roleindex=\${roleindex}
  @input=\${input}
/>\``,...(n=(d=e.parameters)==null?void 0:d.docs)==null?void 0:n.source}}};const f=["Textbox"];export{e as Textbox,f as __namedExportsOrder,p as default};
