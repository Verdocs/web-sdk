import{c as l}from"./index-296aabaf-BfkBbDig.js";import{e as c}from"./index-CL2BROP6.js";import{c as d,g as u}from"./TemplateRoleStore-ddc3b96f-DhMDWHWE.js";import{c as f,g}from"./TemplateFieldStore-d7516adf-DPqtitkf.js";import{u as n}from"./index-7456b04f-CtY4qLFG.js";const m=a=>{const e=new Date().toISOString();return l({isLoading:!0,isLoaded:!1,isError:!1,error:null,roleNames:[],id:a,name:"",description:"",sender:"creator",profile_id:"",organization_id:"",counter:0,star_counter:0,is_sendable:!1,is_personal:!0,is_public:!1,created_at:e,updated_at:e,last_used_at:e,reminder_id:"",reminder:null,organization:null,roles:[],data:{},documents:[],fields:[],profile:null,search_key:"",tags:[],pages:[]})},o={},_=async(a,e,i=!1)=>{let s=!1;o[e]||(console.debug("[TEMPLATES] No template store found for ID, creating",e),o[e]=m(e),s=!0);const t=o[e];if(s||i){console.debug("[TEMPLATES] Loading template",{templateId:e,created:s,forceReload:i}),t.state.isLoading=!0,t.state.isLoaded=!1,t.state.isError=!1,t.state.error=n;try{const r=await c(a,e);console.debug("[TEMPLATES] Got template",r),Object.assign(t.state,r),t.state.isLoaded=!0,t.state.isError=!1,t.state.error=n,d(r),f(r)}catch(r){throw console.error("[TEMPLATES] Error loading template",r),t.state.isLoaded=!1,t.state.isError=!0,t.state.error=r,r}t.state.isLoading=!1}else u(e),g(e);return t};export{_ as g};
