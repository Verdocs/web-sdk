import{x as a}from"./lit-html-DH549LZe.js";const d={title:"Templates/Name",component:"verdocs-template-name",args:{templateId:""},argTypes:{onClose:{action:"close"}}},e=({onClose:l,templateId:o})=>o?a`
        <div style="width: 360px; background: #ffffff; padding: 20px; box-sizing: border-box">
          <verdocs-template-name .templateId=${o} @close=${l} />
        </div>
      `:a`<img src="https://verdocs-public-assets.s3.amazonaws.com/storybook-placeholders/template-name.png" alt="Placeholder" />`;var t,s,r;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`({
  onClose,
  templateId
}) => templateId ? html\`
        <div style="width: 360px; background: #ffffff; padding: 20px; box-sizing: border-box">
          <verdocs-template-name .templateId=\${templateId} @close=\${onClose} />
        </div>
      \` : html\`<img src="https://verdocs-public-assets.s3.amazonaws.com/storybook-placeholders/template-name.png" alt="Placeholder" />\``,...(r=(s=e.parameters)==null?void 0:s.docs)==null?void 0:r.source}}};const p=["Name"];export{e as Name,p as __namedExportsOrder,d as default};
