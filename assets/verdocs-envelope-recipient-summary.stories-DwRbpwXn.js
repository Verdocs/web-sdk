import{x as d}from"./lit-html-DH549LZe.js";const l={title:"Envelopes/Recipient Summary",component:"verdocs-envelope-recipient-summary",args:{envelopeId:"af083350-0202-4c00-ac90-5346914fa6ff",canView:!0,canDone:!0,canSendAnother:!0},argTypes:{another:{action:"another"},view:{action:"view"},next:{action:"next"}}},e=({envelopeId:a,another:t,view:c,next:i,canView:p,canDone:s,canSendAnother:m})=>d`<verdocs-envelope-recipient-summary
  .envelopeId="${a}"
  .canView="${p}"
  .canDone="${s}"
  .canSendAnother="${m}"
  @another=${t}
  @view=${c}
  @next=${i}
/>`;var n,o,r;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`({
  envelopeId,
  another,
  view,
  next,
  canView,
  canDone,
  canSendAnother
}) => html\`<verdocs-envelope-recipient-summary
  .envelopeId="\${envelopeId}"
  .canView="\${canView}"
  .canDone="\${canDone}"
  .canSendAnother="\${canSendAnother}"
  @another=\${another}
  @view=\${view}
  @next=\${next}
/>\``,...(r=(o=e.parameters)==null?void 0:o.docs)==null?void 0:r.source}}};const u=["RecipientSummary"];export{e as RecipientSummary,u as __namedExportsOrder,l as default};
