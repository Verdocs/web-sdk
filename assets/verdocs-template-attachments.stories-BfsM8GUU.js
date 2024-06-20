import{x as s}from"./lit-html-DH549LZe.js";const m={title:"Templates/Attachments",component:"verdocs-template-attachments",args:{templateId:""},argTypes:{onClose:{action:"close"}}},t=({onClose:r,templateId:e})=>e?s`
        <div style="width: 400px; background: #ffffff; padding: 20px; box-sizing: border-box">
          <verdocs-template-attachments .templateId=${e} @close=${r} />
        </div>
      `:s`<img src="https://verdocs-public-assets.s3.amazonaws.com/storybook-placeholders/template-attachments.png" alt="Placeholder" />`;var a,o,c;t.parameters={...t.parameters,docs:{...(a=t.parameters)==null?void 0:a.docs,source:{originalSource:`({
  onClose,
  templateId
}) => templateId ? html\`
        <div style="width: 400px; background: #ffffff; padding: 20px; box-sizing: border-box">
          <verdocs-template-attachments .templateId=\${templateId} @close=\${onClose} />
        </div>
      \` : html\`<img src="https://verdocs-public-assets.s3.amazonaws.com/storybook-placeholders/template-attachments.png" alt="Placeholder" />\``,...(c=(o=t.parameters)==null?void 0:o.docs)==null?void 0:c.source}}};const n=["Attachments"];export{t as Attachments,n as __namedExportsOrder,m as default};
