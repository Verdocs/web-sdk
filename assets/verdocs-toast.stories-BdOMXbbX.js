import{x as m}from"./lit-html-DH549LZe.js";const c={error:`<div class="toast-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 24px; height: 24px; display: block;">
  <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
</svg></div>`,success:`<div class="toast-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 24px; height: 24px; display: block;">
  <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
</svg></div>`,info:`<div class="toast-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 24px; height: 24px; display: block;">
  <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
</svg></div>`,default:'<div class="toast-icon"></div>'},d={error:"#ed3d3d",success:"#3dc763",info:"#2379c7",default:"#6a56c1"},r=()=>Array.from(document.getElementsByClassName("verdocs-toast")).forEach(o=>o.remove()),f=o=>{o.stopPropagation(),r()},g=(o,t={})=>{r();const{duration:a=5e3,style:l="default"}=t||{},v=d[l]||d.default,x=`
    ${c[l]||c.default}
    <div class="verdocs-toast-text" style="padding: 12px 12px 12px 0;">${o}</div>
    <div class="verdocs-toast-close" style="padding: 12px 10px; background: rgba(0, 0, 0, 0.2); cursor: pointer;">✕</div>
  `,s=document.createElement("div");s.className="verdocs-toast",s.innerHTML=x,s.style.cssText=`
display: flex; flex-direction: row; gap: 10px; align-items: center;
position: fixed; top: 20px; right: 20px; z-index: 2147483647; max-width: calc(50% - 20px);
color: #ffffff; background: ${v}; font-family: 'Barlow', sans-serif;
border-radius: 2px; padding-left: 10px;
box-shadow: 0 3px 7px 2px rgba(0, 0, 0, 0.12), 0 10px 36px -4px rgba(77, 96, 232, 0.3);`,document.body.append(s),Array.from(document.getElementsByClassName("verdocs-toast-close")).forEach(u=>u.addEventListener("click",f)),setTimeout(r,a)},b={title:"Controls/Toast",component:"verdocs-toast",args:{text:"Test message",duration:3e3,style:"error"},argTypes:{style:{options:["error","info","success","default"],control:{type:"radio"}}}},e=({text:o,duration:t,style:a})=>m`<verdocs-button @click="${()=>g(o,{duration:t,style:a})}" label="Show Toast" />`;var n,i,p;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`({
  text,
  duration,
  style
}) => html\`<verdocs-button @click="\${() => VerdocsToast(text, {
  duration,
  style
})}" label="Show Toast" />\``,...(p=(i=e.parameters)==null?void 0:i.docs)==null?void 0:p.source}}};const T=["Toast"];export{e as Toast,T as __namedExportsOrder,b as default};
