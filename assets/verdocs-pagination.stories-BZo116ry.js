import{x as g}from"./lit-html-DH549LZe.js";const P={title:"Controls/Pagination",component:"verdocs-pagination",args:{selectedPage:0,itemCount:67,perPage:10,argTypes:{onSelectPage:{action:"selectPage"}}}},e=({selectedPage:o,itemCount:r,perPage:s,onSelectPage:c})=>g`<verdocs-pagination
  .selectedPage=${o}
  .itemCount=${r}
  .perPage=${s}
  @selectPage=${c}
/>`;var t,a,n;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`({
  selectedPage,
  itemCount,
  perPage,
  onSelectPage
}) => html\`<verdocs-pagination
  .selectedPage=\${selectedPage}
  .itemCount=\${itemCount}
  .perPage=\${perPage}
  @selectPage=\${onSelectPage}
/>\``,...(n=(a=e.parameters)==null?void 0:a.docs)==null?void 0:n.source}}};const p=["Pagination"];export{e as Pagination,p as __namedExportsOrder,P as default};
