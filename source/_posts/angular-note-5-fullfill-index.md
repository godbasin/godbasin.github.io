---
title: Angular使用笔记5--作用域简单分析以及制作index页面
date: 2016-07-16 08:49:21
categories: angular混搭
tags: 笔记
---
最近的一个项目使用AngularJS(v1.2.6)作为前端的框架，《Angular使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录简单介绍作用域，以及制作首页的过程。
<!--more-->
## 有关angularJS作用域
-----
### rootscope相关执行过程
- 调用compile(element)(scope)
- 开始编译dom树，传递的element是应用的根节点（有ng-app属性的节点或者手动bootstrap的节点）
- 传递的scope则是唯一的根作用域rootscope，与根节点对应
- 通过scope.$apply(..)进行digest进行脏检查，开始一些初始化工作

### Scope对象
- 简单的JavaScript对象
- 可以像对其他对象一样添加属性
- Scope对象是用构造函数创建的
- 从原型方法包括$watch，$apply和$digest方法，以及处理自定义事件（消息传递）的$on, $emit和$broadcaset方法

### 监控对象属性
- $watch方法
  - $watch方法监听作用域变化
  - $watch函数所做的工作其实就是作用域中变量和关联的监听函数的存储
  - $watch指定如下两个函数，就可以创建一个监听器
    - 一个监控函数，用于指定所关注的那部分数据。
    - 一个监听函数，用于在数据变更的时候接受提示

- $digest方法
  - $digest方法进行脏检查，它执行了所有在作用域上注册过的监听器
  - 当作用域里的变量发生变化时，调用$digest方法便会执行该作用域以及它的所有子作用域上的相关的监听函数
  - $digest函数的作用是调用这个监控函数，并且比较它返回的值和上一次返回值的差异
  - 如果不相同，监听器就是脏的，它的监听函数就应当被调用
  - 内置的directive和controller内部都已经做了$apply操作

- $eval方法
  - $eval在作用域的上下文上执行代码
  - 使用一个函数作参数，所做的事情是立即执行这个传入的函数，并且把作用域自身当作参数传递给它，返回的是这个函数的返回值

- $apply方法
  - 使用一个函数作参数，用$eval执行这个函数，然后通过$digest触发digest循环
  - 在$apply中，$digest的调用放置于finally块中，以确保即使函数抛出异常，也会执行digest

### 作用域树
- 普通的作用域通过原型链实现了继承关系，孤立作用域没有任何继承关系
- 所有的作用域之间（也包括孤立作用域）根据自身所处的位置都存在以下这些关系
  - $root来访问跟作用域
  - $parent来访问父作用域
  - $childHead（$childTail）访问头（尾）子作用域
  - prevSibling（$nextSibling）访问前（后）一个兄弟作用域

### 参考
- [《构建自己的AngularJS，第一部分：作用域和digest》](http://www.ituring.com.cn/article/39865)
- [《angularjs1.3.0源码解析之scope》](http://www.html-js.com/article/2365)

## 制作index页面
-----
页面结构如下：
![image](http://o905ne85q.bkt.clouddn.com/F3A2.tmp.png)

### 添加index控制器
- 在scripts文件夹内添加一个indexCtrl.js文件，并添加控制器

``` javascript
app.controller('IndexCtrl', ['$scope',function($scope) {}]);
```
- 在app.js文件中对应路由添加上控制器

``` javascript
.when('/index', {
	templateUrl: 'views/index.html', //index的html页面
	controller: 'IndexCtrl' //index的控制器，现在暂时不加
})
```
- 在index.html页面内引入indexCtrl.js文件

### 添加侧边菜单
- 使用bootstrap的列表组作为侧边菜单
- 使用bootstrap的Collapse插件实现展开和收缩菜单
- 菜单使用ng-repeat遍历生成，故需在控制器中加入相关的内容使其生成相应菜单，此处使用scope.asidemenus

### 添加页面内容
- 在index页面中添加页面内容
- 使用统一样式添加页面内容
- 使用scope.loading设置当前内容
- 使用ng-show绑定scope.loading设置相应显示内容
- 使用ng-click绑定菜单事件，改变scope.loading来实现内容切换

### 控制器逻辑
- 使用$scope.loading储存当前位置
- 使用$scope.asidemenus储存侧边菜单，包括以下参数
  - title: string，一级菜单的名称
  - click: function对象，点击菜单时绑定的事件
  - menus: obj对象，一级菜单下的二级菜单
    - title: string，二级菜单的名称
    - click: function对象，点击菜单时绑定的事件
``` javascript
app.controller('IndexCtrl', ['$scope', function($scope) {
	$scope.loading = 'init'; //$scope.loading储存当前位置
	$scope.asidemenus = [{
		title: '', //一级菜单的名称
		click: function() {}, //点击菜单时绑定的事件
		menus: [{ //二级菜单
			text: '', //二级菜单的名称
			click: function() {} //点击菜单时绑定的事件
		}]
	}];
}]);
```

## 结束语
-----
AngularJS中用得最爽的莫过于模板引擎的数据和事件绑定了，当你熟悉了angular之后你会喜欢上他的哦。
[此处查看项目代码（仅包含app部分）](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular-notes/5-fullfill-index)
[此处查看页面效果](http://o9grhhyar.bkt.clouddn.com/5-fullfill-index/index.html#/index)