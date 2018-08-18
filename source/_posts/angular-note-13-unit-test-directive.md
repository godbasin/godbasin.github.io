---
title: Angular使用笔记13-对指令Directive进行单元测试
date: 2016-08-05 22:30:27
categories: angular混搭
tags: 笔记
---
最近的一个项目使用AngularJS(v1.2.6)作为前端的框架，《Angular使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录对指令Directive进行单元测试的过程。
<!--more-->

## Directive的单元测试
-----
### 注入模块和依赖
首先我们需要注入模块和依赖，在这里分别是angularTestApp和$compile/$rootScope：
``` js
//注入应用
beforeEach(module('angularTestApp'));
var element, scope;
//注入依赖（指令）
beforeEach(inject(function ($compile, $rootScope) {
	scope = $rootScope.$new();
	// 使用compile编译指令
	element =  $compile("<header app-header></header>")(scope);    
	// 作用域运行
	scope.$digest();
}));
```

### 测试指令生成的模板
对指令生成的模板，可对其包含元素进行测试，例如多少个按钮、有什么文字、等等。
``` js
// 头部指令中，有一个样式为navbar-brand的元素，其内容为Godbasin
it('should contains 1 Godbasin brand', function () {
	// Check that the compiled element contains the templated content
	expect(element[0].querySelectorAll('.navbar-brand').length).toEqual(1);
	expect(element.html()).toContain("Godbasin");
});
// 头部指令中，有一个样式为navbar-header和一个样式为navbar-collapse的元素
it('should have 1 navbar-header and 1 navbar-collapse', function () {    
	expect(element[0].querySelectorAll('.navbar-header').length).toEqual(1);
	expect(element[0].querySelectorAll('.navbar-collapse').length).toEqual(1);
});
```

### 使用jasmine-jquery测试元素
- 安装jasmine-jquery
使用[jasmine-jquery插件](https://github.com/velesin/jasmine-jquery)将有效帮助我们测试指令的元素。这里我们使用bower安装：
``` cmd
bower install jasmine-jquery --save
```
注意：安装jasmine-jquery对jquery的版本有一定要求（jasmine-jquery依赖jquery），可能导致安装失败，提示如下：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/2B17.tmp.png)
这里我们将bower文件中的jquery版本修改一下：
``` cmd
"jquery": ">=2.0.0",
```
然后重新执行`bower install`，此时便可以成功安装jasmine-jquery了。

- 配置karma.conf.js
Karma的配置很简单，只需要将相关的文件添加进加载的文件中便可以：
``` cmd
files: [
	...
	'app/bower_components/jquery/dist/jquery.min.js',
	'app/bower_components/jasmine-jquery/lib/jasmine-jquery.js',
	...
],
```

- 使用jasmine-jquery
这样，我们的元素相关操作变得简单了。
``` javascript
it('should contains 1 Godbasin brand', function () {
	expect($(element).find('.navbar-brand').length).toEqual(1);
	expect($(element).find('.navbar-brand').text()).toContain("Godbasin");
});
it('should have 1 navbar-header and 1 navbar-collapse', function () {    
	expect($(element).find('.navbar-header').length).toEqual(1);
	expect($(element).find('.navbar-collapse').length).toEqual(1);
});
```

### 测试作用域scope
这里我们简单测试Header指令的菜单。
``` javascript
it('should have 2 menus and 1 usermenu', function () {
	expect(scope.menus.length).toEqual(2);
	expect(scope.usermenus.length).toEqual(1);
});
```

### 测试事件触发
这里我们测试按钮的点击。
``` javascript
it('should show asidemenus when click .dropdown-toggle', function () {
	var toggle = $(element).find('.dropdown-toggle');
	var spyEvent = spyOnEvent(toggle, 'click');
	$(element).find('.dropdown-toggle').trigger('click');
	expect(spyEvent).toHaveBeenTriggered();
});
```

## 使用ng-html2js测试指令
-----
当我们的指令中模板使用templateUrl时，我们进行测试会得到以下结果：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/430D.tmp.png)
这时候我们可以使用ng-html2js进行处理。

### 安装配置
这里使用插件[karma-ng-html2js-preprocessor](https://github.com/karma-runner/karma-ng-html2js-preprocessor)。
- 安装依赖
``` cmd
npm install karma-ng-html2js-preprocessor --save-dev
```
- karma.conf.js配置
我们需要在karma配置文件中添加相关的配置：

``` javascript
// 添加加载的文件
files: [
	...
	'app/views/**/*.html',
	'app/views/*.html'
],
// 添加预处理
preprocessors: {
	...
	'app/views/*.html': 'ng-html2js',
	'app/views/**/*.html': 'ng-html2js'
},
// 预处理相关配置
ngHtml2JsPreprocessor: { 
	stripPrefix: 'app/', 
	moduleName: 'views' // 生成的模块名字
},
// 添加插件
plugins: [
	...
	'karma-ng-html2js-preprocessor'
],
```

### 注入模块
测试文件中，我们可以在注入模块的同时注入指令模板，这里使用名字注入：
``` javascript
beforeEach(module('views'));
```
现在运行我们的测试，可以看到测试结果如下：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/7334.tmp.png)
完成！

## 结束语
-----
刚开始接触Karma的配置也很是复杂呢，用多了之后就好多啦，自动化和工程化也是个不简单的事情呢。
[此处查看项目代码（包含app以及test部分）](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular-notes/13-unit-test-directive)

