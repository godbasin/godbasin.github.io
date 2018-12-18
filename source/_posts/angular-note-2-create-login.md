---
title: Angular使用笔记2--创建登录页面
date: 2016-07-08 22:45:32
categories: angular混搭
tags: 笔记
---
最近的一个项目使用AngularJS(v1.2.6)作为前端的框架，《Angular使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录搭建登录页面的过程。
<!--more-->
## 根据产品规划划分模块
-----
### 主要页面逻辑
在这里，本骚年就建一个比较简单的项目。
- 我们的主要页面逻辑如下：
  - 1.登录页面，输入账号和密码即可
  - 2.模块页面

本项目主要用于展示Angular使用过程，故这里使用了Bootstrap简单构建项目。
使用Bootatrap有个不好的地方就是需要引入jQuery(Angular中不建议使用jQuery，同时本人也有这样的洁癖)，而页面大小也增加了不少。

### 创建登录页面
- 首先我们在views文件夹内添加一个login.html

``` html
<div class="container" id="login">
	<!--ng-submit绑定登录事件-->
	<form id="login-form" ng-submit="submit()">
		<h3 class="text-center">login</h3>
		<div class="form-group">
			<label>account</label>
			<!--ng-model双向绑定账号-->
			<input type="text" class="form-control" placeholder="Account" ng-model="username" required />
		</div>
		<div class="form-group">
			<label>Password</label>
			<!--ng-model双向绑定密码-->
			<input type="password" class="form-control" placeholder="Password" ng-model="password" required>
		</div>
		<button type="submit"  class="btn btn-default">登录</button>
	</form>
</div>
```

### 添加路由
- 设置路由
在scripts文件夹内打开app.js，设置如下路由
``` javascript
.config(function($routeProvider) {
	$routeProvider
	//login路由
		.when('/login', {
			templateUrl: 'views/login.html', //login的html页面
			controller: 'LoginCtrl' //login的控制器，稍后提到
		})
		//页面重定向
		.otherwise({
			redirectTo: '/login'
		});
});
```

- 路由功能的实现原理
这里补充一下一般路由功能的实现原理
  - 1.通过hash（location.href.hash）获取位置
  - 2.设置全局拦截器
    - 匹配路径：通配/string/:number
    - 判断后加载对应模块
  - 3.通过window.onhashchange监听路由变化

### 添加登录页面的控制器
- 在scripts文件夹中的controller目录下增加loginCtrl.js
- 在index中引入该js文件

``` javascript
app.controller('LoginCtrl', ['$scope', '$http', function($scope, $http) {
	//定义submit事件，对应html中ng-submit
	$scope.submit = function() {
		//http服务POST账户密码
		$http({
				method: 'POST',
				url: 'your url',
				params: {
					"username": $scope.username, //ng-model双向绑定的用户名
					"password": $scope.password //ng-model双向绑定的密码
				}, 
			})
			.success(function(data) {				
				if (data.result === 'success') {			
					window.location.href = 'index.html#/index'; //判断登录成功，跳转
				} else {					
					alert("error"); //登录失败提示
				}					
			})
			//连接服务失败
			.error(function() {
				alert("connecting fail");
			});
	};
}]);
```

### 不需要在html页面加入ng-controller
由于路由中已经引用了controller，故在路由跳转的同时已经启用了对应的控制器，若在view中再次引入会导致控制器加载两遍的哦

## 保存用户信息
-----
### 登录成功返回用户信息
- 通过登录成功服务端返回的用户信息，在需要用的时候取出
- 可通过该项检查用户是否登录，或者根据用户权限加载不同的视图
- 可通过sessionstorage、$rootscope、angular.service等方式保存，后续章节会提到

## $http服务后台获取不到值
-----
通常从jQuery的ajax转用angular的$http服务的时候，会遇到后台获取不到值的情况，这是因为
### post请求的请求体的两种格式
- 1.字符串: 'name=name&password=password'
这种格式的请求体,需要配置请求头 'Content-Type':'application/x-www-form-urlencoded'
- 2.json: {name:'name',password:'password'}
这种格式的请求体,需要配置请求头 'Content-Type':'application/json;charset=UTF-8'

### ajax和$http区别
- 在jquery中，官方文档解释contentType默认是 application/x-www-form-urlencoded; charset=UTF-8，即第一种
- 在angular的$http中，默认是第二种，所以使用$http(config)提交请求体，config中的data项必须是json格式的值。

### 解决办法
- 此时我们可以配置$http(config)中的headers中的Content-Type值为'application/x-www-form-urlencoded'，然后就能按照ajax的用法尽情使用$http服务啦

``` javascript
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
```

### 参考
[《http请求头中的Content-Type属性在angular 和 node中的用法》](http://www.cnblogs.com/liulangmao/p/3889568.html)
[《jquery和angular的ajax请求的区别》](https://segmentfault.com/a/1190000000396306)
[《Make AngularJS $http service behave like jQuery.ajax()》](http://victorblog.com/2012/12/20/make-angularjs-http-service-behave-like-jquery-ajax/)

## 结束语
-----
本骚年也是AngularJS的初体验者，如果小伙伴们有好的资源请千万千万要分享呀。
[此处查看项目代码（仅包含app部分）](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular-notes/2-create-login)
[此处查看页面效果](http://angular-notes.godbasin.com/2-create-login/index.html#/)
