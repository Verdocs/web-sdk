(window.webpackJsonp=window.webpackJsonp||[]).push([[46],{"./dist/esm/verdocs-ok-dialog.entry.js":function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,"verdocs_ok_dialog",(function(){return VerdocsOkDialog}));__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js"),__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"),__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"),__webpack_require__("./node_modules/core-js/modules/es.object.define-property.js");var _index_f78d163d_js__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./dist/esm/index-f78d163d.js");function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,(arg=descriptor.key,key=void 0,"symbol"==typeof(key=function _toPrimitive(input,hint){if("object"!=typeof input||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!=typeof res)return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string"))?key:String(key)),descriptor)}var arg,key}var VerdocsOkDialog=function(){function VerdocsOkDialog(hostRef){!function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}(this,VerdocsOkDialog),Object(_index_f78d163d_js__WEBPACK_IMPORTED_MODULE_7__.j)(this,hostRef),this.closed=Object(_index_f78d163d_js__WEBPACK_IMPORTED_MODULE_7__.e)(this,"closed",7),this.heading="",this.message="",this.open=!1,this.cancel=!1}return function _createClass(Constructor,protoProps,staticProps){return protoProps&&_defineProperties(Constructor.prototype,protoProps),staticProps&&_defineProperties(Constructor,staticProps),Object.defineProperty(Constructor,"prototype",{writable:!1}),Constructor}(VerdocsOkDialog,[{key:"handleClose",value:function handleClose(reason){this.closed.emit(reason),this.open=!1}},{key:"handleDismiss",value:function handleDismiss(e){"background-overlay"===e.target.className&&(e.preventDefault(),this.handleClose("cancel"))}},{key:"render",value:function render(){var _this=this;return Object(_index_f78d163d_js__WEBPACK_IMPORTED_MODULE_7__.h)(_index_f78d163d_js__WEBPACK_IMPORTED_MODULE_7__.b,{style:{display:this.open?"block":"none"}},Object(_index_f78d163d_js__WEBPACK_IMPORTED_MODULE_7__.h)("div",{class:"background-overlay",onClick:function onClick(e){return _this.handleDismiss(e)}},Object(_index_f78d163d_js__WEBPACK_IMPORTED_MODULE_7__.h)("div",{class:"dialog"},Object(_index_f78d163d_js__WEBPACK_IMPORTED_MODULE_7__.h)("div",{class:"heading"},this.heading),Object(_index_f78d163d_js__WEBPACK_IMPORTED_MODULE_7__.h)("div",{class:"content"},this.message,Object(_index_f78d163d_js__WEBPACK_IMPORTED_MODULE_7__.h)("div",{class:"buttons"},this.cancel?Object(_index_f78d163d_js__WEBPACK_IMPORTED_MODULE_7__.h)("verdocs-button",{label:"CANCEL",variant:"outline",onPress:function onPress(){return _this.handleClose("cancel")}}):Object(_index_f78d163d_js__WEBPACK_IMPORTED_MODULE_7__.h)("div",{style:{display:"none"}}),Object(_index_f78d163d_js__WEBPACK_IMPORTED_MODULE_7__.h)("verdocs-button",{label:"OK",onPress:function onPress(){return _this.handleClose("ok")}}))))))}}]),VerdocsOkDialog}();VerdocsOkDialog.style='verdocs-ok-dialog{font-family:"Barlow", sans-serif;-webkit-box-sizing:border-box;box-sizing:border-box}verdocs-ok-dialog .background-overlay{position:absolute;z-index:10000;top:0;left:0;right:0;bottom:0;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;background:#0000007f}verdocs-ok-dialog .dialog{max-width:50%;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;border-radius:4px;overflow:hidden;-webkit-box-shadow:3px 3px 5px 1px rgba(40, 40, 40, 0.4);box-shadow:3px 3px 5px 1px rgba(40, 40, 40, 0.4)}verdocs-ok-dialog .heading{display:-ms-flexbox;display:flex;font-size:16px;-ms-flex-direction:row;flex-direction:row;background:#444444;padding:8px 16px;color:#ffffff}verdocs-ok-dialog .content{font-size:16px;background:#ffffff;padding:20px}verdocs-ok-dialog .buttons{display:-ms-flexbox;display:flex;margin:20px 0 0 0;-ms-flex-direction:row;flex-direction:row;-ms-flex-align:center;align-items:center;-ms-flex-pack:end;justify-content:flex-end}verdocs-ok-dialog .buttons verdocs-button{margin-left:16px}'}}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vc3JjL2NvbXBvbmVudHMvZGlhbG9ncy92ZXJkb2NzLW9rLWRpYWxvZy92ZXJkb2NzLW9rLWRpYWxvZy5zY3NzIiwid2VicGFjazovLy9zcmMvY29tcG9uZW50cy9kaWFsb2dzL3ZlcmRvY3Mtb2stZGlhbG9nL3ZlcmRvY3Mtb2stZGlhbG9nLnRzeCJdLCJuYW1lcyI6WyJWZXJkb2NzT2tEaWFsb2ciLCJoYW5kbGVDbG9zZSIsInJlYXNvbiIsInRoaXMiLCJjbG9zZWQiLCJlbWl0Iiwib3BlbiIsImhhbmRsZURpc21pc3MiLCJlIiwidGFyZ2V0IiwiY2xhc3NOYW1lIiwicHJldmVudERlZmF1bHQiLCJyZW5kZXIiLCJoIiwiSG9zdCIsInN0eWxlIiwiZGlzcGxheSIsImNsYXNzIiwib25DbGljayIsImhlYWRpbmciLCJtZXNzYWdlIiwiY2FuY2VsIiwibGFiZWwiLCJ2YXJpYW50Iiwib25QcmVzcyJdLCJtYXBwaW5ncyI6IjRtREFBQSxJQ1dhQSxnQkFBZSxXLG9YQUlBLEcsYUFLQSxHLFdBS0YsRSxhQU1FLEMsQ0FzQ3pCLE8sNlNBL0JELFNBQUFDLFlBQVlDLFFBQ1ZDLEtBQUtDLE9BQU9DLEtBQUtILFFBQ2pCQyxLQUFLRyxNQUFPLEMsOEJBSWQsU0FBQUMsY0FBY0MsR0FDZSx1QkFBdkJBLEVBQUVDLE9BQU9DLFlBQ1hGLEVBQUVHLGlCQUNGUixLQUFLRixZQUFZLFUsR0FFcEIsb0JBRUQsU0FBQVcsU0FBTSxlQUNKLE9BQ0VDLDBEQUFDQyxrREFBSSxDQUFDQyxNQUFPLENBQUNDLFFBQVNiLEtBQUtHLEtBQU8sUUFBVSxTQUMzQ08saUVBQUtJLE1BQU0scUJBQXFCQyxRQUFTLGlCQUFBVixHQUFDLE9BQUksTUFBS0QsY0FBY0MsRUFBRSxHQUNqRUssaUVBQUtJLE1BQU0sVUFDVEosaUVBQUtJLE1BQU0sV0FBV2QsS0FBS2dCLFNBQzNCTixpRUFBS0ksTUFBTSxXQUNSZCxLQUFLaUIsUUFFTlAsaUVBQUtJLE1BQU0sV0FDUmQsS0FBS2tCLE9BQVNSLDRFQUFnQlMsTUFBTSxTQUFTQyxRQUFRLFVBQVVDLFFBQVMsMEJBQU0sTUFBS3ZCLFlBQVksU0FBUyxJQUFPWSxpRUFBS0UsTUFBTyxDQUFDQyxRQUFTLFVBQ3RJSCw0RUFBZ0JTLE1BQU0sS0FBS0UsUUFBUywwQkFBTSxNQUFLdkIsWUFBWSxLQUFLLFEsS0FPN0UsZ0JBMUR5QixHLHNCRFhELHFsQyIsImZpbGUiOiI0Ni44MWM4ZGQ4NS5pZnJhbWUuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiQGltcG9ydCAnLi4vLi4vLi4vdGhlbWUuc2Nzcyc7XG5cbnZlcmRvY3Mtb2stZGlhbG9nIHtcbiAgZm9udC1mYW1pbHk6ICRwcmltYXJ5LWZvbnQ7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG5cbiAgLmJhY2tncm91bmQtb3ZlcmxheSB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHotaW5kZXg6IDEwMDAwO1xuICAgIHRvcDogMDtcbiAgICBsZWZ0OiAwO1xuICAgIHJpZ2h0OiAwO1xuICAgIGJvdHRvbTogMDtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgYmFja2dyb3VuZDogIzAwMDAwMDdmO1xuICB9XG5cbiAgLmRpYWxvZyB7XG4gICAgbWF4LXdpZHRoOiA1MCU7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgIGJveC1zaGFkb3c6IDNweCAzcHggNXB4IDFweCByZ2JhKDQwLCA0MCwgNDAsIDAuNCk7XG4gIH1cblxuICAuaGVhZGluZyB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmb250LXNpemU6IDE2cHg7XG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICBiYWNrZ3JvdW5kOiAjNDQ0NDQ0O1xuICAgIHBhZGRpbmc6IDhweCAxNnB4O1xuICAgIGNvbG9yOiAkdmVyZG9jcy1ncmV5LTQ7XG4gIH1cblxuICAuY29udGVudCB7XG4gICAgZm9udC1zaXplOiAxNnB4O1xuICAgIGJhY2tncm91bmQ6ICR2ZXJkb2NzLWdyZXktNDtcbiAgICBwYWRkaW5nOiAyMHB4O1xuICB9XG5cbiAgLmJ1dHRvbnMge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgbWFyZ2luOiAyMHB4IDAgMCAwO1xuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuXG4gICAgdmVyZG9jcy1idXR0b24ge1xuICAgICAgbWFyZ2luLWxlZnQ6IDE2cHg7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQge0NvbXBvbmVudCwgUHJvcCwgaCwgRXZlbnQsIEV2ZW50RW1pdHRlciwgSG9zdH0gZnJvbSAnQHN0ZW5jaWwvY29yZSc7XG5cbi8qKlxuICogRGlzcGxheSBhIHNpbXBsZSB0ZXh0IGRpYWxvZyBib3ggd2l0aCBhbiBPayBidXR0b24uIFRoaXMgYWRkcyBhIHBhcnRpYWxseS10cmFuc3BhcmVudCBvdmVybGF5IGFuZCBzY3JlZW4tY2VudGVyZWQgZGlhbG9nXG4gKiBib3ggd2l0aCBhIG1lc3NhZ2UgYW5kIG9wdGlvbmFsIGhlYWRlci90aXRsZS4gQW4gT0sgYnV0dG9uIGlzIHNob3duIHRoYXQgd2lsbCBkaXNtaXNzIHRoZSBtZXNzYWdlLlxuICogSXQgY2FuIGFsc28gYmUgZGlzbWlzc2VkIGJ5IGNsaWNraW5nIHRoZSBiYWNrZ3JvdW5kIG92ZXJsYXkuXG4gKi9cbkBDb21wb25lbnQoe1xuICB0YWc6ICd2ZXJkb2NzLW9rLWRpYWxvZycsXG4gIHN0eWxlVXJsOiAndmVyZG9jcy1vay1kaWFsb2cuc2NzcycsXG59KVxuZXhwb3J0IGNsYXNzIFZlcmRvY3NPa0RpYWxvZyB7XG4gIC8qKlxuICAgKiBUaGUgdGl0bGUgb2YgdGhlIGRpYWxvZy4gXCJ0aXRsZVwiIGlzIGEgcmVzZXJ2ZWQgd29yZCwgc28gd2UgdXNlIGhlYWRpbmcuXG4gICAqL1xuICBAUHJvcCgpIGhlYWRpbmc6IHN0cmluZyA9ICcnO1xuXG4gIC8qKlxuICAgKiBUaGUgbWVzc2FnZSBjb250ZW50IHRvIGRpc3BsYXkuXG4gICAqL1xuICBAUHJvcCgpIG1lc3NhZ2U6IHN0cmluZyA9ICcnO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBkaWFsb2cgaXMgY3VycmVudGx5IGJlaW5nIGRpc3BsYXllZC4gVGhpcyBhbGxvd3MgaXQgdG8gYmUgYWRkZWQgdG8gdGhlIERPTSBiZWZvcmUgYmVpbmcgZGlzcGxheWVkLlxuICAgKi9cbiAgQFByb3AoKSBvcGVuOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIElmIHNldCwgYSBjYW5jZWwgYnV0dG9uIHdpbGwgYWxzbyBiZSBkaXNwbGF5ZWQuIE5vdGUgdGhhdCB0aGUgZGlhbG9nIGlzIGFsd2F5cyBjYW5jZWxhYmxlIGJ5IGNsaWNraW5nIHRoZSBiYWNrZ3JvdW5kXG4gICAqIG92ZXJsYXkgdG8gZGlzbWlzcyBpdC5cbiAgICovXG4gIEBQcm9wKCkgY2FuY2VsOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEV2ZW50IGZpcmVkIHdoZW4gdGhlIGRpYWxvZyBpcyBjbG9zZWQuIFRoZSBldmVudCBkYXRhIHdpbGwgY29udGFpbiB0aGUgY2xvc3VyZSByZWFzb24uXG4gICAqL1xuICBARXZlbnQoe2NvbXBvc2VkOiB0cnVlfSkgY2xvc2VkOiBFdmVudEVtaXR0ZXI8J2NhbmNlbCcgfCAnb2snPjtcblxuICBoYW5kbGVDbG9zZShyZWFzb246ICdjYW5jZWwnIHwgJ29rJykge1xuICAgIHRoaXMuY2xvc2VkLmVtaXQocmVhc29uKTtcbiAgICB0aGlzLm9wZW4gPSBmYWxzZTtcbiAgfVxuXG4gIC8vIFdlIG5lZWQgYSBzZXBhcmF0ZSBldmVudCBoYW5kbGVyIGZvciBjbGlja2luZyB0aGUgYmFja2dyb3VuZCBiZWNhdXNlIGl0IGNhbiByZWNlaXZlIGV2ZW50cyBcInRocm91Z2hcIiBvdGhlciBjaGlsZCBjb21wb25lbnRzXG4gIGhhbmRsZURpc21pc3MoZTogYW55KSB7XG4gICAgaWYgKGUudGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ2JhY2tncm91bmQtb3ZlcmxheScpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMuaGFuZGxlQ2xvc2UoJ2NhbmNlbCcpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEhvc3Qgc3R5bGU9e3tkaXNwbGF5OiB0aGlzLm9wZW4gPyAnYmxvY2snIDogJ25vbmUnfX0+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJiYWNrZ3JvdW5kLW92ZXJsYXlcIiBvbkNsaWNrPXtlID0+IHRoaXMuaGFuZGxlRGlzbWlzcyhlKX0+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImRpYWxvZ1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImhlYWRpbmdcIj57dGhpcy5oZWFkaW5nfTwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRlbnRcIj5cbiAgICAgICAgICAgICAge3RoaXMubWVzc2FnZX1cblxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uc1wiPlxuICAgICAgICAgICAgICAgIHt0aGlzLmNhbmNlbCA/IDx2ZXJkb2NzLWJ1dHRvbiBsYWJlbD1cIkNBTkNFTFwiIHZhcmlhbnQ9XCJvdXRsaW5lXCIgb25QcmVzcz17KCkgPT4gdGhpcy5oYW5kbGVDbG9zZSgnY2FuY2VsJyl9IC8+IDogPGRpdiBzdHlsZT17e2Rpc3BsYXk6ICdub25lJ319IC8+fVxuICAgICAgICAgICAgICAgIDx2ZXJkb2NzLWJ1dHRvbiBsYWJlbD1cIk9LXCIgb25QcmVzcz17KCkgPT4gdGhpcy5oYW5kbGVDbG9zZSgnb2snKX0gLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L0hvc3Q+XG4gICAgKTtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==