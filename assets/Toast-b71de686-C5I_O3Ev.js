const l={error:`<div class="toast-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 24px; height: 24px; display: block;">
  <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
</svg></div>`,success:`<div class="toast-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 24px; height: 24px; display: block;">
  <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
</svg></div>`,info:`<div class="toast-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 24px; height: 24px; display: block;">
  <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
</svg></div>`,default:'<div class="toast-icon"></div>'},c={error:"#ed3d3d",success:"#3dc763",info:"#2379c7",default:"#6a56c1"},e=()=>Array.from(document.getElementsByClassName("verdocs-toast")).forEach(s=>s.remove()),p=s=>{s.stopPropagation(),e()},f=(s,a={})=>{e();const{duration:d=5e3,style:t="default"}=a||{},i=c[t]||c.default,r=`
    ${l[t]||l.default}
    <div class="verdocs-toast-text" style="padding: 12px 12px 12px 0;">${s}</div>
    <div class="verdocs-toast-close" style="padding: 12px 10px; background: rgba(0, 0, 0, 0.2); cursor: pointer;">✕</div>
  `,o=document.createElement("div");o.className="verdocs-toast",o.innerHTML=r,o.style.cssText=`
display: flex; flex-direction: row; gap: 10px; align-items: center;
position: fixed; top: 20px; right: 20px; z-index: 2147483647; max-width: calc(50% - 20px);
color: #ffffff; background: ${i}; font-family: 'Barlow', sans-serif;
border-radius: 2px; padding-left: 10px;
box-shadow: 0 3px 7px 2px rgba(0, 0, 0, 0.12), 0 10px 36px -4px rgba(77, 96, 232, 0.3);`,document.body.append(o),Array.from(document.getElementsByClassName("verdocs-toast-close")).forEach(n=>n.addEventListener("click",p)),setTimeout(e,d)};export{f as V};
