(window.webpackJsonp=window.webpackJsonp||[]).push([[49],{"./dist/esm/verdocs-file-chooser_2.entry.js":function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,"verdocs_file_chooser",(function(){return VerdocsFileChooser})),__webpack_require__.d(__webpack_exports__,"verdocs_progress_bar",(function(){return VerdocsProgressBar}));__webpack_require__("./node_modules/core-js/modules/es.function.name.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js"),__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"),__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"),__webpack_require__("./node_modules/core-js/modules/es.object.define-property.js");var _index_9ee0ca9f_js__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./dist/esm/index-9ee0ca9f.js"),_VerdocsEndpoint_4367eb13_js__WEBPACK_IMPORTED_MODULE_10__=(__webpack_require__("./dist/esm/Types-5f31149e.js"),__webpack_require__("./dist/esm/VerdocsEndpoint-4367eb13.js"));function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,(arg=descriptor.key,key=void 0,"symbol"==typeof(key=function _toPrimitive(input,hint){if("object"!=typeof input||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!=typeof res)return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string"))?key:String(key)),descriptor)}var arg,key}function _createClass(Constructor,protoProps,staticProps){return protoProps&&_defineProperties(Constructor.prototype,protoProps),staticProps&&_defineProperties(Constructor,staticProps),Object.defineProperty(Constructor,"prototype",{writable:!1}),Constructor}var VerdocsFileChooser=function(){function VerdocsFileChooser(hostRef){_classCallCheck(this,VerdocsFileChooser),Object(_index_9ee0ca9f_js__WEBPACK_IMPORTED_MODULE_8__.j)(this,hostRef),this.fileSelected=Object(_index_9ee0ca9f_js__WEBPACK_IMPORTED_MODULE_8__.e)(this,"fileSelected",7),this.endpoint=_VerdocsEndpoint_4367eb13_js__WEBPACK_IMPORTED_MODULE_10__.b.getDefault(),this.file=void 0}return _createClass(VerdocsFileChooser,[{key:"handleFileChanged",value:function handleFileChanged(e){var _a,_b;this.file=(null===(_a=e.target.files)||void 0===_a?void 0:_a[0])||null,null===(_b=this.fileSelected)||void 0===_b||_b.emit({file:this.file}),console.debug("[CHOOSER] Selected file",this.file)}},{key:"handleSelectFile",value:function handleSelectFile(e){var _a,_b;console.log("sf"),e.stopPropagation(),this.file=null,null===(_a=this.fileSelected)||void 0===_a||_a.emit({file:null}),null===(_b=document.getElementById("verdocs-file-chooser"))||void 0===_b||_b.click()}},{key:"render",value:function render(){var _this=this,buttonlabel=this.file?"Select a different file":"Select a file from your computer";return Object(_index_9ee0ca9f_js__WEBPACK_IMPORTED_MODULE_8__.h)(_index_9ee0ca9f_js__WEBPACK_IMPORTED_MODULE_8__.b,null,Object(_index_9ee0ca9f_js__WEBPACK_IMPORTED_MODULE_8__.h)("input",{type:"file",multiple:!0,id:"verdocs-file-chooser",accept:"application/pdf,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",style:{display:"none"},onChange:function onChange(e){return _this.handleFileChanged(e)}}),Object(_index_9ee0ca9f_js__WEBPACK_IMPORTED_MODULE_8__.h)("div",{class:"upload-box"},Object(_index_9ee0ca9f_js__WEBPACK_IMPORTED_MODULE_8__.h)("div",{innerHTML:'<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"></path></svg>'}),Object(_index_9ee0ca9f_js__WEBPACK_IMPORTED_MODULE_8__.h)("div",{class:"selected-filename"},this.file?this.file.name:"Drag a file here"),Object(_index_9ee0ca9f_js__WEBPACK_IMPORTED_MODULE_8__.h)("div",{class:"or-prefer"},this.file?" ":"Or, if you prefer..."),Object(_index_9ee0ca9f_js__WEBPACK_IMPORTED_MODULE_8__.h)("verdocs-button",{label:buttonlabel,size:"small",onClick:function onClick(e){return _this.handleSelectFile(e)}})))}}]),VerdocsFileChooser}();VerdocsFileChooser.style='verdocs-file-chooser{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;background-color:#ffffff;font-family:"Inter", -apple-system, "Segoe UI", "Roboto", "Helvetica Neue", sans-serif}verdocs-file-chooser .upload-box{text-align:center;-webkit-box-sizing:border-box;box-sizing:border-box;padding:44px 18px 66px;color:rgba(0, 0, 0, 0.54)}verdocs-file-chooser .upload-box svg{width:64px;height:64px;fill:#5c6575}verdocs-file-chooser .selected-filename{font-size:20px;margin-top:20px;font-weight:bold;overflow-wrap:anywhere}verdocs-file-chooser .or-prefer{height:20px;margin:20px 0;font-size:16px}';var VerdocsProgressBar=function(){function VerdocsProgressBar(hostRef){_classCallCheck(this,VerdocsProgressBar),Object(_index_9ee0ca9f_js__WEBPACK_IMPORTED_MODULE_8__.j)(this,hostRef),this.label="",this.showPercent=!1,this.percent=0}return _createClass(VerdocsProgressBar,[{key:"render",value:function render(){var widthPercent=Math.ceil(100*Math.min(this.percent,100)/100);return Object(_index_9ee0ca9f_js__WEBPACK_IMPORTED_MODULE_8__.h)(_index_9ee0ca9f_js__WEBPACK_IMPORTED_MODULE_8__.b,null,Object(_index_9ee0ca9f_js__WEBPACK_IMPORTED_MODULE_8__.h)("div",{class:"labels"},this.label&&Object(_index_9ee0ca9f_js__WEBPACK_IMPORTED_MODULE_8__.h)("div",{class:"label"},this.label),this.showPercent&&Object(_index_9ee0ca9f_js__WEBPACK_IMPORTED_MODULE_8__.h)("div",{class:"label"},this.percent,"%")),Object(_index_9ee0ca9f_js__WEBPACK_IMPORTED_MODULE_8__.h)("div",{class:"bar"},Object(_index_9ee0ca9f_js__WEBPACK_IMPORTED_MODULE_8__.h)("div",{class:"slider",style:{width:widthPercent+"%"}})))}}]),VerdocsProgressBar}();VerdocsProgressBar.style='verdocs-progress-bar{font-family:"Barlow", sans-serif;width:100%;display:-ms-flexbox;display:flex;-ms-flex-wrap:nowrap;flex-wrap:nowrap;-webkit-box-sizing:border-box;box-sizing:border-box;-ms-flex-direction:column;flex-direction:column}verdocs-progress-bar .labels{display:-ms-flexbox;display:flex;margin:0 0 8px 0;-ms-flex-direction:row;flex-direction:row;-ms-flex-pack:justify;justify-content:space-between}verdocs-progress-bar .labels .label{display:-ms-flexbox;display:flex;font-size:14px;font-weight:600;color:#33364b}verdocs-progress-bar .bar{display:-ms-flexbox;display:flex;-ms-flex:0 0 10px;flex:0 0 10px;border-radius:5px;background-color:#cccccc}verdocs-progress-bar .bar .slider{display:-ms-flexbox;display:flex;border-radius:5px;background-color:#55bc81}'}}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9kaXN0L2VzbS92ZXJkb2NzLWZpbGUtY2hvb3Nlcl8yLmVudHJ5LmpzIl0sIm5hbWVzIjpbIlZlcmRvY3NGaWxlQ2hvb3NlciIsImhvc3RSZWYiLCJyZWdpc3Rlckluc3RhbmNlIiwidGhpcyIsImZpbGVTZWxlY3RlZCIsImNyZWF0ZUV2ZW50IiwiZW5kcG9pbnQiLCJWZXJkb2NzRW5kcG9pbnQiLCJnZXREZWZhdWx0IiwiZmlsZSIsInVuZGVmaW5lZCIsImhhbmRsZUZpbGVDaGFuZ2VkIiwiZSIsIl9hIiwiX2IiLCJ0YXJnZXQiLCJmaWxlcyIsImVtaXQiLCJjb25zb2xlIiwiZGVidWciLCJoYW5kbGVTZWxlY3RGaWxlIiwibG9nIiwic3RvcFByb3BhZ2F0aW9uIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImNsaWNrIiwicmVuZGVyIiwiYnV0dG9ubGFiZWwiLCJoIiwiSG9zdCIsInR5cGUiLCJtdWx0aXBsZSIsImlkIiwiYWNjZXB0Iiwic3R5bGUiLCJkaXNwbGF5Iiwib25DaGFuZ2UiLCJjbGFzcyIsImlubmVySFRNTCIsIm5hbWUiLCJsYWJlbCIsInNpemUiLCJvbkNsaWNrIiwiVmVyZG9jc1Byb2dyZXNzQmFyIiwic2hvd1BlcmNlbnQiLCJwZXJjZW50Iiwid2lkdGhQZXJjZW50IiwiTWF0aCIsImNlaWwiLCJtaW4iLCJ3aWR0aCJdLCJtYXBwaW5ncyI6IjAyRUFJQSxJQUlNQSxtQkFBa0IsV0FDdEIsNEJBQVlDLFNBQVMseUNBQ25CQywwREFBaUJDLEtBQU1GLFNBQ3ZCRSxLQUFLQyxhQUFlQywwREFBWUYsS0FBTSxlQUFnQixHQUN0REEsS0FBS0csU0FBV0MsNkRBQWdCQyxhQUNoQ0wsS0FBS00sVUFBT0MsQ0FDZCxDQWtCQyxPQWxCQSxnRUFDRCxTQUFBQyxrQkFBa0JDLEdBQ2hCLElBQUlDLEdBQUlDLEdBQ1JYLEtBQUtNLE1BQWtDLFFBQXpCSSxHQUFLRCxFQUFFRyxPQUFPQyxhQUEwQixJQUFQSCxRQUFnQixFQUFTQSxHQUFHLEtBQU8sS0FDckQsUUFBNUJDLEdBQUtYLEtBQUtDLG9CQUFpQyxJQUFQVSxJQUF5QkEsR0FBR0csS0FBSyxDQUFFUixLQUFNTixLQUFLTSxPQUNuRlMsUUFBUUMsTUFBTSwwQkFBMkJoQixLQUFLTSxLQUNoRCxHQUFDLDhCQUNELFNBQUFXLGlCQUFpQlIsR0FDZixJQUFJQyxHQUFJQyxHQUNSSSxRQUFRRyxJQUFJLE1BQ1pULEVBQUVVLGtCQUNGbkIsS0FBS00sS0FBTyxLQUNpQixRQUE1QkksR0FBS1YsS0FBS0Msb0JBQWlDLElBQVBTLElBQXlCQSxHQUFHSSxLQUFLLENBQUVSLEtBQU0sT0FDbkIsUUFBMURLLEdBQUtTLFNBQVNDLGVBQWUsK0JBQTRDLElBQVBWLElBQXlCQSxHQUFHVyxPQUNqRyxHQUFDLG9CQUNELFNBQUFDLFNBQVMsZUFDREMsWUFBY3hCLEtBQUtNLEtBQU8sMEJBQTRCLG1DQUM1RCxPQUFRbUIsMERBQUVDLGtEQUFNLEtBQU1ELDBEQUFFLFFBQVMsQ0FBRUUsS0FBTSxPQUFRQyxVQUFVLEVBQU1DLEdBQUksdUJBQXdCQyxPQUFRLDZIQUE4SEMsTUFBTyxDQUFFQyxRQUFTLFFBQVVDLFNBQVUsa0JBQUF4QixHQUFDLE9BQUksTUFBS0Qsa0JBQWtCQyxFQUFFLElBQUtnQiwwREFBRSxNQUFPLENBQUVTLE1BQU8sY0FBZ0JULDBEQUFFLE1BQU8sQ0FBRVUsVUF4QjVVLDBMQXdCb1dWLDBEQUFFLE1BQU8sQ0FBRVMsTUFBTyxxQkFBdUJsQyxLQUFLTSxLQUFPTixLQUFLTSxLQUFLOEIsS0FBTyxvQkFBcUJYLDBEQUFFLE1BQU8sQ0FBRVMsTUFBTyxhQUFlbEMsS0FBS00sS0F6QmxlLElBeUJ1Zix3QkFBeUJtQiwwREFBRSxpQkFBa0IsQ0FBRVksTUFBT2IsWUFBYWMsS0FBTSxRQUFTQyxRQUFTLGlCQUFBOUIsR0FBQyxPQUFJLE1BQUtRLGlCQUFpQlIsRUFBRSxLQUNqb0IsS0FBQyxtQkF4QnFCLEdBMEJ4QlosbUJBQW1Ca0MsTUE5Qlcsa25CQWdDOUIsSUFFTVMsbUJBQWtCLFdBQ3RCLDRCQUFZMUMsU0FBUyx5Q0FDbkJDLDBEQUFpQkMsS0FBTUYsU0FDdkJFLEtBQUtxQyxNQUFRLEdBQ2JyQyxLQUFLeUMsYUFBYyxFQUNuQnpDLEtBQUswQyxRQUFVLENBQ2pCLENBSUMsT0FKQSxxREFDRCxTQUFBbkIsU0FDRSxJQUFNb0IsYUFBZUMsS0FBS0MsS0FBTSxJQUFNRCxLQUFLRSxJQUFJOUMsS0FBSzBDLFFBQVMsS0FBUSxLQUNyRSxPQUFRakIsMERBQUVDLGtEQUFNLEtBQU1ELDBEQUFFLE1BQU8sQ0FBRVMsTUFBTyxVQUFZbEMsS0FBS3FDLE9BQVNaLDBEQUFFLE1BQU8sQ0FBRVMsTUFBTyxTQUFXbEMsS0FBS3FDLE9BQVFyQyxLQUFLeUMsYUFBZWhCLDBEQUFFLE1BQU8sQ0FBRVMsTUFBTyxTQUFXbEMsS0FBSzBDLFFBQVMsTUFBT2pCLDBEQUFFLE1BQU8sQ0FBRVMsTUFBTyxPQUFTVCwwREFBRSxNQUFPLENBQUVTLE1BQU8sU0FBVUgsTUFBTyxDQUFFZ0IsTUFBVUosYUFBWSxRQUMxUSxLQUFDLG1CQVZxQixHQVl4QkgsbUJBQW1CVCxNQWRXLGl3QiIsImZpbGUiOiI0OS5iMDhmNzBkMS5pZnJhbWUuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgciBhcyByZWdpc3Rlckluc3RhbmNlLCBjIGFzIGNyZWF0ZUV2ZW50LCBoLCBIIGFzIEhvc3QgfSBmcm9tICcuL2luZGV4LTllZTBjYTlmLmpzJztcbmltcG9ydCAnLi9UeXBlcy01ZjMxMTQ5ZS5qcyc7XG5pbXBvcnQgeyBWIGFzIFZlcmRvY3NFbmRwb2ludCB9IGZyb20gJy4vVmVyZG9jc0VuZHBvaW50LTQzNjdlYjEzLmpzJztcblxuY29uc3QgdmVyZG9jc0ZpbGVDaG9vc2VyQ3NzID0gXCJ2ZXJkb2NzLWZpbGUtY2hvb3NlcntkaXNwbGF5Oi1tcy1mbGV4Ym94O2Rpc3BsYXk6ZmxleDstbXMtZmxleC1kaXJlY3Rpb246Y29sdW1uO2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtiYWNrZ3JvdW5kLWNvbG9yOiNmZmZmZmY7Zm9udC1mYW1pbHk6XFxcIkludGVyXFxcIiwgLWFwcGxlLXN5c3RlbSwgXFxcIlNlZ29lIFVJXFxcIiwgXFxcIlJvYm90b1xcXCIsIFxcXCJIZWx2ZXRpY2EgTmV1ZVxcXCIsIHNhbnMtc2VyaWZ9dmVyZG9jcy1maWxlLWNob29zZXIgLnVwbG9hZC1ib3h7dGV4dC1hbGlnbjpjZW50ZXI7LXdlYmtpdC1ib3gtc2l6aW5nOmJvcmRlci1ib3g7Ym94LXNpemluZzpib3JkZXItYm94O3BhZGRpbmc6NDRweCAxOHB4IDY2cHg7Y29sb3I6cmdiYSgwLCAwLCAwLCAwLjU0KX12ZXJkb2NzLWZpbGUtY2hvb3NlciAudXBsb2FkLWJveCBzdmd7d2lkdGg6NjRweDtoZWlnaHQ6NjRweDtmaWxsOiM1YzY1NzV9dmVyZG9jcy1maWxlLWNob29zZXIgLnNlbGVjdGVkLWZpbGVuYW1le2ZvbnQtc2l6ZToyMHB4O21hcmdpbi10b3A6MjBweDtmb250LXdlaWdodDpib2xkO292ZXJmbG93LXdyYXA6YW55d2hlcmV9dmVyZG9jcy1maWxlLWNob29zZXIgLm9yLXByZWZlcntoZWlnaHQ6MjBweDttYXJnaW46MjBweCAwO2ZvbnQtc2l6ZToxNnB4fVwiO1xuXG5jb25zdCB1bmljb2RlTkJTUCA9ICcgJztcbmNvbnN0IEZpbGVJY29uID0gJzxzdmcgZm9jdXNhYmxlPVwiZmFsc2VcIiBhcmlhLWhpZGRlbj1cInRydWVcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PHBhdGggZD1cIk02IDJjLTEuMSAwLTEuOTkuOS0xLjk5IDJMNCAyMGMwIDEuMS44OSAyIDEuOTkgMkgxOGMxLjEgMCAyLS45IDItMlY4bC02LTZINnptNyA3VjMuNUwxOC41IDlIMTN6XCI+PC9wYXRoPjwvc3ZnPic7XG5jb25zdCBWZXJkb2NzRmlsZUNob29zZXIgPSBjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKGhvc3RSZWYpIHtcbiAgICByZWdpc3Rlckluc3RhbmNlKHRoaXMsIGhvc3RSZWYpO1xuICAgIHRoaXMuZmlsZVNlbGVjdGVkID0gY3JlYXRlRXZlbnQodGhpcywgXCJmaWxlU2VsZWN0ZWRcIiwgNyk7XG4gICAgdGhpcy5lbmRwb2ludCA9IFZlcmRvY3NFbmRwb2ludC5nZXREZWZhdWx0KCk7XG4gICAgdGhpcy5maWxlID0gdW5kZWZpbmVkO1xuICB9XG4gIGhhbmRsZUZpbGVDaGFuZ2VkKGUpIHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIHRoaXMuZmlsZSA9ICgoX2EgPSBlLnRhcmdldC5maWxlcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hWzBdKSB8fCBudWxsO1xuICAgIChfYiA9IHRoaXMuZmlsZVNlbGVjdGVkKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuZW1pdCh7IGZpbGU6IHRoaXMuZmlsZSB9KTtcbiAgICBjb25zb2xlLmRlYnVnKCdbQ0hPT1NFUl0gU2VsZWN0ZWQgZmlsZScsIHRoaXMuZmlsZSk7XG4gIH1cbiAgaGFuZGxlU2VsZWN0RmlsZShlKSB7XG4gICAgdmFyIF9hLCBfYjtcbiAgICBjb25zb2xlLmxvZygnc2YnKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHRoaXMuZmlsZSA9IG51bGw7XG4gICAgKF9hID0gdGhpcy5maWxlU2VsZWN0ZWQpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5lbWl0KHsgZmlsZTogbnVsbCB9KTtcbiAgICAoX2IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmVyZG9jcy1maWxlLWNob29zZXInKSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNsaWNrKCk7XG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGJ1dHRvbmxhYmVsID0gdGhpcy5maWxlID8gJ1NlbGVjdCBhIGRpZmZlcmVudCBmaWxlJyA6ICdTZWxlY3QgYSBmaWxlIGZyb20geW91ciBjb21wdXRlcic7XG4gICAgcmV0dXJuIChoKEhvc3QsIG51bGwsIGgoXCJpbnB1dFwiLCB7IHR5cGU6IFwiZmlsZVwiLCBtdWx0aXBsZTogdHJ1ZSwgaWQ6IFwidmVyZG9jcy1maWxlLWNob29zZXJcIiwgYWNjZXB0OiBcImFwcGxpY2F0aW9uL3BkZiwucGRmLC5kb2MsLmRvY3gsYXBwbGljYXRpb24vbXN3b3JkLGFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC53b3JkcHJvY2Vzc2luZ21sLmRvY3VtZW50XCIsIHN0eWxlOiB7IGRpc3BsYXk6ICdub25lJyB9LCBvbkNoYW5nZTogZSA9PiB0aGlzLmhhbmRsZUZpbGVDaGFuZ2VkKGUpIH0pLCBoKFwiZGl2XCIsIHsgY2xhc3M6IFwidXBsb2FkLWJveFwiIH0sIGgoXCJkaXZcIiwgeyBpbm5lckhUTUw6IEZpbGVJY29uIH0pLCBoKFwiZGl2XCIsIHsgY2xhc3M6IFwic2VsZWN0ZWQtZmlsZW5hbWVcIiB9LCB0aGlzLmZpbGUgPyB0aGlzLmZpbGUubmFtZSA6ICdEcmFnIGEgZmlsZSBoZXJlJyksIGgoXCJkaXZcIiwgeyBjbGFzczogXCJvci1wcmVmZXJcIiB9LCB0aGlzLmZpbGUgPyB1bmljb2RlTkJTUCA6ICdPciwgaWYgeW91IHByZWZlci4uLicpLCBoKFwidmVyZG9jcy1idXR0b25cIiwgeyBsYWJlbDogYnV0dG9ubGFiZWwsIHNpemU6IFwic21hbGxcIiwgb25DbGljazogZSA9PiB0aGlzLmhhbmRsZVNlbGVjdEZpbGUoZSkgfSkpKSk7XG4gIH1cbn07XG5WZXJkb2NzRmlsZUNob29zZXIuc3R5bGUgPSB2ZXJkb2NzRmlsZUNob29zZXJDc3M7XG5cbmNvbnN0IHZlcmRvY3NQcm9ncmVzc0JhckNzcyA9IFwidmVyZG9jcy1wcm9ncmVzcy1iYXJ7Zm9udC1mYW1pbHk6XFxcIkJhcmxvd1xcXCIsIHNhbnMtc2VyaWY7d2lkdGg6MTAwJTtkaXNwbGF5Oi1tcy1mbGV4Ym94O2Rpc3BsYXk6ZmxleDstbXMtZmxleC13cmFwOm5vd3JhcDtmbGV4LXdyYXA6bm93cmFwOy13ZWJraXQtYm94LXNpemluZzpib3JkZXItYm94O2JveC1zaXppbmc6Ym9yZGVyLWJveDstbXMtZmxleC1kaXJlY3Rpb246Y29sdW1uO2ZsZXgtZGlyZWN0aW9uOmNvbHVtbn12ZXJkb2NzLXByb2dyZXNzLWJhciAubGFiZWxze2Rpc3BsYXk6LW1zLWZsZXhib3g7ZGlzcGxheTpmbGV4O21hcmdpbjowIDAgOHB4IDA7LW1zLWZsZXgtZGlyZWN0aW9uOnJvdztmbGV4LWRpcmVjdGlvbjpyb3c7LW1zLWZsZXgtcGFjazpqdXN0aWZ5O2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVufXZlcmRvY3MtcHJvZ3Jlc3MtYmFyIC5sYWJlbHMgLmxhYmVse2Rpc3BsYXk6LW1zLWZsZXhib3g7ZGlzcGxheTpmbGV4O2ZvbnQtc2l6ZToxNHB4O2ZvbnQtd2VpZ2h0OjYwMDtjb2xvcjojMzMzNjRifXZlcmRvY3MtcHJvZ3Jlc3MtYmFyIC5iYXJ7ZGlzcGxheTotbXMtZmxleGJveDtkaXNwbGF5OmZsZXg7LW1zLWZsZXg6MCAwIDEwcHg7ZmxleDowIDAgMTBweDtib3JkZXItcmFkaXVzOjVweDtiYWNrZ3JvdW5kLWNvbG9yOiNjY2NjY2N9dmVyZG9jcy1wcm9ncmVzcy1iYXIgLmJhciAuc2xpZGVye2Rpc3BsYXk6LW1zLWZsZXhib3g7ZGlzcGxheTpmbGV4O2JvcmRlci1yYWRpdXM6NXB4O2JhY2tncm91bmQtY29sb3I6IzU1YmM4MX1cIjtcblxuY29uc3QgVmVyZG9jc1Byb2dyZXNzQmFyID0gY2xhc3Mge1xuICBjb25zdHJ1Y3Rvcihob3N0UmVmKSB7XG4gICAgcmVnaXN0ZXJJbnN0YW5jZSh0aGlzLCBob3N0UmVmKTtcbiAgICB0aGlzLmxhYmVsID0gJyc7XG4gICAgdGhpcy5zaG93UGVyY2VudCA9IGZhbHNlO1xuICAgIHRoaXMucGVyY2VudCA9IDA7XG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHdpZHRoUGVyY2VudCA9IE1hdGguY2VpbCgoMTAwICogTWF0aC5taW4odGhpcy5wZXJjZW50LCAxMDApKSAvIDEwMCk7XG4gICAgcmV0dXJuIChoKEhvc3QsIG51bGwsIGgoXCJkaXZcIiwgeyBjbGFzczogXCJsYWJlbHNcIiB9LCB0aGlzLmxhYmVsICYmIGgoXCJkaXZcIiwgeyBjbGFzczogXCJsYWJlbFwiIH0sIHRoaXMubGFiZWwpLCB0aGlzLnNob3dQZXJjZW50ICYmIGgoXCJkaXZcIiwgeyBjbGFzczogXCJsYWJlbFwiIH0sIHRoaXMucGVyY2VudCwgXCIlXCIpKSwgaChcImRpdlwiLCB7IGNsYXNzOiBcImJhclwiIH0sIGgoXCJkaXZcIiwgeyBjbGFzczogXCJzbGlkZXJcIiwgc3R5bGU6IHsgd2lkdGg6IGAke3dpZHRoUGVyY2VudH0lYCB9IH0pKSkpO1xuICB9XG59O1xuVmVyZG9jc1Byb2dyZXNzQmFyLnN0eWxlID0gdmVyZG9jc1Byb2dyZXNzQmFyQ3NzO1xuXG5leHBvcnQgeyBWZXJkb2NzRmlsZUNob29zZXIgYXMgdmVyZG9jc19maWxlX2Nob29zZXIsIFZlcmRvY3NQcm9ncmVzc0JhciBhcyB2ZXJkb2NzX3Byb2dyZXNzX2JhciB9O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==