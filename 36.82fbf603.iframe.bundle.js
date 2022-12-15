(window.webpackJsonp=window.webpackJsonp||[]).push([[36],{"./dist/esm/verdocs-button-panel_3.entry.js":function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,"verdocs_button_panel",(function(){return VerdocsButtonPanel})),__webpack_require__.d(__webpack_exports__,"verdocs_select_input",(function(){return VerdocsSelectInput})),__webpack_require__.d(__webpack_exports__,"verdocs_text_input",(function(){return VerdocsTextInput}));__webpack_require__("./node_modules/core-js/modules/es.array.map.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js"),__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"),__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"),__webpack_require__("./node_modules/core-js/modules/es.object.define-property.js");var _index_aadbff90_js__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./dist/esm/index-aadbff90.js"),_popper_f860750c_js__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./dist/esm/popper-f860750c.js");function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,(arg=descriptor.key,key=void 0,"symbol"==typeof(key=function _toPrimitive(input,hint){if("object"!=typeof input||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!=typeof res)return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string"))?key:String(key)),descriptor)}var arg,key}function _createClass(Constructor,protoProps,staticProps){return protoProps&&_defineProperties(Constructor.prototype,protoProps),staticProps&&_defineProperties(Constructor,staticProps),Object.defineProperty(Constructor,"prototype",{writable:!1}),Constructor}var VerdocsButtonPanel=function(){function VerdocsButtonPanel(hostRef){_classCallCheck(this,VerdocsButtonPanel),Object(_index_aadbff90_js__WEBPACK_IMPORTED_MODULE_8__.j)(this,hostRef),this.showing=!1,this.icon=""}return _createClass(VerdocsButtonPanel,[{key:"componentDidRender",value:function componentDidRender(){document.body.appendChild(this.panelEl),this.popperInstance&&this.popperInstance.destroy(),this.popperInstance=Object(_popper_f860750c_js__WEBPACK_IMPORTED_MODULE_9__.a)(this.iconEl,this.panelEl,{})}},{key:"disconnectedCallback",value:function disconnectedCallback(){this.popperInstance&&(this.popperInstance.destroy(),this.popperInstance=null),this.panelEl&&this.panelEl.remove()}},{key:"toggle",value:function toggle(e){var _a,_b,_c,_d,_this=this;e.stopPropagation(),this.showing?(null===(_a=this.panelEl)||void 0===_a||_a.removeAttribute("data-show"),null===(_b=this.hiderEl)||void 0===_b||_b.remove(),this.showing=!1):(null===(_c=this.panelEl)||void 0===_c||_c.setAttribute("data-show",""),null===(_d=this.popperInstance)||void 0===_d||_d.update().catch((function(){})),this.showing=!0,this.hiderEl=document.createElement("div"),this.hiderEl.style.zIndex="100",this.hiderEl.style.position="absolute",this.hiderEl.style.top="0px",this.hiderEl.style.left="0px",this.hiderEl.style.right="0px",this.hiderEl.style.bottom="0px",this.hiderEl.onclick=function(e){return _this.toggle(e)},document.body.appendChild(this.hiderEl))}},{key:"render",value:function render(){var _this2=this;return Object(_index_aadbff90_js__WEBPACK_IMPORTED_MODULE_8__.h)(_index_aadbff90_js__WEBPACK_IMPORTED_MODULE_8__.b,null,Object(_index_aadbff90_js__WEBPACK_IMPORTED_MODULE_8__.h)("div",{class:"icon",innerHTML:this.icon,onClick:function onClick(e){return _this2.toggle(e)},ref:function ref(el){return _this2.iconEl=el}}),Object(_index_aadbff90_js__WEBPACK_IMPORTED_MODULE_8__.h)("div",{role:"tooltip",class:"verdocs-button-panel-content","data-popper-placement":"bottom",ref:function ref(el){return _this2.panelEl=el}},Object(_index_aadbff90_js__WEBPACK_IMPORTED_MODULE_8__.h)("div",{"data-popper-arrow":"true",class:"arrow"}),Object(_index_aadbff90_js__WEBPACK_IMPORTED_MODULE_8__.h)("slot",null)))}}]),VerdocsButtonPanel}();VerdocsButtonPanel.style='verdocs-button-panel{font-family:"Inter", -apple-system, "Segoe UI", "Roboto", "Helvetica Neue", sans-serif;display:inline-block}verdocs-button-panel .icon{display:inline-block;cursor:pointer}verdocs-button-panel .icon svg{fill:#cccccc}verdocs-button-panel .icon:hover svg{fill:#ffffff}.verdocs-button-panel-content{font-family:"Inter", -apple-system, "Segoe UI", "Roboto", "Helvetica Neue", sans-serif;-webkit-box-shadow:0 0 10px 1px #999999;box-shadow:0 0 10px 1px #999999;display:none;background:#ffffff;color:#33364b;width:280px;font-weight:bold;padding:15px;font-size:14px;position:relative;border-radius:4px;z-index:10000}.verdocs-button-panel-content .arrow,.verdocs-button-panel-content .arrow::before{position:absolute;width:8px;height:8px;background:inherit}.verdocs-button-panel-content .arrow{visibility:hidden;top:-4px}.verdocs-button-panel-content .arrow::before{visibility:visible;content:"";-webkit-transform:rotate(45deg);transform:rotate(45deg)}.verdocs-button-panel-content[data-show]{display:block}.verdocs-button-panel-content[data-popper-placement^=top]>.arrow{bottom:-4px}.verdocs-button-panel-content[data-popper-placement^=bottom]>.arrow{top:-4px}.verdocs-button-panel-content[data-popper-placement^=left]>.arrow{right:-4px}.verdocs-button-panel-content[data-popper-placement^=right]>.arrow{left:-4px}.verdocs-button-panel-content h6{color:#092c4c;font-size:16px;font-weight:bold;margin:0 0 8px 0}.verdocs-button-panel-content form{margin:0;padding:0;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column}.verdocs-button-panel-content label{display:block;font-size:14px;font-weight:bold;margin:0 0 3px 0;color:#33364b}.verdocs-button-panel-content input{-ms-flex:1;flex:1;height:34px;display:-ms-flexbox;display:flex;font-size:14px;margin:0 0 10px 0}';var VerdocsSelectInput=function(){function VerdocsSelectInput(hostRef){_classCallCheck(this,VerdocsSelectInput),Object(_index_aadbff90_js__WEBPACK_IMPORTED_MODULE_8__.j)(this,hostRef),this.fieldChange=Object(_index_aadbff90_js__WEBPACK_IMPORTED_MODULE_8__.e)(this,"fieldChange",7),this.value="",this.label="",this.options=void 0,this.disabled=!1,this._value=""}return _createClass(VerdocsSelectInput,[{key:"componentWillLoad",value:function componentWillLoad(){this._value=this.value}},{key:"componentDidLoad",value:function componentDidLoad(){}},{key:"handleInput",value:function handleInput(e){var _a;this._value=e.target.value,null===(_a=this.fieldChange)||void 0===_a||_a.emit(e.target.value)}},{key:"render",value:function render(){var _this3=this;return Object(_index_aadbff90_js__WEBPACK_IMPORTED_MODULE_8__.h)(_index_aadbff90_js__WEBPACK_IMPORTED_MODULE_8__.b,{class:"input-field"},Object(_index_aadbff90_js__WEBPACK_IMPORTED_MODULE_8__.h)("label",null,this.label?Object(_index_aadbff90_js__WEBPACK_IMPORTED_MODULE_8__.h)("div",{class:"input-label"},this.label+":"):Object(_index_aadbff90_js__WEBPACK_IMPORTED_MODULE_8__.h)("div",null),Object(_index_aadbff90_js__WEBPACK_IMPORTED_MODULE_8__.h)("select",{class:"input-element",disabled:this.disabled,onInput:function onInput(e){return _this3.handleInput(e)}},this.options.map((function(option){return Object(_index_aadbff90_js__WEBPACK_IMPORTED_MODULE_8__.h)("option",{value:option.value,selected:option.value===_this3.value},option.label)})))))}}]),VerdocsSelectInput}();VerdocsSelectInput.style='verdocs-select-input{font-family:"Barlow", sans-serif;-webkit-box-sizing:border-box;box-sizing:border-box;margin:0 0 10px 0;display:block}verdocs-select-input .input-element{-webkit-box-sizing:border-box;box-sizing:border-box;border:1px solid #707ae5;border-radius:4px;background:#ffffff;color:#000;width:100%;font-size:16px;height:28px;padding:4px 12px}verdocs-select-input .input-element::-webkit-input-placeholder{color:#aaaaaa;opacity:1}verdocs-select-input .input-element::-moz-placeholder{color:#aaaaaa;opacity:1}verdocs-select-input .input-element:-ms-input-placeholder{color:#aaaaaa;opacity:1}verdocs-select-input .input-element::-ms-input-placeholder{color:#aaaaaa;opacity:1}verdocs-select-input .input-element::placeholder{color:#aaaaaa;opacity:1}verdocs-select-input .input-element:focus{border:1px solid #7d88ff}verdocs-select-input .input-label{display:block;color:#555570;font-weight:700;font-size:14px;margin:0 0 4px 0}';var VerdocsTextInput=function(){function VerdocsTextInput(hostRef){_classCallCheck(this,VerdocsTextInput),Object(_index_aadbff90_js__WEBPACK_IMPORTED_MODULE_8__.j)(this,hostRef),this.value="",this.label="",this.placeholder="",this.autocomplete="",this.type="text",this.disabled=!1,this._value=""}return _createClass(VerdocsTextInput,[{key:"componentWillLoad",value:function componentWillLoad(){}},{key:"componentDidLoad",value:function componentDidLoad(){}},{key:"render",value:function render(){return Object(_index_aadbff90_js__WEBPACK_IMPORTED_MODULE_8__.h)(_index_aadbff90_js__WEBPACK_IMPORTED_MODULE_8__.b,{class:"input-field"},Object(_index_aadbff90_js__WEBPACK_IMPORTED_MODULE_8__.h)("label",null,this.label?Object(_index_aadbff90_js__WEBPACK_IMPORTED_MODULE_8__.h)("div",{class:"input-label"},this.label+":"):Object(_index_aadbff90_js__WEBPACK_IMPORTED_MODULE_8__.h)("div",null),Object(_index_aadbff90_js__WEBPACK_IMPORTED_MODULE_8__.h)("input",{type:this.type,value:this.value,class:"input-element","data-lpignore":"true",disabled:this.disabled,placeholder:this.placeholder,autoComplete:this.autocomplete})))}}]),VerdocsTextInput}();VerdocsTextInput.style='verdocs-text-input{font-family:"Barlow", sans-serif;-webkit-box-sizing:border-box;box-sizing:border-box;margin:0 0 10px 0;display:block}verdocs-text-input .input-element{-webkit-box-sizing:border-box;box-sizing:border-box;border:1px solid #707ae5;border-radius:4px;background:#ffffff;color:#000;width:100%;font-size:16px;height:28px;padding:4px 12px;outline:none}verdocs-text-input .input-element::-webkit-input-placeholder{color:#aaaaaa;opacity:1}verdocs-text-input .input-element::-moz-placeholder{color:#aaaaaa;opacity:1}verdocs-text-input .input-element:-ms-input-placeholder{color:#aaaaaa;opacity:1}verdocs-text-input .input-element::-ms-input-placeholder{color:#aaaaaa;opacity:1}verdocs-text-input .input-element::placeholder{color:#aaaaaa;opacity:1}verdocs-text-input .input-element:focus{outline:1px solid #7d88ff}verdocs-text-input .input-label{display:block;color:#555570;font-weight:700;font-size:14px;margin:0 0 4px 0}'}}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vc3JjL2NvbXBvbmVudHMvY29udHJvbHMvdmVyZG9jcy1idXR0b24tcGFuZWwvdmVyZG9jcy1idXR0b24tcGFuZWwuc2NzcyIsIndlYnBhY2s6Ly8vc3JjL2NvbXBvbmVudHMvY29udHJvbHMvdmVyZG9jcy1idXR0b24tcGFuZWwvdmVyZG9jcy1idXR0b24tcGFuZWwudHN4Iiwid2VicGFjazovLy9zcmMvY29tcG9uZW50cy9jb250cm9scy92ZXJkb2NzLXNlbGVjdC1pbnB1dC92ZXJkb2NzLXNlbGVjdC1pbnB1dC5zY3NzIiwid2VicGFjazovLy9zcmMvY29tcG9uZW50cy9jb250cm9scy92ZXJkb2NzLXNlbGVjdC1pbnB1dC92ZXJkb2NzLXNlbGVjdC1pbnB1dC50c3giLCJ3ZWJwYWNrOi8vL3NyYy9jb21wb25lbnRzL2NvbnRyb2xzL3ZlcmRvY3MtdGV4dC1pbnB1dC92ZXJkb2NzLXRleHQtaW5wdXQuc2NzcyIsIndlYnBhY2s6Ly8vc3JjL2NvbXBvbmVudHMvY29udHJvbHMvdmVyZG9jcy10ZXh0LWlucHV0L3ZlcmRvY3MtdGV4dC1pbnB1dC50c3giXSwibmFtZXMiOlsiVmVyZG9jc0J1dHRvblBhbmVsIiwic2hvd2luZyIsImNvbXBvbmVudERpZFJlbmRlciIsImRvY3VtZW50IiwiYm9keSIsImFwcGVuZENoaWxkIiwidGhpcyIsInBhbmVsRWwiLCJwb3BwZXJJbnN0YW5jZSIsImRlc3Ryb3kiLCJjcmVhdGVQb3BwZXIiLCJpY29uRWwiLCJkaXNjb25uZWN0ZWRDYWxsYmFjayIsInJlbW92ZSIsInRvZ2dsZSIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCJyZW1vdmVBdHRyaWJ1dGUiLCJoaWRlckVsIiwic2V0QXR0cmlidXRlIiwidXBkYXRlIiwiY3JlYXRlRWxlbWVudCIsInN0eWxlIiwiekluZGV4IiwicG9zaXRpb24iLCJ0b3AiLCJsZWZ0IiwicmlnaHQiLCJib3R0b20iLCJvbmNsaWNrIiwicmVuZGVyIiwiaCIsIkhvc3QiLCJjbGFzcyIsImlubmVySFRNTCIsImljb24iLCJvbkNsaWNrIiwicmVmIiwiZWwiLCJyb2xlIiwiVmVyZG9jc1NlbGVjdElucHV0IiwiY29tcG9uZW50V2lsbExvYWQiLCJfdmFsdWUiLCJ2YWx1ZSIsImNvbXBvbmVudERpZExvYWQiLCJoYW5kbGVJbnB1dCIsInRhcmdldCIsImZpZWxkQ2hhbmdlIiwiZW1pdCIsImxhYmVsIiwiZGlzYWJsZWQiLCJvbklucHV0Iiwib3B0aW9ucyIsIm1hcCIsIm9wdGlvbiIsInNlbGVjdGVkIiwiVmVyZG9jc1RleHRJbnB1dCIsInR5cGUiLCJwbGFjZWhvbGRlciIsImF1dG9Db21wbGV0ZSIsImF1dG9jb21wbGV0ZSJdLCJtYXBwaW5ncyI6Im00RUFBQSxJQ1dhQSxtQkFBa0IsVyxzSkFrQzdCLEtBQUFDLFNBQVUsRSxVQXpCYSxFLENBNER0QixPLGlFQTFERCxTQUFBQyxxQkFDRUMsU0FBU0MsS0FBS0MsWUFBWUMsS0FBS0MsU0FDM0JELEtBQUtFLGdCQUNQRixLQUFLRSxlQUFlQyxVQUd0QkgsS0FBS0UsZUFBaUJFLDJEQUFhSixLQUFLSyxPQUFRTCxLQUFLQyxRQUFTLEMsS0FJL0Qsa0NBRUQsU0FBQUssdUJBQ01OLEtBQUtFLGlCQUNQRixLQUFLRSxlQUFlQyxVQUNwQkgsS0FBS0UsZUFBaUIsTUFHcEJGLEtBQUtDLFNBQ1BELEtBQUtDLFFBQVFNLFEsR0FFaEIsb0JBR0QsU0FBQUMsT0FBT0MsR0FBTSxJLFlBQUEsV0FDWEEsRUFBRUMsa0JBRUVWLEtBQUtMLFNBQ0ssUUFBWixHQUFBSyxLQUFLQyxlQUFPLFdBQUVVLGdCQUFnQixhQUNsQixRQUFaLEdBQUFYLEtBQUtZLGVBQU8sV0FBRUwsU0FDZFAsS0FBS0wsU0FBVSxJQUVILFFBQVosR0FBQUssS0FBS0MsZUFBTyxXQUFFWSxhQUFhLFlBQWEsSUFDckIsUUFBbkIsR0FBQWIsS0FBS0Usc0JBQWMsV0FBRVksU0FBTSxPQUFTLGVBQ3BDZCxLQUFLTCxTQUFVLEVBRWZLLEtBQUtZLFFBQVVmLFNBQVNrQixjQUFjLE9BQ3RDZixLQUFLWSxRQUFRSSxNQUFNQyxPQUFTLE1BQzVCakIsS0FBS1ksUUFBUUksTUFBTUUsU0FBVyxXQUM5QmxCLEtBQUtZLFFBQVFJLE1BQU1HLElBQU0sTUFDekJuQixLQUFLWSxRQUFRSSxNQUFNSSxLQUFPLE1BQzFCcEIsS0FBS1ksUUFBUUksTUFBTUssTUFBUSxNQUMzQnJCLEtBQUtZLFFBQVFJLE1BQU1NLE9BQVMsTUFDNUJ0QixLQUFLWSxRQUFRVyxRQUFVLFNBQUNkLEdBQU0sT0FBSyxNQUFLRCxPQUFPQyxFQUFFLEVBQ2pEWixTQUFTQyxLQUFLQyxZQUFZQyxLQUFLWSxTLEdBRWxDLG9CQUVELFNBQUFZLFNBQU0sZ0JBQ0osT0FDRUMsMERBQUNDLGtEQUFJLEtBQ0hELGlFQUFLRSxNQUFNLE9BQU9DLFVBQVc1QixLQUFLNkIsS0FBTUMsUUFBUyxpQkFBQ3JCLEdBQU0sT0FBSyxPQUFLRCxPQUFPQyxFQUFFLEVBQUVzQixJQUFLLGFBQUFDLElBQUUsT0FBSyxPQUFLM0IsT0FBUzJCLEVBQUUsSUFDekdQLGlFQUFLUSxLQUFLLFVBQVVOLE1BQU0sK0JBQThCLHdCQUF1QixTQUFTSSxJQUFLLGFBQUFDLElBQUUsT0FBSyxPQUFLL0IsUUFBVStCLEVBQW9CLEdBQ3JJUCxpRUFBQSxvQkFBdUIsT0FBT0UsTUFBTSxVQUNwQ0Ysd0UsS0FJUCxtQkFyRTRCLEcseUJEWEQsNndERUE5QixJQ1dhUyxtQkFBa0IsVyxrUUFJTCxHLFdBS0EsRyxtQ0FVSSxFLFlBRUYsRSxDQWlDekIsTyxnRUExQkQsU0FBQUMsb0JBQ0VuQyxLQUFLb0MsT0FBU3BDLEtBQUtxQyxLLEdBQ3BCLDhCQUVELFNBQUFDLG1CQUFnQixHQUFLLHlCQUVyQixTQUFBQyxZQUFZOUIsRyxPQUNWVCxLQUFLb0MsT0FBUzNCLEVBQUUrQixPQUFPSCxNQUNQLFFBQWhCLEdBQUFyQyxLQUFLeUMsbUJBQVcsV0FBRUMsS0FBS2pDLEVBQUUrQixPQUFPSCxNLEdBQ2pDLG9CQUVELFNBQUFiLFNBQU0sZ0JBQ0osT0FDRUMsMERBQUNDLGtEQUFJLENBQUNDLE1BQU0sZUFDVkYsdUVBQ0d6QixLQUFLMkMsTUFBUWxCLGlFQUFLRSxNQUFNLGVBQWUzQixLQUFLMkMsTUFBUSxLQUFhbEIsc0VBQ2xFQSxvRUFBUUUsTUFBTSxnQkFBZ0JpQixTQUFVNUMsS0FBSzRDLFNBQVVDLFFBQVMsaUJBQUFwQyxHQUFDLE9BQUksT0FBSzhCLFlBQVk5QixFQUFFLEdBQ3JGVCxLQUFLOEMsUUFBUUMsS0FBSSxTQUFBQyxRQUFNLE9BQ3RCdkIsb0VBQVFZLE1BQU9XLE9BQU9YLE1BQU9ZLFNBQVVELE9BQU9YLFFBQVUsT0FBS0EsT0FDMURXLE9BQU9MLE1BQ0QsTSxLQU1wQixtQkF0RDRCLEcseUJEWEQseTZCRUE5QixJQ1dhTyxpQkFBZ0IsVyw2SkFJSCxHLFdBS0EsRyxpQkFLTSxHLGtCQUtDLEcsVUFNcUQsTyxlQUt4RCxFLFlBRUYsRSxDQThCekIsTyw4REE1QkQsU0FBQWYsb0IsR0FFQyw4QkFFRCxTQUFBRyxtQkFBZ0IsRyxvQkFNaEIsU0FBQWQsU0FDRSxPQUNFQywwREFBQ0Msa0RBQUksQ0FBQ0MsTUFBTSxlQUNWRix1RUFDR3pCLEtBQUsyQyxNQUFRbEIsaUVBQUtFLE1BQU0sZUFBZTNCLEtBQUsyQyxNQUFRLEtBQWFsQixzRUFDbEVBLG1FQUNFMEIsS0FBTW5ELEtBQUttRCxLQUNYZCxNQUFPckMsS0FBS3FDLE1BQ1pWLE1BQU0sZ0JBQWUsZ0JBQ1AsT0FDZGlCLFNBQVU1QyxLQUFLNEMsU0FDZlEsWUFBYXBELEtBQUtvRCxZQUNsQkMsYUFBY3JELEtBQUtzRCxnQixLQU01QixpQkE5RDBCLEcsdUJEWEQsbzZCIiwiZmlsZSI6IjM2LjgyZmJmNjAzLmlmcmFtZS5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJAaW1wb3J0ICcuLi8uLi8uLi90aGVtZS5zY3NzJztcblxudmVyZG9jcy1idXR0b24tcGFuZWwge1xuICBmb250LWZhbWlseTogJHZlcmRvY3MtcHJpbWFyeS1mb250O1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG5cbiAgLmljb24ge1xuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG5cbiAgICBzdmcge1xuICAgICAgZmlsbDogJGxpZ2h0LWJvcmRlci1jb2xvcjtcbiAgICB9XG5cbiAgICAmOmhvdmVyIHtcbiAgICAgIHN2ZyB7XG4gICAgICAgIGZpbGw6ICR2ZXJkb2NzLWdyZXktNDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLnZlcmRvY3MtYnV0dG9uLXBhbmVsLWNvbnRlbnQge1xuICBmb250LWZhbWlseTogJHZlcmRvY3MtcHJpbWFyeS1mb250O1xuICBib3gtc2hhZG93OiAwIDAgMTBweCAxcHggIzk5OTk5OTtcbiAgZGlzcGxheTogbm9uZTtcbiAgYmFja2dyb3VuZDogI2ZmZmZmZjtcbiAgY29sb3I6ICRsYWJlbC1jb2xvcjtcbiAgd2lkdGg6IDI4MHB4O1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgcGFkZGluZzogMTVweDtcbiAgZm9udC1zaXplOiAxNHB4O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgei1pbmRleDogMTAwMDA7XG5cbiAgLmFycm93LFxuICAuYXJyb3c6OmJlZm9yZSB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHdpZHRoOiA4cHg7XG4gICAgaGVpZ2h0OiA4cHg7XG4gICAgYmFja2dyb3VuZDogaW5oZXJpdDtcbiAgfVxuXG4gIC5hcnJvdyB7XG4gICAgdmlzaWJpbGl0eTogaGlkZGVuO1xuICAgIHRvcDogLTRweDtcbiAgfVxuXG4gIC5hcnJvdzo6YmVmb3JlIHtcbiAgICB2aXNpYmlsaXR5OiB2aXNpYmxlO1xuICAgIGNvbnRlbnQ6ICcnO1xuICAgIHRyYW5zZm9ybTogcm90YXRlKDQ1ZGVnKTtcbiAgfVxuXG4gICZbZGF0YS1zaG93XSB7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gIH1cblxuICAmW2RhdGEtcG9wcGVyLXBsYWNlbWVudF49J3RvcCddID4gLmFycm93IHtcbiAgICBib3R0b206IC00cHg7XG4gIH1cblxuICAmW2RhdGEtcG9wcGVyLXBsYWNlbWVudF49J2JvdHRvbSddID4gLmFycm93IHtcbiAgICB0b3A6IC00cHg7XG4gIH1cblxuICAmW2RhdGEtcG9wcGVyLXBsYWNlbWVudF49J2xlZnQnXSA+IC5hcnJvdyB7XG4gICAgcmlnaHQ6IC00cHg7XG4gIH1cblxuICAmW2RhdGEtcG9wcGVyLXBsYWNlbWVudF49J3JpZ2h0J10gPiAuYXJyb3cge1xuICAgIGxlZnQ6IC00cHg7XG4gIH1cblxuICBoNiB7XG4gICAgY29sb3I6ICR2ZXJkb2NzLWdyZXktMDtcbiAgICBmb250LXNpemU6IDE2cHg7XG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gICAgbWFyZ2luOiAwIDAgOHB4IDA7XG4gIH1cblxuICBmb3JtIHtcbiAgICBtYXJnaW46IDA7XG4gICAgcGFkZGluZzogMDtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIH1cblxuICBsYWJlbCB7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gICAgZm9udC1zaXplOiAxNHB4O1xuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xuICAgIG1hcmdpbjogMCAwIDNweCAwO1xuICAgIGNvbG9yOiAkdmVyZG9jcy1ncmV5LTE7XG4gIH1cblxuICBpbnB1dCB7XG4gICAgZmxleDogMTtcbiAgICBoZWlnaHQ6IDM0cHg7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmb250LXNpemU6IDE0cHg7XG4gICAgbWFyZ2luOiAwIDAgMTBweCAwO1xuICB9XG59XG4iLCJpbXBvcnQge2NyZWF0ZVBvcHBlciwgSW5zdGFuY2V9IGZyb20gJ0Bwb3BwZXJqcy9jb3JlJztcbmltcG9ydCB7Q29tcG9uZW50LCBoLCBIb3N0LCBQcm9wfSBmcm9tICdAc3RlbmNpbC9jb3JlJztcblxuLyoqXG4gKiBEaXNwbGF5cyBhIGNsaWNrYWJsZSBpY29uLiBXaGVuIGNsaWNrZWQsIGEgY3VzdG9taXphYmxlIGRyb3AtZG93biBwYW5lbCB3aWxsIGJlIGRpc3BsYXllZC5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHRhZzogJ3ZlcmRvY3MtYnV0dG9uLXBhbmVsJyxcbiAgc3R5bGVVcmw6ICd2ZXJkb2NzLWJ1dHRvbi1wYW5lbC5zY3NzJyxcbiAgc2hhZG93OiBmYWxzZSxcbn0pXG5leHBvcnQgY2xhc3MgVmVyZG9jc0J1dHRvblBhbmVsIHtcbiAgaWNvbkVsOiBIVE1MRGl2RWxlbWVudDtcbiAgcGFuZWxFbDogSFRNTERpdkVsZW1lbnQ7XG4gIGhpZGVyRWw/OiBIVE1MRGl2RWxlbWVudDtcbiAgcG9wcGVySW5zdGFuY2U6IEluc3RhbmNlO1xuXG4gIC8qKlxuICAgKiBTVkcgaWNvbiB0byBkaXNwbGF5XG4gICAqL1xuICBAUHJvcCgpIGljb246IHN0cmluZyA9ICcnO1xuXG4gIGNvbXBvbmVudERpZFJlbmRlcigpIHtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMucGFuZWxFbCk7XG4gICAgaWYgKHRoaXMucG9wcGVySW5zdGFuY2UpIHtcbiAgICAgIHRoaXMucG9wcGVySW5zdGFuY2UuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHRoaXMucG9wcGVySW5zdGFuY2UgPSBjcmVhdGVQb3BwZXIodGhpcy5pY29uRWwsIHRoaXMucGFuZWxFbCwge1xuICAgICAgLy8gcGxhY2VtZW50OiAndG9wLWVuZCcsXG4gICAgICAvLyBtb2RpZmllcnM6IFt7bmFtZTogJ29mZnNldCcsIG9wdGlvbnM6IHtvZmZzZXQ6IFswLCAxMF19fV0sXG4gICAgfSk7XG4gIH1cblxuICBkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICBpZiAodGhpcy5wb3BwZXJJbnN0YW5jZSkge1xuICAgICAgdGhpcy5wb3BwZXJJbnN0YW5jZS5kZXN0cm95KCk7XG4gICAgICB0aGlzLnBvcHBlckluc3RhbmNlID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYW5lbEVsKSB7XG4gICAgICB0aGlzLnBhbmVsRWwucmVtb3ZlKCk7XG4gICAgfVxuICB9XG5cbiAgc2hvd2luZyA9IGZhbHNlO1xuICB0b2dnbGUoZTogYW55KSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgIGlmICh0aGlzLnNob3dpbmcpIHtcbiAgICAgIHRoaXMucGFuZWxFbD8ucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXNob3cnKTtcbiAgICAgIHRoaXMuaGlkZXJFbD8ucmVtb3ZlKCk7XG4gICAgICB0aGlzLnNob3dpbmcgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wYW5lbEVsPy5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2hvdycsICcnKTtcbiAgICAgIHRoaXMucG9wcGVySW5zdGFuY2U/LnVwZGF0ZSgpLmNhdGNoKCgpID0+IHt9KTtcbiAgICAgIHRoaXMuc2hvd2luZyA9IHRydWU7XG5cbiAgICAgIHRoaXMuaGlkZXJFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdGhpcy5oaWRlckVsLnN0eWxlLnpJbmRleCA9ICcxMDAnO1xuICAgICAgdGhpcy5oaWRlckVsLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgIHRoaXMuaGlkZXJFbC5zdHlsZS50b3AgPSAnMHB4JztcbiAgICAgIHRoaXMuaGlkZXJFbC5zdHlsZS5sZWZ0ID0gJzBweCc7XG4gICAgICB0aGlzLmhpZGVyRWwuc3R5bGUucmlnaHQgPSAnMHB4JztcbiAgICAgIHRoaXMuaGlkZXJFbC5zdHlsZS5ib3R0b20gPSAnMHB4JztcbiAgICAgIHRoaXMuaGlkZXJFbC5vbmNsaWNrID0gKGU6IGFueSkgPT4gdGhpcy50b2dnbGUoZSk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuaGlkZXJFbCk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8SG9zdD5cbiAgICAgICAgPGRpdiBjbGFzcz1cImljb25cIiBpbm5lckhUTUw9e3RoaXMuaWNvbn0gb25DbGljaz17KGU6IGFueSkgPT4gdGhpcy50b2dnbGUoZSl9IHJlZj17ZWwgPT4gKHRoaXMuaWNvbkVsID0gZWwpfSAvPlxuICAgICAgICA8ZGl2IHJvbGU9XCJ0b29sdGlwXCIgY2xhc3M9XCJ2ZXJkb2NzLWJ1dHRvbi1wYW5lbC1jb250ZW50XCIgZGF0YS1wb3BwZXItcGxhY2VtZW50PVwiYm90dG9tXCIgcmVmPXtlbCA9PiAodGhpcy5wYW5lbEVsID0gZWwgYXMgSFRNTERpdkVsZW1lbnQpfT5cbiAgICAgICAgICA8ZGl2IGRhdGEtcG9wcGVyLWFycm93PVwidHJ1ZVwiIGNsYXNzPVwiYXJyb3dcIiAvPlxuICAgICAgICAgIDxzbG90IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9Ib3N0PlxuICAgICk7XG4gIH1cbn1cbiIsIkBpbXBvcnQgJy4uLy4uLy4uL3RoZW1lLnNjc3MnO1xuXG52ZXJkb2NzLXNlbGVjdC1pbnB1dCB7XG4gIGZvbnQtZmFtaWx5OiAkcHJpbWFyeS1mb250O1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICBtYXJnaW46IDAgMCAxMHB4IDA7XG4gIGRpc3BsYXk6IGJsb2NrO1xuXG4gIC5pbnB1dC1lbGVtZW50IHtcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgIGJvcmRlcjogMXB4IHNvbGlkICRib3JkZXItY29sb3I7XG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAgIGJhY2tncm91bmQ6ICR2ZXJkb2NzLWdyZXktNDtcbiAgICBjb2xvcjogIzAwMDtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBmb250LXNpemU6IDE2cHg7XG4gICAgaGVpZ2h0OiAyOHB4O1xuICAgIHBhZGRpbmc6IDRweCAxMnB4O1xuXG4gICAgJjo6cGxhY2Vob2xkZXIge1xuICAgICAgY29sb3I6ICRsaWdodC1kaXNhYmxlZC1jb2xvcjtcbiAgICAgIG9wYWNpdHk6IDE7XG4gICAgfVxuXG4gICAgJjpmb2N1cyB7XG4gICAgICBib3JkZXI6IDFweCBzb2xpZCAkYm9yZGVyLWNvbG9yLWhpZ2hsaWdodDtcbiAgICB9XG4gIH1cblxuICAuaW5wdXQtbGFiZWwge1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIGNvbG9yOiAkbGFiZWwtY29sb3ItbGlnaHQ7XG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICBmb250LXNpemU6IDE0cHg7XG4gICAgbWFyZ2luOiAwIDAgNHB4IDA7XG4gIH1cbn1cbiIsImltcG9ydCB7Q29tcG9uZW50LCBQcm9wLCBTdGF0ZSwgSG9zdCwgaCwgRXZlbnQsIEV2ZW50RW1pdHRlcn0gZnJvbSAnQHN0ZW5jaWwvY29yZSc7XG5cbi8qKlxuICogRGlzcGxheSBhIHRleHQgaW5wdXQgZmllbGQuIFRoaXMgaXMganVzdCBhIHN0YW5kYXJkIEhUTUwgaW5wdXQgZmllbGQgd2l0aCBtaW5pbWFsIG1hcmt1cCB0byBmaXQgdGhlXG4gKiB2aXN1YWwgc3R5bGVzIG9mIHRoZSBvdGhlciBjb21wb25lbnRzLiBOb3RlIHRoYXQgZXZlbnRzIFwiYnViYmxlXCIgZnJvbSB0aGUgaW5wdXQgZmllbGQgdG8gdGhlIGNvbnRhaW5lcixcbiAqIHNvIHlvdSBjYW4gc3Vic2NyaWJlIHRvIHRoZSBzYW1lIERPTSBldmVudHMgKGlucHV0LCBibHVyLCBldGMpIHRoYXQgYSBub3JtYWwgaW5wdXQgd291bGQgZW1taXQuXG4gKi9cbkBDb21wb25lbnQoe1xuICB0YWc6ICd2ZXJkb2NzLXNlbGVjdC1pbnB1dCcsXG4gIHN0eWxlVXJsOiAndmVyZG9jcy1zZWxlY3QtaW5wdXQuc2NzcycsXG59KVxuZXhwb3J0IGNsYXNzIFZlcmRvY3NTZWxlY3RJbnB1dCB7XG4gIC8qKlxuICAgKiBUaGUgaW5pdGlhbCB2YWx1ZSBmb3IgdGhlIGlucHV0IGZpZWxkLlxuICAgKi9cbiAgQFByb3AoKSB2YWx1ZTogc3RyaW5nID0gJyc7XG5cbiAgLyoqXG4gICAqIFRoZSBsYWJlbCBmb3IgdGhlIGZpZWxkLlxuICAgKi9cbiAgQFByb3AoKSBsYWJlbDogc3RyaW5nID0gJyc7XG5cbiAgLyoqXG4gICAqIFRoZSBvcHRpb25zIHRvIGxpc3QuXG4gICAqL1xuICBAUHJvcCgpIG9wdGlvbnM6IHtsYWJlbDogc3RyaW5nOyB2YWx1ZTogc3RyaW5nfVtdO1xuXG4gIC8qKlxuICAgKiBTaG91bGQgdGhlIGZpZWxkIGJlIGRpc2FibGVkP1xuICAgKi9cbiAgQFByb3AoKSBkaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBTdGF0ZSgpIF92YWx1ZTogc3RyaW5nID0gJyc7XG5cbiAgLyoqXG4gICAqIEV2ZW50IGZpcmVkIHdoZW4gdGhlIHNlbGVjdGlvbiBoYXMgY2hhbmdlZFxuICAgKi9cbiAgQEV2ZW50KHtjb21wb3NlZDogdHJ1ZX0pIGZpZWxkQ2hhbmdlOiBFdmVudEVtaXR0ZXI8c3RyaW5nPjtcblxuICBjb21wb25lbnRXaWxsTG9hZCgpIHtcbiAgICB0aGlzLl92YWx1ZSA9IHRoaXMudmFsdWU7XG4gIH1cblxuICBjb21wb25lbnREaWRMb2FkKCkge31cblxuICBoYW5kbGVJbnB1dChlOiBhbnkpIHtcbiAgICB0aGlzLl92YWx1ZSA9IGUudGFyZ2V0LnZhbHVlO1xuICAgIHRoaXMuZmllbGRDaGFuZ2U/LmVtaXQoZS50YXJnZXQudmFsdWUpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8SG9zdCBjbGFzcz1cImlucHV0LWZpZWxkXCI+XG4gICAgICAgIDxsYWJlbD5cbiAgICAgICAgICB7dGhpcy5sYWJlbCA/IDxkaXYgY2xhc3M9XCJpbnB1dC1sYWJlbFwiPnt0aGlzLmxhYmVsICsgJzonfTwvZGl2PiA6IDxkaXYgLz59XG4gICAgICAgICAgPHNlbGVjdCBjbGFzcz1cImlucHV0LWVsZW1lbnRcIiBkaXNhYmxlZD17dGhpcy5kaXNhYmxlZH0gb25JbnB1dD17ZSA9PiB0aGlzLmhhbmRsZUlucHV0KGUpfT5cbiAgICAgICAgICAgIHt0aGlzLm9wdGlvbnMubWFwKG9wdGlvbiA9PiAoXG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9e29wdGlvbi52YWx1ZX0gc2VsZWN0ZWQ9e29wdGlvbi52YWx1ZSA9PT0gdGhpcy52YWx1ZX0+XG4gICAgICAgICAgICAgICAge29wdGlvbi5sYWJlbH1cbiAgICAgICAgICAgICAgPC9vcHRpb24+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgIDwvSG9zdD5cbiAgICApO1xuICB9XG59XG4iLCJAaW1wb3J0ICcuLi8uLi8uLi90aGVtZS5zY3NzJztcblxudmVyZG9jcy10ZXh0LWlucHV0IHtcbiAgZm9udC1mYW1pbHk6ICRwcmltYXJ5LWZvbnQ7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIG1hcmdpbjogMCAwIDEwcHggMDtcbiAgZGlzcGxheTogYmxvY2s7XG5cbiAgLmlucHV0LWVsZW1lbnQge1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgYm9yZGVyOiAxcHggc29saWQgJGJvcmRlci1jb2xvcjtcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgYmFja2dyb3VuZDogJHZlcmRvY3MtZ3JleS00O1xuICAgIGNvbG9yOiAjMDAwO1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICBoZWlnaHQ6IDI4cHg7XG4gICAgcGFkZGluZzogNHB4IDEycHg7XG4gICAgb3V0bGluZTogbm9uZTtcblxuICAgICY6OnBsYWNlaG9sZGVyIHtcbiAgICAgIGNvbG9yOiAkbGlnaHQtZGlzYWJsZWQtY29sb3I7XG4gICAgICBvcGFjaXR5OiAxO1xuICAgIH1cblxuICAgICY6Zm9jdXMge1xuICAgICAgb3V0bGluZTogMXB4IHNvbGlkICRib3JkZXItY29sb3ItaGlnaGxpZ2h0O1xuICAgIH1cbiAgfVxuXG4gIC5pbnB1dC1sYWJlbCB7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gICAgY29sb3I6ICRsYWJlbC1jb2xvci1saWdodDtcbiAgICBmb250LXdlaWdodDogNzAwO1xuICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICBtYXJnaW46IDAgMCA0cHggMDtcbiAgfVxufVxuIiwiaW1wb3J0IHtDb21wb25lbnQsIFByb3AsIFN0YXRlLCBIb3N0LCBofSBmcm9tICdAc3RlbmNpbC9jb3JlJztcblxuLyoqXG4gKiBEaXNwbGF5IGEgdGV4dCBpbnB1dCBmaWVsZC4gVGhpcyBpcyBqdXN0IGEgc3RhbmRhcmQgSFRNTCBpbnB1dCBmaWVsZCB3aXRoIG1pbmltYWwgbWFya3VwIHRvIGZpdCB0aGVcbiAqIHZpc3VhbCBzdHlsZXMgb2YgdGhlIG90aGVyIGNvbXBvbmVudHMuIE5vdGUgdGhhdCBldmVudHMgXCJidWJibGVcIiBmcm9tIHRoZSBpbnB1dCBmaWVsZCB0byB0aGUgY29udGFpbmVyLFxuICogc28geW91IGNhbiBzdWJzY3JpYmUgdG8gdGhlIHNhbWUgRE9NIGV2ZW50cyAoaW5wdXQsIGJsdXIsIGV0YykgdGhhdCBhIG5vcm1hbCBpbnB1dCB3b3VsZCBlbW1pdC5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHRhZzogJ3ZlcmRvY3MtdGV4dC1pbnB1dCcsXG4gIHN0eWxlVXJsOiAndmVyZG9jcy10ZXh0LWlucHV0LnNjc3MnLFxufSlcbmV4cG9ydCBjbGFzcyBWZXJkb2NzVGV4dElucHV0IHtcbiAgLyoqXG4gICAqIFRoZSBpbml0aWFsIHZhbHVlIGZvciB0aGUgaW5wdXQgZmllbGQuXG4gICAqL1xuICBAUHJvcCgpIHZhbHVlOiBzdHJpbmcgPSAnJztcblxuICAvKipcbiAgICogVGhlIGxhYmVsIGZvciB0aGUgZmllbGQuXG4gICAqL1xuICBAUHJvcCgpIGxhYmVsOiBzdHJpbmcgPSAnJztcblxuICAvKipcbiAgICogVGhlIHBsYWNlaG9sZGVyIGZvciB0aGUgZmllbGQuXG4gICAqL1xuICBAUHJvcCgpIHBsYWNlaG9sZGVyOiBzdHJpbmcgPSAnJztcblxuICAvKipcbiAgICogSWYgZGVzaXJlZCwgdGhlIGF1dG9jb21wbGV0ZSBhdHRyaWJ1dGUgdG8gc2V0LlxuICAgKi9cbiAgQFByb3AoKSBhdXRvY29tcGxldGU6IHN0cmluZyA9ICcnO1xuXG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiBmaWVsZCB0byByZW5kZXIuIE9ubHkgdGV4dC10eXBlIGZpZWxkcyBhcmUgYWxsb3dlZCBoZXJlIGZvciB0aGUgY3VycmVudCBzdHlsaW5nLiBBZGRpdGlvbmFsIHR5cGVzXG4gICAqIChlLmcuIGEgZGF0ZSBwaWNrZXIpIHdpbGwgYmUgc3VwcG9ydGVkIGJ5IG90aGVyIGNvbnRyb2xzIGluIHRoZSBmdXR1cmUuXG4gICAqL1xuICBAUHJvcCgpIHR5cGU6ICd0ZXh0JyB8ICdwYXNzd29yZCcgfCAnZW1haWwnIHwgJ251bWJlcicgfCAnc2VhcmNoJyB8ICd0ZWwnIHwgJ3VybCcgPSAndGV4dCc7XG5cbiAgLyoqXG4gICAqIFNob3VsZCB0aGUgZmllbGQgYmUgZGlzYWJsZWQ/XG4gICAqL1xuICBAUHJvcCgpIGRpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgQFN0YXRlKCkgX3ZhbHVlOiBzdHJpbmcgPSAnJztcblxuICBjb21wb25lbnRXaWxsTG9hZCgpIHtcbiAgICAvLyB0aGlzLl92YWx1ZSA9IHRoaXMudmFsdWU7XG4gIH1cblxuICBjb21wb25lbnREaWRMb2FkKCkge31cblxuICAvLyBoYW5kbGVJbnB1dChlOiBhbnkpIHtcbiAgLy8gICB0aGlzLl92YWx1ZSA9IGUudGFyZ2V0LnZhbHVlO1xuICAvLyB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8SG9zdCBjbGFzcz1cImlucHV0LWZpZWxkXCI+XG4gICAgICAgIDxsYWJlbD5cbiAgICAgICAgICB7dGhpcy5sYWJlbCA/IDxkaXYgY2xhc3M9XCJpbnB1dC1sYWJlbFwiPnt0aGlzLmxhYmVsICsgJzonfTwvZGl2PiA6IDxkaXYgLz59XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICB0eXBlPXt0aGlzLnR5cGV9XG4gICAgICAgICAgICB2YWx1ZT17dGhpcy52YWx1ZX1cbiAgICAgICAgICAgIGNsYXNzPVwiaW5wdXQtZWxlbWVudFwiXG4gICAgICAgICAgICBkYXRhLWxwaWdub3JlPVwidHJ1ZVwiXG4gICAgICAgICAgICBkaXNhYmxlZD17dGhpcy5kaXNhYmxlZH1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPXt0aGlzLnBsYWNlaG9sZGVyfVxuICAgICAgICAgICAgYXV0b0NvbXBsZXRlPXt0aGlzLmF1dG9jb21wbGV0ZX1cbiAgICAgICAgICAgIC8vIG9uSW5wdXQ9e2UgPT4gdGhpcy5oYW5kbGVJbnB1dChlKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2xhYmVsPlxuICAgICAgPC9Ib3N0PlxuICAgICk7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=