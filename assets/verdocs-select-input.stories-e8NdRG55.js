import{x as u}from"./lit-html-DH549LZe.js";const v={title:"Controls/Select Input",component:"verdocs-select-input",args:{label:"Name",value:"",options:[{label:"Option 1",value:"1"},{label:"Option 2",value:"2"},{label:"Option 3",value:"3"}]},argTypes:{input:{action:"input",description:"Fired when a new value is selected. e.target.value will contain the selected value."}}},e=({type:n,label:o,value:p,placeholder:s,options:i,disabled:r,input:c})=>u`<verdocs-select-input .type=${n} .label=${o} .placeholder=${s} .value=${p} .options=${i} .disabled=${r} @input=${c} />`;var t,l,a;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:"({\n  type,\n  label,\n  value,\n  placeholder,\n  options,\n  disabled,\n  input\n}) => html`<verdocs-select-input .type=${type} .label=${label} .placeholder=${placeholder} .value=${value} .options=${options} .disabled=${disabled} @input=${input} />`",...(a=(l=e.parameters)==null?void 0:l.docs)==null?void 0:a.source}}};const $=["SelectInput"];export{e as SelectInput,$ as __namedExportsOrder,v as default};
