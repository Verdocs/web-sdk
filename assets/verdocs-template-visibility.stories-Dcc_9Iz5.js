import{x as s}from"./lit-html-DH549LZe.js";const d={title:"Templates/Visibility",component:"verdocs-template-visibility",args:{templateId:""},argTypes:{onClose:{action:"close"}}},e=({onClose:l,templateId:t})=>t?s`
        <div style="width: 360px; background: #ffffff; padding: 20px; box-sizing: border-box">
          <verdocs-template-visibility .templateId=${t} @close=${l} />
        </div>
      `:s`<img src="https://verdocs-public-assets.s3.amazonaws.com/storybook-placeholders/template-name.png" alt="Placeholder" />`;var o,i,a;e.parameters={...e.parameters,docs:{...(o=e.parameters)==null?void 0:o.docs,source:{originalSource:`({
  onClose,
  templateId
}) => templateId ? html\`
        <div style="width: 360px; background: #ffffff; padding: 20px; box-sizing: border-box">
          <verdocs-template-visibility .templateId=\${templateId} @close=\${onClose} />
        </div>
      \` : html\`<img src="https://verdocs-public-assets.s3.amazonaws.com/storybook-placeholders/template-name.png" alt="Placeholder" />\``,...(a=(i=e.parameters)==null?void 0:i.docs)==null?void 0:a.source}}};const p=["Visibility"];export{e as Visibility,p as __namedExportsOrder,d as default};
