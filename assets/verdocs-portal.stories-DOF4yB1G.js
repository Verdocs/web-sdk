import{x as s}from"./lit-html-DH549LZe.js";const l={title:"Controls/Portal",component:"verdocs-portal",args:{align:"left",voffset:0},argTypes:{}},o=({align:d,voffset:p})=>s`
  <div style="padding: 40px">
    <div id="sample-tooltip" style="border: 1px solid green; padding: 3px 10px;">
      Tooltip Anchor
      <verdocs-portal anchor="sample-tooltip" .align=${d} .voffset=${p}>
        <div style="border: 1px solid red; padding: 3px 10px;">Tooltip</div>
      </verdocs-portal>
    </div>
  </div>
`;var r,e,t;o.parameters={...o.parameters,docs:{...(r=o.parameters)==null?void 0:r.docs,source:{originalSource:`({
  align,
  voffset
}) => html\`
  <div style="padding: 40px">
    <div id="sample-tooltip" style="border: 1px solid green; padding: 3px 10px;">
      Tooltip Anchor
      <verdocs-portal anchor="sample-tooltip" .align=\${align} .voffset=\${voffset}>
        <div style="border: 1px solid red; padding: 3px 10px;">Tooltip</div>
      </verdocs-portal>
    </div>
  </div>
\``,...(t=(e=o.parameters)==null?void 0:e.docs)==null?void 0:t.source}}};const a=["Portal"];export{o as Portal,a as __namedExportsOrder,l as default};
