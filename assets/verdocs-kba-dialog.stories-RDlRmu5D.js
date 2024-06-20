import{x as $}from"./lit-html-DH549LZe.js";const b={title:"Dialogs/KBA Dialog",component:"verdocs-kba-dialog",args:{mode:"choice",helptitle:"One Time Code",helptext:"Please check your text messages for a security code, and enter the code below.",label:"PIN",placeholder:"Enter your PIN...",step:1,steps:3,choices:["553 Arbor Dr","18 Lacey Ln","23A Ball Ct","2375 Cavallo Blvd","23-1 RR-7","151 Boulder Rd"]},argTypes:{onNext:{action:"next",table:{disable:!0}},onExit:{action:"exit",table:{disable:!0}}}},e=({helptitle:a,helptext:s,label:n,placeholder:r,mode:c,step:i,steps:p,choices:d,onNext:h,onExit:x})=>$`<verdocs-kba-dialog
    .mode=${c}
    .helptitle=${a}
    .helptext=${s}
    .label=${n}
    .placeholder=${r}
    .step=${i}
    .steps=${p}
    .choices=${d}
    @next=${h}
    @exit=${x}
  />`;var t,o,l;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`({
  helptitle,
  helptext,
  label,
  placeholder,
  mode,
  step,
  steps,
  choices,
  onNext,
  onExit
}) => html\`<verdocs-kba-dialog
    .mode=\${mode}
    .helptitle=\${helptitle}
    .helptext=\${helptext}
    .label=\${label}
    .placeholder=\${placeholder}
    .step=\${step}
    .steps=\${steps}
    .choices=\${choices}
    @next=\${onNext}
    @exit=\${onExit}
  />\``,...(l=(o=e.parameters)==null?void 0:o.docs)==null?void 0:l.source}}};const g=["KBADialog"];export{e as KBADialog,g as __namedExportsOrder,b as default};
