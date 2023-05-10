(window.webpackJsonp=window.webpackJsonp||[]).push([[60],{"./dist/esm/verdocs-signature-dialog.entry.js":function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,"verdocs_signature_dialog",(function(){return VerdocsSignatureDialog}));__webpack_require__("./node_modules/core-js/modules/es.function.name.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.to-primitive.js"),__webpack_require__("./node_modules/core-js/modules/es.date.to-primitive.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"),__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.number.constructor.js"),__webpack_require__("./node_modules/core-js/modules/es.object.define-property.js");var _index_b18c0348_js__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./dist/esm/index-b18c0348.js");function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,(arg=descriptor.key,key=void 0,"symbol"==typeof(key=function _toPrimitive(input,hint){if("object"!=typeof input||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!=typeof res)return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string"))?key:String(key)),descriptor)}var arg,key}var VerdocsSignatureDialog=function(){function VerdocsSignatureDialog(hostRef){!function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}(this,VerdocsSignatureDialog),Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_8__.j)(this,hostRef),this.next=Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_8__.e)(this,"next",7),this.exit=Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_8__.e)(this,"exit",7),this.name="",this.fontLoaded=!1,this.enteredName="",this.mode="type"}return function _createClass(Constructor,protoProps,staticProps){return protoProps&&_defineProperties(Constructor.prototype,protoProps),staticProps&&_defineProperties(Constructor,staticProps),Object.defineProperty(Constructor,"prototype",{writable:!1}),Constructor}(VerdocsSignatureDialog,[{key:"componentWillLoad",value:function componentWillLoad(){var _this=this;this.enteredName=this.name,new FontFace("Dancing Script","url(https://fonts.gstatic.com/s/dancingscript/v19/If2cXTr6YS-zF4S-kcSWSVi_sxjsohD9F50Ruu7BMSo3Sup6hNX6plRP.woff)").load().then((function(font){document.fonts.add(font),_this.fontLoaded=!0}))}},{key:"componentDidLoad",value:function componentDidLoad(){this.redrawSignature()}},{key:"componentDidUpdate",value:function componentDidUpdate(){this.redrawSignature()}},{key:"redrawSignature",value:function redrawSignature(){if(this.canvasElement){var canvasWidth=this.canvasElement.width,context=this.canvasElement.getContext("2d");context.clearRect(0,0,this.canvasElement.width,this.canvasElement.height);var fontSize=100;do{fontSize-=2,context.font=fontSize+"px Dancing Script"}while(context.measureText(this.enteredName).width>canvasWidth-32);context.textAlign="center",context.textBaseline="middle",context.font=fontSize+"px Dancing Script",context.fillText(this.enteredName,this.canvasElement.width/2,this.canvasElement.height/2)}}},{key:"handleNameChange",value:function handleNameChange(e){this.enteredName=e.target.value}},{key:"handleCancel",value:function handleCancel(e){e.stopPropagation(),e.preventDefault(),this.exit.emit()}},{key:"handleAdopt",value:function handleAdopt(e){e.stopPropagation(),e.preventDefault();var data=this.canvasElement.toDataURL("image/png");this.next.emit(data)}},{key:"render",value:function render(){var _this2=this;return Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_8__.h)(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_8__.b,{onClick:function onClick(e){return _this2.handleCancel(e)}},Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_8__.h)("div",{class:"dialog"},Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_8__.h)("div",{class:"heading"},"Create Your Signature"),Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_8__.h)("div",{class:"content"},Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_8__.h)("verdocs-text-input",{placeholder:"Full Name...",label:"Full Name",value:this.enteredName,onInput:function onInput(e){return _this2.handleNameChange(e)},onClick:function onClick(e){return e.stopPropagation()}}),Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_8__.h)("div",{class:"as-shown"},"As shown on driver's license or govt. ID card."),this.fontLoaded?Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_8__.h)("canvas",{ref:function ref(el){return _this2.canvasElement=el}}):Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_8__.h)("div",{style:{display:"none"}}),Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_8__.h)("div",{class:"disclaimer"},"By clicking Adopt, I agree that the signature will be the electronic representation of my signature for all purposes when I (or my agent) use them on documents, including legally binding contracts — just the same as a pen-and-paper signature or initial."),Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_8__.h)("div",{class:"buttons"},Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_8__.h)("verdocs-button",{label:"CANCEL",size:"normal",variant:"outline",onClick:function onClick(e){return _this2.handleCancel(e)}}),Object(_index_b18c0348_js__WEBPACK_IMPORTED_MODULE_8__.h)("verdocs-button",{label:"Adopt & Sign",size:"normal",onClick:function onClick(e){return _this2.handleAdopt(e)}})))))}}]),VerdocsSignatureDialog}();VerdocsSignatureDialog.style='verdocs-signature-dialog{font-family:"Inter", "Barlow", sans-serif;-webkit-box-sizing:border-box;box-sizing:border-box;position:fixed;z-index:10000;top:0;left:0;right:0;bottom:0;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;background:#0000007f}verdocs-signature-dialog .dialog{width:100%;max-width:340px;border-radius:4px;overflow:hidden;-webkit-box-shadow:3px 3px 5px 1px rgba(40, 40, 40, 0.4);box-shadow:3px 3px 5px 1px rgba(40, 40, 40, 0.4);background:#f9f9f9}verdocs-signature-dialog .heading{display:-ms-flexbox;display:flex;-ms-flex-direction:row;flex-direction:row;padding:20px 20px 0 20px;line-height:28px;font-size:20px;font-weight:500}verdocs-signature-dialog .content{font-size:14px;padding:20px}verdocs-signature-dialog .buttons{display:-ms-flexbox;display:flex;margin:20px 0 0 0;-ms-flex-direction:row;flex-direction:row;-ms-flex-pack:end;justify-content:flex-end;-ms-flex-align:center;align-items:center}verdocs-signature-dialog .buttons verdocs-button{margin-left:16px}verdocs-signature-dialog canvas{background:#ffffff;-webkit-box-sizing:border-box;box-sizing:border-box;margin:0 auto;width:300px;height:79px;max-width:100%;-webkit-box-shadow:0 0 6px 0 #0000001f;box-shadow:0 0 6px 0 #0000001f}verdocs-signature-dialog .disclaimer{text-align:justify;padding:8px 0;font-size:11px;line-height:14px;color:rgba(0, 0, 0, 0.54)}verdocs-signature-dialog .as-shown{font-size:11px;margin:4px 0 20px 4px;color:rgba(0, 0, 0, 0.54)}verdocs-signature-dialog .tabs{display:-ms-flexbox;display:flex;-ms-flex-direction:row;flex-direction:row}verdocs-signature-dialog .tabs .tab{padding:8px 15px;cursor:pointer}verdocs-signature-dialog .tabs .tab.active{border-bottom:2px solid #cccccc}verdocs-signature-dialog .tabs .tab:hover{color:#55bc81}'}}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9kaXN0L2VzbS92ZXJkb2NzLXNpZ25hdHVyZS1kaWFsb2cuZW50cnkuanMiXSwibmFtZXMiOlsiVmVyZG9jc1NpZ25hdHVyZURpYWxvZyIsImhvc3RSZWYiLCJyZWdpc3Rlckluc3RhbmNlIiwidGhpcyIsIm5leHQiLCJjcmVhdGVFdmVudCIsImV4aXQiLCJuYW1lIiwiZm9udExvYWRlZCIsImVudGVyZWROYW1lIiwibW9kZSIsImNvbXBvbmVudFdpbGxMb2FkIiwiRm9udEZhY2UiLCJsb2FkIiwidGhlbiIsImZvbnQiLCJkb2N1bWVudCIsImZvbnRzIiwiYWRkIiwiY29tcG9uZW50RGlkTG9hZCIsInJlZHJhd1NpZ25hdHVyZSIsImNvbXBvbmVudERpZFVwZGF0ZSIsImNhbnZhc0VsZW1lbnQiLCJjYW52YXNXaWR0aCIsIndpZHRoIiwiY29udGV4dCIsImdldENvbnRleHQiLCJjbGVhclJlY3QiLCJoZWlnaHQiLCJmb250U2l6ZSIsIm1lYXN1cmVUZXh0IiwidGV4dEFsaWduIiwidGV4dEJhc2VsaW5lIiwiZmlsbFRleHQiLCJoYW5kbGVOYW1lQ2hhbmdlIiwiZSIsInRhcmdldCIsInZhbHVlIiwiaGFuZGxlQ2FuY2VsIiwic3RvcFByb3BhZ2F0aW9uIiwicHJldmVudERlZmF1bHQiLCJlbWl0IiwiaGFuZGxlQWRvcHQiLCJkYXRhIiwidG9EYXRhVVJMIiwicmVuZGVyIiwiaCIsIkhvc3QiLCJvbkNsaWNrIiwiY2xhc3MiLCJwbGFjZWhvbGRlciIsImxhYmVsIiwib25JbnB1dCIsInJlZiIsImVsIiwic3R5bGUiLCJkaXNwbGF5Iiwic2l6ZSIsInZhcmlhbnQiXSwibWFwcGluZ3MiOiIyc0RBRUEsSUFFTUEsdUJBQXNCLFdBQzFCLGdDQUFZQyxVLDhJQUFTLDhCQUNuQkMsMERBQWlCQyxLQUFNRixTQUN2QkUsS0FBS0MsS0FBT0MsMERBQVlGLEtBQU0sT0FBUSxHQUN0Q0EsS0FBS0csS0FBT0QsMERBQVlGLEtBQU0sT0FBUSxHQUN0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LCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByIGFzIHJlZ2lzdGVySW5zdGFuY2UsIGMgYXMgY3JlYXRlRXZlbnQsIGgsIEggYXMgSG9zdCB9IGZyb20gJy4vaW5kZXgtYjE4YzAzNDguanMnO1xuXG5jb25zdCB2ZXJkb2NzU2lnbmF0dXJlRGlhbG9nQ3NzID0gXCJ2ZXJkb2NzLXNpZ25hdHVyZS1kaWFsb2d7Zm9udC1mYW1pbHk6XFxcIkludGVyXFxcIiwgXFxcIkJhcmxvd1xcXCIsIHNhbnMtc2VyaWY7LXdlYmtpdC1ib3gtc2l6aW5nOmJvcmRlci1ib3g7Ym94LXNpemluZzpib3JkZXItYm94O3Bvc2l0aW9uOmZpeGVkO3otaW5kZXg6MTAwMDA7dG9wOjA7bGVmdDowO3JpZ2h0OjA7Ym90dG9tOjA7ZGlzcGxheTotbXMtZmxleGJveDtkaXNwbGF5OmZsZXg7LW1zLWZsZXgtYWxpZ246Y2VudGVyO2FsaWduLWl0ZW1zOmNlbnRlcjstbXMtZmxleC1wYWNrOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2JhY2tncm91bmQ6IzAwMDAwMDdmfXZlcmRvY3Mtc2lnbmF0dXJlLWRpYWxvZyAuZGlhbG9ne3dpZHRoOjEwMCU7bWF4LXdpZHRoOjM0MHB4O2JvcmRlci1yYWRpdXM6NHB4O292ZXJmbG93OmhpZGRlbjstd2Via2l0LWJveC1zaGFkb3c6M3B4IDNweCA1cHggMXB4IHJnYmEoNDAsIDQwLCA0MCwgMC40KTtib3gtc2hhZG93OjNweCAzcHggNXB4IDFweCByZ2JhKDQwLCA0MCwgNDAsIDAuNCk7YmFja2dyb3VuZDojZjlmOWY5fXZlcmRvY3Mtc2lnbmF0dXJlLWRpYWxvZyAuaGVhZGluZ3tkaXNwbGF5Oi1tcy1mbGV4Ym94O2Rpc3BsYXk6ZmxleDstbXMtZmxleC1kaXJlY3Rpb246cm93O2ZsZXgtZGlyZWN0aW9uOnJvdztwYWRkaW5nOjIwcHggMjBweCAwIDIwcHg7bGluZS1oZWlnaHQ6MjhweDtmb250LXNpemU6MjBweDtmb250LXdlaWdodDo1MDB9dmVyZG9jcy1zaWduYXR1cmUtZGlhbG9nIC5jb250ZW50e2ZvbnQtc2l6ZToxNHB4O3BhZGRpbmc6MjBweH12ZXJkb2NzLXNpZ25hdHVyZS1kaWFsb2cgLmJ1dHRvbnN7ZGlzcGxheTotbXMtZmxleGJveDtkaXNwbGF5OmZsZXg7bWFyZ2luOjIwcHggMCAwIDA7LW1zLWZsZXgtZGlyZWN0aW9uOnJvdztmbGV4LWRpcmVjdGlvbjpyb3c7LW1zLWZsZXgtcGFjazplbmQ7anVzdGlmeS1jb250ZW50OmZsZXgtZW5kOy1tcy1mbGV4LWFsaWduOmNlbnRlcjthbGlnbi1pdGVtczpjZW50ZXJ9dmVyZG9jcy1zaWduYXR1cmUtZGlhbG9nIC5idXR0b25zIHZlcmRvY3MtYnV0dG9ue21hcmdpbi1sZWZ0OjE2cHh9dmVyZG9jcy1zaWduYXR1cmUtZGlhbG9nIGNhbnZhc3tiYWNrZ3JvdW5kOiNmZmZmZmY7LXdlYmtpdC1ib3gtc2l6aW5nOmJvcmRlci1ib3g7Ym94LXNpemluZzpib3JkZXItYm94O21hcmdpbjowIGF1dG87d2lkdGg6MzAwcHg7aGVpZ2h0Ojc5cHg7bWF4LXdpZHRoOjEwMCU7LXdlYmtpdC1ib3gtc2hhZG93OjAgMCA2cHggMCAjMDAwMDAwMWY7Ym94LXNoYWRvdzowIDAgNnB4IDAgIzAwMDAwMDFmfXZlcmRvY3Mtc2lnbmF0dXJlLWRpYWxvZyAuZGlzY2xhaW1lcnt0ZXh0LWFsaWduOmp1c3RpZnk7cGFkZGluZzo4cHggMDtmb250LXNpemU6MTFweDtsaW5lLWhlaWdodDoxNHB4O2NvbG9yOnJnYmEoMCwgMCwgMCwgMC41NCl9dmVyZG9jcy1zaWduYXR1cmUtZGlhbG9nIC5hcy1zaG93bntmb250LXNpemU6MTFweDttYXJnaW46NHB4IDAgMjBweCA0cHg7Y29sb3I6cmdiYSgwLCAwLCAwLCAwLjU0KX12ZXJkb2NzLXNpZ25hdHVyZS1kaWFsb2cgLnRhYnN7ZGlzcGxheTotbXMtZmxleGJveDtkaXNwbGF5OmZsZXg7LW1zLWZsZXgtZGlyZWN0aW9uOnJvdztmbGV4LWRpcmVjdGlvbjpyb3d9dmVyZG9jcy1zaWduYXR1cmUtZGlhbG9nIC50YWJzIC50YWJ7cGFkZGluZzo4cHggMTVweDtjdXJzb3I6cG9pbnRlcn12ZXJkb2NzLXNpZ25hdHVyZS1kaWFsb2cgLnRhYnMgLnRhYi5hY3RpdmV7Ym9yZGVyLWJvdHRvbToycHggc29saWQgI2NjY2NjY312ZXJkb2NzLXNpZ25hdHVyZS1kaWFsb2cgLnRhYnMgLnRhYjpob3Zlcntjb2xvcjojNTViYzgxfVwiO1xuXG5jb25zdCBWZXJkb2NzU2lnbmF0dXJlRGlhbG9nID0gY2xhc3Mge1xuICBjb25zdHJ1Y3Rvcihob3N0UmVmKSB7XG4gICAgcmVnaXN0ZXJJbnN0YW5jZSh0aGlzLCBob3N0UmVmKTtcbiAgICB0aGlzLm5leHQgPSBjcmVhdGVFdmVudCh0aGlzLCBcIm5leHRcIiwgNyk7XG4gICAgdGhpcy5leGl0ID0gY3JlYXRlRXZlbnQodGhpcywgXCJleGl0XCIsIDcpO1xuICAgIHRoaXMubmFtZSA9ICcnO1xuICAgIHRoaXMuZm9udExvYWRlZCA9IGZhbHNlO1xuICAgIHRoaXMuZW50ZXJlZE5hbWUgPSAnJztcbiAgICB0aGlzLm1vZGUgPSAndHlwZSc7XG4gIH1cbiAgY29tcG9uZW50V2lsbExvYWQoKSB7XG4gICAgdGhpcy5lbnRlcmVkTmFtZSA9IHRoaXMubmFtZTtcbiAgICBjb25zdCBkcyA9IG5ldyBGb250RmFjZSgnRGFuY2luZyBTY3JpcHQnLCAndXJsKGh0dHBzOi8vZm9udHMuZ3N0YXRpYy5jb20vcy9kYW5jaW5nc2NyaXB0L3YxOS9JZjJjWFRyNllTLXpGNFMta2NTV1NWaV9zeGpzb2hEOUY1MFJ1dTdCTVNvM1N1cDZoTlg2cGxSUC53b2ZmKScpO1xuICAgIGRzLmxvYWQoKS50aGVuKGZvbnQgPT4ge1xuICAgICAgZG9jdW1lbnQuZm9udHMuYWRkKGZvbnQpO1xuICAgICAgdGhpcy5mb250TG9hZGVkID0gdHJ1ZTtcbiAgICB9KTtcbiAgfVxuICBjb21wb25lbnREaWRMb2FkKCkge1xuICAgIHRoaXMucmVkcmF3U2lnbmF0dXJlKCk7XG4gIH1cbiAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgIHRoaXMucmVkcmF3U2lnbmF0dXJlKCk7XG4gIH1cbiAgcmVkcmF3U2lnbmF0dXJlKCkge1xuICAgIGlmICghdGhpcy5jYW52YXNFbGVtZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGNhbnZhc1dpZHRoID0gdGhpcy5jYW52YXNFbGVtZW50LndpZHRoO1xuICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLmNhbnZhc0VsZW1lbnQuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhc0VsZW1lbnQud2lkdGgsIHRoaXMuY2FudmFzRWxlbWVudC5oZWlnaHQpO1xuICAgIGxldCBmb250U2l6ZSA9IDEwMDtcbiAgICBkbyB7XG4gICAgICBmb250U2l6ZSAtPSAyO1xuICAgICAgY29udGV4dC5mb250ID0gYCR7Zm9udFNpemV9cHggRGFuY2luZyBTY3JpcHRgO1xuICAgIH0gd2hpbGUgKGNvbnRleHQubWVhc3VyZVRleHQodGhpcy5lbnRlcmVkTmFtZSkud2lkdGggPiBjYW52YXNXaWR0aCAtIDMyKTsgLy8gMzJweCBwYWRkaW5nIGVhY2ggc2lkZVxuICAgIGNvbnRleHQudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgY29udGV4dC50ZXh0QmFzZWxpbmUgPSAnbWlkZGxlJztcbiAgICBjb250ZXh0LmZvbnQgPSBgJHtmb250U2l6ZX1weCBEYW5jaW5nIFNjcmlwdGA7XG4gICAgY29udGV4dC5maWxsVGV4dCh0aGlzLmVudGVyZWROYW1lLCB0aGlzLmNhbnZhc0VsZW1lbnQud2lkdGggLyAyLCB0aGlzLmNhbnZhc0VsZW1lbnQuaGVpZ2h0IC8gMik7XG4gIH1cbiAgaGFuZGxlTmFtZUNoYW5nZShlKSB7XG4gICAgdGhpcy5lbnRlcmVkTmFtZSA9IGUudGFyZ2V0LnZhbHVlO1xuICB9XG4gIGhhbmRsZUNhbmNlbChlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5leGl0LmVtaXQoKTtcbiAgfVxuICBoYW5kbGVBZG9wdChlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuY2FudmFzRWxlbWVudC50b0RhdGFVUkwoJ2ltYWdlL3BuZycpO1xuICAgIHRoaXMubmV4dC5lbWl0KGRhdGEpO1xuICB9XG4gIC8qXG4gIHNlbENvbG9yKGhleDogc3RyaW5nKSB7XG4gICAgdGhpcy5jb2xvciA9IGhleDtcbiAgICB0aGlzLmFuaW1hdGVEcmF3KCk7XG4gIH1cblxuICBzdG9wRHJhdygpIHtcbiAgICB0aGlzLnBhaW50ID0gZmFsc2U7XG4gICAgdGhpcy5hZG9wdGVkQW5kU2lnbmVkID0gIXRoaXMuaGFzU2lnbmF0dXJlKCk7XG4gIH1cblxuICBkcmF3KGUpIHtcbiAgICB0aGlzLnBhaW50ID0gdHJ1ZTtcbiAgICB0aGlzLmFkZFBvaW50cyhlLCBmYWxzZSk7XG4gICAgdGhpcy5hbmltYXRlRHJhdygpO1xuICB9XG5cbiAgcmVjb3JkUG9pbnRzKGUpIHtcbiAgICBpZiAodGhpcy5wYWludCkge1xuICAgICAgdGhpcy5hZGRQb2ludHMoZSwgdHJ1ZSk7XG4gICAgICB0aGlzLmFuaW1hdGVEcmF3KCk7XG4gICAgfVxuICB9XG5cbiAgYW5pbWF0ZURyYXcoKSB7XG4gICAgdGhpcy5jYW52YXMuY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzLmNhbnZhcy5vZmZzZXRXaWR0aCwgdGhpcy5jYW52YXMuY2FudmFzLm9mZnNldEhlaWdodCk7XG5cbiAgICB0aGlzLmNhbnZhcy5zdHJva2VTdHlsZSA9IHRoaXMuY29sb3IgfHwgJyMwMDAwMDAnO1xuICAgIHRoaXMuY2FudmFzLmxpbmVKb2luID0gJ3JvdW5kJztcbiAgICB0aGlzLmNhbnZhcy5saW5lV2lkdGggPSAzO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5jYW52YXMuYmVnaW5QYXRoKCk7XG4gICAgICBpZiAodGhpcy5wb2ludHNbaV0uZHJhZyAmJiBpKSB7XG4gICAgICAgIHRoaXMuY2FudmFzLm1vdmVUbyh0aGlzLnBvaW50c1tpIC0gMV0ueCwgdGhpcy5wb2ludHNbaSAtIDFdLnkpO1xuICAgICAgICAvLyB0aGlzLmNhbnZhcy5hcmModGhpcy5wb2ludHNbaSAtIDFdLngsIHRoaXMucG9pbnRzW2kgLSAxXS55LCAyLCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jYW52YXMubW92ZVRvKHRoaXMucG9pbnRzW2ldLnggLSAxLCB0aGlzLnBvaW50c1tpXS55KTtcbiAgICAgICAgLy8gdGhpcy5jYW52YXMuYXJjKHRoaXMucG9pbnRzW2ldLngsIHRoaXMucG9pbnRzW2ldLnksIDIsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY2FudmFzLmxpbmVUbyh0aGlzLnBvaW50c1tpXS54LCB0aGlzLnBvaW50c1tpXS55KTtcbiAgICAgIHRoaXMuY2FudmFzLmNsb3NlUGF0aCgpO1xuICAgICAgdGhpcy5jYW52YXMuc3Ryb2tlKCk7XG4gICAgfVxuICB9XG5cbiAgZHJhd0N1cnZlKGNvbG9yOiBzdHJpbmcsIGN1cnZlOiBudW1iZXIpIHtcbiAgICB0aGlzLmNhbnZhcy5iZWdpblBhdGgoKTtcbiAgfVxuXG5cblxuICBhZGRQb2ludHMoZSwgZHJhZzogYm9vbGVhbikge1xuICAgIGlmICh3aW5kb3cpIHtcbiAgICAgIGxldCB4O1xuICAgICAgbGV0IHk7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAoZS50b3VjaGVzICYmIGUudG91Y2hlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHggPSBlLnRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHggPSBlLmNsaWVudFg7XG4gICAgICB9XG5cbiAgICAgIGlmIChlLnRvdWNoZXMgJiYgZS50b3VjaGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgeSA9IGUudG91Y2hlc1swXS5jbGllbnRZO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgeSA9IGUuY2xpZW50WTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLnNpZ25hdHVyZUNhbnZhcy5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgdGhpcy5wb2ludHMucHVzaCh7XG4gICAgICAgIHg6IHggLSByZWN0LmxlZnQsXG4gICAgICAgIHk6IHkgLSByZWN0LnRvcCxcbiAgICAgICAgZHJhZzogZHJhZ1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgY2xlYXJQYWQoKSB7XG4gICAgdGhpcy5jYW52YXMuY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzLmNhbnZhcy5vZmZzZXRXaWR0aCwgdGhpcy5jYW52YXMuY2FudmFzLm9mZnNldEhlaWdodCk7XG4gICAgdGhpcy5wb2ludHMgPSBbXTtcbiAgICB0aGlzLmFkb3B0ZWRBbmRTaWduZWQgPSAhdGhpcy5oYXNTaWduYXR1cmUoKTtcbiAgfVxuXG4gICAgYXN5bmMgYWRvcHRBbmRTaWduKCkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmFkb3B0ZWRBbmRTaWduZWQgPSB0cnVlO1xuICAgICAgYXdhaXQgdGhpcy51cGRhdGVGdWxsTmFtZSgpO1xuICAgICAgYXdhaXQgdGhpcy5jYXB0dXJlU2lnbmF0dXJlRnJvbUNhbnZhcygpO1xuICAgICAgY29uc3QgbWVzc2FnZSA9IHRoaXMuc2lnbmF0dXJlTW9kZSA9PT0gJ1NpZ25hdHVyZScgPyAnU2F2aW5nIFNpZ25hdHVyZScgOiAnU2F2aW5nIEluaXRpYWwnO1xuICAgICAgdGhpcy5zbmFja2JhclNlcnZpY2Uub3BlbihtZXNzYWdlLCAnT0snLCB0aGlzLnNuYWNrYmFyU2VydmljZS5pbml0Q29uZmlnKG51bGwsICdib3R0b20nKSk7XG4gICAgICB0aGlzLmhhbmRsZU1vZGUoKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuc25hY2tiYXJTZXJ2aWNlLm9wZW4oJ0ZhaWxlZCB0byBhcHBseSBzaWduYXR1cmUnLCAnT0snLCB0aGlzLnNuYWNrYmFyU2VydmljZS5pbml0Q29uZmlnKG51bGwsICdib3R0b20nKSk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlTW9kZSgpIHtcbiAgICBsZXQgY3VycmVudEZpZWxkO1xuICAgIHN3aXRjaCAodGhpcy5tb2RlKSB7XG4gICAgICBjYXNlICdzaWduZXJ2aWV3JzpcbiAgICAgICAgaWYgKHRoaXMuc2lnbmF0dXJlTW9kZSA9PT0gJ1NpZ25hdHVyZScpIHtcbiAgICAgICAgICB0aGlzLnNpZ25hdHVyZVNlcnZpY2UucG9zdFNpZ25hdHVyZUJsb2IoKS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5pZCAmJiByZXN1bHQudXJsKSB7XG4gICAgICAgICAgICAgIGN1cnJlbnRGaWVsZCA9IHRoaXMuc2lnbmF0dXJlU2VydmljZS5jdXJyRmllbGQ7XG4gICAgICAgICAgICAgIHRoaXMuc2lnbmF0dXJlU2VydmljZS51cGRhdGVTaWduZWQoY3VycmVudEZpZWxkLmZOYW1lLCB0cnVlKTtcbiAgICAgICAgICAgICAgdGhpcy5zaWduYXR1cmVTZXJ2aWNlLnRvZ2dsZVNpZyhmYWxzZSk7XG4gICAgICAgICAgICAgIHRoaXMuc2lnbmF0dXJlU2VydmljZS5zZXRTaWduYXR1cmVJZChyZXN1bHQuaWQpO1xuICAgICAgICAgICAgICB0aGlzLnNpZ25hdHVyZVNlcnZpY2UucHV0U2lnbmF0dXJlRmllbGQodGhpcy5lbnZlbG9wZUlkLCB0aGlzLmZpZWxkTmFtZSwgcmVzdWx0LmlkKS50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudFRyYWNrZXIuY3JlYXRlRXZlbnQoe1xuICAgICAgICAgICAgICAgICAgY2F0ZWdvcnk6ICd2ZXJkb2MnLFxuICAgICAgICAgICAgICAgICAgYWN0aW9uOiAndmVyZG9jIHNpZ25lZCcsXG4gICAgICAgICAgICAgICAgICBsYWJlbDogYHZlcmRvYyBpZDogJHt0aGlzLmVudmVsb3BlSWR9YFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgaWYgKHJlcyAmJiByZXMuc2V0dGluZ3MpIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuc2lnbmF0dXJlU2VydmljZS5zZXRTaWduYXR1cmVEYXRhKHJlcy5zZXR0aW5ncy5iYXNlNjQpO1xuICAgICAgICAgICAgICAgICAgdGhpcy5zaWduYXR1cmVTZXJ2aWNlLnNldFNpZ25hdHVyZUlkKHJlcy5zZXR0aW5ncy5zaWduYXR1cmVfaWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnNuYWNrYmFyU2VydmljZS5kaXNtaXNzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5kaWFsb2cuY2xvc2UoeyBzdGF0dXM6ICdzYXZlZCcsIHRlbXBfc2lnOiByZXMuc2V0dGluZ3MuYmFzZTY0LCBzaWdfaWQ6IHJlcy5zZXR0aW5ncy5zaWduYXR1cmVfaWQgfSk7XG4gICAgICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zbmFja2JhclNlcnZpY2Uub3BlbignRmFpbGVkIHRvIHNhdmUgc2lnbmF0dXJlLiBQbGVhc2UgdHJ5IGFnYWluLicsICdESVNNSVNTJywge1xuICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDMwMDBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmFkb3B0ZWRBbmRTaWduZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXJyO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNpZ25hdHVyZVNlcnZpY2UucG9zdEluaXRpYWxCbG9iKCkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQuaWQgJiYgcmVzdWx0LnVybCkge1xuICAgICAgICAgICAgICBjdXJyZW50RmllbGQgPSB0aGlzLnNpZ25hdHVyZVNlcnZpY2UuY3VyckZpZWxkO1xuICAgICAgICAgICAgICB0aGlzLnNpZ25hdHVyZVNlcnZpY2UudXBkYXRlSW5pdGlhbGVkKGN1cnJlbnRGaWVsZC5mTmFtZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgIHRoaXMuc2lnbmF0dXJlU2VydmljZS5zZXRJbml0aWFsSWQocmVzdWx0LmlkKTtcbiAgICAgICAgICAgICAgdGhpcy5zaWduYXR1cmVTZXJ2aWNlLnRvZ2dsZVNpZyhmYWxzZSk7XG4gICAgICAgICAgICAgIHRoaXMuc2lnbmF0dXJlU2VydmljZS5wdXRJbml0aWFsRmllbGQodGhpcy5lbnZlbG9wZUlkLCB0aGlzLmZpZWxkTmFtZSwgcmVzdWx0LmlkKS50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlcyAmJiByZXMuc2V0dGluZ3MpIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuc2lnbmF0dXJlU2VydmljZS5zZXRJbml0aWFsRGF0YShyZXMuc2V0dGluZ3MuYmFzZTY0KTtcbiAgICAgICAgICAgICAgICAgIHRoaXMuc2lnbmF0dXJlU2VydmljZS5zZXRJbml0aWFsSWQocmVzLnNldHRpbmdzLmluaXRpYWxfaWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnNuYWNrYmFyU2VydmljZS5kaXNtaXNzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5kaWFsb2cuY2xvc2UoeyBzdGF0dXM6ICdzYXZlZCcsIHRlbXBfaW50OiByZXMuc2V0dGluZ3MuYmFzZTY0LCBpbnRfaWQ6IHJlcy5zZXR0aW5ncy5pbml0aWFsX2lkIH0pO1xuICAgICAgICAgICAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc25hY2tiYXJTZXJ2aWNlLm9wZW4oJ0ZhaWxlZCB0byBzYXZlIGluaXRpYWwuIFBsZWFzZSB0cnkgYWdhaW4uJywgJ0RJU01JU1MnLCB7XG4gICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMzAwMFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRvcHRlZEFuZFNpZ25lZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybiBlcnI7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICAgKi9cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoaChIb3N0LCB7IG9uQ2xpY2s6IGUgPT4gdGhpcy5oYW5kbGVDYW5jZWwoZSkgfSwgaChcImRpdlwiLCB7IGNsYXNzOiBcImRpYWxvZ1wiIH0sIGgoXCJkaXZcIiwgeyBjbGFzczogXCJoZWFkaW5nXCIgfSwgXCJDcmVhdGUgWW91ciBTaWduYXR1cmVcIiksIGgoXCJkaXZcIiwgeyBjbGFzczogXCJjb250ZW50XCIgfSwgaChcInZlcmRvY3MtdGV4dC1pbnB1dFwiLCB7IHBsYWNlaG9sZGVyOiBcIkZ1bGwgTmFtZS4uLlwiLCBsYWJlbDogXCJGdWxsIE5hbWVcIiwgdmFsdWU6IHRoaXMuZW50ZXJlZE5hbWUsIG9uSW5wdXQ6IGUgPT4gdGhpcy5oYW5kbGVOYW1lQ2hhbmdlKGUpLCBvbkNsaWNrOiBlID0+IGUuc3RvcFByb3BhZ2F0aW9uKCkgfSksIGgoXCJkaXZcIiwgeyBjbGFzczogXCJhcy1zaG93blwiIH0sIFwiQXMgc2hvd24gb24gZHJpdmVyJ3MgbGljZW5zZSBvciBnb3Z0LiBJRCBjYXJkLlwiKSwgdGhpcy5mb250TG9hZGVkID8gaChcImNhbnZhc1wiLCB7IHJlZjogZWwgPT4gKHRoaXMuY2FudmFzRWxlbWVudCA9IGVsKSB9KSA6IGgoXCJkaXZcIiwgeyBzdHlsZTogeyBkaXNwbGF5OiAnbm9uZScgfSB9KSwgaChcImRpdlwiLCB7IGNsYXNzOiBcImRpc2NsYWltZXJcIiB9LCBcIkJ5IGNsaWNraW5nIEFkb3B0LCBJIGFncmVlIHRoYXQgdGhlIHNpZ25hdHVyZSB3aWxsIGJlIHRoZSBlbGVjdHJvbmljIHJlcHJlc2VudGF0aW9uIG9mIG15IHNpZ25hdHVyZSBmb3IgYWxsIHB1cnBvc2VzIHdoZW4gSSAob3IgbXkgYWdlbnQpIHVzZSB0aGVtIG9uIGRvY3VtZW50cywgaW5jbHVkaW5nIGxlZ2FsbHkgYmluZGluZyBjb250cmFjdHMgXFx1MjAxNCBqdXN0IHRoZSBzYW1lIGFzIGEgcGVuLWFuZC1wYXBlciBzaWduYXR1cmUgb3IgaW5pdGlhbC5cIiksIGgoXCJkaXZcIiwgeyBjbGFzczogXCJidXR0b25zXCIgfSwgaChcInZlcmRvY3MtYnV0dG9uXCIsIHsgbGFiZWw6IFwiQ0FOQ0VMXCIsIHNpemU6IFwibm9ybWFsXCIsIHZhcmlhbnQ6IFwib3V0bGluZVwiLCBvbkNsaWNrOiBlID0+IHRoaXMuaGFuZGxlQ2FuY2VsKGUpIH0pLCBoKFwidmVyZG9jcy1idXR0b25cIiwgeyBsYWJlbDogXCJBZG9wdCAmIFNpZ25cIiwgc2l6ZTogXCJub3JtYWxcIiwgb25DbGljazogZSA9PiB0aGlzLmhhbmRsZUFkb3B0KGUpIH0pKSkpKSk7XG4gIH1cbn07XG5WZXJkb2NzU2lnbmF0dXJlRGlhbG9nLnN0eWxlID0gdmVyZG9jc1NpZ25hdHVyZURpYWxvZ0NzcztcblxuZXhwb3J0IHsgVmVyZG9jc1NpZ25hdHVyZURpYWxvZyBhcyB2ZXJkb2NzX3NpZ25hdHVyZV9kaWFsb2cgfTtcbiJdLCJzb3VyY2VSb290IjoiIn0=