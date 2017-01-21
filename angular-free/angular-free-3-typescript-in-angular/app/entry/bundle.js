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
	// 注入angular相关依赖
	var dependencies = [
	    ngRoute,
	    uiRouter,
	];
	// 获取angular的app
	var ngModule = angular.module('AngularFree', dependencies);
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
	                    templateUrl: './modules/login/login.template.html'
	                }];
	            // ui-router路由设置
	            routerStates.forEach(function (stateParams) {
	                $stateProvider.state(tslib_1.__assign({}, stateParams));
	            });
	        }]);
	};


/***/ }

});
//# sourceMappingURL=bundle.js.map