import{r as m,c as d,h as i,H as c,F as x,g as u}from"./preview-X13RbvS2.js";import{V as f,ah as r,ai as p,j as w,n as b,i as y}from"./index-CL2BROP6.js";import{s as I}from"./utils-2cf884a7-7ztE_qbo.js";import{S as h}from"./errors-887f1e88-DR-_BPTJ.js";import"./chunk-QN4WKJDJ-Bf_F3oir.js";import"./iframe-DWV1oore.js";import"../sb-preview/runtime.js";import"./Types-e4a6eba5-BiEcJ5ex.js";import"./index-fc5a08b9-CmPFFxNR.js";const k='@-webkit-keyframes verdocs-field-pulse{0%{background-color:rgba(0, 0, 0, 0.35)}50%{background-color:rgba(0, 0, 0, 0)}100%{background-color:rgba(0, 0, 0, 0.35)}}@keyframes verdocs-field-pulse{0%{background-color:rgba(0, 0, 0, 0.35)}50%{background-color:rgba(0, 0, 0, 0)}100%{background-color:rgba(0, 0, 0, 0.35)}}verdocs-view{display:-ms-flexbox;display:flex;overflow:hidden;min-height:600px;position:relative;-ms-flex-align:center;align-items:center;-ms-flex-direction:column;flex-direction:column;-webkit-box-sizing:border-box;box-sizing:border-box;font-family:"Inter", -apple-system, "Segoe UI", "Roboto", "Helvetica Neue", sans-serif}verdocs-view div,verdocs-view canvas{-webkit-box-sizing:border-box;box-sizing:border-box}verdocs-view .document{-ms-flex:1;flex:1;width:100%;height:100%;display:-ms-flexbox;display:flex;padding:15px;row-gap:15px;min-height:200px;max-width:1200px;position:relative;overflow-y:scroll;-ms-flex-align:center;align-items:center;-webkit-box-sizing:border-box;box-sizing:border-box;-ms-flex-direction:column;flex-direction:column}verdocs-view .document .inner{width:100%;max-width:1028px}verdocs-view .loading-indicator{top:0;left:0;right:0;bottom:0;display:-ms-flexbox;display:flex;z-index:10000;position:fixed;background-color:rgba(0, 0, 0, 0.7)}#verdocs-view-header{width:100%;color:#fff;display:-ms-flexbox;display:flex;z-index:1000;-ms-flex:0 0 56px;flex:0 0 56px;padding:0 20px;font-size:12px;-webkit-column-gap:15px;-moz-column-gap:15px;column-gap:15px;-ms-flex-align:center;align-items:center;-ms-flex-direction:row;flex-direction:row;-webkit-transition:all 0.25s;transition:all 0.25s;background-color:#33354c;-webkit-box-shadow:0 4px 4px 0 rgba(0, 0, 0, 0.24), 0 0 4px 0 rgba(0, 0, 0, 0.12);box-shadow:0 4px 4px 0 rgba(0, 0, 0, 0.24), 0 0 4px 0 rgba(0, 0, 0, 0.12)}@media all and (max-width: 500px){#verdocs-view-header{padding:0 10px}}#verdocs-view-header .inner{width:100%;display:-ms-flexbox;display:flex;margin:0 auto;padding:0 20px;max-width:1200px;-ms-flex-align:center;align-items:center;-ms-flex-direction:row;flex-direction:row}@media all and (max-width: 500px){#verdocs-view-header .inner{padding:0 10px}}#verdocs-view-header .logo{width:80px;display:none;margin:-6px 0 0 0}#verdocs-view-header .title{font-size:18px;font-weight:500;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}',E=k,V=class{constructor(n){m(this,n),this.sdkError=d(this,"sdkError",7),this.envelopeUpdated=d(this,"envelopeUpdated",7),this.another=d(this,"another",7),this.view=d(this,"view",7),this.next=d(this,"next",7),this.endpoint=f.getDefault(),this.envelopeId="",this.headerTargetId=null,this.canceling=!1,this.envelope=null,this.roleNames=[],this.showCancelDone=!1}componentWillLoad(){this.endpoint.loadSession()}async componentWillRender(){if(!this.envelopeId){console.error("[VIEW] Missing required envelopeId");return}return this.reloadEnvelope()}componentDidRender(){const n=this.headerTargetId?document.getElementById(this.headerTargetId):null,o=document.getElementById("verdocs-view-header");n&&o&&(console.log("[VIEW] Moving header"),o.remove(),n.append(o))}async reloadEnvelope(){var n,o,l;console.log("[VIEW] Loading envelope...");try{this.envelope=await r(this.endpoint,this.envelopeId),console.log("[VIEW] Loaded envelope",this.envelope),this.roleNames=this.envelope.recipients.map(e=>e.role_name),setTimeout(async()=>{console.log("[VIEW] Reloading envelope..."),this.envelope=await r(this.endpoint,this.envelopeId),console.log("[VIEW] Reloaded envelope",this.envelope)},2e3)}catch(e){(n=this.sdkError)===null||n===void 0||n.emit(new h(e.message,(o=e.response)===null||o===void 0?void 0:o.status,(l=e.response)===null||l===void 0?void 0:l.data))}}handlePageRendered(n){const o=n.detail;console.log("[VIEW] Page rendered",o)}async handleOptionSelected(n){var o,l;switch(n.detail.id){case"cancel":confirm("Are you sure you wish to cancel this envelope? This action cannot be undone.")&&(this.canceling=!0,w(this.endpoint,this.envelopeId).then(e=>(this.canceling=!1,console.log("[VIEW] Envelope canceled",e),r(this.endpoint,this.envelopeId))).then(e=>{console.log("[VIEW] Loaded new envelope details",e),this.envelope=e}).catch(e=>{var t,s,a;this.canceling=!1,console.log("[VIEW] Error canceling envelope",e),(t=this.sdkError)===null||t===void 0||t.emit(new h(e.message,(s=e.response)===null||s===void 0?void 0:s.status,(a=e.response)===null||a===void 0?void 0:a.data))}),this.showCancelDone=!0,(o=this.envelopeUpdated)===null||o===void 0||o.emit({endpoint:this.endpoint,envelope:this.envelope,event:"canceled"}));break;case"print":window.print(),(l=this.envelopeUpdated)===null||l===void 0||l.emit({endpoint:this.endpoint,envelope:this.envelope,event:"printed"});break;case"download-attachments":{const e=this.envelope.documents.find(t=>t.type==="attachment");if(e){const t=await p(this.endpoint,this.envelopeId,e.id);window.open(t,"_blank")}}break;case"download-certificate":{const e=this.envelope.documents.find(t=>t.type==="certificate");if(e){const t=await p(this.endpoint,this.envelopeId,e.id);window.open(t,"_blank")}}break;case"download-all":I(this.endpoint,[this.envelope]).then(()=>{var e;(e=this.envelopeUpdated)===null||e===void 0||e.emit({endpoint:this.endpoint,envelope:this.envelope,event:"downloaded"})}).catch(e=>{console.log("Error downloading Zip",e)});break}}render(){var n;if(!this.envelope)return i(c,null,i("img",{src:"https://verdocs-public-assets.s3.amazonaws.com/loading-placeholder.png",style:{width:"612px",height:"792px",boxShadow:"0 0 10px 5px #0000000f",marginTop:"15px"},alt:"Placeholder page"}));const o=[{id:"print",label:"Print"}];b(this.endpoint.session,this.envelope)&&o.push({id:"cancel",label:"Cancel"});const l=this.envelope.documents.length>0,e=this.envelope.documents.filter(s=>s.type==="attachment").length,t=this.envelope.documents.find(s=>s.type==="certificate")!==void 0;return(l||t)&&(o.push({label:""}),l&&o.push({id:"download-attachments",label:e>1?"Download Documents":"Download Document"}),t&&o.push({id:"download-certificate",label:"Download Certificate"}),l&&t&&o.push({id:"download-all",label:"Download All Files"})),i(c,null,i("div",{id:"verdocs-view-header"},i("div",{class:"inner"},i("img",{src:"https://verdocs.com/assets/white-logo.svg",alt:"Verdocs Logo",class:"logo"}),i("div",{class:"title"},this.envelope.name),i("div",{style:{flex:"1"}}),i("div",{style:{marginLeft:"10px"}}),i("verdocs-dropdown",{options:o,onOptionSelected:s=>this.handleOptionSelected(s)}))),i("div",{class:"document",style:{paddingTop:this.headerTargetId?"70px":"15px"}},(((n=this.envelope)===null||n===void 0?void 0:n.documents)||[]).filter(s=>s.type!=="certificate").map(s=>{const a=y(1,s.pages);return i(x,null,a.map(v=>i("verdocs-envelope-document-page",{envelopeId:this.envelopeId,documentId:s.id,endpoint:this.endpoint,type:"filled",virtualWidth:612,virtualHeight:792,pageNumber:v,onPageRendered:g=>this.handlePageRendered(g),layers:[{name:"page",type:"canvas"},{name:"controls",type:"div"}]})))})),this.showCancelDone&&i("verdocs-ok-dialog",{heading:"Cancelled",message:"This envelope has been cancelled successfully.",onNext:()=>{this.showCancelDone=!1}}),this.canceling&&i("div",{class:"loading-indicator"},i("verdocs-loader",null)))}get component(){return u(this)}};V.style=E;export{V as verdocs_view};
