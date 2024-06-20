import{x as o}from"./lit-html-DH549LZe.js";const m={title:"Templates/Reminders",component:"verdocs-template-reminders",args:{templateId:""},argTypes:{onClose:{action:"close"}}},e=({onClose:d,templateId:s})=>s?o`
        <div style="width: 360px; background: #ffffff; padding: 20px; box-sizing: border-box">
          <verdocs-template-reminders .templateId=${s} @close=${d} />
        </div>
      `:o`<img src="https://verdocs-public-assets.s3.amazonaws.com/storybook-placeholders/template-name.png" alt="Placeholder" />`;var t,r,a;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`({
  onClose,
  templateId
}) => templateId ? html\`
        <div style="width: 360px; background: #ffffff; padding: 20px; box-sizing: border-box">
          <verdocs-template-reminders .templateId=\${templateId} @close=\${onClose} />
        </div>
      \` : html\`<img src="https://verdocs-public-assets.s3.amazonaws.com/storybook-placeholders/template-name.png" alt="Placeholder" />\``,...(a=(r=e.parameters)==null?void 0:r.docs)==null?void 0:a.source}}};const n=["Reminders"];export{e as Reminders,n as __namedExportsOrder,m as default};
