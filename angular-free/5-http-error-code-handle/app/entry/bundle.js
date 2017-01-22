webpackJsonp([0],{

/***/ 0:
/*!*****************!*\
  !*** multi app ***!
  \*****************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(/*! ./app/bootstrap */1);


/***/ },

/***/ 1:
/*!**************************!*\
  !*** ./app/bootstrap.ts ***!
  \**************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 注入babel-polyfill
	__webpack_require__(/*! babel-polyfill */ 2);
	// 注入angular相关配置，如路由等
	var app_1 = __webpack_require__(/*! ./app */ 299);
	// 获取angular相关依赖
	var angular = __webpack_require__(/*! angular */ 301);
	var ngRoute = __webpack_require__(/*! angular-route */ 303);
	var uiRouter = __webpack_require__(/*! angular-ui-router */ 305);
	// 注入控制器
	var login_controller_1 = __webpack_require__(/*! ./modules/login/login.controller */ 306);
	// 注入angular相关依赖
	var dependencies = [
	    ngRoute,
	    uiRouter
	];
	// 获取angular的app
	var ngModule = angular.module('AngularFree', dependencies);
	[
	    login_controller_1.default
	].forEach(function (service) { return service(ngModule); });
	// 进行angular相关配置
	app_1.default(ngModule, angular);
	// 启动应用
	angular.bootstrap(document, ['AngularFree']);


/***/ },

/***/ 299:
/*!********************!*\
  !*** ./app/app.ts ***!
  \********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var tslib_1 = __webpack_require__(/*! tslib */ 300);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = function (ngModule, angular) {
	    ngModule.config(['$stateProvider', '$compileProvider', '$httpProvider', function ($stateProvider, $compileProvider, $httpProvider) {
	            $compileProvider.debugInfoEnabled(true);
	            // 未登录则跳转至登录页
	            if (!sessionStorage.getItem('username') && location.href.indexOf('login') === -1) {
	                location.href = 'index.html#/login';
	            }
	            // ui-router路由的参数
	            var routerStates = [{
	                    name: 'login',
	                    url: '/login',
	                    templateUrl: './modules/login/login.template.html',
	                    controller: 'LoginCtrl'
	                }];
	            // ui-router路由设置
	            routerStates.forEach(function (stateParams) {
	                $stateProvider.state(tslib_1.__assign({}, stateParams));
	            });
	        }]);
	};


/***/ },

/***/ 306:
/*!***********************************************!*\
  !*** ./app/modules/login/login.controller.ts ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var BasicTools_1 = __webpack_require__(/*! ../../shared/services/BasicTools */ 307);
	var angular = __webpack_require__(/*! angular */ 301);
	var LoginCtrl = (function () {
	    // 注入依赖
	    function LoginCtrl($scope, $timeout) {
	        this.$scope = $scope;
	        this.$timeout = $timeout;
	        // VM用于绑定模板相关内容
	        $scope.VM = this;
	    }
	    // 登录事件
	    LoginCtrl.prototype.submitForm = function () {
	        // 登录中提示
	        var loading = BasicTools_1.Notify({
	            title: "\u767B\u5F55\u4E2D",
	            type: 'info',
	            hide: false
	        });
	        // 一秒后，提示登陆成功
	        this.$timeout(function () {
	            if (loading.remove) {
	                loading.remove();
	            }
	            BasicTools_1.Notify({
	                title: "\u767B\u5F55\u6210\u529F",
	                type: 'success'
	            });
	            location.href = 'index.html#/app';
	        }, 1000);
	    };
	    return LoginCtrl;
	}());
	// 获取依赖
	LoginCtrl.$inject = [
	    '$scope',
	    '$timeout'
	];
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = function (ngModule) {
	    ngModule.controller('LoginCtrl', LoginCtrl);
	};


/***/ },

/***/ 307:
/*!*******************************************!*\
  !*** ./app/shared/services/BasicTools.ts ***!
  \*******************************************/
/***/ function(module, exports) {

	"use strict";
	// Panel toolbox
	function SetPanelToolbox() {
	    $('.collapse-link').on('click', function () {
	        var $BOX_PANEL = $(this).closest('.x_panel'), $ICON = $(this).find('i'), $BOX_CONTENT = $BOX_PANEL.find('.x_content');
	        // fix for some div with hardcoded fix class
	        if ($BOX_PANEL.attr('style')) {
	            $BOX_CONTENT.slideToggle(200, function () {
	                $BOX_PANEL.removeAttr('style');
	            });
	        }
	        else {
	            $BOX_CONTENT.slideToggle(200);
	            $BOX_PANEL.css('height', 'auto');
	        }
	        $ICON.toggleClass('fa-chevron-up fa-chevron-down');
	    });
	    $('.close-link').click(function () {
	        var $BOX_PANEL = $(this).closest('.x_panel');
	        $BOX_PANEL.remove();
	    });
	}
	exports.SetPanelToolbox = SetPanelToolbox;
	;
	// /Panel toolbox
	function Notify(_a) {
	    var _b = _a.title, title = _b === void 0 ? '' : _b, _c = _a.text, text = _c === void 0 ? '' : _c, _d = _a.type, type = _d === void 0 ? 'info' : _d, _e = _a.styling, styling = _e === void 0 ? 'bootstrap3' : _e, _f = _a.animation, animation = _f === void 0 ? 'slide' : _f, _g = _a.delay, delay = _g === void 0 ? 2000 : _g, _h = _a.hide, hide = _h === void 0 ? true : _h;
	    return new PNotify({
	        title: title,
	        text: text,
	        type: type,
	        styling: styling,
	        animation: animation,
	        delay: delay,
	        hide: hide
	    });
	}
	exports.Notify = Notify;
	function Comfirm(_a) {
	    var title = _a.title, text = _a.text, _b = _a.type, type = _b === void 0 ? 'info' : _b, _c = _a.styling, styling = _c === void 0 ? 'bootstrap3' : _c, _d = _a.animation, animation = _d === void 0 ? 'slide' : _d, _e = _a.delay, delay = _e === void 0 ? 2000 : _e, _f = _a.hide, hide = _f === void 0 ? false : _f, _g = _a.confirm, confirm = _g === void 0 ? {} : _g, _h = _a.cancel, cancel = _h === void 0 ? {} : _h;
	    (new PNotify({
	        title: title,
	        text: text,
	        styling: styling,
	        animation: animation,
	        type: type,
	        icon: 'glyphicon glyphicon-question-sign',
	        hide: hide,
	        confirm: {
	            confirm: true,
	            buttons: [{
	                    text: confirm.text ? confirm.text : '是',
	                    addClass: "btn btn-default",
	                    promptTrigger: true,
	                    click: function (notice, value) {
	                        notice.remove();
	                        notice.get().trigger("pnotify.confirm", [notice, value]);
	                    }
	                }, {
	                    text: cancel.text ? cancel.text : '否',
	                    addClass: "btn btn-default",
	                    click: function (notice) {
	                        notice.remove();
	                        notice.get().trigger("pnotify.cancel", notice);
	                    }
	                }]
	        },
	        history: {
	            history: false
	        }
	    })).get().on('pnotify.confirm', function () {
	        if (typeof confirm.callback === 'function') {
	            confirm.callback();
	        }
	    }).on('pnotify.cancel', function () {
	        if (typeof cancel.callback === 'function') {
	            cancel.callback();
	        }
	    });
	}
	exports.Comfirm = Comfirm;
	function OperationResponse(res, title) {
	    var isError = res.exitValue !== 0;
	    if (isError) {
	        Comfirm({
	            title: title + "\u5931\u8D25",
	            text: "\u662F\u5426\u4E0B\u8F7Dlog\u6587\u4EF6?",
	            type: 'error',
	            confirm: {
	                callback: function () { window.open(res.logAddress, '_blank'); }
	            }
	        });
	    }
	    else {
	        Notify({
	            title: title + "\u6210\u529F",
	            type: 'success',
	            text: res.logAddress
	        });
	    }
	}
	exports.OperationResponse = OperationResponse;
	function FormatJson(txt, compress) {
	    if (typeof txt != 'string') {
	        txt = JSON.stringify(txt, undefined, 2);
	    }
	    var indentChar = '&nbsp;&nbsp;&nbsp;&nbsp;';
	    if (/^\s*$/.test(txt)) {
	        // alert('数据为空,无法格式化! ');
	        return undefined;
	    }
	    try {
	        var data = eval('(' + txt + ')');
	    }
	    catch (e) {
	        alert('数据源语法错误,JSON格式化失败! 错误信息: ' + e.description);
	        return undefined;
	    }
	    ;
	    var draw = [], last = false, This = this, line = compress ? '' : '<br>', nodeCount = 0, maxDepth = 0;
	    var notify = function (name, value, isLast, indent /*缩进*/, formObj) {
	        nodeCount++; /*节点计数*/
	        for (var i = 0, tab = ''; i < indent; i++)
	            tab += indentChar; /* 缩进HTML */
	        tab = compress ? '' : tab; /*压缩模式忽略缩进*/
	        maxDepth = ++indent; /*缩进递增并记录*/
	        if (value && value.constructor == Array) {
	            draw.push(tab + (formObj ? ('"' + name + '" :  ') : '') + '[' + line); /*缩进'[' 然后换行*/
	            for (var i = 0; i < value.length; i++)
	                notify(i, value[i], i == value.length - 1, indent, false);
	            draw.push(tab + ']' + (isLast ? line : (',' + line))); /*缩进']'换行,若非尾元素则添加逗号*/
	        }
	        else if (value && typeof value == 'object') {
	            draw.push(tab + (formObj ? ('"' + name + '" :  ') : '') + '{' + line); /*缩进'{' 然后换行*/
	            var len = 0, i = 0;
	            for (var key in value)
	                len++;
	            for (var key in value)
	                notify(key, value[key], ++i == len, indent, true);
	            draw.push(tab + '}' + (isLast ? line : (',' + line))); /*缩进'}'换行,若非尾元素则添加逗号*/
	        }
	        else {
	            if (typeof value == 'string')
	                value = '"' + value + '"';
	            draw.push(tab + (formObj ? ('"' + name + '" :  ') : '') + value + (isLast ? '' : ',') + line);
	        }
	        ;
	    };
	    var isLast = true, indent = 0;
	    notify('', data, isLast, indent, false);
	    draw = draw.join('').replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
	        var cls = 'number';
	        if (/^"/.test(match)) {
	            if (/:$/.test(match)) {
	                cls = 'key';
	            }
	            else {
	                cls = 'string';
	            }
	        }
	        else if (/true|false/.test(match)) {
	            cls = 'boolean';
	        }
	        else if (/null/.test(match)) {
	            cls = 'null';
	        }
	        return '<span class="' + cls + '">' + match + '</span>';
	    });
	    draw = '<div class="json">' + draw + '</div>';
	    return draw;
	}
	exports.FormatJson = FormatJson;
	;
	function UrlEncode(param, key, encode) {
	    if (param == null)
	        return '';
	    var paramStr = '';
	    var t = typeof (param);
	    if (t == 'string' || t == 'number' || t == 'boolean') {
	        paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
	    }
	    else {
	        for (var i in param) {
	            var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
	            paramStr += UrlEncode(param[i], k, encode);
	        }
	    }
	    return paramStr;
	}
	exports.UrlEncode = UrlEncode;
	;
	function SetDataTable(eleType, destroy) {
	    $(eleType).dataTable({
	        destroy: destroy || true,
	        "language": {
	            "url": "/static/datatable_zh_CN.json"
	        }
	    });
	}
	exports.SetDataTable = SetDataTable;
	;
	function SetTooltip(ele, trigger) {
	    if (ele === void 0) { ele = '[data-toggle="tooltip"]'; }
	    if (trigger === void 0) { trigger = 'click hover'; }
	    var $tooltip = $(ele);
	    $tooltip.tooltip({
	        container: 'body',
	        trigger: trigger
	    });
	}
	exports.SetTooltip = SetTooltip;
	;
	function SetICheck(callback) {
	    // iCheck
	    var $input = $("input.flat");
	    if ($input.length) {
	        $input.iCheck({
	            checkboxClass: 'icheckbox_flat-green',
	            radioClass: 'iradio_flat-green'
	        });
	        $('input').on('ifChecked', function (event) {
	            if (typeof callback === 'function') {
	                callback(event.currentTarget.name, event.currentTarget.value);
	            }
	        });
	    }
	}
	exports.SetICheck = SetICheck;
	;
	function SetSwitchery(callback) {
	    // Switchery
	    if ($(".js-switch")[0]) {
	        var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
	        elems.forEach(function (html) {
	            var switchery = new Switchery(html, {
	                color: '#26B99A'
	            });
	            html.onchange = function () {
	                var value = html.checked === true ? Number(html.attributes['true'].value) : Number(html.attributes['false'].value);
	                if (typeof callback === 'function') {
	                    callback(html.name, value);
	                }
	            };
	        });
	    }
	}
	exports.SetSwitchery = SetSwitchery;
	;
	function SetDaterangepicker(eleToSet, callback) {
	    var today = new Date();
	    var year = today.getFullYear();
	    var month = today.getMonth() + 1;
	    var date = today.getDate();
	    // daterangepicker
	    $(eleToSet).daterangepicker({
	        singleDatePicker: true,
	        format: 'YYYY-MM-DD',
	        minDate: year + "-" + month + "-" + date,
	        calender_style: "picker_3"
	    }, function (start, end, label) {
	        if (typeof callback === 'function') {
	            callback($(eleToSet).attr("name"), start.toISOString().substring(0, 10));
	        }
	    });
	}
	exports.SetDaterangepicker = SetDaterangepicker;
	function SetDataTableAjax(url) {
	    return {
	        url: url,
	        // dataSrc: "list",
	        data: function (data) {
	            for (var i = 0; i < data.columns.length; i++) {
	                var column = data.columns[i];
	                column.searchRegex = column.search.regex;
	                column.searchValue = column.search.value;
	                delete column.search;
	            }
	            data.accessToken = exports.AccessToken.get();
	            // console.log(AccessToken.get())
	        }
	    };
	}
	exports.SetDataTableAjax = SetDataTableAjax;
	;
	exports.AccessToken = {
	    get: function () {
	        return sessionStorage.getItem('accessToken');
	    },
	    set: function (token) {
	        sessionStorage.setItem('accessToken', token);
	    }
	};
	var BasicTools = {
	    SetPanelToolbox: SetPanelToolbox,
	    Notify: Notify,
	    FormatJson: FormatJson,
	    UrlEncode: UrlEncode,
	    SetDataTable: SetDataTable,
	    SetTooltip: SetTooltip,
	    SetICheck: SetICheck,
	    SetSwitchery: SetSwitchery,
	    SetDaterangepicker: SetDaterangepicker,
	    SetDataTableAjax: SetDataTableAjax,
	    AccessToken: exports.AccessToken
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = BasicTools;


/***/ }

});
//# sourceMappingURL=bundle.js.map