import{r as s,c as i,h as e,F as a,H as t}from"./preview-X13RbvS2.js";import"./chunk-QN4WKJDJ-Bf_F3oir.js";import"./iframe-DWV1oore.js";import"../sb-preview/runtime.js";const l='@-webkit-keyframes verdocs-field-pulse{0%{background-color:rgba(0, 0, 0, 0.35)}50%{background-color:rgba(0, 0, 0, 0)}100%{background-color:rgba(0, 0, 0, 0.35)}}@keyframes verdocs-field-pulse{0%{background-color:rgba(0, 0, 0, 0.35)}50%{background-color:rgba(0, 0, 0, 0)}100%{background-color:rgba(0, 0, 0, 0.35)}}verdocs-kba-dialog{font-family:"Inter", "Barlow", sans-serif;-webkit-box-sizing:border-box;box-sizing:border-box}verdocs-kba-dialog div{-webkit-box-sizing:border-box;box-sizing:border-box}verdocs-kba-dialog .background-overlay{position:fixed;z-index:10000;top:0;left:0;right:0;bottom:0;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;background:rgba(0, 0, 0, 0.4980392157)}verdocs-kba-dialog .dialog{width:440px;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;border-radius:4px;overflow:hidden;background:#fff;padding:16px;-webkit-box-shadow:3px 3px 5px 1px rgba(40, 40, 40, 0.4);box-shadow:3px 3px 5px 1px rgba(40, 40, 40, 0.4)}verdocs-kba-dialog .heading{display:-ms-flexbox;display:flex;-ms-flex-direction:row;flex-direction:row;font-size:20px;font-weight:500}verdocs-kba-dialog .step{margin-left:6px;color:#666}verdocs-kba-dialog .help-box{background-color:#707ae5;display:-ms-flexbox;display:flex;-ms-flex-direction:row;flex-direction:row;margin:14px 0;padding:14px;-ms-flex-align:center;align-items:center;color:white}verdocs-kba-dialog .help-details{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;margin-left:15px;font-size:14px}verdocs-kba-dialog .help-icon{width:40px;height:40px}verdocs-kba-dialog .help-title{font-weight:600;margin-bottom:4px}verdocs-kba-dialog .help-text{font-weight:400}verdocs-kba-dialog .choices{display:grid;gap:15px;grid-template-columns:repeat(auto-fill, minmax(100px, 1fr));margin:0 0 15px 0}verdocs-kba-dialog .choice{border:1px solid #707ae5;border-radius:5px;display:-ms-flexbox;display:flex;height:60px;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center;text-align:center;color:#5c6575;cursor:pointer}verdocs-kba-dialog .choice.selected{background-color:#707ae5;color:#ffffff}verdocs-kba-dialog .buttons{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-direction:row;flex-direction:row;-ms-flex-pack:end;justify-content:flex-end}verdocs-kba-dialog .buttons verdocs-button{margin-left:16px}',d=l,c='<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 0C8.95313 0 0 8.95313 0 20C0 31.0469 8.95313 40 20 40C31.0469 40 40 31.0469 40 20C40 8.95313 31.0469 0 20 0ZM20 36.25C11.0391 36.25 3.75 28.9602 3.75 20C3.75 11.0398 11.0391 3.75 20 3.75C28.9609 3.75 36.25 11.0398 36.25 20C36.25 28.9602 28.9609 36.25 20 36.25Z" fill="white"/><path d="M20 26.25C18.5938 26.25 17.5 27.3438 17.5 28.75C17.5 30.1562 18.5234 31.25 20 31.25C21.3359 31.25 22.5 30.1562 22.5 28.75C22.5 27.3438 21.3359 26.25 20 26.25ZM22.5859 10H18.5938C15.5469 10 13.125 12.4219 13.125 15.4688C13.125 16.4844 13.9844 17.3438 15 17.3438C16.0156 17.3438 16.875 16.4844 16.875 15.4688C16.875 14.5312 17.5859 13.75 18.5234 13.75H22.5156C23.5234 13.75 24.375 14.5312 24.375 15.4688C24.375 16.0938 24.0625 16.5703 23.5156 16.8828L19.0625 19.6094C18.4375 20 18.125 20.625 18.125 21.25V22.5C18.125 23.5156 18.9844 24.375 20 24.375C21.0156 24.375 21.875 23.5156 21.875 22.5V22.3438L25.3984 20.1562C27.0391 19.1406 28.0547 17.3438 28.0547 15.4688C28.125 12.4219 25.7031 10 22.5859 10Z" fill="#E7E7E7"/></svg>',r=class{constructor(o){s(this,o),this.exit=i(this,"exit",7),this.next=i(this,"next",7),this.step=1,this.steps=3,this.helptitle="One Time Code",this.helptext="Please check your text messages for a security code, and enter the code below.",this.mode="choice",this.label="PIN",this.placeholder="Enter your PIN...",this.choices=["553 Arbor Dr","18 Lacey Ln","23A Ball Ct","2375 Cavallo Blvd","23-1 RR-7","151 Boulder Rd"],this.response=""}handleCancel(){this.exit.emit()}handleDismiss(o){o.target.className==="background-overlay"&&(o.preventDefault(),this.handleCancel())}handleDone(){this.next.emit(this.response)}render(){return e(t,{key:"b0ff245110f7b7ffa12929463ca2817f76168dca"},e("div",{key:"1b7a0c4991a4d450dde99ad9b4be83f38ff21a4a",class:"background-overlay",onClick:o=>this.handleDismiss(o)},e("div",{key:"914c88c6709e6dc3a5638277ba7f1c9f9ba38d70",class:"dialog"},e("div",{key:"4611fda838e96f34d03b59e61272209ad996cc3d",class:"heading"},"Confirm Your Identity",this.steps>1?e("span",{class:"step"},"(",this.step,"/",this.steps,")"):e(a,null)),e("div",{key:"0932233389d14ef824f95ea8dd7b5799c960e77b",class:"help-box"},e("div",{key:"cbb5fdb6d35911aa65ad46da2016e6dbc4209181",class:"help-icon",innerHTML:c}),e("div",{key:"29b4dac42074fcedebe9f63c409e4e838cec7477",class:"help-details"},e("div",{key:"f803eb449de8f352eed7caad0c2a22f0b8abe84b",class:"help-title"},this.helptitle),e("div",{key:"7ca67ecd148312ef50d3257fbae7f7eb9f0cff1f",class:"help-text"},this.helptext))),this.mode==="choice"?e("div",{class:"choices"},this.choices.map(o=>e("div",{class:`choice ${o===this.response?"selected":""}`,onClick:()=>{this.response=o}},o))):e("div",{class:"input"},e("label",{htmlFor:"verdocs-kba-input"},this.label),e("input",{type:"text",id:"verdocs-kba-input",name:"verdocs-kba-input",placeholder:this.placeholder})),e("div",{key:"ddb2c56c1cc829d255f0b32f4c76d7d7f19bc031",class:"buttons"},e("verdocs-button",{key:"08d8db4183d65546d9e6240ed8b2fb610134efe3",label:"Cancel",variant:"outline",onClick:()=>this.handleCancel()}),e("verdocs-button",{key:"7a5fb7a4f4564df0ec083efa0d12d84b8ba253dd",label:"Done",onClick:()=>this.handleDone(),disabled:!this.response})))))}};r.style=d;export{r as verdocs_kba_dialog};
