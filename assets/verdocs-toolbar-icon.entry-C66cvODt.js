import{r,h as t,H as i}from"./preview-X13RbvS2.js";import{c as a}from"./popper-0fbeff6d-BQBsAJpH.js";import"./chunk-QN4WKJDJ-Bf_F3oir.js";import"./iframe-DWV1oore.js";import"../sb-preview/runtime.js";const c='@-webkit-keyframes verdocs-field-pulse{0%{background-color:rgba(0, 0, 0, 0.35)}50%{background-color:rgba(0, 0, 0, 0)}100%{background-color:rgba(0, 0, 0, 0.35)}}@keyframes verdocs-field-pulse{0%{background-color:rgba(0, 0, 0, 0.35)}50%{background-color:rgba(0, 0, 0, 0)}100%{background-color:rgba(0, 0, 0, 0.35)}}verdocs-toolbar-icon{font-family:"Inter", -apple-system, "Segoe UI", "Roboto", "Helvetica Neue", sans-serif;display:inline-block}verdocs-toolbar-icon .icon{display:inline-block;cursor:pointer}verdocs-toolbar-icon .icon svg{fill:#5c6575}verdocs-toolbar-icon .tooltip{display:none;-webkit-box-shadow:0 0 10px 1px #999999;box-shadow:0 0 10px 1px #999999;background:#ffffff;color:#33364b;max-width:240px;font-weight:bold;padding:5px 10px;font-size:13px;position:relative;border-radius:4px;z-index:20000;white-space:nowrap}verdocs-toolbar-icon .tooltip .arrow,verdocs-toolbar-icon .tooltip .arrow::before{position:absolute;width:8px;height:8px;background:inherit}verdocs-toolbar-icon .tooltip .arrow{visibility:hidden;top:-4px}verdocs-toolbar-icon .tooltip .arrow::before{visibility:visible;content:"";-webkit-transform:rotate(45deg);transform:rotate(45deg)}verdocs-toolbar-icon .tooltip[data-show]{display:block}verdocs-toolbar-icon .tooltip[data-popper-placement^=top]>.arrow{bottom:-4px}verdocs-toolbar-icon .tooltip[data-popper-placement^=bottom]>.arrow{top:-4px}verdocs-toolbar-icon .tooltip[data-popper-placement^=left]>.arrow{right:-4px}verdocs-toolbar-icon .tooltip[data-popper-placement^=right]>.arrow{left:-4px}verdocs-toolbar-icon .tooltip[data-popper-placement^=left]{padding:3px 10px}verdocs-toolbar-icon .tooltip[data-popper-placement^=left]>.arrow{right:-1px}',s=c,p=class{constructor(o){r(this,o),this.text="",this.icon="",this.placement="bottom",this.containerId=`verdocs-toolbar-icon-${Math.random().toString(36).substring(2,11)}`}componentDidLoad(){this.popperInstance=a(this.iconEl,this.tooltip,{placement:this.placement,modifiers:this.placement==="left"?[{name:"offset",options:{offset:[0,20]}}]:[]})}disconnectedCallback(){this.popperInstance&&(this.popperInstance.destroy(),this.popperInstance=null)}show(){var o,e;(o=this.tooltip)===null||o===void 0||o.setAttribute("data-show",""),(e=this.popperInstance)===null||e===void 0||e.update().catch(()=>{})}hide(){var o;(o=this.tooltip)===null||o===void 0||o.removeAttribute("data-show")}render(){return t(i,{key:"f9c2c8bd293559e5e504b69cbc445ca813f134a2",class:{}},t("div",{key:"e5d497d4859e8bd61364f56f8c452c61ece75a76","aria-describedby":this.containerId,class:"icon",innerHTML:this.icon,onMouseEnter:()=>this.show(),onFocus:()=>this.show(),onMouseLeave:()=>this.hide(),onBlur:()=>this.hide(),ref:o=>this.iconEl=o}),t("div",{key:"ebb1c0fa2cd8b58eba9d5057fc965ead53c23059",id:this.containerId,role:"tooltip",class:"tooltip","data-popper-placement":this.placement,ref:o=>this.tooltip=o},this.text,t("div",{key:"df0d03fbeeeb3016dde67f6d8bf8f75c5a97105c","data-popper-arrow":"true",class:"arrow"})))}};p.style=s;export{p as verdocs_toolbar_icon};
