'use strict';

var app = angular.module('angularTestApp', [
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'ngRoute',
], function($httpProvider) {
	// Use x-www-form-urlencoded Content-Type
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	var param = function(obj) {
		var query = '',
			name, value, fullSubName, subName, subValue, innerObj, i;
		for (name in obj) {
			value = obj[name];

			if (value instanceof Array) {
				for (i = 0; i < value.length; ++i) {
					subValue = value[i];
					/*fullSubName = name + '[' + i + ']';*/
					fullSubName = name;
					innerObj = {};
					innerObj[fullSubName] = subValue;
					query += param(innerObj) + '&';
				}
			} else if (value instanceof Object) {
				for (subName in value) {
					subValue = value[subName];
					fullSubName = name /* + '[' + subName + ']'*/ ;
					innerObj = {};
					innerObj[fullSubName] = subValue;
					query += param(innerObj) + '&';
				}
			} else if (value !== undefined && value !== null)
				query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
		}
		return query.length ? query.substr(0, query.length - 1) : query;
	};
	// Override $http service's default transformRequest
	$httpProvider.defaults.transformRequest = [function(data) {
		return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
	}];
});
app.config(function($routeProvider) {
	$routeProvider
	//login路由
		.when('/login', {
			templateUrl: 'views/login.html', //login的html页面
			controller: 'LoginCtrl' //login的控制器
		})
		.when('/index', {
			templateUrl: 'views/index.html', //index的html页面
			controller: 'IndexCtrl' //index的控制器
		})
		//页面重定向
		.otherwise({
			redirectTo: '/login'
		});
});