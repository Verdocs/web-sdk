import{m as l,H as p,o as g,r as v,n as f}from"./components-BUY51Sj4.js";import{aj as m,V as b}from"./index-FOFzXDN2.js";import{t as y}from"./utils-61c1093b-BdPfu6ZN.js";import"./index-CDs2tPxN.js";import"./index-BXagdh-V.js";import"./iframe-BIHgOnMp.js";import"../sb-preview/runtime.js";import"./Types-e4a6eba5-DhtnXEHy.js";import"./index-0329eed3-CmPFFxNR.js";var H=function(s,t,r,o){function n(e){return e instanceof r?e:new r(function(a){a(e)})}return new(r||(r=Promise))(function(e,a){function d(c){try{i(o.next(c))}catch(u){a(u)}}function h(c){try{i(o.throw(c))}catch(u){a(u)}}function i(c){c.done?e(c.value):n(c.value).then(d,h)}i((o=o.apply(s,t||[])).next())})},w=function(s,t){var r={label:0,sent:function(){if(e[0]&1)throw e[1];return e[1]},trys:[],ops:[]},o,n,e,a;return a={next:d(0),throw:d(1),return:d(2)},typeof Symbol=="function"&&(a[Symbol.iterator]=function(){return this}),a;function d(i){return function(c){return h([i,c])}}function h(i){if(o)throw new TypeError("Generator is already executing.");for(;a&&(a=0,i[0]&&(r=0)),r;)try{if(o=1,n&&(e=i[0]&2?n.return:i[0]?n.throw||((e=n.return)&&e.call(n),0):n.next)&&!(e=e.call(n,i[1])).done)return e;switch(n=0,e&&(i=[i[0]&2,e.value]),i[0]){case 0:case 1:e=i;break;case 4:return r.label++,{value:i[1],done:!1};case 5:r.label++,n=i[1],i=[0];continue;case 7:i=r.ops.pop(),r.trys.pop();continue;default:if(e=r.trys,!(e=e.length>0&&e[e.length-1])&&(i[0]===6||i[0]===2)){r=0;continue}if(i[0]===3&&(!e||i[1]>e[0]&&i[1]<e[3])){r.label=i[1];break}if(i[0]===6&&r.label<e[1]){r.label=e[1],e=i;break}if(e&&r.label<e[2]){r.label=e[2],r.ops.push(i);break}e[2]&&r.ops.pop(),r.trys.pop();continue}i=t.call(s,r)}catch(c){i=[6,c],n=0}finally{o=e=0}if(i[0]&5)throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}},W="@-webkit-keyframes verdocs-field-pulse{0%{background-color:rgba(0, 0, 0, 0.35)}50%{background-color:rgba(0, 0, 0, 0)}100%{background-color:rgba(0, 0, 0, 0.35)}}@keyframes verdocs-field-pulse{0%{background-color:rgba(0, 0, 0, 0.35)}50%{background-color:rgba(0, 0, 0, 0)}100%{background-color:rgba(0, 0, 0, 0.35)}}verdocs-envelope-document-page{width:100%;position:relative}verdocs-envelope-document-page .verdocs-envelope-document-page-layer{position:absolute;top:0;left:0;right:0;bottom:0;-webkit-box-shadow:0 0 10px 5px rgba(0, 0, 0, 0.0588235294);box-shadow:0 0 10px 5px rgba(0, 0, 0, 0.0588235294)}verdocs-envelope-document-page .verdocs-envelope-document-page-layer.img{width:100%}",k=W,x=function(){function s(t){v(this,t),this.pageRendered=f(this,"pageRendered",7),this.endpoint=b.getDefault(),this.envelopeId="",this.documentId="",this.pageNumber=1,this.virtualWidth=612,this.virtualHeight=792,this.layers=[{name:"page",type:"canvas"}],this.type="original",this.containerId="verdocs-envelope-document-page-".concat(Math.random().toString(36).substring(2,11)),this.renderedWidth=this.virtualWidth,this.renderedHeight=this.virtualHeight,this.naturalWidth=this.virtualWidth,this.naturalHeight=this.virtualHeight,this.aspectRatio=this.virtualWidth/this.virtualHeight,this.skipFirstNotification=!0,this.pageDisplayUri="https://verdocs-public-assets.s3.amazonaws.com/page-loading-placeholder.png"}return s.prototype.componentWillLoad=function(){return H(this,void 0,void 0,function(){var t;return w(this,function(r){switch(r.label){case 0:return t=this,[4,m(this.endpoint,this.envelopeId,this.documentId,this.pageNumber,this.type)];case 1:return t.pageDisplayUri=r.sent(),[2]}})})},s.prototype.componentDidLoad=function(){var t=this;this.resizeObserver=new ResizeObserver(y(function(r){for(var o=0,n=r;o<n.length;o++){var e=n[o],a=e.contentRect.width;t.renderedWidth=a,t.renderedHeight=t.virtualHeight*(a/t.virtualWidth)}t.notifyRenderedSize()},100)),this.resizeObserver.observe(this.container)},s.prototype.disconnectedCallback=function(){var t;(t=this.resizeObserver)===null||t===void 0||t.disconnect(),console.log("[PAGE] Disconnected",this.containerId)},s.prototype.notifyRenderedSize=function(){if(this.skipFirstNotification){this.skipFirstNotification=!1;return}this.pageRendered.emit({containerId:this.containerId,documentId:this.documentId,pageNumber:this.pageNumber,virtualWidth:this.virtualWidth,virtualHeight:this.virtualHeight,renderedWidth:this.renderedWidth,renderedHeight:this.renderedHeight,naturalWidth:this.naturalWidth,naturalHeight:this.naturalHeight,aspectRatio:this.aspectRatio,xScale:this.renderedWidth/this.virtualWidth,yScale:this.renderedHeight/this.virtualHeight})},s.prototype.render=function(){var t=this,r="".concat(this.renderedHeight,"px");return l(p,{key:"ffde44b0a64fd3d3859ab4d87938f9a442d36cda",id:"".concat(this.containerId),style:{height:r,flex:"0 0 ".concat(r)}},this.layers.map(function(o){return o.type==="div"?l("div",{class:"verdocs-envelope-document-page-layer",id:"".concat(t.containerId,"-").concat(o.name),style:{height:r}}):t.pageDisplayUri?l("img",{class:"verdocs-envelope-document-page-layer img",id:"".concat(t.containerId,"-").concat(o.name),src:t.pageDisplayUri,alt:"Page ".concat(t.pageNumber),"aria-hidden":!0,loading:"lazy",onLoad:function(n){t.naturalWidth=n.target.naturalWidth,t.naturalHeight=n.target.naturalHeight,t.aspectRatio=t.naturalWidth/t.naturalHeight,t.virtualHeight=t.virtualWidth/t.aspectRatio,t.renderedHeight=n.target.offsetWidth/t.aspectRatio}}):l("div",null)}))},Object.defineProperty(s.prototype,"container",{get:function(){return g(this)},enumerable:!1,configurable:!0}),s}();x.style=k;export{x as verdocs_envelope_document_page};
