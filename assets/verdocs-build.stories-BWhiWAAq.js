import{x as d}from"./lit-html-DH549LZe.js";const p={title:"Embeds/Build",component:"verdocs-build",args:{templateId:"",step:"preview"},parameters:{layout:"fullscreen"}},e=({templateId:r,step:t,...a})=>(console.log("rendering",{templateId:r,step:t,params:a}),d`<verdocs-build .step=${t} .templateId=${r} />`);var s,o,n;e.parameters={...e.parameters,docs:{...(s=e.parameters)==null?void 0:s.docs,source:{originalSource:`({
  templateId,
  step,
  ...params
}) => {
  console.log('rendering', {
    templateId,
    step,
    params
  });
  return html\`<verdocs-build .step=\${step} .templateId=\${templateId} />\`;
}`,...(n=(o=e.parameters)==null?void 0:o.docs)==null?void 0:n.source}}};const m=["Build"];export{e as Build,m as __namedExportsOrder,p as default};
