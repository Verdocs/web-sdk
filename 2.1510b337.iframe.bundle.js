(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{"./dist/esm/Token-b82a8ea3.js":function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return VerdocsEndpoint})),__webpack_require__.d(__webpack_exports__,"b",(function(){return decodeAccessTokenBody})),__webpack_require__.d(__webpack_exports__,"c",(function(){return getEndpoint})),__webpack_require__.d(__webpack_exports__,"d",(function(){return setActiveEndpoint}));__webpack_require__("./node_modules/core-js/modules/es.global-this.js"),__webpack_require__("./node_modules/core-js/modules/es.object.define-property.js"),__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.array.is-array.js"),__webpack_require__("./node_modules/core-js/modules/es.array-buffer.constructor.js"),__webpack_require__("./node_modules/core-js/modules/es.array-buffer.slice.js"),__webpack_require__("./node_modules/core-js/modules/es.array-buffer.is-view.js"),__webpack_require__("./node_modules/core-js/modules/es.object.get-prototype-of.js"),__webpack_require__("./node_modules/core-js/modules/es.string.trim.js"),__webpack_require__("./node_modules/core-js/modules/es.string.replace.js"),__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js"),__webpack_require__("./node_modules/core-js/modules/es.array.slice.js"),__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.date.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.array.for-each.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"),__webpack_require__("./node_modules/core-js/modules/es.date.to-iso-string.js"),__webpack_require__("./node_modules/core-js/modules/es.array.join.js"),__webpack_require__("./node_modules/core-js/modules/es.array.index-of.js"),__webpack_require__("./node_modules/core-js/modules/es.date.to-json.js"),__webpack_require__("./node_modules/core-js/modules/web.url.to-json.js"),__webpack_require__("./node_modules/core-js/modules/es.function.name.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"),__webpack_require__("./node_modules/core-js/modules/es.string.match.js"),__webpack_require__("./node_modules/core-js/modules/es.regexp.constructor.js"),__webpack_require__("./node_modules/core-js/modules/es.date.now.js"),__webpack_require__("./node_modules/core-js/modules/es.string.split.js"),__webpack_require__("./node_modules/core-js/modules/es.array.concat.js"),__webpack_require__("./node_modules/core-js/modules/es.string.search.js"),__webpack_require__("./node_modules/core-js/modules/es.promise.js"),__webpack_require__("./node_modules/core-js/modules/web.timers.js"),__webpack_require__("./node_modules/core-js/modules/es.object.keys.js"),__webpack_require__("./node_modules/core-js/modules/es.array.splice.js"),__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.string.starts-with.js");var _index_2b1938ea_js__WEBPACK_IMPORTED_MODULE_38__=__webpack_require__("./dist/esm/index-2b1938ea.js"),naiveFallback=function naiveFallback(){if("object"==typeof self&&self)return self;if("object"==typeof window&&window)return window;throw new Error("Unable to resolve global `this`")},globalThis_1=function(){if(this)return this;if("object"==typeof globalThis&&globalThis)return globalThis;try{Object.defineProperty(Object.prototype,"__global__",{get:function get(){return this},configurable:!0})}catch(error){return naiveFallback()}try{return __global__||naiveFallback()}finally{delete Object.prototype.__global__}}(),bind=function bind(fn,thisArg){return function wrap(){for(var args=new Array(arguments.length),i=0;i<args.length;i++)args[i]=arguments[i];return fn.apply(thisArg,args)}},toString=Object.prototype.toString;function isArray(val){return Array.isArray(val)}function isUndefined(val){return void 0===val}function isArrayBuffer(val){return"[object ArrayBuffer]"===toString.call(val)}function isObject(val){return null!==val&&"object"==typeof val}function isPlainObject(val){if("[object Object]"!==toString.call(val))return!1;var prototype=Object.getPrototypeOf(val);return null===prototype||prototype===Object.prototype}function isFunction(val){return"[object Function]"===toString.call(val)}function forEach(obj,fn){if(null!=obj)if("object"!=typeof obj&&(obj=[obj]),isArray(obj))for(var i=0,l=obj.length;i<l;i++)fn.call(null,obj[i],i,obj);else for(var key in obj)Object.prototype.hasOwnProperty.call(obj,key)&&fn.call(null,obj[key],key,obj)}var utils={isArray:isArray,isArrayBuffer:isArrayBuffer,isBuffer:function isBuffer(val){return null!==val&&!isUndefined(val)&&null!==val.constructor&&!isUndefined(val.constructor)&&"function"==typeof val.constructor.isBuffer&&val.constructor.isBuffer(val)},isFormData:function isFormData(val){return"[object FormData]"===toString.call(val)},isArrayBufferView:function isArrayBufferView(val){return"undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(val):val&&val.buffer&&isArrayBuffer(val.buffer)},isString:function isString(val){return"string"==typeof val},isNumber:function isNumber(val){return"number"==typeof val},isObject:isObject,isPlainObject:isPlainObject,isUndefined:isUndefined,isDate:function isDate(val){return"[object Date]"===toString.call(val)},isFile:function isFile(val){return"[object File]"===toString.call(val)},isBlob:function isBlob(val){return"[object Blob]"===toString.call(val)},isFunction:isFunction,isStream:function isStream(val){return isObject(val)&&isFunction(val.pipe)},isURLSearchParams:function isURLSearchParams(val){return"[object URLSearchParams]"===toString.call(val)},isStandardBrowserEnv:function isStandardBrowserEnv(){return("undefined"==typeof navigator||"ReactNative"!==navigator.product&&"NativeScript"!==navigator.product&&"NS"!==navigator.product)&&("undefined"!=typeof window&&"undefined"!=typeof document)},forEach:forEach,merge:function merge(){var result={};function assignValue(val,key){isPlainObject(result[key])&&isPlainObject(val)?result[key]=merge(result[key],val):isPlainObject(val)?result[key]=merge({},val):isArray(val)?result[key]=val.slice():result[key]=val}for(var i=0,l=arguments.length;i<l;i++)forEach(arguments[i],assignValue);return result},extend:function extend(a,b,thisArg){return forEach(b,(function assignValue(val,key){a[key]=thisArg&&"function"==typeof val?bind(val,thisArg):val})),a},trim:function trim(str){return str.trim?str.trim():str.replace(/^\s+|\s+$/g,"")},stripBOM:function stripBOM(content){return 65279===content.charCodeAt(0)&&(content=content.slice(1)),content}};function encode(val){return encodeURIComponent(val).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}var buildURL=function buildURL(url,params,paramsSerializer){if(!params)return url;var serializedParams;if(paramsSerializer)serializedParams=paramsSerializer(params);else if(utils.isURLSearchParams(params))serializedParams=params.toString();else{var parts=[];utils.forEach(params,(function serialize(val,key){null!=val&&(utils.isArray(val)?key+="[]":val=[val],utils.forEach(val,(function parseValue(v){utils.isDate(v)?v=v.toISOString():utils.isObject(v)&&(v=JSON.stringify(v)),parts.push(encode(key)+"="+encode(v))})))})),serializedParams=parts.join("&")}if(serializedParams){var hashmarkIndex=url.indexOf("#");-1!==hashmarkIndex&&(url=url.slice(0,hashmarkIndex)),url+=(-1===url.indexOf("?")?"?":"&")+serializedParams}return url};function InterceptorManager(){this.handlers=[]}InterceptorManager.prototype.use=function use(fulfilled,rejected,options){return this.handlers.push({fulfilled:fulfilled,rejected:rejected,synchronous:!!options&&options.synchronous,runWhen:options?options.runWhen:null}),this.handlers.length-1},InterceptorManager.prototype.eject=function eject(id){this.handlers[id]&&(this.handlers[id]=null)},InterceptorManager.prototype.forEach=function forEach(fn){utils.forEach(this.handlers,(function forEachHandler(h){null!==h&&fn(h)}))};var InterceptorManager_1=InterceptorManager,normalizeHeaderName=function normalizeHeaderName(headers,normalizedName){utils.forEach(headers,(function processHeader(value,name){name!==normalizedName&&name.toUpperCase()===normalizedName.toUpperCase()&&(headers[normalizedName]=value,delete headers[name])}))},enhanceError=function enhanceError(error,config,code,request,response){return error.config=config,code&&(error.code=code),error.request=request,error.response=response,error.isAxiosError=!0,error.toJSON=function toJSON(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:this.config,code:this.code,status:this.response&&this.response.status?this.response.status:null}},error},createError=function createError(message,config,code,request,response){var error=new Error(message);return enhanceError(error,config,code,request,response)},cookies=utils.isStandardBrowserEnv()?function standardBrowserEnv(){return{write:function write(name,value,expires,path,domain,secure){var cookie=[];cookie.push(name+"="+encodeURIComponent(value)),utils.isNumber(expires)&&cookie.push("expires="+new Date(expires).toGMTString()),utils.isString(path)&&cookie.push("path="+path),utils.isString(domain)&&cookie.push("domain="+domain),!0===secure&&cookie.push("secure"),document.cookie=cookie.join("; ")},read:function read(name){var match=document.cookie.match(new RegExp("(^|;\\s*)("+name+")=([^;]*)"));return match?decodeURIComponent(match[3]):null},remove:function remove(name){this.write(name,"",Date.now()-864e5)}}}():{write:function write(){},read:function read(){return null},remove:function remove(){}},ignoreDuplicateOf=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"],isURLSameOrigin=utils.isStandardBrowserEnv()?function standardBrowserEnv(){var originURL,msie=/(msie|trident)/i.test(navigator.userAgent),urlParsingNode=document.createElement("a");function resolveURL(url){var href=url;return msie&&(urlParsingNode.setAttribute("href",href),href=urlParsingNode.href),urlParsingNode.setAttribute("href",href),{href:urlParsingNode.href,protocol:urlParsingNode.protocol?urlParsingNode.protocol.replace(/:$/,""):"",host:urlParsingNode.host,search:urlParsingNode.search?urlParsingNode.search.replace(/^\?/,""):"",hash:urlParsingNode.hash?urlParsingNode.hash.replace(/^#/,""):"",hostname:urlParsingNode.hostname,port:urlParsingNode.port,pathname:"/"===urlParsingNode.pathname.charAt(0)?urlParsingNode.pathname:"/"+urlParsingNode.pathname}}return originURL=resolveURL(window.location.href),function isURLSameOrigin(requestURL){var parsed=utils.isString(requestURL)?resolveURL(requestURL):requestURL;return parsed.protocol===originURL.protocol&&parsed.host===originURL.host}}():function isURLSameOrigin(){return!0};function Cancel(message){this.message=message}Cancel.prototype.toString=function toString(){return"Cancel"+(this.message?": "+this.message:"")},Cancel.prototype.__CANCEL__=!0;var Cancel_1=Cancel,xhr=function xhrAdapter(config){return new Promise((function dispatchXhrRequest(resolve,reject){var onCanceled,requestData=config.data,requestHeaders=config.headers,responseType=config.responseType;function done(){config.cancelToken&&config.cancelToken.unsubscribe(onCanceled),config.signal&&config.signal.removeEventListener("abort",onCanceled)}utils.isFormData(requestData)&&delete requestHeaders["Content-Type"];var request=new XMLHttpRequest;if(config.auth){var username=config.auth.username||"",password=config.auth.password?unescape(encodeURIComponent(config.auth.password)):"";requestHeaders.Authorization="Basic "+btoa(username+":"+password)}var fullPath=function buildFullPath(baseURL,requestedURL){return baseURL&&!function isAbsoluteURL(url){return/^([a-z][a-z\d+\-.]*:)?\/\//i.test(url)}(requestedURL)?function combineURLs(baseURL,relativeURL){return relativeURL?baseURL.replace(/\/+$/,"")+"/"+relativeURL.replace(/^\/+/,""):baseURL}(baseURL,requestedURL):requestedURL}(config.baseURL,config.url);function onloadend(){if(request){var responseHeaders="getAllResponseHeaders"in request?function parseHeaders(headers){var key,val,i,parsed={};return headers?(utils.forEach(headers.split("\n"),(function parser(line){if(i=line.indexOf(":"),key=utils.trim(line.substr(0,i)).toLowerCase(),val=utils.trim(line.substr(i+1)),key){if(parsed[key]&&ignoreDuplicateOf.indexOf(key)>=0)return;parsed[key]="set-cookie"===key?(parsed[key]?parsed[key]:[]).concat([val]):parsed[key]?parsed[key]+", "+val:val}})),parsed):parsed}(request.getAllResponseHeaders()):null;!function settle(resolve,reject,response){var validateStatus=response.config.validateStatus;response.status&&validateStatus&&!validateStatus(response.status)?reject(createError("Request failed with status code "+response.status,response.config,null,response.request,response)):resolve(response)}((function _resolve(value){resolve(value),done()}),(function _reject(err){reject(err),done()}),{data:responseType&&"text"!==responseType&&"json"!==responseType?request.response:request.responseText,status:request.status,statusText:request.statusText,headers:responseHeaders,config:config,request:request}),request=null}}if(request.open(config.method.toUpperCase(),buildURL(fullPath,config.params,config.paramsSerializer),!0),request.timeout=config.timeout,"onloadend"in request?request.onloadend=onloadend:request.onreadystatechange=function handleLoad(){request&&4===request.readyState&&(0!==request.status||request.responseURL&&0===request.responseURL.indexOf("file:"))&&setTimeout(onloadend)},request.onabort=function handleAbort(){request&&(reject(createError("Request aborted",config,"ECONNABORTED",request)),request=null)},request.onerror=function handleError(){reject(createError("Network Error",config,null,request)),request=null},request.ontimeout=function handleTimeout(){var timeoutErrorMessage=config.timeout?"timeout of "+config.timeout+"ms exceeded":"timeout exceeded",transitional=config.transitional||defaults_1.transitional;config.timeoutErrorMessage&&(timeoutErrorMessage=config.timeoutErrorMessage),reject(createError(timeoutErrorMessage,config,transitional.clarifyTimeoutError?"ETIMEDOUT":"ECONNABORTED",request)),request=null},utils.isStandardBrowserEnv()){var xsrfValue=(config.withCredentials||isURLSameOrigin(fullPath))&&config.xsrfCookieName?cookies.read(config.xsrfCookieName):void 0;xsrfValue&&(requestHeaders[config.xsrfHeaderName]=xsrfValue)}"setRequestHeader"in request&&utils.forEach(requestHeaders,(function setRequestHeader(val,key){void 0===requestData&&"content-type"===key.toLowerCase()?delete requestHeaders[key]:request.setRequestHeader(key,val)})),utils.isUndefined(config.withCredentials)||(request.withCredentials=!!config.withCredentials),responseType&&"json"!==responseType&&(request.responseType=config.responseType),"function"==typeof config.onDownloadProgress&&request.addEventListener("progress",config.onDownloadProgress),"function"==typeof config.onUploadProgress&&request.upload&&request.upload.addEventListener("progress",config.onUploadProgress),(config.cancelToken||config.signal)&&(onCanceled=function onCanceled(cancel){request&&(reject(!cancel||cancel&&cancel.type?new Cancel_1("canceled"):cancel),request.abort(),request=null)},config.cancelToken&&config.cancelToken.subscribe(onCanceled),config.signal&&(config.signal.aborted?onCanceled():config.signal.addEventListener("abort",onCanceled))),requestData||(requestData=null),request.send(requestData)}))},DEFAULT_CONTENT_TYPE={"Content-Type":"application/x-www-form-urlencoded"};function setContentTypeIfUnset(headers,value){!utils.isUndefined(headers)&&utils.isUndefined(headers["Content-Type"])&&(headers["Content-Type"]=value)}var defaults={transitional:{silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1},adapter:function getDefaultAdapter(){var adapter;return("undefined"!=typeof XMLHttpRequest||void 0!==_index_2b1938ea_js__WEBPACK_IMPORTED_MODULE_38__.f&&"[object process]"===Object.prototype.toString.call(_index_2b1938ea_js__WEBPACK_IMPORTED_MODULE_38__.f))&&(adapter=xhr),adapter}(),transformRequest:[function transformRequest(data,headers){return normalizeHeaderName(headers,"Accept"),normalizeHeaderName(headers,"Content-Type"),utils.isFormData(data)||utils.isArrayBuffer(data)||utils.isBuffer(data)||utils.isStream(data)||utils.isFile(data)||utils.isBlob(data)?data:utils.isArrayBufferView(data)?data.buffer:utils.isURLSearchParams(data)?(setContentTypeIfUnset(headers,"application/x-www-form-urlencoded;charset=utf-8"),data.toString()):utils.isObject(data)||headers&&"application/json"===headers["Content-Type"]?(setContentTypeIfUnset(headers,"application/json"),function stringifySafely(rawValue,parser,encoder){if(utils.isString(rawValue))try{return(parser||JSON.parse)(rawValue),utils.trim(rawValue)}catch(e){if("SyntaxError"!==e.name)throw e}return(encoder||JSON.stringify)(rawValue)}(data)):data}],transformResponse:[function transformResponse(data){var transitional=this.transitional||defaults.transitional,silentJSONParsing=transitional&&transitional.silentJSONParsing,forcedJSONParsing=transitional&&transitional.forcedJSONParsing,strictJSONParsing=!silentJSONParsing&&"json"===this.responseType;if(strictJSONParsing||forcedJSONParsing&&utils.isString(data)&&data.length)try{return JSON.parse(data)}catch(e){if(strictJSONParsing){if("SyntaxError"===e.name)throw enhanceError(e,this,"E_JSON_PARSE");throw e}}return data}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,validateStatus:function validateStatus(status){return status>=200&&status<300},headers:{common:{Accept:"application/json, text/plain, */*"}}};utils.forEach(["delete","get","head"],(function forEachMethodNoData(method){defaults.headers[method]={}})),utils.forEach(["post","put","patch"],(function forEachMethodWithData(method){defaults.headers[method]=utils.merge(DEFAULT_CONTENT_TYPE)}));var defaults_1=defaults,transformData=function transformData(data,headers,fns){var context=this||defaults_1;return utils.forEach(fns,(function transform(fn){data=fn.call(context,data,headers)})),data},isCancel=function isCancel(value){return!(!value||!value.__CANCEL__)};function throwIfCancellationRequested(config){if(config.cancelToken&&config.cancelToken.throwIfRequested(),config.signal&&config.signal.aborted)throw new Cancel_1("canceled")}var dispatchRequest=function dispatchRequest(config){return throwIfCancellationRequested(config),config.headers=config.headers||{},config.data=transformData.call(config,config.data,config.headers,config.transformRequest),config.headers=utils.merge(config.headers.common||{},config.headers[config.method]||{},config.headers),utils.forEach(["delete","get","head","post","put","patch","common"],(function cleanHeaderConfig(method){delete config.headers[method]})),(config.adapter||defaults_1.adapter)(config).then((function onAdapterResolution(response){return throwIfCancellationRequested(config),response.data=transformData.call(config,response.data,response.headers,config.transformResponse),response}),(function onAdapterRejection(reason){return isCancel(reason)||(throwIfCancellationRequested(config),reason&&reason.response&&(reason.response.data=transformData.call(config,reason.response.data,reason.response.headers,config.transformResponse))),Promise.reject(reason)}))},mergeConfig=function mergeConfig(config1,config2){config2=config2||{};var config={};function getMergedValue(target,source){return utils.isPlainObject(target)&&utils.isPlainObject(source)?utils.merge(target,source):utils.isPlainObject(source)?utils.merge({},source):utils.isArray(source)?source.slice():source}function mergeDeepProperties(prop){return utils.isUndefined(config2[prop])?utils.isUndefined(config1[prop])?void 0:getMergedValue(void 0,config1[prop]):getMergedValue(config1[prop],config2[prop])}function valueFromConfig2(prop){if(!utils.isUndefined(config2[prop]))return getMergedValue(void 0,config2[prop])}function defaultToConfig2(prop){return utils.isUndefined(config2[prop])?utils.isUndefined(config1[prop])?void 0:getMergedValue(void 0,config1[prop]):getMergedValue(void 0,config2[prop])}function mergeDirectKeys(prop){return prop in config2?getMergedValue(config1[prop],config2[prop]):prop in config1?getMergedValue(void 0,config1[prop]):void 0}var mergeMap={url:valueFromConfig2,method:valueFromConfig2,data:valueFromConfig2,baseURL:defaultToConfig2,transformRequest:defaultToConfig2,transformResponse:defaultToConfig2,paramsSerializer:defaultToConfig2,timeout:defaultToConfig2,timeoutMessage:defaultToConfig2,withCredentials:defaultToConfig2,adapter:defaultToConfig2,responseType:defaultToConfig2,xsrfCookieName:defaultToConfig2,xsrfHeaderName:defaultToConfig2,onUploadProgress:defaultToConfig2,onDownloadProgress:defaultToConfig2,decompress:defaultToConfig2,maxContentLength:defaultToConfig2,maxBodyLength:defaultToConfig2,transport:defaultToConfig2,httpAgent:defaultToConfig2,httpsAgent:defaultToConfig2,cancelToken:defaultToConfig2,socketPath:defaultToConfig2,responseEncoding:defaultToConfig2,validateStatus:mergeDirectKeys};return utils.forEach(Object.keys(config1).concat(Object.keys(config2)),(function computeConfigValue(prop){var merge=mergeMap[prop]||mergeDeepProperties,configValue=merge(prop);utils.isUndefined(configValue)&&merge!==mergeDirectKeys||(config[prop]=configValue)})),config},data_version="0.25.0",VERSION=data_version,validators$1={};["object","boolean","number","function","string","symbol"].forEach((function(type,i){validators$1[type]=function validator(thing){return typeof thing===type||"a"+(i<1?"n ":" ")+type}}));var deprecatedWarnings={};validators$1.transitional=function transitional(validator,version,message){function formatMessage(opt,desc){return"[Axios v"+VERSION+"] Transitional option '"+opt+"'"+desc+(message?". "+message:"")}return function(value,opt,opts){if(!1===validator)throw new Error(formatMessage(opt," has been removed"+(version?" in "+version:"")));return version&&!deprecatedWarnings[opt]&&(deprecatedWarnings[opt]=!0,console.warn(formatMessage(opt," has been deprecated since v"+version+" and will be removed in the near future"))),!validator||validator(value,opt,opts)}};var validator={assertOptions:function assertOptions(options,schema,allowUnknown){if("object"!=typeof options)throw new TypeError("options must be an object");for(var keys=Object.keys(options),i=keys.length;i-- >0;){var opt=keys[i],validator=schema[opt];if(validator){var value=options[opt],result=void 0===value||validator(value,opt,options);if(!0!==result)throw new TypeError("option "+opt+" must be "+result)}else if(!0!==allowUnknown)throw Error("Unknown option "+opt)}},validators:validators$1},validators=validator.validators;function Axios(instanceConfig){this.defaults=instanceConfig,this.interceptors={request:new InterceptorManager_1,response:new InterceptorManager_1}}Axios.prototype.request=function request(configOrUrl,config){if("string"==typeof configOrUrl?(config=config||{}).url=configOrUrl:config=configOrUrl||{},!config.url)throw new Error("Provided config url is not valid");(config=mergeConfig(this.defaults,config)).method?config.method=config.method.toLowerCase():this.defaults.method?config.method=this.defaults.method.toLowerCase():config.method="get";var transitional=config.transitional;void 0!==transitional&&validator.assertOptions(transitional,{silentJSONParsing:validators.transitional(validators.boolean),forcedJSONParsing:validators.transitional(validators.boolean),clarifyTimeoutError:validators.transitional(validators.boolean)},!1);var requestInterceptorChain=[],synchronousRequestInterceptors=!0;this.interceptors.request.forEach((function unshiftRequestInterceptors(interceptor){"function"==typeof interceptor.runWhen&&!1===interceptor.runWhen(config)||(synchronousRequestInterceptors=synchronousRequestInterceptors&&interceptor.synchronous,requestInterceptorChain.unshift(interceptor.fulfilled,interceptor.rejected))}));var promise,responseInterceptorChain=[];if(this.interceptors.response.forEach((function pushResponseInterceptors(interceptor){responseInterceptorChain.push(interceptor.fulfilled,interceptor.rejected)})),!synchronousRequestInterceptors){var chain=[dispatchRequest,void 0];for(Array.prototype.unshift.apply(chain,requestInterceptorChain),chain=chain.concat(responseInterceptorChain),promise=Promise.resolve(config);chain.length;)promise=promise.then(chain.shift(),chain.shift());return promise}for(var newConfig=config;requestInterceptorChain.length;){var onFulfilled=requestInterceptorChain.shift(),onRejected=requestInterceptorChain.shift();try{newConfig=onFulfilled(newConfig)}catch(error){onRejected(error);break}}try{promise=dispatchRequest(newConfig)}catch(error){return Promise.reject(error)}for(;responseInterceptorChain.length;)promise=promise.then(responseInterceptorChain.shift(),responseInterceptorChain.shift());return promise},Axios.prototype.getUri=function getUri(config){if(!config.url)throw new Error("Provided config url is not valid");return config=mergeConfig(this.defaults,config),buildURL(config.url,config.params,config.paramsSerializer).replace(/^\?/,"")},utils.forEach(["delete","get","head","options"],(function forEachMethodNoData(method){Axios.prototype[method]=function(url,config){return this.request(mergeConfig(config||{},{method:method,url:url,data:(config||{}).data}))}})),utils.forEach(["post","put","patch"],(function forEachMethodWithData(method){Axios.prototype[method]=function(url,data,config){return this.request(mergeConfig(config||{},{method:method,url:url,data:data}))}}));var Axios_1=Axios;function CancelToken(executor){if("function"!=typeof executor)throw new TypeError("executor must be a function.");var resolvePromise;this.promise=new Promise((function promiseExecutor(resolve){resolvePromise=resolve}));var token=this;this.promise.then((function(cancel){if(token._listeners){var i,l=token._listeners.length;for(i=0;i<l;i++)token._listeners[i](cancel);token._listeners=null}})),this.promise.then=function(onfulfilled){var _resolve,promise=new Promise((function(resolve){token.subscribe(resolve),_resolve=resolve})).then(onfulfilled);return promise.cancel=function reject(){token.unsubscribe(_resolve)},promise},executor((function cancel(message){token.reason||(token.reason=new Cancel_1(message),resolvePromise(token.reason))}))}CancelToken.prototype.throwIfRequested=function throwIfRequested(){if(this.reason)throw this.reason},CancelToken.prototype.subscribe=function subscribe(listener){this.reason?listener(this.reason):this._listeners?this._listeners.push(listener):this._listeners=[listener]},CancelToken.prototype.unsubscribe=function unsubscribe(listener){if(this._listeners){var index=this._listeners.indexOf(listener);-1!==index&&this._listeners.splice(index,1)}},CancelToken.source=function source(){var cancel;return{token:new CancelToken((function executor(c){cancel=c})),cancel:cancel}};var CancelToken_1=CancelToken;var axios$1=function createInstance(defaultConfig){var context=new Axios_1(defaultConfig),instance=bind(Axios_1.prototype.request,context);return utils.extend(instance,Axios_1.prototype,context),utils.extend(instance,context),instance.create=function create(instanceConfig){return createInstance(mergeConfig(defaultConfig,instanceConfig))},instance}(defaults_1);axios$1.Axios=Axios_1,axios$1.Cancel=Cancel_1,axios$1.CancelToken=CancelToken_1,axios$1.isCancel=isCancel,axios$1.VERSION=data_version,axios$1.all=function all(promises){return Promise.all(promises)},axios$1.spread=function spread(callback){return function wrap(arr){return callback.apply(null,arr)}},axios$1.isAxiosError=function isAxiosError(payload){return utils.isObject(payload)&&!0===payload.isAxiosError};var axios_1=axios$1,_default=axios$1;axios_1.default=_default;var axios=axios_1,requestLogger=function requestLogger(r){return console.debug("[JS-SDK] ".concat(r.method.toUpperCase()," ").concat(r.baseURL).concat(r.url),r.data?JSON.stringify(r.data):""),r},VerdocsEndpoint=function(){function VerdocsEndpoint(){this.requestLoggerId=null,this.api=axios.create({baseURL:"https://api.verdocs.com",timeout:3e3})}return VerdocsEndpoint.prototype.setTimeout=function(timeout){return this.api.defaults.timeout=timeout,this},VerdocsEndpoint.prototype.setClientID=function(clientID){return this.api.defaults.headers.common["X-Client-ID"]=clientID,this},VerdocsEndpoint.prototype.setAuthorization=function(accessToken){return accessToken?this.api.defaults.headers.common.Authorization="Bearer ".concat(accessToken):delete this.api.defaults.headers.common.Authorization,this},VerdocsEndpoint.prototype.setSigningAuthorization=function(accessToken){return accessToken?this.api.defaults.headers.common.signer="Bearer ".concat(accessToken):delete this.api.defaults.headers.common.signer,this},VerdocsEndpoint.prototype.setBaseURL=function(url){return this.api.defaults.baseURL=url,this},VerdocsEndpoint.prototype.logRequests=function(enable){return enable&&null===this.requestLoggerId?this.requestLoggerId=this.api.interceptors.request.use(requestLogger):enable||null===this.requestLoggerId||this.api.interceptors.request.eject(this.requestLoggerId),this},VerdocsEndpoint}(),ENDPOINT_KEY=Symbol.for("verdocs-api-endpoint");globalThis_1[ENDPOINT_KEY]||(globalThis_1[ENDPOINT_KEY]=new VerdocsEndpoint);var globalEndpoint=globalThis_1[ENDPOINT_KEY],activeEndpoint=globalEndpoint,getEndpoint=function getEndpoint(){return activeEndpoint},setActiveEndpoint=function setActiveEndpoint(e){activeEndpoint=e||globalEndpoint},b64="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",b64re=/^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/,decodeTokenBody=function decodeTokenBody(token){return JSON.parse(function AtoB(str){if(str=String(str).replace(/[\t\n\f\r ]+/g,""),!b64re.test(str))throw new TypeError("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");var bitmap;str+="==".slice(2-(3&str.length));for(var r1,r2,result="",i=0;i<str.length;)bitmap=b64.indexOf(str.charAt(i++))<<18|b64.indexOf(str.charAt(i++))<<12|(r1=b64.indexOf(str.charAt(i++)))<<6|(r2=b64.indexOf(str.charAt(i++))),result+=64===r1?String.fromCharCode(bitmap>>16&255):64===r2?String.fromCharCode(bitmap>>16&255,bitmap>>8&255):String.fromCharCode(bitmap>>16&255,bitmap>>8&255,255&bitmap);return result}((token||"").split(".")[1]||""))},decodeAccessTokenBody=function decodeAccessTokenBody(token){var decoded;try{if(null===(decoded=decodeTokenBody(token)))return null}catch(e){return null}return Object.keys(decoded).forEach((function(key){"string"==typeof key&&key.startsWith("https://verdocs.com/")&&(decoded[key.replace("https://verdocs.com/","")]=decoded[key],delete decoded[key])})),decoded}},"./dist/esm/index-2b1938ea.js":function(module,__webpack_exports__,__webpack_require__){"use strict";(function(global){__webpack_require__.d(__webpack_exports__,"a",(function(){return getDefaultExportFromCjs})),__webpack_require__.d(__webpack_exports__,"b",(function(){return commonjsGlobal})),__webpack_require__.d(__webpack_exports__,"c",(function(){return createCommonjsModule})),__webpack_require__.d(__webpack_exports__,"d",(function(){return commonjsRequire})),__webpack_require__.d(__webpack_exports__,"e",(function(){return getAugmentedNamespace})),__webpack_require__.d(__webpack_exports__,"f",(function(){return process_1}));__webpack_require__("./node_modules/core-js/modules/es.global-this.js"),__webpack_require__("./node_modules/core-js/modules/es.object.define-property.js"),__webpack_require__("./node_modules/core-js/modules/es.array.for-each.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"),__webpack_require__("./node_modules/core-js/modules/es.object.keys.js"),__webpack_require__("./node_modules/core-js/modules/es.object.get-own-property-descriptor.js");var commonjsGlobal="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:void 0!==global?global:"undefined"!=typeof self?self:{};function getDefaultExportFromCjs(x){return x&&x.__esModule&&Object.prototype.hasOwnProperty.call(x,"default")?x.default:x}function createCommonjsModule(fn,basedir,module){return fn(module={path:basedir,exports:{},require:function require(path,base){return commonjsRequire()}},module.exports),module.exports}function getAugmentedNamespace(n){if(n.__esModule)return n;var a=Object.defineProperty({},"__esModule",{value:!0});return Object.keys(n).forEach((function(k){var d=Object.getOwnPropertyDescriptor(n,k);Object.defineProperty(a,k,d.get?d:{enumerable:!0,get:function get(){return n[k]}})})),a}function commonjsRequire(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}var process_1=commonjsGlobal.process}).call(this,__webpack_require__("./node_modules/@storybook/builder-webpack4/node_modules/webpack/buildin/global.js"))}}]);