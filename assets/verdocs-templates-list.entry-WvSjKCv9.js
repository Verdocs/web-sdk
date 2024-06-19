import{m as i,H as w,r as x,n as h}from"./components-BUY51Sj4.js";import{J as b,K as y,i as k,L as m,V as z}from"./index-FOFzXDN2.js";import{S as v}from"./errors-887f1e88-DR85jTO9.js";import{d as M}from"./index-0329eed3-CmPFFxNR.js";import"./index-CDs2tPxN.js";import"./index-BXagdh-V.js";import"./iframe-BIHgOnMp.js";import"../sb-preview/runtime.js";var f=function(d,e,s,t){function a(n){return n instanceof s?n:new s(function(l){l(n)})}return new(s||(s=Promise))(function(n,l){function o(p){try{r(t.next(p))}catch(u){l(u)}}function c(p){try{r(t.throw(p))}catch(u){l(u)}}function r(p){p.done?n(p.value):a(p.value).then(o,c)}r((t=t.apply(d,e||[])).next())})},g=function(d,e){var s={label:0,sent:function(){if(n[0]&1)throw n[1];return n[1]},trys:[],ops:[]},t,a,n,l;return l={next:o(0),throw:o(1),return:o(2)},typeof Symbol=="function"&&(l[Symbol.iterator]=function(){return this}),l;function o(r){return function(p){return c([r,p])}}function c(r){if(t)throw new TypeError("Generator is already executing.");for(;l&&(l=0,r[0]&&(s=0)),s;)try{if(t=1,a&&(n=r[0]&2?a.return:r[0]?a.throw||((n=a.return)&&n.call(a),0):a.next)&&!(n=n.call(a,r[1])).done)return n;switch(a=0,n&&(r=[r[0]&2,n.value]),r[0]){case 0:case 1:n=r;break;case 4:return s.label++,{value:r[1],done:!1};case 5:s.label++,a=r[1],r=[0];continue;case 7:r=s.ops.pop(),s.trys.pop();continue;default:if(n=s.trys,!(n=n.length>0&&n[n.length-1])&&(r[0]===6||r[0]===2)){s=0;continue}if(r[0]===3&&(!n||r[1]>n[0]&&r[1]<n[3])){s.label=r[1];break}if(r[0]===6&&s.label<n[1]){s.label=n[1],n=r;break}if(n&&s.label<n[2]){s.label=n[2],s.ops.push(r);break}n[2]&&s.ops.pop(),s.trys.pop();continue}r=e.call(d,s)}catch(p){r=[6,p],a=0}finally{t=n=0}if(r[0]&5)throw r[1];return{value:r[0]?r[1]:void 0,done:!0}}},S=`@-webkit-keyframes verdocs-field-pulse {
  0% {
    background-color: rgba(0, 0, 0, 0.35);
  }
  50% {
    background-color: rgba(0, 0, 0, 0);
  }
  100% {
    background-color: rgba(0, 0, 0, 0.35);
  }
}
@keyframes verdocs-field-pulse {
  0% {
    background-color: rgba(0, 0, 0, 0.35);
  }
  50% {
    background-color: rgba(0, 0, 0, 0);
  }
  100% {
    background-color: rgba(0, 0, 0, 0.35);
  }
}
verdocs-templates-list {
  display: -ms-flexbox;
  display: flex;
  padding: 10px;
  font-size: 18px;
  -ms-flex-wrap: nowrap;
  flex-wrap: nowrap;
  border-radius: 6px;
  color: #33364b;
  -ms-flex-direction: column;
  flex-direction: column;
  font-family: "Inter", "Barlow", sans-serif;
}
verdocs-templates-list .header {
  width: 100%;
  row-gap: 4px;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-column-gap: 12px;
  -moz-column-gap: 12px;
  column-gap: 12px;
  margin: 0 0 10px 0;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-direction: row;
  flex-direction: row;
}
verdocs-templates-list .header .filter {
  width: 150px;
}
verdocs-templates-list .header verdocs-text-input {
  margin: 0;
}
verdocs-templates-list .header verdocs-text-input input {
  height: 32px;
}
verdocs-templates-list .filter {
  -ms-flex-align: center;
  align-items: center;
}
verdocs-templates-list .template-placeholder {
  height: 48px;
  -ms-flex: 0 0 48px;
  flex: 0 0 48px;
  margin: 5px 0;
  border-radius: 5px;
  background: #f5f5fa;
}
verdocs-templates-list .template {
  width: 100%;
  margin: 2px 0;
  border: 1px solid #ffffff;
  background: #ffffff;
}
verdocs-templates-list .template:hover {
  cursor: pointer;
  background: #ededff;
  border: 1px solid #a7a7f5;
}
verdocs-templates-list .template .inner {
  gap: 12px;
  display: -ms-flexbox;
  display: flex;
  padding: 8px 14px;
  border-radius: 5px;
  -ms-flex-direction: row;
  flex-direction: row;
  -ms-flex-align: center;
  align-items: center;
  container-type: inline-size;
}
verdocs-templates-list .template .inner svg {
  width: 24px;
  height: 24px;
}
verdocs-templates-list .name {
  -ms-flex: 1;
  flex: 1;
  display: -ms-flexbox;
  display: flex;
  color: black;
  font-size: 16px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
@media screen and (max-width: 1300px) {
  verdocs-templates-list .name {
    font-size: 16px;
  }
}
verdocs-templates-list .spacer {
  margin: 0;
  height: 30px;
  -ms-flex: 0 0 1px;
  flex: 0 0 1px;
  display: -ms-flexbox;
  display: flex;
  border-right: 1px solid #dad8dd;
}
@media screen and (max-width: 800px) {
  verdocs-templates-list .spacer {
    display: none;
  }
}
verdocs-templates-list .empty-text {
  font-size: 20px;
  text-align: center;
  margin: 16px 0 0 0;
  padding: 80px 80px;
  border: 2px solid #ccc;
}
verdocs-templates-list .usage,
verdocs-templates-list .ownership,
verdocs-templates-list .last-used {
  gap: 10px;
  color: #444;
  display: -ms-flexbox;
  display: flex;
  font-size: 16px;
  margin: 0 0 0 10px;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-direction: row;
  flex-direction: row;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
verdocs-templates-list .usage span,
verdocs-templates-list .usage svg,
verdocs-templates-list .ownership span,
verdocs-templates-list .ownership svg,
verdocs-templates-list .last-used span,
verdocs-templates-list .last-used svg {
  width: 24px;
  height: 24px;
}
verdocs-templates-list .usage span,
verdocs-templates-list .ownership span,
verdocs-templates-list .last-used span {
  display: block;
}
@media screen and (max-width: 700px) {
  verdocs-templates-list verdocs-template-star {
    display: none;
  }
}
verdocs-templates-list .ownership {
  -ms-flex: 0 0 100px;
  flex: 0 0 100px;
}
@media screen and (max-width: 700px) {
  verdocs-templates-list .ownership {
    display: none;
  }
}
verdocs-templates-list .last-used {
  -ms-flex: 0 0 130px;
  flex: 0 0 130px;
}
verdocs-templates-list .usage {
  -ms-flex: 0 0 60px;
  flex: 0 0 60px;
}
verdocs-templates-list .header-row {
  display: none;
}
verdocs-templates-list table {
  container-type: size;
  max-width: 100%;
  overflow: hidden;
  table-layout: fixed;
}
verdocs-templates-list .data-row {
  cursor: pointer;
  background: #ededff;
  border: 1px solid #a7a7f5;
}
verdocs-templates-list .data-col svg {
  width: 24px;
  height: 24px;
}
verdocs-templates-list .col-name {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
@container (max-width:700 px) {
  verdocs-templates-list verdocs-templates-list .col-starred {
    display: none;
  }
}`,L=S,H='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>',T='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>',P='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>',_='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>',A='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88"><g><path d="M81.61,4.73c0-2.61,2.58-4.73,5.77-4.73c3.19,0,5.77,2.12,5.77,4.73v20.72c0,2.61-2.58,4.73-5.77,4.73 c-3.19,0-5.77-2.12-5.77-4.73V4.73L81.61,4.73z M66.11,103.81c-0.34,0-0.61-1.43-0.61-3.2c0-1.77,0.27-3.2,0.61-3.2H81.9 c0.34,0,0.61,1.43,0.61,3.2c0,1.77-0.27,3.2-0.61,3.2H66.11L66.11,103.81z M15.85,67.09c-0.34,0-0.61-1.43-0.61-3.2 c0-1.77,0.27-3.2,0.61-3.2h15.79c0.34,0,0.61,1.43,0.61,3.2c0,1.77-0.27,3.2-0.61,3.2H15.85L15.85,67.09z M40.98,67.09 c-0.34,0-0.61-1.43-0.61-3.2c0-1.77,0.27-3.2,0.61-3.2h15.79c0.34,0,0.61,1.43,0.61,3.2c0,1.77-0.27,3.2-0.61,3.2H40.98 L40.98,67.09z M66.11,67.09c-0.34,0-0.61-1.43-0.61-3.2c0-1.77,0.27-3.2,0.61-3.2H81.9c0.34,0,0.61,1.43,0.61,3.2 c0,1.77-0.27,3.2-0.61,3.2H66.11L66.11,67.09z M91.25,67.09c-0.34,0-0.61-1.43-0.61-3.2c0-1.77,0.27-3.2,0.61-3.2h15.79 c0.34,0,0.61,1.43,0.61,3.2c0,1.77-0.27,3.2-0.61,3.2H91.25L91.25,67.09z M15.85,85.45c-0.34,0-0.61-1.43-0.61-3.2 c0-1.77,0.27-3.2,0.61-3.2h15.79c0.34,0,0.61,1.43,0.61,3.2c0,1.77-0.27,3.2-0.61,3.2H15.85L15.85,85.45z M40.98,85.45 c-0.34,0-0.61-1.43-0.61-3.2c0-1.77,0.27-3.2,0.61-3.2h15.79c0.34,0,0.61,1.43,0.61,3.2c0,1.77-0.27,3.2-0.61,3.2H40.98 L40.98,85.45z M66.11,85.45c-0.34,0-0.61-1.43-0.61-3.2c0-1.77,0.27-3.2,0.61-3.2H81.9c0.34,0,0.61,1.43,0.61,3.2 c0,1.77-0.27,3.2-0.61,3.2H66.11L66.11,85.45z M91.25,85.45c-0.34,0-0.61-1.43-0.61-3.2c0-1.77,0.27-3.2,0.61-3.2h15.79 c0.34,0,0.61,1.43,0.61,3.2c0,1.77-0.27,3.2-0.61,3.2H91.25L91.25,85.45z M15.85,103.81c-0.34,0-0.61-1.43-0.61-3.2 c0-1.77,0.27-3.2,0.61-3.2h15.79c0.34,0,0.61,1.43,0.61,3.2c0,1.77-0.27,3.2-0.61,3.2H15.85L15.85,103.81z M40.98,103.81 c-0.34,0-0.61-1.43-0.61-3.2c0-1.77,0.27-3.2,0.61-3.2h15.79c0.34,0,0.61,1.43,0.61,3.2c0,1.77-0.27,3.2-0.61,3.2H40.98 L40.98,103.81z M29.61,4.73c0-2.61,2.58-4.73,5.77-4.73s5.77,2.12,5.77,4.73v20.72c0,2.61-2.58,4.73-5.77,4.73 s-5.77-2.12-5.77-4.73V4.73L29.61,4.73z M6.4,45.32h110.07V21.47c0-0.8-0.33-1.53-0.86-2.07c-0.53-0.53-1.26-0.86-2.07-0.86H103 c-1.77,0-3.2-1.43-3.2-3.2c0-1.77,1.43-3.2,3.2-3.2h10.55c2.57,0,4.9,1.05,6.59,2.74c1.69,1.69,2.74,4.02,2.74,6.59v27.06v65.03 c0,2.57-1.05,4.9-2.74,6.59c-1.69,1.69-4.02,2.74-6.59,2.74H9.33c-2.57,0-4.9-1.05-6.59-2.74C1.05,118.45,0,116.12,0,113.55V48.52 V21.47c0-2.57,1.05-4.9,2.74-6.59c1.69-1.69,4.02-2.74,6.59-2.74H20.6c1.77,0,3.2,1.43,3.2,3.2c0,1.77-1.43,3.2-3.2,3.2H9.33 c-0.8,0-1.53,0.33-2.07,0.86c-0.53,0.53-0.86,1.26-0.86,2.07V45.32L6.4,45.32z M116.48,51.73H6.4v61.82c0,0.8,0.33,1.53,0.86,2.07 c0.53,0.53,1.26,0.86,2.07,0.86h104.22c0.8,0,1.53-0.33,2.07-0.86c0.53-0.53,0.86-1.26,0.86-2.07V51.73L116.48,51.73z M50.43,18.54 c-1.77,0-3.2-1.43-3.2-3.2c0-1.77,1.43-3.2,3.2-3.2h21.49c1.77,0,3.2,1.43,3.2,3.2c0,1.77-1.43,3.2-3.2,3.2H50.43L50.43,18.54z"/></g></svg>',V='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 410.2"><path d="M35.28 35.51h32.54v43.42c0 10.58 4.27 20.06 11.35 27.23 17.03 17.14 45.5 17.45 63.06.93 7.71-7.29 12.4-17.14 12.4-28.16V35.51h65.71v43.42c0 6.34 1.56 12.3 4.35 17.6 2.03 3.85 4.71 7.37 7.92 10.43l2.41 2.24c1.79 1.46 3.71 2.79 5.76 3.97l.31.18.07.04.25.13.16.1.15.08.27.14.05.03.32.17.05.03.27.13.15.08.17.09.26.12.07.04.32.16.03.01.31.15.12.06.2.09.24.11.1.05.33.14.34.16.1.04.23.1.21.09.13.05.31.13h.03l.34.14.08.04.27.1.18.07.16.06.3.11.05.02.34.12.06.02.3.11.16.05.19.07.26.09.09.03.35.12.02.01.34.1.13.04.22.07.25.07.11.03.36.11.36.1.11.03.25.07.22.06.14.04.34.09h.02l.37.1.08.02.29.06.19.05.17.03.32.08.05.01.37.08.06.01.31.06.17.04.21.03.28.06.09.02.37.07h.03l.35.06.14.03.23.03.27.04.11.02.38.06.38.05.12.01.26.04.23.03.15.01.35.05h.03l.39.04.08.01.3.02.21.02.17.02.34.02.05.01.39.03h.05l.34.02.18.01.21.01.3.02h.08l.39.01.03.01.36.01h.39l.28.01h.96l.33-.01h.39l.18-.01.2-.01.25-.01h.13l.32-.02h.07l.38-.02h.01l.37-.02.07-.01.32-.02.12-.01.26-.02.19-.02.19-.02.25-.02.13-.01.31-.04h.07l.37-.05h.01l.37-.04.06-.01.32-.04.12-.02.26-.03.18-.03.19-.03.24-.04.14-.02.3-.05.07-.01.36-.06h.01l.37-.07.05-.01.32-.06.12-.02.25-.05.18-.04.19-.04.23-.05.14-.03.29-.07.08-.01.35-.08.01-.01.36-.08.05-.02.31-.08.11-.02.25-.07.17-.04.2-.06.22-.05.14-.05.28-.08.07-.02.34-.09.02-.01.36-.11.03-.01.32-.1.1-.03.25-.08.16-.05.19-.07.22-.07.13-.04.28-.1.08-.03.32-.11.02-.01.35-.13.04-.01.3-.11.09-.04.26-.1.15-.06.19-.07.21-.09.13-.05.26-.11.08-.03.32-.13.02-.01.33-.14.04-.02.3-.13.09-.04.24-.11.14-.07.19-.08.19-.1.14-.06.25-.12.08-.03.3-.16h.03l.32-.17.03-.01.29-.16.09-.04.24-.12.13-.07.19-.1.18-.1.14-.07.23-.13.08-.05.29-.16.03-.01.31-.18c1.11-.64 2.17-1.31 3.2-2.03l2.71-1.95c4.36-3.56 7.92-7.88 10.43-12.76 2.73-5.26 4.25-11.19 4.25-17.5V35.51h33.97c9.68 0 18.5 3.98 24.91 10.38 6.4 6.37 10.38 15.2 10.38 24.9V192.9H365.1v-53.83H11.3v233.49c0 15.25 12.49 27.74 27.75 27.74h298.3c15.27 0 27.75-12.51 27.75-27.74V325.6h11.31v49.32c0 9.7-3.98 18.53-10.37 24.91-6.42 6.39-15.24 10.37-24.92 10.37H35.28c-9.68 0-18.49-3.97-24.89-10.37C3.97 393.41 0 384.59 0 374.92V70.79C0 61.12 3.97 52.3 10.36 45.9c6.43-6.42 15.25-10.39 24.92-10.39zm211.43-21.54c0-7.71 7.61-13.97 17.03-13.97 9.42 0 17.04 6.26 17.04 13.97v64.96c0 7.7-7.62 13.96-17.04 13.96-9.42 0-17.03-6.26-17.03-13.96V13.97zm-152.52 0C94.19 6.26 101.81 0 111.23 0c9.42 0 17.03 6.26 17.03 13.97v64.96c0 7.7-7.61 13.96-17.03 13.96-9.42 0-17.04-6.26-17.04-13.96V13.97zm311.37 327.72c1.48-14.79 2.69-32.45 3.59-46.5h-75.88v-71.88h77.43c-.39-14.06-1.17-31.75-2.35-46.58-.96-5.93 6.02-9.73 10.51-5.9l90.89 82.99c2.7 2.31 3.02 6.38.7 9.08l-.74.73-93.65 84.05c-4.6 3.89-11.47-.19-10.5-5.99zM63.51 286h50.56c3.53 0 6.43 2.91 6.43 6.44v42.06c0 3.52-2.91 6.44-6.43 6.44H63.51c-3.53 0-6.44-2.91-6.44-6.44v-42.06c0-3.54 2.9-6.44 6.44-6.44zm198.44-98.62h50.55c3.23 0 5.92 2.43 6.37 5.52h-16v49.42h-40.92c-3.53 0-6.45-2.9-6.45-6.45v-42.05c0-3.54 2.9-6.44 6.45-6.44zm0 98.62h40.92v39.6h16.07v8.9c0 3.52-2.92 6.44-6.44 6.44h-50.55c-3.53 0-6.45-2.91-6.45-6.44v-42.06c0-3.54 2.9-6.44 6.45-6.44zm-98.5-98.62h50.56c3.53 0 6.43 2.92 6.43 6.44v42.05c0 3.53-2.91 6.45-6.43 6.45h-50.56c-3.53 0-6.44-2.9-6.44-6.45v-42.05c0-3.54 2.9-6.44 6.44-6.44zm-99.94 0h50.56c3.53 0 6.43 2.92 6.43 6.44v42.05c0 3.53-2.91 6.45-6.43 6.45H63.51c-3.53 0-6.44-2.9-6.44-6.45v-42.05c0-3.54 2.9-6.44 6.44-6.44zM163.45 286h50.56c3.53 0 6.43 2.91 6.43 6.44v42.06c0 3.52-2.91 6.44-6.43 6.44h-50.56c-3.53 0-6.44-2.91-6.44-6.44v-42.06c0-3.54 2.9-6.44 6.44-6.44z"/></svg>',C='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 506.49"><path fill-rule="nonzero" d="m371.06 415.61-43.25 11.52 6.23-46.41 37.02 34.89zm6.76-177.5c36.98 0 70.56 15.04 94.83 39.35C496.96 301.7 512 335.25 512 372.31c0 37.02-15.02 70.61-39.3 94.88l-.68.64c-24.23 23.88-57.5 38.66-94.2 38.66-37.06 0-70.61-15.04-94.88-39.31l-.64-.69c-23.9-24.24-38.68-57.53-38.68-94.18 0-37.06 15.04-70.61 39.32-94.89 24.27-24.27 57.85-39.31 94.88-39.31zm78.74 55.41c-20.09-20.11-47.96-32.58-78.74-32.58-30.75 0-58.61 12.47-78.75 32.62-20.15 20.14-32.62 48-32.62 78.75 0 30.5 12.25 58.14 32.02 78.19l.6.55c20.14 20.14 48 32.61 78.75 32.61 30.48 0 58.12-12.25 78.21-32.02l.54-.58c20.15-20.15 32.61-48 32.61-78.75s-12.48-58.61-32.62-78.79zM294.24 17.11C294.24 7.69 303.52 0 315.1 0c11.57 0 20.87 7.64 20.87 17.11v74.85c0 9.42-9.3 17.11-20.87 17.11-11.58 0-20.86-7.65-20.86-17.11V17.11zM56.8 242.28c-1.17 0-2.23-5.2-2.23-11.57 0-6.38.92-11.53 2.23-11.53h56.94c1.18 0 2.24 5.2 2.24 11.53 0 6.39-.92 11.57-2.24 11.57H56.8zm90.77 0c-1.17 0-2.23-5.2-2.23-11.57 0-6.38.92-11.53 2.23-11.53h56.94c1.18 0 2.24 5.2 2.24 11.53 0 6.39-.92 11.57-2.24 11.57h-56.94zm90.77 0c-1.16 0-2.22-5.2-2.22-11.57 0-6.38.92-11.53 2.22-11.53h56.94c1.19 0 2.25 5.15 2.25 11.49-5.7 3.55-11.2 7.44-16.43 11.61h-42.76zm-181.4 66.24c-1.18 0-2.24-5.2-2.24-11.57 0-6.38.93-11.58 2.24-11.58h56.94c1.18 0 2.22 5.2 2.22 11.58 0 6.37-.91 11.57-2.22 11.57H56.94zm90.77 0c-1.18 0-2.24-5.2-2.24-11.57 0-6.38.93-11.58 2.24-11.58h56.94c1.18 0 2.23 5.2 2.23 11.58 0 6.37-.92 11.57-2.23 11.57h-56.94zM57.06 374.8c-1.18 0-2.24-5.2-2.24-11.59 0-6.36.94-11.56 2.24-11.56H114c1.19 0 2.24 5.2 2.24 11.56 0 6.39-.93 11.59-2.24 11.59H57.06zm90.78 0c-1.19 0-2.25-5.2-2.25-11.59 0-6.36.94-11.56 2.25-11.56h56.94c1.18 0 2.24 5.2 2.24 11.56 0 6.39-.94 11.59-2.24 11.59h-56.94zM106.83 17.11C106.83 7.69 116.1 0 127.69 0c11.57 0 20.86 7.64 20.86 17.11v74.85c0 9.42-9.34 17.11-20.86 17.11-11.59 0-20.86-7.65-20.86-17.11V17.11zM22.97 163.64h397.39V77.46c0-2.94-1.19-5.53-3.09-7.43-1.9-1.9-4.59-3.08-7.42-3.08h-38.1c-6.39 0-11.59-5.2-11.59-11.57 0-6.38 5.2-11.58 11.59-11.58h38.1c9.32 0 17.7 3.77 23.82 9.88 6.12 6.14 9.88 14.5 9.88 23.83v136.81c-7.61-2.62-15.41-4.73-23.44-6.29v-21.38h.25H22.97v223.17c0 2.94 1.18 5.52 3.08 7.42 1.91 1.9 4.61 3.08 7.44 3.08h188.85c2.16 8.02 4.86 15.84 8.11 23.36H33.71c-9.3 0-17.7-3.75-23.84-9.89C3.75 427.72 0 419.36 0 410.02V77.55c0-9.29 3.75-17.7 9.87-23.82 6.14-6.13 14.5-9.89 23.84-9.89h40.67c6.38 0 11.57 5.2 11.57 11.57C85.95 61.8 80.76 67 74.38 67H33.71c-2.96 0-5.54 1.18-7.44 3.08-1.9 1.9-3.09 4.59-3.09 7.43v86.16h-.21v-.03zm158.95-96.69c-6.39 0-11.57-5.2-11.57-11.57 0-6.38 5.18-11.58 11.57-11.58h77.55c6.39 0 11.57 5.2 11.57 11.58 0 6.37-5.18 11.57-11.57 11.57h-77.55zm161.66 303.24 45.37-51.33c.72-.84 1.78-1.34 2.85-1.36.69-.01 1.37.13 1.98.45l32.94 29.96c.66.59 1.05 1.46 1.06 2.35.02 1-.39 1.98-1.16 2.66l-46.15 52.16-36.95-34.89h.06z"/></svg>',E=[{value:"all",label:"All"},{value:"personal",label:"Personal"},{value:"shared",label:"Shared"},{value:"public",label:"Public"}],N=[{value:"all",label:"All"},{value:"starred",label:"Starred"},{value:"unstarred",label:"Not Starred"}],D=[{value:"name",label:"Name"},{value:"created_at",label:"Created"},{value:"updated_at",label:"Last Updated"},{value:"last_used_at",label:"Last Used"},{value:"counter",label:"Most Used"},{value:"star_counter",label:"Most Starred"}],U=function(){function d(e){var s=this;x(this,e),this.sdkError=h(this,"sdkError",7),this.viewTemplate=h(this,"viewTemplate",7),this.signNow=h(this,"signNow",7),this.submittedData=h(this,"submittedData",7),this.editTemplate=h(this,"editTemplate",7),this.templateDeleted=h(this,"templateDeleted",7),this.changeSort=h(this,"changeSort",7),this.changeSharing=h(this,"changeSharing",7),this.changeStarred=h(this,"changeStarred",7),this.changeName=h(this,"changeName",7),this.handleOptionSelected=function(t,a){var n,l,o,c;t==="send"?(n=s.viewTemplate)===null||n===void 0||n.emit({endpoint:s.endpoint,template:a}):t==="signnow"?(l=s.signNow)===null||l===void 0||l.emit({endpoint:s.endpoint,template:a}):t==="submitted"?(o=s.submittedData)===null||o===void 0||o.emit({endpoint:s.endpoint,template:a}):t==="edit"?(c=s.editTemplate)===null||c===void 0||c.emit({endpoint:s.endpoint,template:a}):t==="delete"&&(s.confirmDelete=a)},this.endpoint=z.getDefault(),this.sharing="all",this.starred="all",this.sort="updated_at",this.name="",this.allowedActions=["send","submitted","link","edit","delete"],this.showPagination=!0,this.rowsPerPage=10,this.selectedPage=0,this.count=0,this.initiallyLoaded=!1,this.loading=!0,this.confirmDelete=null,this.templates=[],this.localNameFilter=""}return d.prototype.handleSharingUpdated=function(){return this.queryTemplates()},d.prototype.handleStarredUpdated=function(){return this.queryTemplates()},d.prototype.handleSortUpdated=function(){return this.queryTemplates()},d.prototype.handleNameUpdated=function(){return this.queryTemplates()},d.prototype.handlePageUpdated=function(){return this.queryTemplates()},d.prototype.componentWillLoad=function(){if(this.endpoint.loadSession(),!this.endpoint.session){console.log("[TEMPLATES] Must be authenticated");return}},d.prototype.componentDidLoad=function(){return f(this,void 0,void 0,function(){return g(this,function(e){switch(e.label){case 0:return[4,this.queryTemplates()];case 1:return e.sent(),this.initiallyLoaded=!0,[2]}})})},d.prototype.queryTemplates=function(){return f(this,void 0,void 0,function(){var e,s,t,a,n,l;return g(this,function(o){switch(o.label){case 0:console.log("[TEMPLATES] Querying templates"),this.loading=!0,o.label=1;case 1:return o.trys.push([1,3,,4]),a={page:this.selectedPage,rows:this.rowsPerPage},this.name.trim()!==""&&(a.q=this.name.trim()),[4,b(this.endpoint,a)];case 2:return n=o.sent(),this.templates=n.templates,this.count=n.total,this.loading=!1,[3,4];case 3:return l=o.sent(),this.loading=!1,console.log("[TEMPLATES] Error listing templates",l),(e=this.sdkError)===null||e===void 0||e.emit(new v(l.message,(s=l.response)===null||s===void 0?void 0:s.status,(t=l.response)===null||t===void 0?void 0:t.data)),[3,4];case 4:return[2]}})})},d.prototype.deleteTemplate=function(e){var s=this;this.confirmDelete=null,y(this.endpoint,e.id).then(function(){var t;return console.log("[TEMPLATES] Deleted template",e),(t=s.templateDeleted)===null||t===void 0||t.emit({endpoint:s.endpoint,template:e}),s.queryTemplates()}).catch(function(t){var a,n,l;console.log("[TEMPLATES] Error deleting template",e),(a=s.sdkError)===null||a===void 0||a.emit(new v(t.message,(n=t.response)===null||n===void 0?void 0:n.status,(l=t.response)===null||l===void 0?void 0:l.data))})},d.prototype.render=function(){var e=this,s=this.localNameFilter?this.templates.filter(function(t){return t.name.toLowerCase().includes(e.localNameFilter.toLowerCase())}):this.templates;return i(w,{key:"bebf191a117bcaa2fdf9c04f0ad11b1bb51bfe0a"},i("div",{key:"4f965488f88b32ba4372135a8c69e1c54334681d",class:"header"},i("div",{key:"81d9da459a3694104a59c99c4fc12f1b5de65f12",class:"filter"},i("verdocs-text-input",{key:"1f48c9fcea48ca89bd3129b5c99b284274d0368c",id:"verdocs-filter-name",value:this.name,clearable:!0,autocomplete:"off",placeholder:"Filter by Name...",onInput:function(t){return e.localNameFilter=t.target.value.trim()},onFocusout:function(t){var a;e.name=t.target.value.trim(),e.localNameFilter=t.target.value.trim(),(a=e.changeName)===null||a===void 0||a.emit(e.name)}})),i("verdocs-quick-filter",{key:"000233a7fc8793d9ace12fc11dbda636fd71028e",label:"Sharing",value:this.sharing,options:E,onOptionSelected:function(t){var a;e.sharing=t.detail.value,(a=e.changeSharing)===null||a===void 0||a.emit(e.sharing)}}),i("verdocs-quick-filter",{key:"e0d6f6ff8d7d6add7352859c9ab3ed38082645c9",label:"Starred",value:this.starred,options:N,onOptionSelected:function(t){var a;e.starred=t.detail.value,(a=e.changeStarred)===null||a===void 0||a.emit(e.starred)}}),i("verdocs-quick-filter",{key:"bc4125163612f3e9e06867052f5e3f644a616dee",label:"Sort By",value:this.sort,options:D,onOptionSelected:function(t){var a;e.sort=t.detail.value,(a=e.changeSort)===null||a===void 0||a.emit(e.sort)}}),this.loading&&i("verdocs-spinner",{key:"4d13c53ac70efcfa24e2e3e1c360cc44717771f1",mode:"dark",size:24}),i("div",{key:"f921d5d44e2bda13b52e0d7095225f357f8fa9d5",style:{display:"flex",flex:"1"}})),s.map(function(t){var a=e.sort==="created_at"?"created_at":e.sort==="updated_at"?"updated_at":"last_used_at",n=t[a],l=[],o=[];return e.allowedActions.includes("send")&&l.push({label:"Preview / Send",id:"send",disabled:!m(e.endpoint.session,"read",t)}),e.allowedActions.includes("signnow")&&l.push({label:"Sign Now",id:"signnow",disabled:!0}),e.allowedActions.includes("submitted")&&(l.push({label:""}),l.push({label:"Submissions",id:"submitted",disabled:!m(e.endpoint.session,"read",t)})),(e.allowedActions.includes("link")||e.allowedActions.includes("edit")||e.allowedActions.includes("delete"))&&(l.push({label:""}),(e.allowedActions.includes("link")||e.allowedActions.includes("edit")||e.allowedActions.includes("delete"))&&l.push({label:"Edit",id:"edit",disabled:!o.includes("write")}),(e.allowedActions.includes("link")||e.allowedActions.includes("edit")||e.allowedActions.includes("delete"))&&l.push({label:"Delete",id:"delete",disabled:!o.includes("delete")})),i("div",{class:"template",onClick:function(){var c;(c=e.viewTemplate)===null||c===void 0||c.emit({endpoint:e.endpoint,template:t})}},i("div",{class:"inner"},i("verdocs-template-star",{template:t,endpoint:e.endpoint}),i("div",{class:"spacer icon-spacer"}),i("div",{class:"name"},t.name),i("div",{class:"spacer usage-spacer"}),i("div",{class:"usage"},i("span",{innerHTML:_,title:"Usage Counter"}),t.counter||"--"),i("div",{class:"spacer last-used-spacer"}),i("div",{class:"last-used"},a==="created_at"&&i("span",{innerHTML:A,title:"Created"}),a==="updated_at"&&i("span",{innerHTML:C,title:"Last Updated"}),a==="last_used_at"&&i("span",{innerHTML:V,title:"Last Used"}),n?M.format(new Date(n),"P"):"Never"),i("div",{class:"spacer ownership-spacer"}),t.is_public&&i("div",{class:"ownership"},i("span",{innerHTML:H})," Public"),!t.is_public&&!t.is_personal&&i("div",{class:"ownership"},i("span",{innerHTML:T})," Private"),!t.is_public&&t.is_personal&&i("div",{class:"ownership"},i("span",{innerHTML:P})," Shared"),i("verdocs-dropdown",{options:l,onOptionSelected:function(c){return e.handleOptionSelected(c.detail.id,t)}})))}),!this.initiallyLoaded&&i("div",{key:"46a1bff9ddae80881dd897e052b223e141afb358"},k(0,this.rowsPerPage).map(function(){return i("div",{class:"template-placeholder"})})),this.initiallyLoaded&&!this.templates.length&&i("div",{key:"a9d8f7f6602a0e2c8a447bb0868f097b9d7cb094",class:"empty-text"},"No matching templates found. Please adjust your filters and try again."),this.initiallyLoaded&&this.templates.length&&this.showPagination?i("div",{style:{marginTop:"20px"}},i("verdocs-pagination",{selectedPage:this.selectedPage,perPage:this.rowsPerPage,itemCount:this.count,onSelectPage:function(t){e.selectedPage=t.detail.selectedPage}})):i("div",null),this.confirmDelete&&i("verdocs-ok-dialog",{key:"a94528dd94af77c49c1b8c168c2c82d91003ba31",heading:"Delete this Template?",message:"This operation cannot be undone.",onNext:function(){return e.deleteTemplate(e.confirmDelete)},onExit:function(){return e.confirmDelete=null},showCancel:!0}))},Object.defineProperty(d,"watchers",{get:function(){return{sharing:["handleSharingUpdated"],starred:["handleStarredUpdated"],sort:["handleSortUpdated"],name:["handleNameUpdated"],selectedPage:["handlePageUpdated"]}},enumerable:!1,configurable:!0}),d}();U.style=L;export{U as verdocs_templates_list};
