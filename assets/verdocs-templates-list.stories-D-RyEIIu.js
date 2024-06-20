import{x as r}from"./lit-html-DH549LZe.js";const n={title:"Templates/Templates List",component:"verdocs-templates-list",args:{items:10,sharing:"all",starred:"all",sortBy:"updated_at"},argTypes:{onClose:{action:"close"},onEditTemplate:{action:"editTemplate"},onViewTemplate:{action:"viewTemplate"}},parameters:{layout:"fullscreen"}},e=({onClose:l,onEditTemplate:o,onViewTemplate:m,templateId:p})=>r`
  <verdocs-templates-list .templateId=${p} @close=${l} @viewTemplate=${m} @editTemplate=${o} />
`;var t,a,s;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`({
  onClose,
  onEditTemplate,
  onViewTemplate,
  templateId
}) => html\`
  <verdocs-templates-list .templateId=\${templateId} @close=\${onClose} @viewTemplate=\${onViewTemplate} @editTemplate=\${onEditTemplate} />
\``,...(s=(a=e.parameters)==null?void 0:a.docs)==null?void 0:s.source}}};const d=["TemplatesList"];export{e as TemplatesList,d as __namedExportsOrder,n as default};
