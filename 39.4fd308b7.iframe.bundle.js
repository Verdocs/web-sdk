(window.webpackJsonp=window.webpackJsonp||[]).push([[39],{"./dist/esm/verdocs-checkbox_4.entry.js":function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,"verdocs_checkbox",(function(){return VerdocsCheckbox})),__webpack_require__.d(__webpack_exports__,"verdocs_component_error",(function(){return VerdocsComponentError})),__webpack_require__.d(__webpack_exports__,"verdocs_help_icon",(function(){return VerdocsHelpIcon})),__webpack_require__.d(__webpack_exports__,"verdocs_text_input",(function(){return VerdocsTextInput}));__webpack_require__("./node_modules/core-js/modules/es.function.name.js"),__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.date.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js"),__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"),__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"),__webpack_require__("./node_modules/core-js/modules/es.object.define-property.js");var _index_b18c0348_js__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__("./dist/esm/index-b18c0348.js"),_popper_bfa25c7f_js__WEBPACK_IMPORTED_MODULE_11__=__webpack_require__("./dist/esm/popper-bfa25c7f.js");function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,(arg=descriptor.key,key=void 0,"symbol"==typeof(key=function _toPrimitive(input,hint){if("object"!=typeof input||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!=typeof res)return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string"))?key:String(key)),descriptor)}var arg,key}function _createClass(Constructor,protoProps,staticProps){return protoProps&&_defineProperties(Constructor.prototype,protoProps),staticProps&&_defineProperties(Constructor,staticProps),Object.defineProperty(Constructor,"prototype",{writable:!1}),Constructor}var VerdocsCheckbox=function(){function VerdocsCheckbox(hostRef){_classCallCheck(this,VerdocsCheckbox),Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_10__.j)(this,hostRef),this.checked=!1,this.name="",this.label="",this.value="",this.theme="light",this.disabled=!1}return _createClass(VerdocsCheckbox,[{key:"render",value:function render(){var _class;return Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_10__.h)(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_10__.b,{class:(_class={disabled:this.disabled},_class[this.theme]=!0,_class)},Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_10__.h)("label",null,Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_10__.h)("input",{type:"checkbox",value:this.value,name:this.name,checked:this.checked,disabled:this.disabled}),Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_10__.h)("span",null,this.label)))}}]),VerdocsCheckbox}();VerdocsCheckbox.style='@charset "UTF-8";verdocs-checkbox{line-height:18px;font-family:"Inter", -apple-system, "Segoe UI", "Roboto", "Helvetica Neue", sans-serif}verdocs-checkbox label>input[type=checkbox]{display:none}verdocs-checkbox label>input[type=checkbox]+*::before{content:"";width:20px;height:20px;-ms-flex-negative:0;flex-shrink:0;line-height:20px;border-radius:2px;border-style:solid;border-width:0.1rem;display:inline-block;vertical-align:bottom;border-color:#aeb4bf}verdocs-checkbox label>input[type=checkbox]:checked+*{color:#55bc81}verdocs-checkbox label>input[type=checkbox]:checked+*::before{content:"✓";color:white;text-align:center;background:#55bc81;border-color:#55bc81}verdocs-checkbox.dark label>input[type=checkbox]+*::before{border-color:#ffffff}verdocs-checkbox.dark label>input[type=checkbox]:checked+*::before{background:#55bc81;border-color:#55bc81}';var VerdocsComponentError=function(){function VerdocsComponentError(hostRef){_classCallCheck(this,VerdocsComponentError),Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_10__.j)(this,hostRef),this.message=""}return _createClass(VerdocsComponentError,[{key:"render",value:function render(){return Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_10__.h)(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_10__.b,null,Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_10__.h)("div",{class:"inner"},this.message))}}]),VerdocsComponentError}();VerdocsComponentError.style='verdocs-component-error{font-family:"Inter", -apple-system, "Segoe UI", "Roboto", "Helvetica Neue", sans-serif;display:-ms-flexbox;display:flex;padding:15px;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center}verdocs-component-error .inner{-ms-flex:1;flex:1;height:300px;display:-ms-flexbox;display:flex;font-size:18px;-webkit-box-sizing:border-box;box-sizing:border-box;padding:0 20px;background:#ffffff;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center}';var VerdocsHelpIcon=function(){function VerdocsHelpIcon(hostRef){_classCallCheck(this,VerdocsHelpIcon),Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_10__.j)(this,hostRef),this.text="",this.containerId="verdocs-help-icon-"+Math.random().toString(36).substring(2,11)}return _createClass(VerdocsHelpIcon,[{key:"componentDidLoad",value:function componentDidLoad(){this.popperInstance=Object(_popper_bfa25c7f_js__WEBPACK_IMPORTED_MODULE_11__.a)(this.icon,this.tooltip,{})}},{key:"disconnectedCallback",value:function disconnectedCallback(){this.popperInstance&&(this.popperInstance.destroy(),this.popperInstance=null)}},{key:"show",value:function show(){var _a,_b;null===(_a=this.tooltip)||void 0===_a||_a.setAttribute("data-show",""),null===(_b=this.popperInstance)||void 0===_b||_b.update().catch((function(){}))}},{key:"hide",value:function hide(){var _a;null===(_a=this.tooltip)||void 0===_a||_a.removeAttribute("data-show")}},{key:"render",value:function render(){var _this=this;return Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_10__.h)(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_10__.b,{class:{}},Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_10__.h)("div",{"aria-describedby":this.containerId,class:"icon",innerHTML:'<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M11.925 18q.55 0 .938-.387.387-.388.387-.938 0-.55-.387-.925-.388-.375-.938-.375-.55 0-.925.375t-.375.925q0 .55.375.938.375.387.925.387Zm-.95-3.85h1.95q0-.8.2-1.287.2-.488 1.025-1.288.65-.625 1.025-1.213.375-.587.375-1.437 0-1.425-1.025-2.175Q13.5 6 12.1 6q-1.425 0-2.35.775t-1.275 1.85l1.775.7q.125-.45.55-.975.425-.525 1.275-.525.725 0 1.1.412.375.413.375.888 0 .475-.287.9-.288.425-.713.775-1.075.95-1.325 1.475-.25.525-.25 1.875ZM12 22.2q-2.125 0-3.988-.8-1.862-.8-3.237-2.175Q3.4 17.85 2.6 15.988 1.8 14.125 1.8 12t.8-3.988q.8-1.862 2.175-3.237Q6.15 3.4 8.012 2.6 9.875 1.8 12 1.8t3.988.8q1.862.8 3.237 2.175Q20.6 6.15 21.4 8.012q.8 1.863.8 3.988t-.8 3.988q-.8 1.862-2.175 3.237Q17.85 20.6 15.988 21.4q-1.863.8-3.988.8Zm0-2.275q3.325 0 5.625-2.3t2.3-5.625q0-3.325-2.3-5.625T12 4.075q-3.325 0-5.625 2.3T4.075 12q0 3.325 2.3 5.625t5.625 2.3ZM12 12Z"/></svg>',onMouseEnter:function onMouseEnter(){return _this.show()},onFocus:function onFocus(){return _this.show()},onMouseLeave:function onMouseLeave(){return _this.hide()},onBlur:function onBlur(){return _this.hide()},ref:function ref(el){return _this.icon=el}}),Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_10__.h)("div",{id:this.containerId,role:"tooltip",class:"tooltip","data-popper-placement":"bottom",ref:function ref(el){return _this.tooltip=el}},this.text,Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_10__.h)("div",{"data-popper-arrow":"true",class:"arrow"})))}}]),VerdocsHelpIcon}();VerdocsHelpIcon.style='verdocs-help-icon{font-family:"Inter", -apple-system, "Segoe UI", "Roboto", "Helvetica Neue", sans-serif;display:inline-block;opacity:0.3;position:relative}verdocs-help-icon:hover{opacity:1}verdocs-help-icon .icon{display:inline-block}verdocs-help-icon .icon svg{fill:#5c6575}verdocs-help-icon .tooltip{display:none;min-width:200px;-webkit-box-shadow:0 0 10px 1px #999999;box-shadow:0 0 10px 1px #999999;background:#ffffff;color:#33364b;max-width:240px;font-weight:bold;position:absolute;padding:5px 10px;font-size:13px;border-radius:4px;z-index:10000}verdocs-help-icon .tooltip .arrow,verdocs-help-icon .tooltip .arrow::before{position:absolute;width:8px;height:8px;background:inherit}verdocs-help-icon .tooltip .arrow{visibility:hidden;top:-4px}verdocs-help-icon .tooltip .arrow::before{visibility:visible;content:"";-webkit-transform:rotate(45deg);transform:rotate(45deg)}verdocs-help-icon .tooltip[data-show]{display:block}verdocs-help-icon .tooltip[data-popper-placement^=top]>.arrow{bottom:-4px}verdocs-help-icon .tooltip[data-popper-placement^=bottom]>.arrow{top:-4px}verdocs-help-icon .tooltip[data-popper-placement^=left]>.arrow{right:-4px}verdocs-help-icon .tooltip[data-popper-placement^=right]>.arrow{left:-4px}';var VerdocsTextInput=function(){function VerdocsTextInput(hostRef){_classCallCheck(this,VerdocsTextInput),Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_10__.j)(this,hostRef),this.value="",this.label="",this.placeholder="",this.autocomplete="",this.helpText="",this.type="text",this.disabled=!1}return _createClass(VerdocsTextInput,[{key:"render",value:function render(){return Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_10__.h)(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_10__.b,{class:"input-field"},Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_10__.h)("label",null,this.label&&Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_10__.h)("div",{class:"input-label"},this.label+":"),Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_10__.h)("input",{type:this.type,value:this.value,class:"input-element","data-lpignore":"true",disabled:this.disabled,placeholder:this.placeholder,autoComplete:this.autocomplete}),this.helpText&&Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_10__.h)("verdocs-help-icon",{text:this.helpText})))}}]),VerdocsTextInput}();VerdocsTextInput.style='verdocs-text-input{font-family:"Inter", "Barlow", sans-serif;-webkit-box-sizing:border-box;box-sizing:border-box;margin:0 0 10px 0;display:block}verdocs-text-input .input-element{-webkit-box-sizing:border-box;box-sizing:border-box;border:1px solid #707ae5;border-radius:4px;background:#ffffff;color:#000;width:100%;font-size:16px;height:28px;padding:4px 12px;outline:none}verdocs-text-input .input-element:disabled{border:1px solid #aeb4bf;background:#f5f5fa}verdocs-text-input .input-element::-webkit-input-placeholder{color:#aaaaaa;opacity:1}verdocs-text-input .input-element::-moz-placeholder{color:#aaaaaa;opacity:1}verdocs-text-input .input-element:-ms-input-placeholder{color:#aaaaaa;opacity:1}verdocs-text-input .input-element::-ms-input-placeholder{color:#aaaaaa;opacity:1}verdocs-text-input .input-element::placeholder{color:#aaaaaa;opacity:1}verdocs-text-input .input-element:focus{outline:1px solid #7d88ff}verdocs-text-input .input-label{display:block;color:#555570;font-weight:700;font-size:14px;margin:0 0 4px 0}verdocs-text-input [data-lastpass-icon-root]{display:none !important}'},"./node_modules/core-js/internals/array-reduce.js":function(module,exports,__webpack_require__){var aCallable=__webpack_require__("./node_modules/core-js/internals/a-callable.js"),toObject=__webpack_require__("./node_modules/core-js/internals/to-object.js"),IndexedObject=__webpack_require__("./node_modules/core-js/internals/indexed-object.js"),lengthOfArrayLike=__webpack_require__("./node_modules/core-js/internals/length-of-array-like.js"),$TypeError=TypeError,createMethod=function(IS_RIGHT){return function(that,callbackfn,argumentsLength,memo){aCallable(callbackfn);var O=toObject(that),self=IndexedObject(O),length=lengthOfArrayLike(O),index=IS_RIGHT?length-1:0,i=IS_RIGHT?-1:1;if(argumentsLength<2)for(;;){if(index in self){memo=self[index],index+=i;break}if(index+=i,IS_RIGHT?index<0:length<=index)throw $TypeError("Reduce of empty array with no initial value")}for(;IS_RIGHT?index>=0:length>index;index+=i)index in self&&(memo=callbackfn(memo,self[index],index,O));return memo}};module.exports={left:createMethod(!1),right:createMethod(!0)}},"./node_modules/core-js/modules/es.array.reduce.js":function(module,exports,__webpack_require__){"use strict";var $=__webpack_require__("./node_modules/core-js/internals/export.js"),$reduce=__webpack_require__("./node_modules/core-js/internals/array-reduce.js").left,arrayMethodIsStrict=__webpack_require__("./node_modules/core-js/internals/array-method-is-strict.js"),CHROME_VERSION=__webpack_require__("./node_modules/core-js/internals/engine-v8-version.js"),IS_NODE=__webpack_require__("./node_modules/core-js/internals/engine-is-node.js");$({target:"Array",proto:!0,forced:!arrayMethodIsStrict("reduce")||!IS_NODE&&CHROME_VERSION>79&&CHROME_VERSION<83},{reduce:function reduce(callbackfn){var length=arguments.length;return $reduce(this,callbackfn,length,length>1?arguments[1]:void 0)}})}}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9kaXN0L2VzbS92ZXJkb2NzLWNoZWNrYm94XzQuZW50cnkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2FycmF5LXJlZHVjZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLmFycmF5LnJlZHVjZS5qcyJdLCJuYW1lcyI6WyJWZXJkb2NzQ2hlY2tib3giLCJob3N0UmVmIiwicmVnaXN0ZXJJbnN0YW5jZSIsInRoaXMiLCJjaGVja2VkIiwibmFtZSIsImxhYmVsIiwidmFsdWUiLCJ0aGVtZSIsImRpc2FibGVkIiwicmVuZGVyIiwiaCIsIkhvc3QiLCJjbGFzcyIsInR5cGUiLCJzdHlsZSIsIlZlcmRvY3NDb21wb25lbnRFcnJvciIsIm1lc3NhZ2UiLCJWZXJkb2NzSGVscEljb24iLCJ0ZXh0IiwiY29udGFpbmVySWQiLCJNYXRoIiwicmFuZG9tIiwidG9TdHJpbmciLCJzdWJzdHJpbmciLCJjb21wb25lbnREaWRMb2FkIiwicG9wcGVySW5zdGFuY2UiLCJjcmVhdGVQb3BwZXIiLCJpY29uIiwidG9vbHRpcCIsImRpc2Nvbm5lY3RlZENhbGxiYWNrIiwiZGVzdHJveSIsInNob3ciLCJfYSIsIl9iIiwic2V0QXR0cmlidXRlIiwidXBkYXRlIiwiaGlkZSIsInJlbW92ZUF0dHJpYnV0ZSIsImlubmVySFRNTCIsIm9uTW91c2VFbnRlciIsIm9uRm9jdXMiLCJvbk1vdXNlTGVhdmUiLCJvbkJsdXIiLCJyZWYiLCJlbCIsImlkIiwicm9sZSIsIlZlcmRvY3NUZXh0SW5wdXQiLCJwbGFjZWhvbGRlciIsImF1dG9jb21wbGV0ZSIsImhlbHBUZXh0IiwiYXV0b0NvbXBsZXRlIiwiYUNhbGxhYmxlIiwidG9PYmplY3QiLCJJbmRleGVkT2JqZWN0IiwibGVuZ3RoT2ZBcnJheUxpa2UiLCIkVHlwZUVycm9yIiwiVHlwZUVycm9yIiwiY3JlYXRlTWV0aG9kIiwiSVNfUklHSFQiLCJ0aGF0IiwiY2FsbGJhY2tmbiIsImFyZ3VtZW50c0xlbmd0aCIsIm1lbW8iLCJPIiwic2VsZiIsImxlbmd0aCIsImluZGV4IiwiaSIsIm1vZHVsZSIsImV4cG9ydHMiLCJsZWZ0IiwicmlnaHQiLCIkIiwiJHJlZHVjZSIsImFycmF5TWV0aG9kSXNTdHJpY3QiLCJDSFJPTUVfVkVSU0lPTiIsIklTX05PREUiLCJ0YXJnZXQiLCJwcm90byIsImZvcmNlZCIsInJlZHVjZSIsImFyZ3VtZW50cyIsInVuZGVmaW5lZCJdLCJtYXBwaW5ncyI6ImdvRkFHQSxJQUVNQSxnQkFBZSxXQUNuQix5QkFBWUMsU0FBUyxzQ0FDbkJDLDJEQUFpQkMsS0FBTUYsU0FDdkJFLEtBQUtDLFNBQVUsRUFDZkQsS0FBS0UsS0FBTyxHQUNaRixLQUFLRyxNQUFRLEdBQ2JILEtBQUtJLE1BQVEsR0FDYkosS0FBS0ssTUFBUSxRQUNiTCxLQUFLTSxVQUFXLENBQ2xCLENBR0MsT0FIQSxrREFDRCxTQUFBQyxTQUFTLFdBQ1AsT0FBUUMsMkRBQUVDLG1EQUFNLENBQUVDLE9BQUEsUUFBU0osU0FBVU4sS0FBS00sVUFBUSxPQUFHTixLQUFLSyxRQUFRLEVBQUksU0FBTUcsMkRBQUUsUUFBUyxLQUFNQSwyREFBRSxRQUFTLENBQUVHLEtBQU0sV0FBWVAsTUFBT0osS0FBS0ksTUFBT0YsS0FBTUYsS0FBS0UsS0FBTUQsUUFBU0QsS0FBS0MsUUFBU0ssU0FBVU4sS0FBS00sV0FBYUUsMkRBQUUsT0FBUSxLQUFNUixLQUFLRyxRQUMxTyxLQUFDLGdCQVprQixHQWNyQk4sZ0JBQWdCZSxNQWhCVyx5MUJBa0IzQixJQUVNQyxzQkFBcUIsV0FDekIsK0JBQVlmLFNBQVMsNENBQ25CQywyREFBaUJDLEtBQU1GLFNBQ3ZCRSxLQUFLYyxRQUFVLEVBQ2pCLENBR0MsT0FIQSx3REFDRCxTQUFBUCxTQUNFLE9BQVFDLDJEQUFFQyxtREFBTSxLQUFNRCwyREFBRSxNQUFPLENBQUVFLE1BQU8sU0FBV1YsS0FBS2MsU0FDMUQsS0FBQyxzQkFQ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QU8sU0FBVUMsS0FBTUMsV0FBWUMsZ0JBQWlCQyxNQUNsRFgsVUFBVVMsWUFDVixJQUFJRyxFQUFJWCxTQUFTTyxNQUNiSyxLQUFPWCxjQUFjVSxHQUNyQkUsT0FBU1gsa0JBQWtCUyxHQUMzQkcsTUFBUVIsU0FBV08sT0FBUyxFQUFJLEVBQ2hDRSxFQUFJVCxVQUFZLEVBQUksRUFDeEIsR0FBSUcsZ0JBQWtCLEVBQUcsT0FBYSxDQUNwQyxHQUFJSyxTQUFTRixLQUFNLENBQ2pCRixLQUFPRSxLQUFLRSxPQUNaQSxPQUFTQyxFQUNULEtBQ0YsQ0FFQSxHQURBRCxPQUFTQyxFQUNMVCxTQUFXUSxNQUFRLEVBQUlELFFBQVVDLE1BQ25DLE1BQU1YLFdBQVcsOENBRXJCLENBQ0EsS0FBTUcsU0FBV1EsT0FBUyxFQUFJRCxPQUFTQyxNQUFPQSxPQUFTQyxFQUFPRCxTQUFTRixPQUNyRUYsS0FBT0YsV0FBV0UsS0FBTUUsS0FBS0UsT0FBUUEsTUFBT0gsSUFFOUMsT0FBT0QsSUFDVCxDQUNGLEVBRUFNLE9BQU9DLFFBQVUsQ0FHZkMsS0FBTWIsY0FBYSxHQUduQmMsTUFBT2QsY0FBYSxHLGdIQ3ZDdEIsSUFBSWUsRUFBSSxvQkFBUSw4Q0FDWkMsUUFBVSxvQkFBUSxvREFBNkJILEtBQy9DSSxvQkFBc0Isb0JBQVEsOERBQzlCQyxlQUFpQixvQkFBUSx5REFDekJDLFFBQVUsb0JBQVEsc0RBU3RCSixFQUFFLENBQUVLLE9BQVEsUUFBU0MsT0FBTyxFQUFNQyxRQVBkTCxvQkFBb0IsWUFHdEJFLFNBQVdELGVBQWlCLElBQU1BLGVBQWlCLElBSUssQ0FDeEVLLE9BQVEsU0FBU0EsT0FBT3BCLFlBQ3RCLElBQUlLLE9BQVNnQixVQUFVaEIsT0FDdkIsT0FBT1EsUUFBUXhFLEtBQU0yRCxXQUFZSyxPQUFRQSxPQUFTLEVBQUlnQixVQUFVLFFBQUtDLEVBQ3ZFLEciLCJmaWxlIjoiMzkuNGZkMzA4YjcuaWZyYW1lLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHIgYXMgcmVnaXN0ZXJJbnN0YW5jZSwgaCwgSCBhcyBIb3N0IH0gZnJvbSAnLi9pbmRleC1iMThjMDM0OC5qcyc7XG5pbXBvcnQgeyBjIGFzIGNyZWF0ZVBvcHBlciB9IGZyb20gJy4vcG9wcGVyLWJmYTI1YzdmLmpzJztcblxuY29uc3QgdmVyZG9jc0NoZWNrYm94Q3NzID0gXCJAY2hhcnNldCBcXFwiVVRGLThcXFwiO3ZlcmRvY3MtY2hlY2tib3h7bGluZS1oZWlnaHQ6MThweDtmb250LWZhbWlseTpcXFwiSW50ZXJcXFwiLCAtYXBwbGUtc3lzdGVtLCBcXFwiU2Vnb2UgVUlcXFwiLCBcXFwiUm9ib3RvXFxcIiwgXFxcIkhlbHZldGljYSBOZXVlXFxcIiwgc2Fucy1zZXJpZn12ZXJkb2NzLWNoZWNrYm94IGxhYmVsPmlucHV0W3R5cGU9Y2hlY2tib3hde2Rpc3BsYXk6bm9uZX12ZXJkb2NzLWNoZWNrYm94IGxhYmVsPmlucHV0W3R5cGU9Y2hlY2tib3hdKyo6OmJlZm9yZXtjb250ZW50OlxcXCJcXFwiO3dpZHRoOjIwcHg7aGVpZ2h0OjIwcHg7LW1zLWZsZXgtbmVnYXRpdmU6MDtmbGV4LXNocmluazowO2xpbmUtaGVpZ2h0OjIwcHg7Ym9yZGVyLXJhZGl1czoycHg7Ym9yZGVyLXN0eWxlOnNvbGlkO2JvcmRlci13aWR0aDowLjFyZW07ZGlzcGxheTppbmxpbmUtYmxvY2s7dmVydGljYWwtYWxpZ246Ym90dG9tO2JvcmRlci1jb2xvcjojYWViNGJmfXZlcmRvY3MtY2hlY2tib3ggbGFiZWw+aW5wdXRbdHlwZT1jaGVja2JveF06Y2hlY2tlZCsqe2NvbG9yOiM1NWJjODF9dmVyZG9jcy1jaGVja2JveCBsYWJlbD5pbnB1dFt0eXBlPWNoZWNrYm94XTpjaGVja2VkKyo6OmJlZm9yZXtjb250ZW50OlxcXCLinJNcXFwiO2NvbG9yOndoaXRlO3RleHQtYWxpZ246Y2VudGVyO2JhY2tncm91bmQ6IzU1YmM4MTtib3JkZXItY29sb3I6IzU1YmM4MX12ZXJkb2NzLWNoZWNrYm94LmRhcmsgbGFiZWw+aW5wdXRbdHlwZT1jaGVja2JveF0rKjo6YmVmb3Jle2JvcmRlci1jb2xvcjojZmZmZmZmfXZlcmRvY3MtY2hlY2tib3guZGFyayBsYWJlbD5pbnB1dFt0eXBlPWNoZWNrYm94XTpjaGVja2VkKyo6OmJlZm9yZXtiYWNrZ3JvdW5kOiM1NWJjODE7Ym9yZGVyLWNvbG9yOiM1NWJjODF9XCI7XG5cbmNvbnN0IFZlcmRvY3NDaGVja2JveCA9IGNsYXNzIHtcbiAgY29uc3RydWN0b3IoaG9zdFJlZikge1xuICAgIHJlZ2lzdGVySW5zdGFuY2UodGhpcywgaG9zdFJlZik7XG4gICAgdGhpcy5jaGVja2VkID0gZmFsc2U7XG4gICAgdGhpcy5uYW1lID0gJyc7XG4gICAgdGhpcy5sYWJlbCA9ICcnO1xuICAgIHRoaXMudmFsdWUgPSAnJztcbiAgICB0aGlzLnRoZW1lID0gJ2xpZ2h0JztcbiAgICB0aGlzLmRpc2FibGVkID0gZmFsc2U7XG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoaChIb3N0LCB7IGNsYXNzOiB7IGRpc2FibGVkOiB0aGlzLmRpc2FibGVkLCBbdGhpcy50aGVtZV06IHRydWUgfSB9LCBoKFwibGFiZWxcIiwgbnVsbCwgaChcImlucHV0XCIsIHsgdHlwZTogXCJjaGVja2JveFwiLCB2YWx1ZTogdGhpcy52YWx1ZSwgbmFtZTogdGhpcy5uYW1lLCBjaGVja2VkOiB0aGlzLmNoZWNrZWQsIGRpc2FibGVkOiB0aGlzLmRpc2FibGVkIH0pLCBoKFwic3BhblwiLCBudWxsLCB0aGlzLmxhYmVsKSkpKTtcbiAgfVxufTtcblZlcmRvY3NDaGVja2JveC5zdHlsZSA9IHZlcmRvY3NDaGVja2JveENzcztcblxuY29uc3QgdmVyZG9jc0NvbXBvbmVudEVycm9yQ3NzID0gXCJ2ZXJkb2NzLWNvbXBvbmVudC1lcnJvcntmb250LWZhbWlseTpcXFwiSW50ZXJcXFwiLCAtYXBwbGUtc3lzdGVtLCBcXFwiU2Vnb2UgVUlcXFwiLCBcXFwiUm9ib3RvXFxcIiwgXFxcIkhlbHZldGljYSBOZXVlXFxcIiwgc2Fucy1zZXJpZjtkaXNwbGF5Oi1tcy1mbGV4Ym94O2Rpc3BsYXk6ZmxleDtwYWRkaW5nOjE1cHg7LW1zLWZsZXgtYWxpZ246Y2VudGVyO2FsaWduLWl0ZW1zOmNlbnRlcjstbXMtZmxleC1wYWNrOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyfXZlcmRvY3MtY29tcG9uZW50LWVycm9yIC5pbm5lcnstbXMtZmxleDoxO2ZsZXg6MTtoZWlnaHQ6MzAwcHg7ZGlzcGxheTotbXMtZmxleGJveDtkaXNwbGF5OmZsZXg7Zm9udC1zaXplOjE4cHg7LXdlYmtpdC1ib3gtc2l6aW5nOmJvcmRlci1ib3g7Ym94LXNpemluZzpib3JkZXItYm94O3BhZGRpbmc6MCAyMHB4O2JhY2tncm91bmQ6I2ZmZmZmZjstbXMtZmxleC1hbGlnbjpjZW50ZXI7YWxpZ24taXRlbXM6Y2VudGVyOy1tcy1mbGV4LXBhY2s6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXJ9XCI7XG5cbmNvbnN0IFZlcmRvY3NDb21wb25lbnRFcnJvciA9IGNsYXNzIHtcbiAgY29uc3RydWN0b3IoaG9zdFJlZikge1xuICAgIHJlZ2lzdGVySW5zdGFuY2UodGhpcywgaG9zdFJlZik7XG4gICAgdGhpcy5tZXNzYWdlID0gJyc7XG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoaChIb3N0LCBudWxsLCBoKFwiZGl2XCIsIHsgY2xhc3M6IFwiaW5uZXJcIiB9LCB0aGlzLm1lc3NhZ2UpKSk7XG4gIH1cbn07XG5WZXJkb2NzQ29tcG9uZW50RXJyb3Iuc3R5bGUgPSB2ZXJkb2NzQ29tcG9uZW50RXJyb3JDc3M7XG5cbmNvbnN0IHZlcmRvY3NIZWxwSWNvbkNzcyA9IFwidmVyZG9jcy1oZWxwLWljb257Zm9udC1mYW1pbHk6XFxcIkludGVyXFxcIiwgLWFwcGxlLXN5c3RlbSwgXFxcIlNlZ29lIFVJXFxcIiwgXFxcIlJvYm90b1xcXCIsIFxcXCJIZWx2ZXRpY2EgTmV1ZVxcXCIsIHNhbnMtc2VyaWY7ZGlzcGxheTppbmxpbmUtYmxvY2s7b3BhY2l0eTowLjM7cG9zaXRpb246cmVsYXRpdmV9dmVyZG9jcy1oZWxwLWljb246aG92ZXJ7b3BhY2l0eToxfXZlcmRvY3MtaGVscC1pY29uIC5pY29ue2Rpc3BsYXk6aW5saW5lLWJsb2NrfXZlcmRvY3MtaGVscC1pY29uIC5pY29uIHN2Z3tmaWxsOiM1YzY1NzV9dmVyZG9jcy1oZWxwLWljb24gLnRvb2x0aXB7ZGlzcGxheTpub25lO21pbi13aWR0aDoyMDBweDstd2Via2l0LWJveC1zaGFkb3c6MCAwIDEwcHggMXB4ICM5OTk5OTk7Ym94LXNoYWRvdzowIDAgMTBweCAxcHggIzk5OTk5OTtiYWNrZ3JvdW5kOiNmZmZmZmY7Y29sb3I6IzMzMzY0YjttYXgtd2lkdGg6MjQwcHg7Zm9udC13ZWlnaHQ6Ym9sZDtwb3NpdGlvbjphYnNvbHV0ZTtwYWRkaW5nOjVweCAxMHB4O2ZvbnQtc2l6ZToxM3B4O2JvcmRlci1yYWRpdXM6NHB4O3otaW5kZXg6MTAwMDB9dmVyZG9jcy1oZWxwLWljb24gLnRvb2x0aXAgLmFycm93LHZlcmRvY3MtaGVscC1pY29uIC50b29sdGlwIC5hcnJvdzo6YmVmb3Jle3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOjhweDtoZWlnaHQ6OHB4O2JhY2tncm91bmQ6aW5oZXJpdH12ZXJkb2NzLWhlbHAtaWNvbiAudG9vbHRpcCAuYXJyb3d7dmlzaWJpbGl0eTpoaWRkZW47dG9wOi00cHh9dmVyZG9jcy1oZWxwLWljb24gLnRvb2x0aXAgLmFycm93OjpiZWZvcmV7dmlzaWJpbGl0eTp2aXNpYmxlO2NvbnRlbnQ6XFxcIlxcXCI7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDQ1ZGVnKTt0cmFuc2Zvcm06cm90YXRlKDQ1ZGVnKX12ZXJkb2NzLWhlbHAtaWNvbiAudG9vbHRpcFtkYXRhLXNob3dde2Rpc3BsYXk6YmxvY2t9dmVyZG9jcy1oZWxwLWljb24gLnRvb2x0aXBbZGF0YS1wb3BwZXItcGxhY2VtZW50Xj10b3BdPi5hcnJvd3tib3R0b206LTRweH12ZXJkb2NzLWhlbHAtaWNvbiAudG9vbHRpcFtkYXRhLXBvcHBlci1wbGFjZW1lbnRePWJvdHRvbV0+LmFycm93e3RvcDotNHB4fXZlcmRvY3MtaGVscC1pY29uIC50b29sdGlwW2RhdGEtcG9wcGVyLXBsYWNlbWVudF49bGVmdF0+LmFycm93e3JpZ2h0Oi00cHh9dmVyZG9jcy1oZWxwLWljb24gLnRvb2x0aXBbZGF0YS1wb3BwZXItcGxhY2VtZW50Xj1yaWdodF0+LmFycm93e2xlZnQ6LTRweH1cIjtcblxuY29uc3QgaGVscEljb24gPSAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgaGVpZ2h0PVwiMjRcIiB3aWR0aD1cIjI0XCI+PHBhdGggZD1cIk0xMS45MjUgMThxLjU1IDAgLjkzOC0uMzg3LjM4Ny0uMzg4LjM4Ny0uOTM4IDAtLjU1LS4zODctLjkyNS0uMzg4LS4zNzUtLjkzOC0uMzc1LS41NSAwLS45MjUuMzc1dC0uMzc1LjkyNXEwIC41NS4zNzUuOTM4LjM3NS4zODcuOTI1LjM4N1ptLS45NS0zLjg1aDEuOTVxMC0uOC4yLTEuMjg3LjItLjQ4OCAxLjAyNS0xLjI4OC42NS0uNjI1IDEuMDI1LTEuMjEzLjM3NS0uNTg3LjM3NS0xLjQzNyAwLTEuNDI1LTEuMDI1LTIuMTc1UTEzLjUgNiAxMi4xIDZxLTEuNDI1IDAtMi4zNS43NzV0LTEuMjc1IDEuODVsMS43NzUuN3EuMTI1LS40NS41NS0uOTc1LjQyNS0uNTI1IDEuMjc1LS41MjUuNzI1IDAgMS4xLjQxMi4zNzUuNDEzLjM3NS44ODggMCAuNDc1LS4yODcuOS0uMjg4LjQyNS0uNzEzLjc3NS0xLjA3NS45NS0xLjMyNSAxLjQ3NS0uMjUuNTI1LS4yNSAxLjg3NVpNMTIgMjIuMnEtMi4xMjUgMC0zLjk4OC0uOC0xLjg2Mi0uOC0zLjIzNy0yLjE3NVEzLjQgMTcuODUgMi42IDE1Ljk4OCAxLjggMTQuMTI1IDEuOCAxMnQuOC0zLjk4OHEuOC0xLjg2MiAyLjE3NS0zLjIzN1E2LjE1IDMuNCA4LjAxMiAyLjYgOS44NzUgMS44IDEyIDEuOHQzLjk4OC44cTEuODYyLjggMy4yMzcgMi4xNzVRMjAuNiA2LjE1IDIxLjQgOC4wMTJxLjggMS44NjMuOCAzLjk4OHQtLjggMy45ODhxLS44IDEuODYyLTIuMTc1IDMuMjM3UTE3Ljg1IDIwLjYgMTUuOTg4IDIxLjRxLTEuODYzLjgtMy45ODguOFptMC0yLjI3NXEzLjMyNSAwIDUuNjI1LTIuM3QyLjMtNS42MjVxMC0zLjMyNS0yLjMtNS42MjVUMTIgNC4wNzVxLTMuMzI1IDAtNS42MjUgMi4zVDQuMDc1IDEycTAgMy4zMjUgMi4zIDUuNjI1dDUuNjI1IDIuM1pNMTIgMTJaXCIvPjwvc3ZnPic7XG5jb25zdCBWZXJkb2NzSGVscEljb24gPSBjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKGhvc3RSZWYpIHtcbiAgICByZWdpc3Rlckluc3RhbmNlKHRoaXMsIGhvc3RSZWYpO1xuICAgIHRoaXMudGV4dCA9ICcnO1xuICAgIHRoaXMuY29udGFpbmVySWQgPSBgdmVyZG9jcy1oZWxwLWljb24tJHtNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMiwgMTEpfWA7XG4gIH1cbiAgY29tcG9uZW50RGlkTG9hZCgpIHtcbiAgICB0aGlzLnBvcHBlckluc3RhbmNlID0gY3JlYXRlUG9wcGVyKHRoaXMuaWNvbiwgdGhpcy50b29sdGlwLCB7XG4gICAgLy8gcGxhY2VtZW50OiAndG9wLWVuZCcsXG4gICAgLy8gbW9kaWZpZXJzOiBbe25hbWU6ICdvZmZzZXQnLCBvcHRpb25zOiB7b2Zmc2V0OiBbMCwgMTBdfX1dLFxuICAgIH0pO1xuICB9XG4gIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgIGlmICh0aGlzLnBvcHBlckluc3RhbmNlKSB7XG4gICAgICB0aGlzLnBvcHBlckluc3RhbmNlLmRlc3Ryb3koKTtcbiAgICAgIHRoaXMucG9wcGVySW5zdGFuY2UgPSBudWxsO1xuICAgIH1cbiAgfVxuICBzaG93KCkge1xuICAgIHZhciBfYSwgX2I7XG4gICAgKF9hID0gdGhpcy50b29sdGlwKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Euc2V0QXR0cmlidXRlKCdkYXRhLXNob3cnLCAnJyk7XG4gICAgKF9iID0gdGhpcy5wb3BwZXJJbnN0YW5jZSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnVwZGF0ZSgpLmNhdGNoKCgpID0+IHsgfSk7XG4gIH1cbiAgaGlkZSgpIHtcbiAgICB2YXIgX2E7XG4gICAgKF9hID0gdGhpcy50b29sdGlwKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXNob3cnKTtcbiAgfVxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChoKEhvc3QsIHsgY2xhc3M6IHt9IH0sIGgoXCJkaXZcIiwgeyBcImFyaWEtZGVzY3JpYmVkYnlcIjogdGhpcy5jb250YWluZXJJZCwgY2xhc3M6IFwiaWNvblwiLCBpbm5lckhUTUw6IGhlbHBJY29uLCBvbk1vdXNlRW50ZXI6ICgpID0+IHRoaXMuc2hvdygpLCBvbkZvY3VzOiAoKSA9PiB0aGlzLnNob3coKSwgb25Nb3VzZUxlYXZlOiAoKSA9PiB0aGlzLmhpZGUoKSwgb25CbHVyOiAoKSA9PiB0aGlzLmhpZGUoKSwgcmVmOiBlbCA9PiAodGhpcy5pY29uID0gZWwpIH0pLCBoKFwiZGl2XCIsIHsgaWQ6IHRoaXMuY29udGFpbmVySWQsIHJvbGU6IFwidG9vbHRpcFwiLCBjbGFzczogXCJ0b29sdGlwXCIsIFwiZGF0YS1wb3BwZXItcGxhY2VtZW50XCI6IFwiYm90dG9tXCIsIHJlZjogZWwgPT4gKHRoaXMudG9vbHRpcCA9IGVsKSB9LCB0aGlzLnRleHQsIGgoXCJkaXZcIiwgeyBcImRhdGEtcG9wcGVyLWFycm93XCI6IFwidHJ1ZVwiLCBjbGFzczogXCJhcnJvd1wiIH0pKSkpO1xuICB9XG59O1xuVmVyZG9jc0hlbHBJY29uLnN0eWxlID0gdmVyZG9jc0hlbHBJY29uQ3NzO1xuXG5jb25zdCB2ZXJkb2NzVGV4dElucHV0Q3NzID0gXCJ2ZXJkb2NzLXRleHQtaW5wdXR7Zm9udC1mYW1pbHk6XFxcIkludGVyXFxcIiwgXFxcIkJhcmxvd1xcXCIsIHNhbnMtc2VyaWY7LXdlYmtpdC1ib3gtc2l6aW5nOmJvcmRlci1ib3g7Ym94LXNpemluZzpib3JkZXItYm94O21hcmdpbjowIDAgMTBweCAwO2Rpc3BsYXk6YmxvY2t9dmVyZG9jcy10ZXh0LWlucHV0IC5pbnB1dC1lbGVtZW50ey13ZWJraXQtYm94LXNpemluZzpib3JkZXItYm94O2JveC1zaXppbmc6Ym9yZGVyLWJveDtib3JkZXI6MXB4IHNvbGlkICM3MDdhZTU7Ym9yZGVyLXJhZGl1czo0cHg7YmFja2dyb3VuZDojZmZmZmZmO2NvbG9yOiMwMDA7d2lkdGg6MTAwJTtmb250LXNpemU6MTZweDtoZWlnaHQ6MjhweDtwYWRkaW5nOjRweCAxMnB4O291dGxpbmU6bm9uZX12ZXJkb2NzLXRleHQtaW5wdXQgLmlucHV0LWVsZW1lbnQ6ZGlzYWJsZWR7Ym9yZGVyOjFweCBzb2xpZCAjYWViNGJmO2JhY2tncm91bmQ6I2Y1ZjVmYX12ZXJkb2NzLXRleHQtaW5wdXQgLmlucHV0LWVsZW1lbnQ6Oi13ZWJraXQtaW5wdXQtcGxhY2Vob2xkZXJ7Y29sb3I6I2FhYWFhYTtvcGFjaXR5OjF9dmVyZG9jcy10ZXh0LWlucHV0IC5pbnB1dC1lbGVtZW50OjotbW96LXBsYWNlaG9sZGVye2NvbG9yOiNhYWFhYWE7b3BhY2l0eToxfXZlcmRvY3MtdGV4dC1pbnB1dCAuaW5wdXQtZWxlbWVudDotbXMtaW5wdXQtcGxhY2Vob2xkZXJ7Y29sb3I6I2FhYWFhYTtvcGFjaXR5OjF9dmVyZG9jcy10ZXh0LWlucHV0IC5pbnB1dC1lbGVtZW50OjotbXMtaW5wdXQtcGxhY2Vob2xkZXJ7Y29sb3I6I2FhYWFhYTtvcGFjaXR5OjF9dmVyZG9jcy10ZXh0LWlucHV0IC5pbnB1dC1lbGVtZW50OjpwbGFjZWhvbGRlcntjb2xvcjojYWFhYWFhO29wYWNpdHk6MX12ZXJkb2NzLXRleHQtaW5wdXQgLmlucHV0LWVsZW1lbnQ6Zm9jdXN7b3V0bGluZToxcHggc29saWQgIzdkODhmZn12ZXJkb2NzLXRleHQtaW5wdXQgLmlucHV0LWxhYmVse2Rpc3BsYXk6YmxvY2s7Y29sb3I6IzU1NTU3MDtmb250LXdlaWdodDo3MDA7Zm9udC1zaXplOjE0cHg7bWFyZ2luOjAgMCA0cHggMH12ZXJkb2NzLXRleHQtaW5wdXQgW2RhdGEtbGFzdHBhc3MtaWNvbi1yb290XXtkaXNwbGF5Om5vbmUgIWltcG9ydGFudH1cIjtcblxuY29uc3QgVmVyZG9jc1RleHRJbnB1dCA9IGNsYXNzIHtcbiAgY29uc3RydWN0b3IoaG9zdFJlZikge1xuICAgIHJlZ2lzdGVySW5zdGFuY2UodGhpcywgaG9zdFJlZik7XG4gICAgdGhpcy52YWx1ZSA9ICcnO1xuICAgIHRoaXMubGFiZWwgPSAnJztcbiAgICB0aGlzLnBsYWNlaG9sZGVyID0gJyc7XG4gICAgdGhpcy5hdXRvY29tcGxldGUgPSAnJztcbiAgICB0aGlzLmhlbHBUZXh0ID0gJyc7XG4gICAgdGhpcy50eXBlID0gJ3RleHQnO1xuICAgIHRoaXMuZGlzYWJsZWQgPSBmYWxzZTtcbiAgfVxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChoKEhvc3QsIHsgY2xhc3M6IFwiaW5wdXQtZmllbGRcIiB9LCBoKFwibGFiZWxcIiwgbnVsbCwgdGhpcy5sYWJlbCAmJiBoKFwiZGl2XCIsIHsgY2xhc3M6IFwiaW5wdXQtbGFiZWxcIiB9LCB0aGlzLmxhYmVsICsgJzonKSwgaChcImlucHV0XCIsIHsgdHlwZTogdGhpcy50eXBlLCB2YWx1ZTogdGhpcy52YWx1ZSwgY2xhc3M6IFwiaW5wdXQtZWxlbWVudFwiLCBcImRhdGEtbHBpZ25vcmVcIjogXCJ0cnVlXCIsIGRpc2FibGVkOiB0aGlzLmRpc2FibGVkLCBwbGFjZWhvbGRlcjogdGhpcy5wbGFjZWhvbGRlciwgYXV0b0NvbXBsZXRlOiB0aGlzLmF1dG9jb21wbGV0ZSB9KSwgdGhpcy5oZWxwVGV4dCAmJiBoKFwidmVyZG9jcy1oZWxwLWljb25cIiwgeyB0ZXh0OiB0aGlzLmhlbHBUZXh0IH0pKSkpO1xuICB9XG59O1xuVmVyZG9jc1RleHRJbnB1dC5zdHlsZSA9IHZlcmRvY3NUZXh0SW5wdXRDc3M7XG5cbmV4cG9ydCB7IFZlcmRvY3NDaGVja2JveCBhcyB2ZXJkb2NzX2NoZWNrYm94LCBWZXJkb2NzQ29tcG9uZW50RXJyb3IgYXMgdmVyZG9jc19jb21wb25lbnRfZXJyb3IsIFZlcmRvY3NIZWxwSWNvbiBhcyB2ZXJkb2NzX2hlbHBfaWNvbiwgVmVyZG9jc1RleHRJbnB1dCBhcyB2ZXJkb2NzX3RleHRfaW5wdXQgfTtcbiIsInZhciBhQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYS1jYWxsYWJsZScpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLW9iamVjdCcpO1xudmFyIEluZGV4ZWRPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaW5kZXhlZC1vYmplY3QnKTtcbnZhciBsZW5ndGhPZkFycmF5TGlrZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9sZW5ndGgtb2YtYXJyYXktbGlrZScpO1xuXG52YXIgJFR5cGVFcnJvciA9IFR5cGVFcnJvcjtcblxuLy8gYEFycmF5LnByb3RvdHlwZS57IHJlZHVjZSwgcmVkdWNlUmlnaHQgfWAgbWV0aG9kcyBpbXBsZW1lbnRhdGlvblxudmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uIChJU19SSUdIVCkge1xuICByZXR1cm4gZnVuY3Rpb24gKHRoYXQsIGNhbGxiYWNrZm4sIGFyZ3VtZW50c0xlbmd0aCwgbWVtbykge1xuICAgIGFDYWxsYWJsZShjYWxsYmFja2ZuKTtcbiAgICB2YXIgTyA9IHRvT2JqZWN0KHRoYXQpO1xuICAgIHZhciBzZWxmID0gSW5kZXhlZE9iamVjdChPKTtcbiAgICB2YXIgbGVuZ3RoID0gbGVuZ3RoT2ZBcnJheUxpa2UoTyk7XG4gICAgdmFyIGluZGV4ID0gSVNfUklHSFQgPyBsZW5ndGggLSAxIDogMDtcbiAgICB2YXIgaSA9IElTX1JJR0hUID8gLTEgOiAxO1xuICAgIGlmIChhcmd1bWVudHNMZW5ndGggPCAyKSB3aGlsZSAodHJ1ZSkge1xuICAgICAgaWYgKGluZGV4IGluIHNlbGYpIHtcbiAgICAgICAgbWVtbyA9IHNlbGZbaW5kZXhdO1xuICAgICAgICBpbmRleCArPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGluZGV4ICs9IGk7XG4gICAgICBpZiAoSVNfUklHSFQgPyBpbmRleCA8IDAgOiBsZW5ndGggPD0gaW5kZXgpIHtcbiAgICAgICAgdGhyb3cgJFR5cGVFcnJvcignUmVkdWNlIG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZScpO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKDtJU19SSUdIVCA/IGluZGV4ID49IDAgOiBsZW5ndGggPiBpbmRleDsgaW5kZXggKz0gaSkgaWYgKGluZGV4IGluIHNlbGYpIHtcbiAgICAgIG1lbW8gPSBjYWxsYmFja2ZuKG1lbW8sIHNlbGZbaW5kZXhdLCBpbmRleCwgTyk7XG4gICAgfVxuICAgIHJldHVybiBtZW1vO1xuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8vIGBBcnJheS5wcm90b3R5cGUucmVkdWNlYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUucmVkdWNlXG4gIGxlZnQ6IGNyZWF0ZU1ldGhvZChmYWxzZSksXG4gIC8vIGBBcnJheS5wcm90b3R5cGUucmVkdWNlUmlnaHRgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5yZWR1Y2VyaWdodFxuICByaWdodDogY3JlYXRlTWV0aG9kKHRydWUpXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XG52YXIgJHJlZHVjZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1yZWR1Y2UnKS5sZWZ0O1xudmFyIGFycmF5TWV0aG9kSXNTdHJpY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktbWV0aG9kLWlzLXN0cmljdCcpO1xudmFyIENIUk9NRV9WRVJTSU9OID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2VuZ2luZS12OC12ZXJzaW9uJyk7XG52YXIgSVNfTk9ERSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9lbmdpbmUtaXMtbm9kZScpO1xuXG52YXIgU1RSSUNUX01FVEhPRCA9IGFycmF5TWV0aG9kSXNTdHJpY3QoJ3JlZHVjZScpO1xuLy8gQ2hyb21lIDgwLTgyIGhhcyBhIGNyaXRpY2FsIGJ1Z1xuLy8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9MTA0OTk4MlxudmFyIENIUk9NRV9CVUcgPSAhSVNfTk9ERSAmJiBDSFJPTUVfVkVSU0lPTiA+IDc5ICYmIENIUk9NRV9WRVJTSU9OIDwgODM7XG5cbi8vIGBBcnJheS5wcm90b3R5cGUucmVkdWNlYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLnJlZHVjZVxuJCh7IHRhcmdldDogJ0FycmF5JywgcHJvdG86IHRydWUsIGZvcmNlZDogIVNUUklDVF9NRVRIT0QgfHwgQ0hST01FX0JVRyB9LCB7XG4gIHJlZHVjZTogZnVuY3Rpb24gcmVkdWNlKGNhbGxiYWNrZm4gLyogLCBpbml0aWFsVmFsdWUgKi8pIHtcbiAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICByZXR1cm4gJHJlZHVjZSh0aGlzLCBjYWxsYmFja2ZuLCBsZW5ndGgsIGxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xuICB9XG59KTtcbiJdLCJzb3VyY2VSb290IjoiIn0=