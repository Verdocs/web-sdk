import{x as t}from"./lit-html-DH549LZe.js";const i={title:"Templates/Field Properties",component:"verdocs-template-field-properties",args:{templateId:"",fieldName:""},argTypes:{onClose:{action:"close"}}},e=({onClose:l,templateId:o,fieldName:d})=>o?t`
        <div style="width: 360px; background: #ffffff; padding: 20px; box-sizing: border-box">
          <verdocs-template-field-properties .templateId=${o} .fieldName=${d} @close=${l} />
        </div>
      `:t`<img src="https://verdocs-public-assets.s3.amazonaws.com/storybook-placeholders/template-name.png" alt="Placeholder" />`;var s,r,a;e.parameters={...e.parameters,docs:{...(s=e.parameters)==null?void 0:s.docs,source:{originalSource:`({
  onClose,
  templateId,
  fieldName
}) => templateId ? html\`
        <div style="width: 360px; background: #ffffff; padding: 20px; box-sizing: border-box">
          <verdocs-template-field-properties .templateId=\${templateId} .fieldName=\${fieldName} @close=\${onClose} />
        </div>
      \` : html\`<img src="https://verdocs-public-assets.s3.amazonaws.com/storybook-placeholders/template-name.png" alt="Placeholder" />\``,...(a=(r=e.parameters)==null?void 0:r.docs)==null?void 0:a.source}}};const m=["FieldProperties"];export{e as FieldProperties,m as __namedExportsOrder,i as default};
