import{j as e}from"./jsx-runtime-qGIIFXMu.js";import{useMDXComponents as r}from"./index-CqcSDpoT.js";import{M as o}from"./index-CfQOWdRw.js";/* empty css               */import"./index-CDs2tPxN.js";import"./iframe-BiNtG6Y6.js";import"../sb-preview/runtime.js";import"./chunk-QN4WKJDJ-Bf_F3oir.js";import"./index-BXagdh-V.js";import"./index-DXimoRZY.js";import"./index-BH_9z_ur.js";import"./index-DrFu-skq.js";function n(s){const t={code:"code",h2:"h2",p:"p",pre:"pre",...r(),...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(o,{title:"Quick Start"}),`
`,e.jsx("div",{className:"sb-container",children:e.jsxs("div",{className:"sb-section-title",children:[e.jsx(t.h2,{id:"quick-start",children:"Quick Start"}),e.jsx(t.p,{children:"A bare-bones React signing experience is below. To scaffold a project to use this code, simply run"}),e.jsx(t.pre,{children:e.jsx(t.code,{className:"language-sh",children:`mkdir projects
cd projects
npm create vite@latest my-app --template react-ts
cd my-app
npm i
npm i -S @verdocs/web-sdk
`})}),e.jsx(t.p,{children:"then adust App.tsx as follows:"}),e.jsx(t.pre,{children:e.jsx(t.code,{className:"language-ts",children:`import {VerdocsTemplatesList} from '@verdocs/web-sdk-react';

export default function App() {
return <VerdocsTemplatesList />;
}
`})})]})})]})}function b(s={}){const{wrapper:t}={...r(),...s.components};return t?e.jsx(t,{...s,children:e.jsx(n,{...s})}):n(s)}export{b as default};
