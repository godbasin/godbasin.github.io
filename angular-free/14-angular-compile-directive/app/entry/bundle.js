webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },

/***/ 1:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 注入babel-polyfill
	__webpack_require__(2);
	// 注入angular相关配置，如路由等
	var app_1 = __webpack_require__(299);
	// 获取angular相关依赖
	var angular = __webpack_require__(301);
	var ngRoute = __webpack_require__(303);
	var uiRouter = __webpack_require__(305);
	// 注入控制器
	var login_controller_1 = __webpack_require__(306);
	var accountAdd_controller_1 = __webpack_require__(308);
	var account_controller_1 = __webpack_require__(310);
	// 注入指令
	var alertMsg_directive_1 = __webpack_require__(311);
	var selectDate_directive_1 = __webpack_require__(313);
	var selectDateInterval_directive_1 = __webpack_require__(314);
	var selectTime_directive_1 = __webpack_require__(315);
	var sidebar_directive_1 = __webpack_require__(316);
	var onEnter_directive_1 = __webpack_require__(317);
	var onEsc_directive_1 = __webpack_require__(318);
	var onFocusLost_directive_1 = __webpack_require__(319);
	// 注入服务
	var AlertMsg_1 = __webpack_require__(320);
	var HttpServices_1 = __webpack_require__(321);
	var AsyncForm_1 = __webpack_require__(322);
	// 注入angular相关依赖
	var dependencies = [
	    ngRoute,
	    uiRouter
	];
	// 获取angular的app
	var ngModule = angular.module('AngularFree', dependencies);
	[
	    login_controller_1.default,
	    accountAdd_controller_1.default,
	    account_controller_1.default,
	    alertMsg_directive_1.default,
	    selectDate_directive_1.default,
	    selectDateInterval_directive_1.default,
	    selectTime_directive_1.default,
	    sidebar_directive_1.default,
	    onEnter_directive_1.default,
	    onEsc_directive_1.default,
	    onFocusLost_directive_1.default,
	    AlertMsg_1.default,
	    HttpServices_1.default,
	    AsyncForm_1.default
	].forEach(function (service) { return service(ngModule); });
	// 进行angular相关配置
	app_1.default(ngModule, angular);
	// 启动应用
	angular.bootstrap(document, ['AngularFree']);


/***/ },

/***/ 299:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var tslib_1 = __webpack_require__(300);
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
	                }, {
	                    name: 'home',
	                    url: '/home',
	                    templateUrl: './modules/home/home.template.html'
	                }, {
	                    name: 'home.accounts',
	                    url: '/accounts',
	                    templateUrl: './modules/home/account/account.template.html',
	                    controller: 'AccountCtrl'
	                }, {
	                    name: 'home.accountsadd',
	                    url: '/accountsadd',
	                    templateUrl: './modules/home/account/accountAdd.template.html',
	                    controller: 'AccountAddCtrl'
	                }, {
	                    name: 'home.system',
	                    url: '/system',
	                    templateUrl: './modules/home/system/system.template.html'
	                }];
	            // ui-router路由设置
	            routerStates.forEach(function (stateParams) {
	                $stateProvider.state(tslib_1.__assign({}, stateParams));
	            });
	        }]);
	};


/***/ },

/***/ 306:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var BasicTools_1 = __webpack_require__(307);
	var angular = __webpack_require__(301);
	var LoginCtrl = (function () {
	    // 注入依赖
	    function LoginCtrl($scope, $timeout, AlertMsg) {
	        this.$scope = $scope;
	        this.$timeout = $timeout;
	        this.AlertMsg = AlertMsg;
	        // VM用于绑定模板相关内容
	        this.Notify = BasicTools_1.Notify;
	        $scope.VM = this;
	        $scope.VM.username = this.username;
	        $scope.VM.password = this.password;
	        BasicTools_1.Notify({ title: '可focus在表单中，然后按下Esc键或者Enter键试试' });
	    }
	    // 登录事件
	    LoginCtrl.prototype.submitForm = function () {
	        var _this = this;
	        if (!this.username || !this.password) {
	            BasicTools_1.Notify({
	                title: "\u8D26\u6237\u548C\u5BC6\u7801\u4E0D\u80FD\u4E3A\u7A7A",
	                type: 'error'
	            });
	            return;
	        }
	        this.AlertMsg(this.$scope, { text: '确认？', needConfirm: true }).then(function () {
	            // 登录中提示
	            var loading = BasicTools_1.Notify({
	                title: "\u767B\u5F55\u4E2D",
	                text: "\u8D26\u53F7\uFF1A" + _this.username + "\uFF0C\u5BC6\u7801\uFF1A" + _this.password,
	                type: 'info',
	                hide: false
	            });
	            // 一秒后，提示登陆成功
	            _this.$timeout(function () {
	                if (loading.remove) {
	                    loading.remove();
	                }
	                BasicTools_1.Notify({
	                    title: "\u767B\u5F55\u6210\u529F",
	                    type: 'success'
	                });
	                sessionStorage.setItem('username', _this.username);
	                location.href = 'index.html#/home';
	            }, 1000);
	        });
	    };
	    return LoginCtrl;
	}());
	// 获取依赖
	LoginCtrl.$inject = [
	    '$scope',
	    '$timeout',
	    'AlertMsg'
	];
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = function (ngModule) {
	    ngModule.controller('LoginCtrl', LoginCtrl);
	};


/***/ },

/***/ 307:
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
	function FormatDate(str) {
	    // 格式化数字，小于10表示为0x
	    function numStd(num) {
	        if (!num) {
	            return undefined;
	        }
	        var _val = parseInt(num);
	        return (_val < 10) ? ('0' + _val) : ('' + _val);
	    }
	    // 反格式化数字，去掉0
	    function numUnstd(num) {
	        if (!num) {
	            return '';
	        }
	        return parseInt(num);
	    }
	    var _str = str + '';
	    if (!_str) {
	        return '';
	    }
	    // 正则判断当前日期格式
	    var datearr;
	    if (/\d{4}-\d{1,2}-\d{1,2}/.test(_str)) {
	        datearr = _str.split('-');
	        _str = numStd(datearr[0]) + '-' + numStd(datearr[1]) + '-' + numStd(datearr[2]);
	    }
	    else if (/\d{4}\.\d{1,2}\.\d{1,2}/.test(_str)) {
	        datearr = _str.split('-');
	        _str = numStd(datearr[0]) + '-' + numStd(datearr[1]) + '-' + numStd(datearr[2]);
	    }
	    else if ((_str.indexOf('年') > -1) && (_str.indexOf('月') > -1) && (_str.indexOf('日') > -1)) {
	        datearr = _str.split('年');
	        var year = datearr[0];
	        var month = datearr[1].split('月')[0];
	        var day = datearr[1].split('月')[1].replace('日', '');
	        _str = numStd(year) + '-' + numStd(month) + '-' + numStd(day);
	    }
	    else {
	        return str;
	    }
	    return _str;
	}
	exports.FormatDate = FormatDate;
	;
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
	    AccessToken: exports.AccessToken,
	    FormatDate: FormatDate
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = BasicTools;


/***/ },

/***/ 308:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var OpenImageDialog_1 = __webpack_require__(309);
	var angular = __webpack_require__(301);
	var AccountAddCtrl = (function () {
	    // 注入依赖
	    function AccountAddCtrl($scope, AsyncForm) {
	        this.$scope = $scope;
	        this.AsyncForm = AsyncForm;
	        this.images = [];
	        // VM用于绑定模板相关内容
	        $scope.VM = this;
	    }
	    // 点击打开选择文件对话框
	    AccountAddCtrl.prototype.openImageDialog = function () {
	        var _this = this;
	        // 调用openImageDialog，返回Promise，传入file、name、url参数
	        OpenImageDialog_1.OpenImageDialog().then(function (_a) {
	            var file = _a.file, url = _a.url, name = _a.name;
	            // 添加进数组
	            _this.images.push({ url: url, name: name });
	            // 需手动刷新数据
	            _this.$scope.$digest();
	            _this.AsyncForm({
	                files: [file],
	                url: 'http://modifyDetail',
	                params: {
	                    gender: 'male'
	                }
	            }).then(function () { console.log('success'); }, function () { console.log('error'); });
	        });
	    };
	    return AccountAddCtrl;
	}());
	// 获取依赖
	AccountAddCtrl.$inject = [
	    '$scope',
	    'AsyncForm'
	];
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = function (ngModule) {
	    ngModule.controller('AccountAddCtrl', AccountAddCtrl);
	};


/***/ },

/***/ 309:
/***/ function(module, exports) {

	"use strict";
	// 打开图片对话框，只接受一张图片上传
	function OpenImageDialog() {
	    // 新建input，作为文件获取
	    var input = document.createElement('input');
	    input.type = 'file';
	    input.name = 'file';
	    input.accept = 'image/*';
	    var resolve;
	    // 新建Promise，并获取resolve函数
	    var promise = new Promise(function (res, rej) {
	        resolve = res;
	    });
	    // 设置input中图片改变时触发事件
	    input.onchange = function () {
	        // 创建fileReader读取文件内容
	        var fileReader = new FileReader();
	        var file = input.files[0];
	        // 读取完毕后，传入文件、图片信息以及名字
	        fileReader.onload = function () {
	            resolve({ file: file, url: fileReader.result, name: input.value.substring(input.value.lastIndexOf('\\') + 1) });
	        };
	        fileReader.readAsDataURL(file);
	    };
	    // 触发表单点击事件
	    input.click();
	    // 返回promise
	    return promise;
	}
	exports.OpenImageDialog = OpenImageDialog;


/***/ },

/***/ 310:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var BasicTools_1 = __webpack_require__(307);
	var angular = __webpack_require__(301);
	var AccountCtrl = (function () {
	    // 注入依赖
	    function AccountCtrl($scope) {
	        this.$scope = $scope;
	        // VM用于绑定模板相关内容
	        $scope.VM = this;
	    }
	    AccountCtrl.prototype.chosen = function (date) { BasicTools_1.Notify({ title: "\u9009\u4E2D" + date }); };
	    AccountCtrl.prototype.chosenInterval = function (date, dateType) { BasicTools_1.Notify({ title: "\u9009\u4E2D" + dateType + "\uFF0C\u4E3A" + date }); };
	    return AccountCtrl;
	}());
	// 获取依赖
	AccountCtrl.$inject = [
	    '$scope',
	];
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = function (ngModule) {
	    ngModule.controller('AccountCtrl', AccountCtrl);
	};


/***/ },

/***/ 311:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var KeyUp_1 = __webpack_require__(312);
	Object.defineProperty(exports, "__esModule", { value: true });
	/*
	 * [alert-msg]
	 *
	 * 确认弹出框组件
	 *
	 * 通过SetAlertMsg服务调用，参考'../services/AlertMsg'
	 *
	 */
	exports.default = function (ngModule) {
	    ngModule.directive('alertMsg', ['AlertMsg', function (AlertMsg) {
	            return {
	                restrict: 'AE',
	                templateUrl: './shared/components/alertMsg.template.html',
	                transclude: true,
	                replace: true,
	                scope: {
	                    params: '=',
	                    reject: '=?',
	                    resolve: '=?'
	                },
	                link: function (scope, element, attrs) {
	                    // 关闭或者取消时，调用reject
	                    scope.close = function () {
	                        scope.reject();
	                        element[0].remove();
	                    };
	                    // 确认时，调用resolve
	                    scope.submit = function () {
	                        // 若设置了再次确认，再次确认
	                        if (scope.params && scope.params.needConfirm) {
	                            AlertMsg(scope, { text: '再次确认？' }).then(function () {
	                                scope.resolve();
	                                element[0].remove();
	                            });
	                        }
	                        else {
	                            scope.resolve();
	                            element[0].remove();
	                        }
	                    };
	                    // 设置按下Esc键时默认取消
	                    KeyUp_1.EscKeyUp(scope, function () {
	                        scope.close();
	                    });
	                }
	            };
	        }]);
	};


/***/ },

/***/ 312:
/***/ function(module, exports) {

	// 按键事件
	// EscKeyUp(scope, callback);
	// SpaceKeyUp(scope, callback);
	"use strict";
	var KeyUpService = (function () {
	    function KeyUpService() {
	        this.CallbackObjscts = [];
	        this.EnterCallbacks = [];
	        this.EscCallbacks = [];
	        this.SpaceCallbacks = [];
	        this.isEventInit = false;
	        // 绑定this
	        this.addEnterCallback = this.addEnterCallback.bind(this);
	        this.addEscCallback = this.addEscCallback.bind(this);
	        this.addSpaceCallback = this.addSpaceCallback.bind(this);
	    }
	    // 添加Enter按键队列
	    KeyUpService.prototype.addEnterCallback = function (scope, callback) {
	        this.addCallback(this.EnterCallbacks, scope, callback);
	    };
	    // 添加Esc按键队列
	    KeyUpService.prototype.addEscCallback = function (scope, callback) {
	        this.addCallback(this.EscCallbacks, scope, callback);
	    };
	    // 添加Space按键队列
	    KeyUpService.prototype.addSpaceCallback = function (scope, callback) {
	        this.addCallback(this.SpaceCallbacks, scope, callback);
	    };
	    // 添加按键事件队列
	    KeyUpService.prototype.addCallback = function (callbacks, scope, callback) {
	        // 产生随机数
	        var uuid = Math.random().toString(36).substr(2);
	        // 需有回调函数
	        // if (typeof callback !== 'function') {
	        //     console.log('callback is not a function.');
	        //     return;
	        // }
	        // 关联uuid的作用域和回调
	        this.CallbackObjscts[uuid] = { scope: scope, callback: callback };
	        // 添加到队列的头部
	        callbacks.unshift(uuid);
	        // 初始化监听事件
	        if (!this.isEventInit) {
	            this.initEvent();
	            this.isEventInit = true;
	        }
	    };
	    // 执行回调队列
	    KeyUpService.prototype.executeCallback = function (callbacks) {
	        var _this = this;
	        if (!callbacks.length) {
	            return;
	        }
	        // 获取队列头部uuid
	        var uuid = callbacks.shift();
	        // 取出uuid关联的作用域和回调
	        var _a = this.CallbackObjscts[uuid], scope = _a.scope, callback = _a.callback;
	        // 执行回调
	        try {
	            scope.$apply(callback());
	        }
	        catch (e) {
	            scope.$apply(callback);
	        }
	        // 移除
	        this.CallbackObjscts.splice(this.CallbackObjscts.findIndex(function (item) { return item === _this.CallbackObjscts[uuid]; }), 1);
	    };
	    // 监听按键事件
	    KeyUpService.prototype.initEvent = function () {
	        var that = this;
	        // 添加按键事件监听
	        document.addEventListener('keyup', (function (e) {
	            if (e === void 0) { e = window.event; }
	            if (e && e.keyCode) {
	                switch (e.keyCode) {
	                    case 13:
	                        // Enter按键事件
	                        that.executeCallback(that.EnterCallbacks);
	                        break;
	                    case 27:
	                        // Esc按键事件
	                        that.executeCallback(that.EscCallbacks);
	                        break;
	                    case 32:
	                        // Space按键事件
	                        that.executeCallback(that.SpaceCallbacks);
	                        break;
	                }
	            }
	        }).bind(this), true);
	    };
	    return KeyUpService;
	}());
	// 新建按键服务
	var KeyUp = new KeyUpService();
	// 取出Esc按键添加和Space按键添加
	var addEnterCallback = KeyUp.addEnterCallback, addEscCallback = KeyUp.addEscCallback, addSpaceCallback = KeyUp.addSpaceCallback;
	exports.EnterKeyUp = addEnterCallback;
	exports.EscKeyUp = addEscCallback;
	exports.SpaceKeyUp = addSpaceCallback;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = KeyUp;


/***/ },

/***/ 313:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var BasicTools_1 = __webpack_require__(307);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = function (ngModule) {
	    /*
	    * @ 日期筛选组件 by 被删
	    * @param: {
	    *     data: {
	    *       beginDate: string?, // 开始日期
	    *       endDate: string?,  // 结束日期
	    *       chosenDate: string?, // 选中日期
	    *     },
	    *     text: string, // 未选择日期时显示
	    *     chosen: function, // 选中日期后回调（传入选中日期：xxxx-xx-xx）
	    * }
	    *
	    */
	    ngModule.directive('selectDate', function () {
	        return {
	            restrict: 'AE',
	            scope: {
	                data: '=?',
	                chosen: '=?',
	                text: '@?'
	            },
	            templateUrl: './shared/components/selectDate.template.html',
	            transclude: true,
	            replace: false,
	            link: function (scope, element, attrs) {
	                var dateNow = new Date();
	                var todate = dateNow.getFullYear() + "-" + (dateNow.getMonth() + 1) + "-" + dateNow.getDate();
	                var beginDate;
	                var endDate;
	                scope.isShown = false;
	                scope.toggle = toggle;
	                scope.init = init;
	                scope.chooseDay = chooseDay;
	                scope.lastMonth = lastMonth;
	                scope.nextMonth = nextMonth;
	                scope.lastYear = lastYear;
	                scope.nextYear = nextYear;
	                scope.isDayChosen = isDayChosen;
	                scope.isDayActive = isDayActive;
	                // 下拉/收起日期组件
	                function toggle() {
	                    scope.isShown = !scope.isShown;
	                }
	                // 初始化事件
	                function init() {
	                    if (!scope.data) {
	                        scope.data = {};
	                    }
	                    scope.chosenDate = scope.data && scope.data.chosenDate || todate;
	                    beginDate = scope.data && scope.data.beginDate || '1700-01-01';
	                    endDate = scope.data && scope.data.endDate || '2900-12-30';
	                    render();
	                }
	                // 刷新日历事件
	                function render(date) {
	                    scope.readingDate = BasicTools_1.FormatDate(date || scope.data.chosenDate || todate);
	                    var year = Number(scope.readingDate.split('-')[0]);
	                    var month = Number(scope.readingDate.split('-')[1]);
	                    var firstday = getFirstDay(year, month);
	                    var monthlength = getMonthLength(year, month);
	                    // readingDays保存当前月份的日期数组
	                    scope.readingDays = [];
	                    // 传入''则为空，用于星期对齐
	                    for (var i = 0; i < firstday; i++) {
	                        scope.readingDays.push('');
	                    }
	                    // 传入当前月份日期
	                    for (var i = 1; i <= monthlength; i++) {
	                        scope.readingDays.push(i);
	                    }
	                }
	                // 选中日期事件
	                function chooseDay(day) {
	                    var _a = getDateDetail(scope.readingDate), year = _a.year, month = _a.month;
	                    scope.chosenDate = scope.data.chosenDate = year + "-" + month + "-" + day;
	                    scope.isShown = false;
	                    if (typeof scope.chosen === 'function') {
	                        scope.chosen(scope.chosenDate);
	                    }
	                }
	                // 选择上一个月份日期
	                function lastMonth() {
	                    var _a = getDateDetail(scope.readingDate), year = _a.year, month = _a.month, day = _a.day;
	                    if (--month === 0) {
	                        render(year - 1 + "-12-" + day);
	                    }
	                    else {
	                        render(year + "-" + month + "-" + day);
	                    }
	                }
	                // 选择下一个月份日期
	                function nextMonth() {
	                    var _a = getDateDetail(scope.readingDate), year = _a.year, month = _a.month, day = _a.day;
	                    if (++month > 12) {
	                        render(year + 1 + "-1-" + day);
	                    }
	                    else {
	                        render(year + "-" + month + "-" + day);
	                    }
	                }
	                // 选择上一年日期
	                function lastYear() {
	                    var _a = getDateDetail(scope.readingDate), year = _a.year, month = _a.month, day = _a.day;
	                    render(year - 1 + "-" + month + "-" + day);
	                }
	                // 选择下一年日期
	                function nextYear() {
	                    var _a = getDateDetail(scope.readingDate), year = _a.year, month = _a.month, day = _a.day;
	                    render(year + 1 + "-" + month + "-" + day);
	                }
	                // 判断日期是否当前选中日期
	                function isDayChosen(day) {
	                    if (!day) {
	                        return false;
	                    }
	                    var _a = getDateDetail(scope.readingDate), year = _a.year, month = _a.month;
	                    return BasicTools_1.FormatDate(year + "-" + month + "-" + day) === BasicTools_1.FormatDate(scope.chosenDate);
	                }
	                // 判断当前日期是否有效日期
	                function isDayActive(day) {
	                    if (!day) {
	                        return false;
	                    }
	                    var _a = getDateDetail(scope.readingDate), year = _a.year, month = _a.month;
	                    var date = BasicTools_1.FormatDate(year + "-" + month + "-" + day);
	                    return (date >= BasicTools_1.FormatDate(beginDate) && date <= BasicTools_1.FormatDate(endDate));
	                }
	                // 获取当月第一天星期几
	                function getFirstDay(year, month) {
	                    return new Date(year, month - 1, 1).getDay();
	                }
	                // 获取当月天数
	                function getMonthLength(year, month) {
	                    var nextMonth = new Date(year, month, 1);
	                    nextMonth.setHours(nextMonth.getHours() - 2);
	                    return nextMonth.getDate();
	                }
	                // 获取当前查看日期的年月日
	                function getDateDetail(date) {
	                    var year = Number(scope.readingDate.split('-')[0]);
	                    var month = Number(scope.readingDate.split('-')[1]);
	                    var day = Number(scope.readingDate.split('-')[2]);
	                    return { year: year, month: month, day: day };
	                }
	            },
	        };
	    });
	};


/***/ },

/***/ 314:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var tslib_1 = __webpack_require__(300);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = function (ngModule) {
	    /*
	    * @ 日期（时间）间断筛选组件
	    * @param: {
	    *     data: {
	    *       beginDate: string?, // 开始日期
	    *       endDate: string?,  // 结束日期
	    *       chosenBeginDate: string?, // 选中开始日期
	    *       chosenEndDate: string?, // 选中结束日期
	    *       beginTime: string? // 开始时间
	    *       endTime: string? // 结束时间
	    *     },
	    *     beginText: string?, // 未选择开始日期时显示
	    *     endText: string?, // 未选择结束日期时显示
	    *     withTime: string? // 是否有时间控件,传入任何值均为是
	    *     chosen: function, // 选中日期后回调（传入选中数据：[data, dataType], dataType有四种：'beginData', 'endData', 'beginTime', 'endTime'）
	    * }
	    *
	    */
	    ngModule.directive('selectDateInterval', function () {
	        return {
	            restrict: 'AE',
	            scope: {
	                data: '=?',
	                chosen: '=?',
	                beginText: '@?',
	                endText: '@?',
	                withTime: '@?',
	            },
	            template: "\n            <div>\n                <div select-date data=\"beginData\" class=\"inline-block\" text=\"{{ data && data.chosenBeginDate || beginText || '\u5F00\u59CB\u65E5\u671F' }}\" chosen=\"chooseBeginDate\"></div>\n                <div ng-if=\"withTime\" select-time class=\"inline-block\" type=\"begin\" chosen=\"chooseTime\" selected=\"beginTime\"></div>\n                <span class=\"bold-vertical-line inline-block\"></span>\n                <div select-date data=\"endData\" class=\"inline-block\" text=\"{{ data && data.chosenEndDate || endText || '\u7ED3\u675F\u65E5\u671F' }}\" chosen=\"chooseEndDate\"></div>\n                <div ng-if=\"withTime\" select-time class=\"inline-block\" type=\"end\" chosen=\"chooseTime\" selected=\"endTime\"></div>\n            </div>\n            ",
	            transclude: true,
	            replace: true,
	            link: function (scope, element, attrs) {
	                var dateNow = new Date();
	                var todate = dateNow.getFullYear() + "-" + (dateNow.getMonth() + 1) + "-" + dateNow.getDate();
	                scope.data = {};
	                scope.beginData = {};
	                scope.endData = {};
	                scope.init = init;
	                scope.chooseBeginDate = chooseBeginDate;
	                scope.chooseEndDate = chooseEndDate;
	                scope.chooseTime = chooseTime;
	                // 初始化事件
	                function init() {
	                    scope.withTime = !!scope.withTime;
	                    scope.beginData = {
	                        beginDate: scope.data && scope.data.beginDate,
	                        endDate: scope.data && scope.data.endDate,
	                        chosenDate: scope.data && scope.data.chosenBeginDate
	                    };
	                    scope.endData = {
	                        beginDate: scope.data && scope.data.beginDate,
	                        endDate: scope.data && scope.data.endDate,
	                        chosenDate: scope.data && scope.data.chosenEndDate
	                    };
	                    if (scope.withTime) {
	                        scope.beginTime = scope.data && scope.data.beginTime || '00:00:00';
	                        scope.endTime = scope.data && scope.data.endTime || '23:59:59';
	                    }
	                }
	                // 选择开始日期事件
	                function chooseBeginDate(date) {
	                    scope.data.chosenBeginDate = date;
	                    scope.endData = tslib_1.__assign({}, scope.endData, { beginDate: date });
	                    if (typeof scope.chosen === 'function') {
	                        scope.chosen(date, 'beginDate');
	                    }
	                }
	                // 选择结束日期事件
	                function chooseEndDate(date) {
	                    scope.data.chosenEndDate = date;
	                    scope.beginData = tslib_1.__assign({}, scope.beginData, { endDate: date });
	                    if (typeof scope.chosen === 'function') {
	                        scope.chosen(date, 'endDate');
	                    }
	                }
	                // 选择时间事件
	                function chooseTime(time, type) {
	                    if (type === 'begin') {
	                        scope.data.beginTime = scope.beginTime = time;
	                    }
	                    else if (type === 'end') {
	                        scope.data.endTime = scope.endTime = time;
	                    }
	                    if (typeof scope.chosen === 'function') {
	                        scope.chosen(time, type + "Time");
	                    }
	                }
	                // 监听data进行初始化
	                scope.$watch('data', function (n, o) {
	                    if (n !== undefined) {
	                        scope.data = n;
	                        init();
	                    }
	                });
	            },
	        };
	    });
	};


/***/ },

/***/ 315:
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = function (ngModule) {
	    ngModule.directive('selectTime', [function () {
	            return {
	                restrict: 'AE',
	                scope: {
	                    chosenCb: '=chosen',
	                    selected: '=selected',
	                    type: '@type'
	                },
	                template: "\n\t\t\t<div select=\"select\" class=\"select-time\" select-id=\"{{ id }}\" on-focus-lost=\"class = '';\">\n\t\t\t\t<p ng-click=\"toggle()\" ng-class=\"class\"><span class=\"btn-time-icon\"></span>{{ selected || '00:00:00' }}</p>\n\t\t\t\t<aside>\n\t\t\t\t\t<article class=\"select-time\">\n\t\t\t\t\t\t<input type=\"text\" ng-model=\"hour\" >:\n\t\t\t\t\t\t<input type=\"text\" ng-model=\"minute\" >:\n\t\t\t\t\t\t<input type=\"text\" ng-model=\"second\" >\n\t\t\t\t\t</article>\n\t\t\t\t\t<footer>\n                        <div class=\"box-1 box-center box-middle\">\n                            <a class=\"button-2\" ng-click=\"confirm()\">\u786E\u8BA4</a>\n\t\t\t\t\t\t    <a class=\"button-2 secondary\" ng-click=\"cancel()\">\u53D6\u6D88</a>\n                        </div>\n\t\t\t\t\t</footer>\n\t\t\t\t</aside>\n\t\t\t</div>\n\t\t\t</aside>",
	                transclude: true,
	                replace: false,
	                link: function (scope, element, attrs) {
	                    var checkTime = function (type, time) {
	                        if (scope.hour < 0 || !/^[0-9]{1,2}$/.test(scope.hour) || scope.hour > 23) {
	                            return false;
	                        }
	                        if (scope.minute < 0 || !/^[0-9]{1,2}$/.test(scope.minute) || scope.minute > 59) {
	                            return false;
	                        }
	                        if (scope.second < 0 || !/^[0-9]{1,2}$/.test(scope.second) || scope.second > 59) {
	                            return false;
	                        }
	                        return true;
	                    };
	                    var formatTime = function (time) {
	                        var _time;
	                        time = Number(time);
	                        _time = (time < 10) ? ('0' + time) : ('' + time);
	                        return _time;
	                    };
	                    scope.class = '';
	                    scope.id = Math.random();
	                    scope.toggle = function () {
	                        if (scope.class === '') {
	                            scope.hour = scope.selected.split(':')[0];
	                            scope.minute = scope.selected.split(':')[1];
	                            scope.second = scope.selected.split(':')[2];
	                        }
	                        scope.class = (scope.class === 'active') ? '' : 'active';
	                    };
	                    scope.confirm = function () {
	                        if (!checkTime()) {
	                            makeToast('时间需为00:00:00-23:59:59间，请填写正确的时间格式', 'error');
	                            return;
	                        }
	                        scope.selected = formatTime(scope.hour) + ':' +
	                            formatTime(scope.minute) + ':' +
	                            formatTime(scope.second);
	                        if (typeof scope.chosenCb === 'function') {
	                            scope.chosenCb(scope.selected, scope.type);
	                        }
	                        scope.toggle();
	                    };
	                    scope.cancel = function () {
	                        scope.toggle();
	                    };
	                },
	            };
	        }]);
	};


/***/ },

/***/ 316:
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	/*
	 * [sidebar]
	 *
	 * 侧边栏组件
	 *
	 * created by deleted
	 *
	 */
	exports.default = function (ngModule) {
	    ngModule.directive('sidebar', ['$state', function ($state) {
	            return {
	                restrict: 'AE',
	                templateUrl: './shared/components/sidebar.template.html',
	                transclude: true,
	                replace: false,
	                link: function (scope, element, attrs) {
	                    var menuShowAll = false;
	                    scope.$state = $state;
	                    // 初始化菜单数据
	                    var menus = [{
	                            icon: 'fa-home',
	                            text: '账户管理',
	                            show: false,
	                            childMenus: [{
	                                    href: 'home.accounts',
	                                    text: '账户信息' // text用于储存该菜单显示名称
	                                }, {
	                                    href: 'home.accountsadd',
	                                    text: '新建'
	                                }]
	                        }, {
	                            icon: 'fa-cubes',
	                            text: '系统管理',
	                            show: false,
	                            href: 'home.system'
	                        }];
	                    scope.menus = menus;
	                    // 点击父菜单
	                    scope.toggleMenu = function (menu) {
	                        // 将其他菜单设置为非激活状态
	                        scope.menus.forEach(function (m) { return m.show = false; });
	                        if (menu.childMenus && menu.childMenus.length) {
	                            // 若当前菜单有子菜单，则切换激活状态
	                            menu.show = !menu.show;
	                        }
	                        else if (menu.href) {
	                            // 若当前菜单没有子菜单，则进行跳转 
	                            $state.go(menu.href);
	                        }
	                    };
	                    checkActive();
	                    // 初始化的时候检测菜单是否激活
	                    function checkActive() {
	                        menus.forEach(function (menu) {
	                            menu.show = !!(menu.childMenus && menu.childMenus.find(function (item) { return item.href === $state.current.name; }));
	                        });
	                    }
	                }
	            };
	        }]);
	};


/***/ },

/***/ 317:
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	/*
	 * [on-enter]
	 *
	 * created by cao
	 *
	 * @param {function} callback
	 *
	 * 监听Enter按键事件，触发callback回调
	 *
	 */
	// 以下代码不会连续触发
	// export default (ngModule) => {
	//     ngModule.directive('onEnter', () => ({
	//         restrict: 'A',
	//         link(scope, element, attrs) {
	//             EnterKeyUp(scope, attrs['onEnter']);
	//         }
	//     }));
	// };
	// 以下代码会连续触发，每一层都会触发
	exports.default = function (ngModule) {
	    ngModule.directive('onEnter', function () { return ({
	        restrict: 'A',
	        link: function (scope, ele, attrs) {
	            document.addEventListener('keyup', onEnter, true);
	            ele.on('$destroy', function () { return document.removeEventListener('keyup', onEnter, true); });
	            function onEnter(ev) {
	                if (ev.keyCode === 13 || ev.key === 'Enter') {
	                    scope.$apply(attrs['onEnter']);
	                    document.removeEventListener('keyup', onEnter, true);
	                }
	            }
	        }
	    }); });
	};


/***/ },

/***/ 318:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var KeyUp_1 = __webpack_require__(312);
	Object.defineProperty(exports, "__esModule", { value: true });
	/*
	 * [on-esc]
	 *
	 * params: callback; // function
	 *
	 * 监听Esc按键事件，触发callback回调
	 *
	 */
	exports.default = function (ngModule) {
	    ngModule.directive('onEsc', function () { return ({
	        restrict: 'A',
	        link: function (scope, ele, attrs) {
	            KeyUp_1.EscKeyUp(scope, attrs['onEsc']);
	        }
	    }); });
	};
	// 以下代码会连续触发，每一层都会触发
	// export default (ngModule) => {
	//     ngModule.directive('onEsc',  () => ({
	//         restrict: 'A',
	//         link(scope, ele, attrs) {
	//             document.addEventListener('keyup', onEsc, true);
	//             ele.on('$destroy', () => document.removeEventListener('keyup', onEsc, true));
	// 
	//             function onEsc(ev) {
	//                 if (ev.keyCode === 27) {
	//                     scope.$apply(attrs['onEsc']);
	//                     document.removeEventListener('keyup', onEsc, true);
	//                 }
	//             }
	//         }
	//     }));
	// }; 


/***/ },

/***/ 319:
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	/*
	 * [on-focus-lost]
	 *
	 * params: callback; // function
	 *
	 * 监听click鼠标事件，元素失去焦点时，触发callback回调
	 *
	 */
	exports.default = function (ngModule) {
	    ngModule.directive('onFocusLost', function () { return ({
	        restrict: 'A',
	        link: function (scope, ele, attrs) {
	            document.addEventListener('click', onClick, true);
	            ele.on('$destroy', function () { return document.removeEventListener('click', onClick, true); });
	            function onClick(ev) {
	                if (!ele[0].contains(ev.target)) {
	                    scope.$apply(attrs['onFocusLost']);
	                }
	            }
	        }
	    }); });
	};


/***/ },

/***/ 320:
/***/ function(module, exports) {

	// 提示确认弹窗
	// SetAlertMsg({
	//     confirmText: '我是确认键',
	//     cancelText: '我是取消键',
	//     title: '我是头部',
	//     text: '我是说明文字文字文字',
	//     needConfirm: true/false
	// }).then(() => {
	//     console.log('点击了确定');
	// }, () => {
	//     console.log('关闭');
	// });
	"use strict";
	var AlertMsgService = (function () {
	    function AlertMsgService($compile, $rootScope) {
	        this.$compile = $compile;
	        this.$rootScope = $rootScope;
	    }
	    // 设置参数，并返回promise
	    AlertMsgService.prototype.setMsg = function (scope, params) {
	        // 创建新的作用域，用于编译指令
	        var newScope = this.$rootScope.$new();
	        // 创建新的Promise，并将回调传入作用域
	        var promise = new Promise(function (resolve, reject) {
	            newScope.reject = reject;
	            newScope.resolve = resolve;
	        });
	        // 传入数据
	        newScope.params = params;
	        // 模板
	        var tmp = '<aside alert-msg params="params" reject="reject" resolve="resolve"></aside>';
	        // 添加到页面中
	        $('body').append(this.$compile(tmp)(newScope));
	        return promise;
	    };
	    return AlertMsgService;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = function (ngModule) {
	    // 注入$compile、$rootScope服务
	    ngModule.factory('AlertMsg', ['$compile', '$rootScope', function ($compile, $rootScope) {
	            return function (scope, params) { return new AlertMsgService($compile, $rootScope).setMsg(scope, params); };
	        }]);
	};


/***/ },

/***/ 321:
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = function (ngModule) {
	    ngModule
	        .factory('qHttp', ['$http', function ($http) { return (function () {
	            function qHttp(config) {
	                return $http(config).then(function (res) { return errCodeHandler(res); }).then(function (res) { return res.data; }).catch(function (res) { errCodeHandler(res); throw (new Error('error response')); });
	            }
	            ['post', 'get', 'delete', 'put'].forEach(function (method) {
	                qHttp[method] = function () {
	                    var obj = [];
	                    for (var _i = 0; _i < arguments.length; _i++) {
	                        obj[_i] = arguments[_i];
	                    }
	                    return $http[method].apply($http, obj).then(function (res) { return errCodeHandler(res); }).then(function (res) { return res.data; }).catch(function (res) { errCodeHandler(res); throw (new Error('error response')); });
	                };
	            });
	            return qHttp;
	        })(); }])
	        .factory('postJSON', ['qHttp', function (qHttp) { return function (url, data, params) { return qHttp({
	            url: url,
	            data: data,
	            params: params,
	            method: 'POST',
	            headers: {
	                'Content-Type': 'application/json;charset=UTF-8'
	            },
	            withCredentials: true,
	            transformRequest: [function (x) { return JSON.stringify(x); }]
	        }); }; }])
	        .factory('putJSON', ['qHttp', function (qHttp) { return function (url, data, params) { return qHttp({
	            url: url,
	            data: data,
	            params: params,
	            method: 'PUT',
	            headers: {
	                'Content-Type': 'application/json;charset=UTF-8'
	            },
	            withCredentials: true,
	            transformRequest: [function (x) { return JSON.stringify(x); }]
	        }); }; }]);
	};
	function errCodeHandler(res) {
	    if (res.status >= 400) {
	        var err = errCodeTranslate(res.data.errorCode);
	        var errText = err ? "\u9519\u8BEF\uFF1A" + err : '';
	        makeToast(errText, 'error');
	    }
	    else if (res.status >= 200) {
	        var body = res.data;
	        if (body.code !== '0') {
	            var err = errCodeTranslate(body.code);
	            var errText = err ? "\u9519\u8BEF\uFF1A" + err : '';
	            makeToast(errText, 'error');
	        }
	    }
	    return res;
	}
	exports.errCodeHandler = errCodeHandler;
	var errCodes = {
	    '0101010101': '名称重复',
	};
	function errCodeTranslate(code) {
	    return errCodes[code] || (code ? "\u9519\u8BEF\u7801" + code : '');
	}


/***/ },

/***/ 322:
/***/ function(module, exports) {

	"use strict";
	// 异步提交带图片表单
	/* 参数:
	 * {
	 * 	files: 传入file input的dom对象,
	 * 	url: 服务器地址,
	 * 	params: 其他需要发送的参数{键：值}
	 *  不应该使用 contentType: 默认为`multipart/form-data`，可用'application/x-www-form-urlencoded'
	 * }
	 * 返回Promise，可使用.then调用
	 */
	var AsyncForm = (function () {
	    function AsyncForm(qHttp, _a) {
	        var url = _a.url, params = _a.params, _b = _a.files, files = _b === void 0 ? [] : _b, contentType = _a.contentType;
	        // 初始化参数
	        this.qHttp = qHttp;
	        this.url = url;
	        this.contentType = contentType;
	        var formData = new FormData();
	        this.formData = formData;
	        // 若有传入文件，则添加
	        if (files) {
	            Array.prototype.forEach.call(files, function (file) {
	                formData.append('file', file);
	            });
	        }
	        // 若有其他参数，则添加
	        Object.keys(params).forEach(function (key) {
	            if (params[key] != null) {
	                formData.append(key, params[key]);
	            }
	        });
	    }
	    AsyncForm.prototype.submit = function () {
	        // 提交，返回promise
	        return this.qHttp.post(this.url, this.formData, {
	            withCredentials: true,
	            headers: {
	                'Content-Type': undefined
	            },
	            transformRequest: function (x) { return x; }
	        });
	    };
	    return AsyncForm;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = function (ngModule) {
	    // 注入qHttp服务
	    ngModule.factory('AsyncForm', ['qHttp', function (qHttp) {
	            return function (config) { return new AsyncForm(qHttp, config).submit(); };
	        }]);
	};


/***/ }

});