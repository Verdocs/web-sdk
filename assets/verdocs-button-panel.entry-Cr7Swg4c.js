import{m as p,H as b,r as v}from"./components-BUY51Sj4.js";import{c as y}from"./popper-0fbeff6d-BA1lq3OH.js";import"./index-CDs2tPxN.js";import"./index-BXagdh-V.js";import"./iframe-BIHgOnMp.js";import"../sb-preview/runtime.js";var f=function(a,n,t,i){function r(e){return e instanceof t?e:new t(function(l){l(e)})}return new(t||(t=Promise))(function(e,l){function c(s){try{o(i.next(s))}catch(u){l(u)}}function d(s){try{o(i.throw(s))}catch(u){l(u)}}function o(s){s.done?e(s.value):r(s.value).then(c,d)}o((i=i.apply(a,n||[])).next())})},h=function(a,n){var t={label:0,sent:function(){if(e[0]&1)throw e[1];return e[1]},trys:[],ops:[]},i,r,e,l;return l={next:c(0),throw:c(1),return:c(2)},typeof Symbol=="function"&&(l[Symbol.iterator]=function(){return this}),l;function c(o){return function(s){return d([o,s])}}function d(o){if(i)throw new TypeError("Generator is already executing.");for(;l&&(l=0,o[0]&&(t=0)),t;)try{if(i=1,r&&(e=o[0]&2?r.return:o[0]?r.throw||((e=r.return)&&e.call(r),0):r.next)&&!(e=e.call(r,o[1])).done)return e;switch(r=0,e&&(o=[o[0]&2,e.value]),o[0]){case 0:case 1:e=o;break;case 4:return t.label++,{value:o[1],done:!1};case 5:t.label++,r=o[1],o=[0];continue;case 7:o=t.ops.pop(),t.trys.pop();continue;default:if(e=t.trys,!(e=e.length>0&&e[e.length-1])&&(o[0]===6||o[0]===2)){t=0;continue}if(o[0]===3&&(!e||o[1]>e[0]&&o[1]<e[3])){t.label=o[1];break}if(o[0]===6&&t.label<e[1]){t.label=e[1],e=o;break}if(e&&t.label<e[2]){t.label=e[2],t.ops.push(o);break}e[2]&&t.ops.pop(),t.trys.pop();continue}o=n.call(a,t)}catch(s){o=[6,s],r=0}finally{i=e=0}if(o[0]&5)throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}},g='@-webkit-keyframes verdocs-field-pulse{0%{background-color:rgba(0, 0, 0, 0.35)}50%{background-color:rgba(0, 0, 0, 0)}100%{background-color:rgba(0, 0, 0, 0.35)}}@keyframes verdocs-field-pulse{0%{background-color:rgba(0, 0, 0, 0.35)}50%{background-color:rgba(0, 0, 0, 0)}100%{background-color:rgba(0, 0, 0, 0.35)}}verdocs-button-panel{font-family:"Inter", -apple-system, "Segoe UI", "Roboto", "Helvetica Neue", sans-serif;display:inline-block}verdocs-button-panel .icon{display:inline-block;cursor:pointer;opacity:0.6}verdocs-button-panel .icon svg{fill:#707ae5}verdocs-button-panel .icon:hover{opacity:1}.verdocs-button-panel-content{font-family:"Inter", -apple-system, "Segoe UI", "Roboto", "Helvetica Neue", sans-serif;-webkit-box-shadow:0 0 10px 1px #999999;box-shadow:0 0 10px 1px #999999;display:none;background:#ffffff;color:#33364b;width:320px;font-weight:bold;padding:15px;font-size:14px;position:relative;border-radius:4px;z-index:10000}.verdocs-button-panel-content .arrow,.verdocs-button-panel-content .arrow::before{position:absolute;width:8px;height:8px;background:inherit}.verdocs-button-panel-content .arrow{visibility:hidden;top:-4px}.verdocs-button-panel-content .arrow::before{visibility:visible;content:"";-webkit-transform:rotate(45deg);transform:rotate(45deg)}.verdocs-button-panel-content[data-show]{display:block}.verdocs-button-panel-content[data-popper-placement^=top]>.arrow{bottom:-4px}.verdocs-button-panel-content[data-popper-placement^=bottom]>.arrow{top:-4px}.verdocs-button-panel-content[data-popper-placement^=left]>.arrow{right:-4px}.verdocs-button-panel-content[data-popper-placement^=right]>.arrow{left:-4px}.verdocs-button-panel-content h6{font-size:16px;font-weight:bold;margin:0 0 16px 0;color:#092c4c;border-bottom:1px solid #cccccc}',m=g,w=function(){function a(n){v(this,n),this.showing=!1,this.icon=""}return a.prototype.componentDidRender=function(){document.body.appendChild(this.panelEl),this.popperInstance&&this.popperInstance.destroy(),this.popperInstance=y(this.iconEl,this.panelEl,{})},a.prototype.disconnectedCallback=function(){this.popperInstance&&(this.popperInstance.destroy(),this.popperInstance=null),this.panelEl&&this.panelEl.remove()},a.prototype.showPanel=function(){return f(this,void 0,void 0,function(){var n,t,i=this;return h(this,function(r){return(n=this.panelEl)===null||n===void 0||n.setAttribute("data-show",""),(t=this.popperInstance)===null||t===void 0||t.update().catch(function(){}),this.showing=!0,this.hiderEl=document.createElement("div"),this.hiderEl.id="verdocs-button-panel-hider",this.hiderEl.style.zIndex="100",this.hiderEl.style.position="absolute",this.hiderEl.style.top="0px",this.hiderEl.style.left="0px",this.hiderEl.style.right="0px",this.hiderEl.style.bottom="0px",this.hiderEl.onclick=function(e){e.stopPropagation(),i.toggle()},document.body.appendChild(this.hiderEl),[2]})})},a.prototype.hidePanel=function(){return f(this,void 0,void 0,function(){var n;return h(this,function(t){return Array.from(document.getElementsByClassName("verdocs-button-panel-content")).forEach(function(i){i.removeAttribute("data-show")}),(n=document.getElementById("verdocs-button-panel-hider"))===null||n===void 0||n.remove(),this.showing=!1,[2]})})},a.prototype.toggle=function(){return f(this,void 0,void 0,function(){return h(this,function(n){switch(n.label){case 0:return this.showing?[4,this.hidePanel()]:[3,2];case 1:return n.sent(),[3,4];case 2:return[4,this.showPanel()];case 3:n.sent(),n.label=4;case 4:return[2]}})})},a.prototype.render=function(){var n=this;return p(b,{key:"875a734696925dd22625880b694e32c4845e1254"},p("div",{key:"cc83aef76b34b3e9031160451f9643168d41cf3b",class:"icon",innerHTML:this.icon,onClick:function(t){return t.stopPropagation(),n.toggle()},ref:function(t){return n.iconEl=t}}),p("div",{key:"136375bb517b9d86327c6fa63b115f3f496df7a4",role:"tooltip",class:"verdocs-button-panel-content","data-popper-placement":"bottom",ref:function(t){return n.panelEl=t}},p("div",{key:"065c60cf39be8a608fbc5e2199b09cb55d8a551b","data-popper-arrow":"true",class:"arrow"}),p("slot",{key:"85af4ff2a549a5d062fff08bf17d1c6c24c439e5"})))},a}();w.style=m;export{w as verdocs_button_panel};
