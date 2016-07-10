---
title: Angular使用笔记3--公用信息的管理
date: 2016-07-09 16:59:57
categories: angular混搭
tags: 笔记
---
最近的一个项目使用AngularJS(v1.2.6)作为前端的框架，《Angular使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录公共信息的管理方法。
<!--more-->
## 使用服务
-----
### 什么是服务
- 在AngularJS中，服务是一个函数或对象，可在你的AngularJS应用中使用
- AngularJS中有内置服务如$http, $route, $window, $location
- 服务通过注入依赖方式进行使用

### 创建自定义服务
有若干方法来创建服务
- 1.工厂(factory)
- 2.服务(service)
- 3.provider，唯一一种你可以传进.config()函数的service。当你想要在service对象启用之前，先进行模块范围的配置，那就应该用 provider

### factory服务示例
- 创建一个对象，为它添加属性，然后把这个对象返回出来
``` javascript
app.factory('CommonInfo', function() {
	var data = '';
	return {
		set: function(data) {
			data = data;
		},
		get: function() {
			return data;
		}
	};
});
```

### service服务示例
- 用"new"关键字实例化，给"this"添加属性，然后 service返回"this"
- Angular中，Services和Factories几乎一样
``` javascript
app.service('CommonInfo', function() {
	var data = '';
	this.set = function(data) {
		data = data;
	};
	this.get: function() {
		return data;
	};
});
```

### provider
- 使用Provider创建一个service的独特之处是，你可以在Provider对象传递到应用程序的其他部分之前在app.config函数对其进行修改
``` javascript
app.provider('CommonInfo', function() {
	var data = '';
	return {
		set: function(data) {
			data = data;
		},
		get: function() {
			return data;
		}
	};
});
app.config(function(CommonInfo) {
	CommonInfo.set('Config');
});
```

### 参考
- [《AngularJS中的Provider们：Service和Factory等的区别》](https://segmentfault.com/a/1190000003096933)
- [《AngularJS之Factory vs Service vs Provider》](http://www.linuxidc.com/Linux/2014-05/101475.htm)
- [《走进AngularJs(六) 服务》](http://www.cnblogs.com/lvdabao/p/3464015.html?utm_source=tuicool&utm_medium=referral)

## 使用$rootscope
-----
### 什么是作用域Scope
- Scope(作用域)是应用在HTML(视图)和JavaScript(控制器)之间的纽带
- Scope是一个对象，有可用的方法和属性
- Scope可应用在视图和控制器上

### 什么是跟作用域$rootScope
- $rootScope可作用于整个应用中。是各个controller中scope的桥梁。用rootscope定义的值，可以在各个controller中使用
- $rootScope是由angularJS加载模块的时候自动创建的，每个模块只会有1个rootScope

### 使用$rootscope保存公用信息
- 使用$rootscope跟作用域保存公用信息，则在每个控制器中均可获取这些信息
- 使用$rootscope需要引用'$rootscope'依赖
``` javascript
app.controller('SomeCtrl', ['$rootscope', '$scope', function($rootscope, $scope) {
	//设置$rootscope的信息
	$rootscope.data = data;
	//获取$rootscope的信息
	$scope.data = $rootscope.data;
}]);
```

### 参考
- [【原创】angularjs1.3.0源码解析之scope](http://www.html-js.com/article/2365)

## 使用SessionStorage
-----
### HTML5新特性: SessionStorage
- sessionStorage用于本地存储一个会话（session）中的数据，这些数据只有在同一个会话中的页面才能访问并且当会话结束后数据也随之销毁
- sessionStorage不是一种持久化的本地存储，仅仅是会话级别的存储
- 可利用SessionStorage保存一些会话类公共信息

### 使用sessionStorage
> 检测兼容性：window.sessionStorage
> 设置session项：sessionStorage.setItem(key, value)
> 获取session项：sessionStorage.getItem(key)
> 删除session项：sessionStorage.removeItem(key)
> 清除所有session信息：sessionStorage.clear()

## 各种方法适用性
-----
### 服务的使用
- 需通过http获取数据保存的信息
- 公用方法的服务

### $rootscope的使用
- 在HTML DOM中直接使用的信息，如权限等
- 可配合ng-if等绑定界面结构

### sessionStorage的使用
- 会话中的数据，如登录信息
- 模块间跳转时需要携带数据信息
> 跳转前设置session
> location.href进行跳转
> 控制器加载时判断是否加载特定数据
> 加载数据后销毁相关session

## 结束语
-----
以上方法均为本骚年脑洞出来的方法，若有不正确之处希望大家指出，又或者有更多的办法欢迎加入讨论呀。