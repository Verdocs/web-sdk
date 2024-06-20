import{x as l}from"./lit-html-DH549LZe.js";const r={title:"Dialogs/Default",component:"verdocs-dialog",args:{},argTypes:{onExit:{action:"exit",table:{disable:!0}},onNext:{action:"next",table:{disable:!0}}}},o=({onExit:a,onNext:i})=>l`<verdocs-dialog @exit=${a}>
    <h1 slot="heading">Test Dialog</h1>
    <p>Test dialog box.</p>
    <div class="buttons">
      <verdocs-button label="OK" size="small" onClick=${i} />
    </div>
  </verdocs-dialog>`;var e,t,s;o.parameters={...o.parameters,docs:{...(e=o.parameters)==null?void 0:e.docs,source:{originalSource:`({
  onExit,
  onNext
}) => html\`<verdocs-dialog @exit=\${onExit}>
    <h1 slot="heading">Test Dialog</h1>
    <p>Test dialog box.</p>
    <div class="buttons">
      <verdocs-button label="OK" size="small" onClick=\${onNext} />
    </div>
  </verdocs-dialog>\``,...(s=(t=o.parameters)==null?void 0:t.docs)==null?void 0:s.source}}};const d=["Default"];export{o as Default,d as __namedExportsOrder,r as default};
