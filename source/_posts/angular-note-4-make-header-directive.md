---
title: Angular使用笔记4--制作头部指令
date: 2016-07-10 11:32:37
categories: angular混搭
tags: 笔记
---
最近的一个项目使用AngularJS(v1.2.6)作为前端的框架，《Angular使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录简单介绍指令，以及制作头部指令的过程。
<!--more-->
## 有关angularJS指令
-----
### 指令要求
- 指令作为一种服务，其定义有几个特殊要求
  - 1.必须使用模块的directive方法定义
  - 2.必须提供factory方法
  - 3.factory方法返回的对象必须返回一个指令定义的对象

### 指令常用属性
- restrict
- 可以是EAMC这四个字母的任意组合，来限定指令的应用场景
  - E: 只限元素名使用
  - A: 只限属性使用
  - C: 只限类名使用
  - M: 只限注释使用

- template/templateUrl
  - 指定HTML标记替换指令内容（或指令自身）
  - 可使用templateUrl指定模板位置

- transclude
  - 包裹指令的内容，如果transclude属性为true
  - 模板中使用ng-transclude定位

- replace
  - 如果replace=true，那么用HTML片段替换指令本身

- scope作用域
  - 如果设置为true 
    - 将为这个指令创建一个新的作用域
    - 如果在同一个元素中有多个指令需要新的作用域的话，它还是只会创建一个作用域
    - 新的作用域规则不适用于根模版（root of the template），因此根模版往往会获得一个新的作用域
  - 如果设置为{}(object hash)
    - 将创建一个新的、独立(isolate)的作用域
    - @或@attr: 建立一个local scope property到DOM属性的绑定
    - =或=expression: 在本地作用域属性与父作用域属性之间设置双向的绑定
    - &或&attr: 提供一个在父作用域上下文中执行一个表达式的途径

- require
  - 请求另外的controller，传入当前directive的link函数中
  - require需要传入一个指令controller的名称

- link函数
  - link函数负责实现DOM和Scope的数据绑定
  - 通常在link里执行DOM事件监听和数据变化监听
  - link函数在template执行后被调用

- controller函数
  - 指令可以有controller，因为指令可以创建scope
  - controller在所有的同一scope的指令中共享，同时可以作为link函数的第四个参数被访问到
  - 在同一层级的scope上，这些controller是指令间的一个可用的通信信道，也可能包含指令自身

- compile函数
  - 在所有module都装载完毕在之后，compile(element)(scope)
  - 这句开始编译和链接整个dom树（其实就是调用dom上出现的指令）

### 解析指令编译过程
首先，controller会在prelink步骤之前进行初始化，并允许其他directive通过指定名称的require进行共享
接下来，angular在解析指令的时候，其实会先按一定的顺序执行所有指令的compile函数，然后执行所有指令的preLink函数（如果存在的话），最后执行所有指令的postLink函数
- compile过程如下：
  - 1.传递应用根节点给$compile函数，开始编译，返回link函数
  - 2.传递根作用域给link函数，开始链接（每个指令分为pre link 和 post link两个过程）

- 关于link和compile
  由于在compile函数最后返回link函数，故有compile函数时指令设置link函数无效，将自动使用compile返回的link函数

- 关于link和controller
  控制器可以暴露一个API，而link可以通过require与其他的指令控制器交互。所以如果要开放出一个API给其他指令用就写在controller中，否则写在link中

### 参考
- [《angularjs directive实例详解》](http://blog.51yip.com/jsjquery/1607.html)
- [《angularjs1.3.0源码解析之directive》](http://www.html-js.com/article/Front-end-source-code-analysis-directive-angularjs130-source-code-analysis-of-the-original)

## 制作头部菜单栏
-----
头部菜单栏包括，主菜单，侧边下拉菜单和时钟。如图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/753B.tmp.png)

### 添加index页面
- 在views文件夹内添加一个index.html
- 在app.js文件中添加路由

``` javascript
.when('/index', {
	templateUrl: 'views/index.html', //index的html页面
	controller: '' //index的控制器，现在暂时不加
})
```
- 设置login登录后跳转至index页面

``` javascript
window.location.href = 'index.html#/index';
```
### 添加头部菜单指令
- 在scripts文件夹中添加directives文件夹，然后新增headerDir.js文件
- 创建指令header

``` javascript
app.directive('appheader', ['$timeout', function($timeout) {
	return {
		restrict: 'AE', 
		templateUrl: './views/directive/header.html',
		controller: function($scope, $element){},
	};
}]);
```
- 在index.html页面内引入headerDir.js文件

### 添加头部菜单模板
- 若模板比较长，为了方便维护可将其放在views中，然后使用templateUrl进行引用
- 模板架构
  - 这里使用bootstrap的导航条作为头部
  - 使用ng-repeat来加载菜单，则可将菜单相关设置放置到scope中，方便维护
- 这里直接使用template编写模板，具体代码可到项目源码中查看，这里就不放出来了

### 添加控制器
- 若控制器逻辑比较多，可新增一个controller的js文件来储存逻辑，然后使用require注入或者模板添加ng-controller引用即可
- 这里直接使用指令的controller来进行逻辑整理
- 主要逻辑
  - 设置主菜单和侧边下拉菜单内容
  - 判断当前路径，并点亮对应菜单（使其active）
  - 加载和格式化时钟，并定时刷新时间

``` javascript
controller: function($scope, $element, $timeout) {
	//$scope.menus用于储存主菜单
	$scope.menus = [{
		title: 'index', //title用于储存路由对应的路径
		href: 'index.html#/index', //href用于设定该菜单跳转路由
		text: '首页', //text用于储存该菜单显示名称
	}, {
		title: 'others',
		href: 'index.html#/other',
		text: '其他',
	}];
	//$scope.usermenus用于储存侧边下拉菜单
	$scope.usermenus = [{
		href: 'index.html#/login', //href用于设定该菜单跳转路由
		text: '退出', //text用于储存该菜单显示名称
	}];
	//判断当前路径，点亮对应模块
	var _location = location.hash.split('/')[1];
	for (var i in $scope.menus) {
		//current用于储存当前菜单是否与当前路径符合，符合则点亮(active)菜单
		if ($scope.menus[i].title == _location){$scope.menus[i].current = true;}
		else{$scope.menus[i].current = false;}
	}
	//用于格式化时间（少于10在前面增加0）
	var numberStandard = function(num) {
		var _val = Number(num),
			_num;
		_num = (_val < 10) ? ('0' + _val) : ('' + _val);
		return _num;
	};
	//用于渲染时钟
	var renderClock = function() {
		var _date = new Date();
		$scope.clock = '';
		$scope.clock += _date.getFullYear() + '年' + (_date.getMonth() + 1) + '月' +
			_date.getDate() + '日';
		$scope.clock += ' ' + numberStandard(_date.getHours()) + ':' + numberStandard(_date.getMinutes()) +
			':' + numberStandard(_date.getSeconds());
		//此处已通过参数注入$timeout服务，若需要注入自定义服务需要require
		$timeout(function() {
			renderClock();
		}, 500);
	};
	renderClock();
}
```

### 在index页面中引入头部指令
``` html
<header app-header></header>
```

### 最终效果
如图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/C902.tmp.png)

## 结束语
-----
AngularJS指令的使用过程中可能会出现一些莫名的问题，主要是因为对指令的了解不够深入，大家可以结合使用多去熟悉一下指令过程。
[此处查看项目代码（仅包含app部分）](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular-notes/4-create-header)
[此处查看页面效果](http://o9grhhyar.bkt.clouddn.com/4-create-header/index.html#/)