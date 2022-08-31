/*! For license information please see 27.3d64c5cd.iframe.bundle.js.LICENSE.txt */
(window.webpackJsonp=window.webpackJsonp||[]).push([[27],{"./dist/esm/verdocs-field-signature.entry.js":function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,"verdocs_field_signature",(function(){return VerdocsFieldSignature}));__webpack_require__("./node_modules/core-js/modules/es.promise.js"),__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.object.define-property.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.async-iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.to-string-tag.js"),__webpack_require__("./node_modules/core-js/modules/es.math.to-string-tag.js"),__webpack_require__("./node_modules/core-js/modules/es.json.to-string-tag.js"),__webpack_require__("./node_modules/core-js/modules/es.object.create.js"),__webpack_require__("./node_modules/core-js/modules/es.object.get-prototype-of.js"),__webpack_require__("./node_modules/core-js/modules/es.array.for-each.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"),__webpack_require__("./node_modules/core-js/modules/es.function.name.js"),__webpack_require__("./node_modules/core-js/modules/es.object.set-prototype-of.js"),__webpack_require__("./node_modules/core-js/modules/es.array.reverse.js"),__webpack_require__("./node_modules/core-js/modules/es.array.slice.js");var _index_5d92e60f_js__WEBPACK_IMPORTED_MODULE_21__=__webpack_require__("./dist/esm/index-5d92e60f.js");function _regeneratorRuntime(){_regeneratorRuntime=function _regeneratorRuntime(){return exports};var exports={},Op=Object.prototype,hasOwn=Op.hasOwnProperty,$Symbol="function"==typeof Symbol?Symbol:{},iteratorSymbol=$Symbol.iterator||"@@iterator",asyncIteratorSymbol=$Symbol.asyncIterator||"@@asyncIterator",toStringTagSymbol=$Symbol.toStringTag||"@@toStringTag";function define(obj,key,value){return Object.defineProperty(obj,key,{value:value,enumerable:!0,configurable:!0,writable:!0}),obj[key]}try{define({},"")}catch(err){define=function define(obj,key,value){return obj[key]=value}}function wrap(innerFn,outerFn,self,tryLocsList){var protoGenerator=outerFn&&outerFn.prototype instanceof Generator?outerFn:Generator,generator=Object.create(protoGenerator.prototype),context=new Context(tryLocsList||[]);return generator._invoke=function(innerFn,self,context){var state="suspendedStart";return function(method,arg){if("executing"===state)throw new Error("Generator is already running");if("completed"===state){if("throw"===method)throw arg;return doneResult()}for(context.method=method,context.arg=arg;;){var delegate=context.delegate;if(delegate){var delegateResult=maybeInvokeDelegate(delegate,context);if(delegateResult){if(delegateResult===ContinueSentinel)continue;return delegateResult}}if("next"===context.method)context.sent=context._sent=context.arg;else if("throw"===context.method){if("suspendedStart"===state)throw state="completed",context.arg;context.dispatchException(context.arg)}else"return"===context.method&&context.abrupt("return",context.arg);state="executing";var record=tryCatch(innerFn,self,context);if("normal"===record.type){if(state=context.done?"completed":"suspendedYield",record.arg===ContinueSentinel)continue;return{value:record.arg,done:context.done}}"throw"===record.type&&(state="completed",context.method="throw",context.arg=record.arg)}}}(innerFn,self,context),generator}function tryCatch(fn,obj,arg){try{return{type:"normal",arg:fn.call(obj,arg)}}catch(err){return{type:"throw",arg:err}}}exports.wrap=wrap;var ContinueSentinel={};function Generator(){}function GeneratorFunction(){}function GeneratorFunctionPrototype(){}var IteratorPrototype={};define(IteratorPrototype,iteratorSymbol,(function(){return this}));var getProto=Object.getPrototypeOf,NativeIteratorPrototype=getProto&&getProto(getProto(values([])));NativeIteratorPrototype&&NativeIteratorPrototype!==Op&&hasOwn.call(NativeIteratorPrototype,iteratorSymbol)&&(IteratorPrototype=NativeIteratorPrototype);var Gp=GeneratorFunctionPrototype.prototype=Generator.prototype=Object.create(IteratorPrototype);function defineIteratorMethods(prototype){["next","throw","return"].forEach((function(method){define(prototype,method,(function(arg){return this._invoke(method,arg)}))}))}function AsyncIterator(generator,PromiseImpl){function invoke(method,arg,resolve,reject){var record=tryCatch(generator[method],generator,arg);if("throw"!==record.type){var result=record.arg,value=result.value;return value&&"object"==typeof value&&hasOwn.call(value,"__await")?PromiseImpl.resolve(value.__await).then((function(value){invoke("next",value,resolve,reject)}),(function(err){invoke("throw",err,resolve,reject)})):PromiseImpl.resolve(value).then((function(unwrapped){result.value=unwrapped,resolve(result)}),(function(error){return invoke("throw",error,resolve,reject)}))}reject(record.arg)}var previousPromise;this._invoke=function(method,arg){function callInvokeWithMethodAndArg(){return new PromiseImpl((function(resolve,reject){invoke(method,arg,resolve,reject)}))}return previousPromise=previousPromise?previousPromise.then(callInvokeWithMethodAndArg,callInvokeWithMethodAndArg):callInvokeWithMethodAndArg()}}function maybeInvokeDelegate(delegate,context){var method=delegate.iterator[context.method];if(void 0===method){if(context.delegate=null,"throw"===context.method){if(delegate.iterator.return&&(context.method="return",context.arg=void 0,maybeInvokeDelegate(delegate,context),"throw"===context.method))return ContinueSentinel;context.method="throw",context.arg=new TypeError("The iterator does not provide a 'throw' method")}return ContinueSentinel}var record=tryCatch(method,delegate.iterator,context.arg);if("throw"===record.type)return context.method="throw",context.arg=record.arg,context.delegate=null,ContinueSentinel;var info=record.arg;return info?info.done?(context[delegate.resultName]=info.value,context.next=delegate.nextLoc,"return"!==context.method&&(context.method="next",context.arg=void 0),context.delegate=null,ContinueSentinel):info:(context.method="throw",context.arg=new TypeError("iterator result is not an object"),context.delegate=null,ContinueSentinel)}function pushTryEntry(locs){var entry={tryLoc:locs[0]};1 in locs&&(entry.catchLoc=locs[1]),2 in locs&&(entry.finallyLoc=locs[2],entry.afterLoc=locs[3]),this.tryEntries.push(entry)}function resetTryEntry(entry){var record=entry.completion||{};record.type="normal",delete record.arg,entry.completion=record}function Context(tryLocsList){this.tryEntries=[{tryLoc:"root"}],tryLocsList.forEach(pushTryEntry,this),this.reset(!0)}function values(iterable){if(iterable){var iteratorMethod=iterable[iteratorSymbol];if(iteratorMethod)return iteratorMethod.call(iterable);if("function"==typeof iterable.next)return iterable;if(!isNaN(iterable.length)){var i=-1,next=function next(){for(;++i<iterable.length;)if(hasOwn.call(iterable,i))return next.value=iterable[i],next.done=!1,next;return next.value=void 0,next.done=!0,next};return next.next=next}}return{next:doneResult}}function doneResult(){return{value:void 0,done:!0}}return GeneratorFunction.prototype=GeneratorFunctionPrototype,define(Gp,"constructor",GeneratorFunctionPrototype),define(GeneratorFunctionPrototype,"constructor",GeneratorFunction),GeneratorFunction.displayName=define(GeneratorFunctionPrototype,toStringTagSymbol,"GeneratorFunction"),exports.isGeneratorFunction=function(genFun){var ctor="function"==typeof genFun&&genFun.constructor;return!!ctor&&(ctor===GeneratorFunction||"GeneratorFunction"===(ctor.displayName||ctor.name))},exports.mark=function(genFun){return Object.setPrototypeOf?Object.setPrototypeOf(genFun,GeneratorFunctionPrototype):(genFun.__proto__=GeneratorFunctionPrototype,define(genFun,toStringTagSymbol,"GeneratorFunction")),genFun.prototype=Object.create(Gp),genFun},exports.awrap=function(arg){return{__await:arg}},defineIteratorMethods(AsyncIterator.prototype),define(AsyncIterator.prototype,asyncIteratorSymbol,(function(){return this})),exports.AsyncIterator=AsyncIterator,exports.async=function(innerFn,outerFn,self,tryLocsList,PromiseImpl){void 0===PromiseImpl&&(PromiseImpl=Promise);var iter=new AsyncIterator(wrap(innerFn,outerFn,self,tryLocsList),PromiseImpl);return exports.isGeneratorFunction(outerFn)?iter:iter.next().then((function(result){return result.done?result.value:iter.next()}))},defineIteratorMethods(Gp),define(Gp,toStringTagSymbol,"Generator"),define(Gp,iteratorSymbol,(function(){return this})),define(Gp,"toString",(function(){return"[object Generator]"})),exports.keys=function(object){var keys=[];for(var key in object)keys.push(key);return keys.reverse(),function next(){for(;keys.length;){var key=keys.pop();if(key in object)return next.value=key,next.done=!1,next}return next.done=!0,next}},exports.values=values,Context.prototype={constructor:Context,reset:function reset(skipTempReset){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(resetTryEntry),!skipTempReset)for(var name in this)"t"===name.charAt(0)&&hasOwn.call(this,name)&&!isNaN(+name.slice(1))&&(this[name]=void 0)},stop:function stop(){this.done=!0;var rootRecord=this.tryEntries[0].completion;if("throw"===rootRecord.type)throw rootRecord.arg;return this.rval},dispatchException:function dispatchException(exception){if(this.done)throw exception;var context=this;function handle(loc,caught){return record.type="throw",record.arg=exception,context.next=loc,caught&&(context.method="next",context.arg=void 0),!!caught}for(var i=this.tryEntries.length-1;i>=0;--i){var entry=this.tryEntries[i],record=entry.completion;if("root"===entry.tryLoc)return handle("end");if(entry.tryLoc<=this.prev){var hasCatch=hasOwn.call(entry,"catchLoc"),hasFinally=hasOwn.call(entry,"finallyLoc");if(hasCatch&&hasFinally){if(this.prev<entry.catchLoc)return handle(entry.catchLoc,!0);if(this.prev<entry.finallyLoc)return handle(entry.finallyLoc)}else if(hasCatch){if(this.prev<entry.catchLoc)return handle(entry.catchLoc,!0)}else{if(!hasFinally)throw new Error("try statement without catch or finally");if(this.prev<entry.finallyLoc)return handle(entry.finallyLoc)}}}},abrupt:function abrupt(type,arg){for(var i=this.tryEntries.length-1;i>=0;--i){var entry=this.tryEntries[i];if(entry.tryLoc<=this.prev&&hasOwn.call(entry,"finallyLoc")&&this.prev<entry.finallyLoc){var finallyEntry=entry;break}}finallyEntry&&("break"===type||"continue"===type)&&finallyEntry.tryLoc<=arg&&arg<=finallyEntry.finallyLoc&&(finallyEntry=null);var record=finallyEntry?finallyEntry.completion:{};return record.type=type,record.arg=arg,finallyEntry?(this.method="next",this.next=finallyEntry.finallyLoc,ContinueSentinel):this.complete(record)},complete:function complete(record,afterLoc){if("throw"===record.type)throw record.arg;return"break"===record.type||"continue"===record.type?this.next=record.arg:"return"===record.type?(this.rval=this.arg=record.arg,this.method="return",this.next="end"):"normal"===record.type&&afterLoc&&(this.next=afterLoc),ContinueSentinel},finish:function finish(finallyLoc){for(var i=this.tryEntries.length-1;i>=0;--i){var entry=this.tryEntries[i];if(entry.finallyLoc===finallyLoc)return this.complete(entry.completion,entry.afterLoc),resetTryEntry(entry),ContinueSentinel}},catch:function _catch(tryLoc){for(var i=this.tryEntries.length-1;i>=0;--i){var entry=this.tryEntries[i];if(entry.tryLoc===tryLoc){var record=entry.completion;if("throw"===record.type){var thrown=record.arg;resetTryEntry(entry)}return thrown}}throw new Error("illegal catch attempt")},delegateYield:function delegateYield(iterable,resultName,nextLoc){return this.delegate={iterator:values(iterable),resultName:resultName,nextLoc:nextLoc},"next"===this.method&&(this.arg=void 0),ContinueSentinel}},exports}function asyncGeneratorStep(gen,resolve,reject,_next,_throw,key,arg){try{var info=gen[key](arg),value=info.value}catch(error){return void reject(error)}info.done?resolve(value):Promise.resolve(value).then(_next,_throw)}function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}var VerdocsFieldSignature=function(){function VerdocsFieldSignature(hostRef){!function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}(this,VerdocsFieldSignature),Object(_index_5d92e60f_js__WEBPACK_IMPORTED_MODULE_21__.h)(this,hostRef),this.fieldChange=Object(_index_5d92e60f_js__WEBPACK_IMPORTED_MODULE_21__.d)(this,"fieldChange",7),this.tempSignature="",this.settings={x:0,y:0},this.fullName=""}var _focusField;return function _createClass(Constructor,protoProps,staticProps){return protoProps&&_defineProperties(Constructor.prototype,protoProps),staticProps&&_defineProperties(Constructor,staticProps),Object.defineProperty(Constructor,"prototype",{writable:!1}),Constructor}(VerdocsFieldSignature,[{key:"focusField",value:(_focusField=function _asyncToGenerator(fn){return function(){var self=this,args=arguments;return new Promise((function(resolve,reject){var gen=fn.apply(self,args);function _next(value){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"next",value)}function _throw(err){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"throw",err)}_next(void 0)}))}}(_regeneratorRuntime().mark((function _callee(){return _regeneratorRuntime().wrap((function _callee$(_context){for(;;)switch(_context.prev=_context.next){case 0:this.handleShow(),console.log("focused",this);case 2:case"end":return _context.stop()}}),_callee,this)}))),function focusField(){return _focusField.apply(this,arguments)})},{key:"componentWillLoad",value:function componentWillLoad(){var _a,_b;(null===(_a=this.field)||void 0===_a?void 0:_a.settings)&&(this.settings=this.field.settings),(null===(_b=this.recipient)||void 0===_b?void 0:_b.full_name)&&(this.fullName=this.recipient.full_name),console.log({settings:this.settings,fullName:this.fullName})}},{key:"hideDialog",value:function hideDialog(){var _a;null===(_a=this.dialog)||void 0===_a||_a.remove(),this.dialog=null}},{key:"handleAdopt",value:function handleAdopt(e){console.log("[SIGNATURE] Adopted signature"),this.tempSignature=e.detail,this.hideDialog()}},{key:"handleShow",value:function handleShow(){var _this=this;this.dialog=document.createElement("verdocs-signature-dialog"),this.dialog.open=!0,this.dialog.fullName=this.fullName,this.dialog.addEventListener("cancel",(function(){return _this.hideDialog()})),this.dialog.addEventListener("adopt",(function(e){return _this.handleAdopt(e)})),document.body.append(this.dialog)}},{key:"render",value:function render(){var _a,_this2=this,_this$settings$base=this.settings.base64,base64=void 0===_this$settings$base?"":_this$settings$base;return Object(_index_5d92e60f_js__WEBPACK_IMPORTED_MODULE_21__.f)(_index_5d92e60f_js__WEBPACK_IMPORTED_MODULE_21__.b,{class:{required:null===(_a=this.field)||void 0===_a?void 0:_a.required}},""!==this.tempSignature||""!==base64?Object(_index_5d92e60f_js__WEBPACK_IMPORTED_MODULE_21__.f)("img",{src:this.tempSignature||base64,alt:"Signature"}):Object(_index_5d92e60f_js__WEBPACK_IMPORTED_MODULE_21__.f)("button",{class:{},onClick:function onClick(){return _this2.handleShow()}},"Signature"))}}]),VerdocsFieldSignature}();VerdocsFieldSignature.style='verdocs-field-signature{font-family:"Inter", -apple-system, "Segoe UI", "Roboto", "Helvetica Neue", sans-serif;width:83px;height:36px;display:block;font-size:11px;position:relative;letter-spacing:0.3px;background-color:transparent;-webkit-transform-origin:bottom left;transform-origin:bottom left;border:1px solid rgba(0, 0, 0, 0.2)}verdocs-field-signature img{display:block;max-width:100%;max-height:100%}verdocs-field-signature button{-webkit-box-sizing:border-box;box-sizing:border-box;border:none;color:rgba(0, 0, 0, 0.87);font-weight:500;-webkit-transform-origin:0 0;transform-origin:0 0;height:100%;width:100%;background:none;font-size:11px}verdocs-field-signature button.hide{display:none}verdocs-field-signature.required{border:1px solid #cc0000}verdocs-field-signature.focused{-webkit-animation:verdocs-field-pulse 0.75s 2;animation:verdocs-field-pulse 0.75s 2}'}}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vc3JjL2NvbXBvbmVudHMvZWxlbWVudHMvdmVyZG9jcy1maWVsZC1zaWduYXR1cmUvdmVyZG9jcy1maWVsZC1zaWduYXR1cmUuc2NzcyIsIndlYnBhY2s6Ly8vc3JjL2NvbXBvbmVudHMvZWxlbWVudHMvdmVyZG9jcy1maWVsZC1zaWduYXR1cmUvdmVyZG9jcy1maWVsZC1zaWduYXR1cmUudHN4Il0sIm5hbWVzIjpbIlZlcmRvY3NGaWVsZFNpZ25hdHVyZSIsInRlbXBTaWduYXR1cmUiLCJzZXR0aW5ncyIsIngiLCJ5IiwiZnVsbE5hbWUiLCJ0aGlzIiwiaGFuZGxlU2hvdyIsImNvbnNvbGUiLCJsb2ciLCJjb21wb25lbnRXaWxsTG9hZCIsImZpZWxkIiwiX2EiLCJyZWNpcGllbnQiLCJfYiIsImZ1bGxfbmFtZSIsImhpZGVEaWFsb2ciLCJkaWFsb2ciLCJyZW1vdmUiLCJoYW5kbGVBZG9wdCIsImUiLCJkZXRhaWwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJvcGVuIiwiYWRkRXZlbnRMaXN0ZW5lciIsImJvZHkiLCJhcHBlbmQiLCJyZW5kZXIiLCJiYXNlNjQiLCJoIiwiSG9zdCIsImNsYXNzIiwicmVxdWlyZWQiLCJzcmMiLCJhbHQiLCJvbkNsaWNrIl0sIm1hcHBpbmdzIjoiOzBrWkFBQSxJQ2FhQSxzQkFBcUIsV0FMbEMseUMsOElBQUEsNkIsMktBMkJFLEtBQUFDLGNBQXdCLEdBR2hCLEtBQUFDLFNBQTBCLENBQUNDLEVBQUcsRUFBR0MsRUFBRyxHQUNwQyxLQUFBQyxTQUFtQixFQWlENUIsQ0EzRWlDLHVCLGtRQUFBLDZELHFWQUFBLDZCQWdCdEIsb0lBQ1JDLEtBQUtDLGFBQ0xDLFFBQVFDLElBQUksVUFBV0gsTUFGZiw2REFoQnNCLGlHQTRCaEMsU0FBQUksb0IsV0FDZ0IsUUFBVixHQUFBSixLQUFLSyxhQUFLQyxZQUFBLEVBQUFBLEdBQUVWLFlBQ2RJLEtBQUtKLFNBQVdJLEtBQUtLLE1BQU1ULFdBR1gsUUFBZCxHQUFBSSxLQUFLTyxpQkFBU0MsWUFBQSxFQUFBQSxHQUFFQyxhQUNsQlQsS0FBS0QsU0FBV0MsS0FBS08sVUFBVUUsV0FHakNQLFFBQVFDLElBQUksQ0FBQ1AsU0FBVUksS0FBS0osU0FBVUcsU0FBVUMsS0FBS0QsVUFDdEQsR0F0QytCLHdCQXdDaEMsU0FBQVcsYSxPQUNhLFFBQVgsR0FBQVYsS0FBS1csY0FBTUwsV0FBRU0sU0FDYlosS0FBS1csT0FBUyxJQUNmLEdBM0MrQix5QkE2Q2hDLFNBQUFFLFlBQVlDLEdBQ1ZaLFFBQVFDLElBQUksaUNBQ1pILEtBQUtMLGNBQWdCbUIsRUFBRUMsT0FDdkJmLEtBQUtVLFlBQ04sR0FqRCtCLHdCQW1EaEMsU0FBQVQsYUFBVSxlQUNSRCxLQUFLVyxPQUFTSyxTQUFTQyxjQUFjLDRCQUNyQ2pCLEtBQUtXLE9BQU9PLE1BQU8sRUFDbkJsQixLQUFLVyxPQUFPWixTQUFXQyxLQUFLRCxTQUM1QkMsS0FBS1csT0FBT1EsaUJBQWlCLFVBQVUsa0JBQU0sTUFBS1QsWUFBWCxJQUN2Q1YsS0FBS1csT0FBT1EsaUJBQWlCLFNBQVMsU0FBQUwsR0FBQyxPQUFJLE1BQUtELFlBQVlDLEVBQXJCLElBQ3ZDRSxTQUFTSSxLQUFLQyxPQUFPckIsS0FBS1csT0FDM0IsR0ExRCtCLG9CQTREaEMsU0FBQVcsU0FBTSxJLEdBQUEsWUFDSixvQkFBc0J0QixLQUFLSixTQUFwQjJCLG1CQUFQLHdCQUFnQixHQUFoQixvQkFFQSxPQUNFQywyREFBQ0MsbURBQUksQ0FBQ0MsTUFBTyxDQUFDQyxTQUFvQixRQUFWLEdBQUEzQixLQUFLSyxhQUFLQyxZQUFBLEVBQUFBLEdBQUVxQixXQUNWLEtBQXZCM0IsS0FBS0wsZUFBbUMsS0FBWDRCLE9BQzVCQyxrRUFBS0ksSUFBSzVCLEtBQUtMLGVBQWlCNEIsT0FBUU0sSUFBSSxjQUU1Q0wscUVBQVFFLE1BQU8sQ0FBQyxFQUFHSSxRQUFTLDBCQUFNLE9BQUs3QixZQUFYLEdBQXVCLGFBTTFELEtBMUUrQix5Qiw0QkRiRCx3MkIiLCJmaWxlIjoiMjcuM2Q2NGM1Y2QuaWZyYW1lLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgJy4uLy4uLy4uL3RoZW1lLnNjc3MnO1xuXG52ZXJkb2NzLWZpZWxkLXNpZ25hdHVyZSB7XG4gIGZvbnQtZmFtaWx5OiAkdmVyZG9jcy1wcmltYXJ5LWZvbnQ7XG4gIHdpZHRoOiA4M3B4O1xuICBoZWlnaHQ6IDM2cHg7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBmb250LXNpemU6IDExcHg7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgbGV0dGVyLXNwYWNpbmc6IDAuM3B4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgdHJhbnNmb3JtLW9yaWdpbjogYm90dG9tIGxlZnQ7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgMC4yKTtcblxuICBpbWcge1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIG1heC13aWR0aDogMTAwJTtcbiAgICBtYXgtaGVpZ2h0OiAxMDAlO1xuICB9XG5cbiAgYnV0dG9uIHtcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBjb2xvcjogcmdiYSgwLCAwLCAwLCAwLjg3KTtcbiAgICBmb250LXdlaWdodDogNTAwO1xuICAgIHRyYW5zZm9ybS1vcmlnaW46IDAgMDtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgYmFja2dyb3VuZDogbm9uZTtcbiAgICBmb250LXNpemU6IDExcHg7XG5cbiAgICAmLmhpZGUge1xuICAgICAgZGlzcGxheTogbm9uZTtcbiAgICB9XG4gIH1cblxuICAmLnJlcXVpcmVkIHtcbiAgICBib3JkZXI6IDFweCBzb2xpZCByZ2IoMjA0LCAwLCAwKTtcbiAgfVxuXG4gICYuZm9jdXNlZCB7XG4gICAgYW5pbWF0aW9uOiB2ZXJkb2NzLWZpZWxkLXB1bHNlIDAuNzVzIDI7XG4gIH1cbn1cbiIsImltcG9ydCB7SUZpZWxkU2V0dGluZ30gZnJvbSAnQHZlcmRvY3MvanMtc2RrL1RlbXBsYXRlcy9UeXBlcyc7XG5pbXBvcnQge0lEb2N1bWVudEZpZWxkLCBJUmVjaXBpZW50fSBmcm9tICdAdmVyZG9jcy9qcy1zZGsvRG9jdW1lbnRzL0RvY3VtZW50cyc7XG5pbXBvcnQge0NvbXBvbmVudCwgaCwgSG9zdCwgUHJvcCwgRXZlbnQsIEV2ZW50RW1pdHRlciwgTWV0aG9kLCBTdGF0ZX0gZnJvbSAnQHN0ZW5jaWwvY29yZSc7XG5cbi8qKlxuICogRGlzcGxheXMgYSBzaWduYXR1cmUgZmllbGQuIElmIGEgc2lnbmF0dXJlIGFscmVhZHkgZXhpc3RzLCBpdCB3aWxsIGJlIGRpc3BsYXllZCBhbmQgdGhlIGZpZWxkIHdpbGwgYmUgZGlzYWJsZWQuIE90aGVyd2lzZSwgYSBwbGFjZWhvbGRlclxuICogYnV0dG9uIHdpbGwgYmUgc2hvd24uIENsaWNraW5nIHRoZSBidXR0b24gd2lsbCBzaG93IGEgZGlhbG9nIHRvIGFkb3B0IGEgc2lnbmF0dXJlLlxuICovXG5AQ29tcG9uZW50KHtcbiAgdGFnOiAndmVyZG9jcy1maWVsZC1zaWduYXR1cmUnLFxuICBzdHlsZVVybDogJ3ZlcmRvY3MtZmllbGQtc2lnbmF0dXJlLnNjc3MnLFxuICBzaGFkb3c6IGZhbHNlLFxufSlcbmV4cG9ydCBjbGFzcyBWZXJkb2NzRmllbGRTaWduYXR1cmUge1xuICAvKipcbiAgICogU2V0cyB0aGUgZmllbGQgc291cmNlLlxuICAgKi9cbiAgQFByb3AoKSBmaWVsZDogSURvY3VtZW50RmllbGQ7XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHJlY2lwaWVudCAoc2lnbmVyKS5cbiAgICovXG4gIEBQcm9wKCkgcmVjaXBpZW50OiBJUmVjaXBpZW50O1xuXG4gIC8qKlxuICAgKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGZpZWxkIGhhcyBjaGFuZ2VkLlxuICAgKi9cbiAgQEV2ZW50KHtjb21wb3NlZDogdHJ1ZX0pIGZpZWxkQ2hhbmdlOiBFdmVudEVtaXR0ZXI8c3RyaW5nPjtcblxuICBATWV0aG9kKCkgYXN5bmMgZm9jdXNGaWVsZCgpIHtcbiAgICB0aGlzLmhhbmRsZVNob3coKTtcbiAgICBjb25zb2xlLmxvZygnZm9jdXNlZCcsIHRoaXMpO1xuICB9XG5cbiAgQFN0YXRlKClcbiAgdGVtcFNpZ25hdHVyZTogc3RyaW5nID0gJyc7XG5cbiAgcHJpdmF0ZSBkaWFsb2c/OiBhbnk7XG4gIHByaXZhdGUgc2V0dGluZ3M6IElGaWVsZFNldHRpbmcgPSB7eDogMCwgeTogMH07XG4gIHByaXZhdGUgZnVsbE5hbWU6IHN0cmluZyA9ICcnO1xuXG4gIGNvbXBvbmVudFdpbGxMb2FkKCkge1xuICAgIGlmICh0aGlzLmZpZWxkPy5zZXR0aW5ncykge1xuICAgICAgdGhpcy5zZXR0aW5ncyA9IHRoaXMuZmllbGQuc2V0dGluZ3M7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVjaXBpZW50Py5mdWxsX25hbWUpIHtcbiAgICAgIHRoaXMuZnVsbE5hbWUgPSB0aGlzLnJlY2lwaWVudC5mdWxsX25hbWU7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coe3NldHRpbmdzOiB0aGlzLnNldHRpbmdzLCBmdWxsTmFtZTogdGhpcy5mdWxsTmFtZX0pO1xuICB9XG5cbiAgaGlkZURpYWxvZygpIHtcbiAgICB0aGlzLmRpYWxvZz8ucmVtb3ZlKCk7XG4gICAgdGhpcy5kaWFsb2cgPSBudWxsO1xuICB9XG5cbiAgaGFuZGxlQWRvcHQoZTogYW55KSB7XG4gICAgY29uc29sZS5sb2coJ1tTSUdOQVRVUkVdIEFkb3B0ZWQgc2lnbmF0dXJlJyk7XG4gICAgdGhpcy50ZW1wU2lnbmF0dXJlID0gZS5kZXRhaWw7XG4gICAgdGhpcy5oaWRlRGlhbG9nKCk7XG4gIH1cblxuICBoYW5kbGVTaG93KCkge1xuICAgIHRoaXMuZGlhbG9nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmVyZG9jcy1zaWduYXR1cmUtZGlhbG9nJyk7XG4gICAgdGhpcy5kaWFsb2cub3BlbiA9IHRydWU7XG4gICAgdGhpcy5kaWFsb2cuZnVsbE5hbWUgPSB0aGlzLmZ1bGxOYW1lO1xuICAgIHRoaXMuZGlhbG9nLmFkZEV2ZW50TGlzdGVuZXIoJ2NhbmNlbCcsICgpID0+IHRoaXMuaGlkZURpYWxvZygpKTtcbiAgICB0aGlzLmRpYWxvZy5hZGRFdmVudExpc3RlbmVyKCdhZG9wdCcsIGUgPT4gdGhpcy5oYW5kbGVBZG9wdChlKSk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmQodGhpcy5kaWFsb2cpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtiYXNlNjQgPSAnJ30gPSB0aGlzLnNldHRpbmdzO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxIb3N0IGNsYXNzPXt7cmVxdWlyZWQ6IHRoaXMuZmllbGQ/LnJlcXVpcmVkfX0+XG4gICAgICAgIHt0aGlzLnRlbXBTaWduYXR1cmUgIT09ICcnIHx8IGJhc2U2NCAhPT0gJycgPyAoXG4gICAgICAgICAgPGltZyBzcmM9e3RoaXMudGVtcFNpZ25hdHVyZSB8fCBiYXNlNjR9IGFsdD1cIlNpZ25hdHVyZVwiIC8+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz17e319IG9uQ2xpY2s9eygpID0+IHRoaXMuaGFuZGxlU2hvdygpfT5cbiAgICAgICAgICAgIFNpZ25hdHVyZVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICApfVxuICAgICAgPC9Ib3N0PlxuICAgICk7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=