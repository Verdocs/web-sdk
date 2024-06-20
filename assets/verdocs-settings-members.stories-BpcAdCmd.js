import{x as d}from"./lit-html-DH549LZe.js";const b={title:"Settings/Members",component:"verdocs-settings-members",args:{},argTypes:{onMemberInvited:{action:"memberInvited"},onMemberUpdated:{action:"memberUpdated"},onMemberRemoved:{action:"memberRemoved"}},parameters:{layout:"fullscreen"}},e=({onMemberInvited:o,onMemberUpdated:s,onMemberRemoved:n})=>d`
  <verdocs-settings-members @memberInvited=${o} @memberUpdated=${s} @memberRemoved=${n} />
`;var m,r,t;e.parameters={...e.parameters,docs:{...(m=e.parameters)==null?void 0:m.docs,source:{originalSource:`({
  onMemberInvited,
  onMemberUpdated,
  onMemberRemoved
}) => html\`
  <verdocs-settings-members @memberInvited=\${onMemberInvited} @memberUpdated=\${onMemberUpdated} @memberRemoved=\${onMemberRemoved} />
\``,...(t=(r=e.parameters)==null?void 0:r.docs)==null?void 0:t.source}}};const i=["Members"];export{e as Members,i as __namedExportsOrder,b as default};
