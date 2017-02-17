---
title: Angular使用笔记9-使用sessionStorage判断是否已登录
date: 2016-07-24 09:32:34
categories: angular混搭
tags: 笔记
---
最近的一个项目使用AngularJS(v1.2.6)作为前端的框架，《Angular使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录使用sessionStorage判断是否已登录并进行跳转的过程。
<!--more-->

前面篇章我们已经讲述过公用信息的获取和设置方法，具体可以查看[《Angular使用笔记3--公用信息的管理》](/2016/07/09/angular-note-3-common-info-manage/)。
在这里我们使用sessionStorage来记录会话，如果没登录则自行跳转至登录页面。
## sessionStorage
-----
### HTML5新特性: SessionStorage
- sessionStorage用于本地存储一个会话（session）中的数据，这些数据只有在同一个会话中的页面才能访问并且当会话结束后数据也随之销毁
- sessionStorage不是一种持久化的本地存储，仅仅是会话级别的存储
- 可利用SessionStorage保存一些会话类公共信息

### 使用sessionStorage
- 检测兼容性：window.sessionStorage
- 设置session项：sessionStorage.setItem(key, value)
- 获取session项：sessionStorage.getItem(key)
- 删除session项：sessionStorage.removeItem(key)
- 清除所有session信息：sessionStorage.clear()
- sessionStorage的项目数：sessionStorage.length

### sessionStorage/localStorage/Cookie的异同
-  sessionStorage数据的存储仅特定于某个会话中，也就是说数据只保持到浏览器关闭，当浏览器关闭后重新打开这个页面时，之前的存储已经被清除
-  localStorage是一个持久化的存储，它并不局限于会话
-  Cookie非常小，它的大小限制为4KB左右（sessionStorage和localStorage为5M左右），可设置失效时间，默认是关闭浏览器后失效

### 依赖注入使用filter
- 需使用依赖注入方法将$filter注入到该controller中

``` javascrpit
var new_value = $filter('filtername')(old_value);
```

## 使用sessionStorage判断是否已登录
-----
### 登录提交设置sessionStorage
登录的时候将账户信息添加进sessionStorage，这里为方便直接记录账户名。当然在实际使用中一般都是登录成功返回信息时进行添加，然后再进行跳转。
- 在LoginCtrl控制器中跳转前加入以下代码：

``` javascrpit
sessionStorage.setItem('username', $scope.username);
```

### 在页面中添加判断
除了login页面之外，其他页面都需要进行判断，方法可以有以下几种：
- 在每个页面的控制器中添加判断
- 在头部控制器中添加判断（除login页面之外都有头部指令）
- 集成服务，在服务中进行判断，然后在控制器中注入服务并使用

这里我们在头部控制器里加入判断
``` javascrpit
//判断是否已经登录，未登录则进行跳转
if (!sessionStorage.getItem('username')) {
	alert("请登录");
	location.href = 'index.html#/';
}
```

### 退出时注销登录信息
我们之前在头部下拉菜单上添加了退出选项，现在我们需要在跳转前注销登录信息。
- 绑定ng-click事件
- 添加click选项，值为funxtion执行函数

``` javascrpit
$scope.usermenus = [{
	text: '退出', //text用于储存该菜单显示名称
	click: function() {
		sessionStorage.clear(); //清除登录信息
		location.href = 'index.html#/login'; //设定该菜单跳转路由
	}
}];
```

## 结束语
-----
至此，我们大概完成了一个较完整的项目，当然实际中工程远大于本骚年所介绍的，遇到的问题也远比这些复杂。但没关系，困难都是一步步克服的，相信大家能很好地解决掉他们。
[此处查看项目代码（仅包含app部分）](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular-notes/8-create-filter)
[此处查看页面效果](http://o9grhhyar.bkt.clouddn.com/9-session-commit/index.html#/index)