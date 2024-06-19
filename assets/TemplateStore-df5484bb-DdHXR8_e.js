import{c as m}from"./index-296aabaf-RiVWanv8.js";import{e as g}from"./index-FOFzXDN2.js";import{g as h,c as _}from"./TemplateRoleStore-ddc3b96f-B5kZ-UY0.js";import{g as b,c as y}from"./TemplateFieldStore-d7516adf-DcKvNlmt.js";import{u as p}from"./index-7456b04f-WYt0v2to.js";var v=function(f,l,t,a){function o(e){return e instanceof t?e:new t(function(u){u(e)})}return new(t||(t=Promise))(function(e,u){function s(i){try{r(a.next(i))}catch(c){u(c)}}function n(i){try{r(a.throw(i))}catch(c){u(c)}}function r(i){i.done?e(i.value):o(i.value).then(s,n)}r((a=a.apply(f,l||[])).next())})},T=function(f,l){var t={label:0,sent:function(){if(e[0]&1)throw e[1];return e[1]},trys:[],ops:[]},a,o,e,u;return u={next:s(0),throw:s(1),return:s(2)},typeof Symbol=="function"&&(u[Symbol.iterator]=function(){return this}),u;function s(r){return function(i){return n([r,i])}}function n(r){if(a)throw new TypeError("Generator is already executing.");for(;u&&(u=0,r[0]&&(t=0)),t;)try{if(a=1,o&&(e=r[0]&2?o.return:r[0]?o.throw||((e=o.return)&&e.call(o),0):o.next)&&!(e=e.call(o,r[1])).done)return e;switch(o=0,e&&(r=[r[0]&2,e.value]),r[0]){case 0:case 1:e=r;break;case 4:return t.label++,{value:r[1],done:!1};case 5:t.label++,o=r[1],r=[0];continue;case 7:r=t.ops.pop(),t.trys.pop();continue;default:if(e=t.trys,!(e=e.length>0&&e[e.length-1])&&(r[0]===6||r[0]===2)){t=0;continue}if(r[0]===3&&(!e||r[1]>e[0]&&r[1]<e[3])){t.label=r[1];break}if(r[0]===6&&t.label<e[1]){t.label=e[1],e=r;break}if(e&&t.label<e[2]){t.label=e[2],t.ops.push(r);break}e[2]&&t.ops.pop(),t.trys.pop();continue}r=l.call(f,t)}catch(i){r=[6,i],o=0}finally{a=e=0}if(r[0]&5)throw r[1];return{value:r[0]?r[1]:void 0,done:!0}}},w=function(f,l,t){if(t||arguments.length===2)for(var a=0,o=l.length,e;a<o;a++)(e||!(a in l))&&(e||(e=Array.prototype.slice.call(l,0,a)),e[a]=l[a]);return f.concat(e||Array.prototype.slice.call(l))},S=function(f){var l=new Date().toISOString();return m({isLoading:!0,isLoaded:!1,isError:!1,error:null,roleNames:[],id:f,name:"",description:"",sender:"creator",profile_id:"",organization_id:"",counter:0,star_counter:0,is_sendable:!1,is_personal:!0,is_public:!1,created_at:l,updated_at:l,last_used_at:l,reminder_id:"",reminder:null,organization:null,roles:[],data:{},documents:[],fields:[],profile:null,search_key:"",tags:[],pages:[]})},d={},P=function(f,l){for(var t=[],a=2;a<arguments.length;a++)t[a-2]=arguments[a];return v(void 0,w([f,l],t,!0),void 0,function(o,e,u){var s,n,r,i;return u===void 0&&(u=!1),T(this,function(c){switch(c.label){case 0:if(s=!1,d[e]||(console.debug("[TEMPLATES] No template store found for ID, creating",e),d[e]=S(e),s=!0),n=d[e],!(s||u))return[3,5];console.debug("[TEMPLATES] Loading template",{templateId:e,created:s,forceReload:u}),n.state.isLoading=!0,n.state.isLoaded=!1,n.state.isError=!1,n.state.error=p,c.label=1;case 1:return c.trys.push([1,3,,4]),[4,g(o,e)];case 2:return r=c.sent(),console.debug("[TEMPLATES] Got template",r),Object.assign(n.state,r),n.state.isLoaded=!0,n.state.isError=!1,n.state.error=p,_(r),y(r),[3,4];case 3:throw i=c.sent(),console.error("[TEMPLATES] Error loading template",i),n.state.isLoaded=!1,n.state.isError=!0,n.state.error=i,i;case 4:return n.state.isLoading=!1,[3,6];case 5:h(e),b(e),c.label=6;case 6:return[2,n]}})})};export{P as g};
