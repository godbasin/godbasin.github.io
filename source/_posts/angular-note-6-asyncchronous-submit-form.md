---
title: Angular使用笔记6--编写异步提交带图片的表单服务
date: 2016-07-17 20:52:25
categories: angular混搭
tags: 笔记
---
最近的一个项目使用AngularJS(v1.2.6)作为前端的框架，《Angular使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录编写异步提交带图片的表单服务的过程，同时简单介绍$q服务，以及HTML5 File API和FormData。
<!--more-->
## 有关angularJS$http和$q
-----
### $http
- $http是一个用于读取web服务器上数据的服务
- $http.get()从web服务器上读取静态JSON数据
- $http的post使用会与ajax不一样哦，需要设置Content-Type值，具体可以查看[《Angular使用笔记2--创建登录页面》](https://godbasin.github.io/2016/07/08/angular-note-2-create-login/)里的解决办法

### Promise对象
Javascript采用回调函数(callback)来处理异步编程。从同步编程到异步回调编程有一个适应的过程，但是如果出现多层回调嵌套，也就是我们常说的厄运的回调金字塔(Pyramid of Doom)。
- Promise是一种异步方式处理值（或者非值）的方法
- Promise允许以一种同步的方式编写异步代码
- 代表了一个函数最终可能的返回值或者抛出的异常
- Promises/A规范
  - promise有三种状态：未完成(unfulfilled)，完成(fulfilled) 和失败(failed)
  - promise的状态只能由未完成转换成完成，或者未完成转换成失败
  - promise的状态转换只发生一次

### 在AngularJS中使用Promise: $q
$q是Angular的一种内置服务，它可以使你异步地执行函数，并且当函数执行完成时它允许你使用函数的返回值（或异常）
- $q常用的几个方法
  - defer() 创建一个deferred对象，这个对象可以执行几个常用的方法，比如resolve,reject,notify等
  - all() 传入Promise的数组，批量执行，返回一个promise对象
  - when() 传入一个不确定的参数，如果符合Promise标准，就返回一个promise对象

- defer()方法
  - 在$q中，可以使用resolve方法，变成完成状态；使用reject方法，变成拒绝状态
  - defer()用于创建一个deferred对象，defer.promise用于返回一个promise对象，来定义then方法
  - then中有三个参数，分别是成功回调、失败回调、状态变更回调

- all()方法
  - 可以把多个primise的数组合并成一个
  - 当所有的promise执行成功后，会执行后面的回调

- when()方法
  - 可以传入一个参数，这个参数可能是一个值，可能是一个符合promise标准的外部对象

### 编写一个集成$q服务
这里我们将单个$q服务和多个$q服务（all()方法）集成成一个服务，返回Promise
- query方法
  - query方法返回一个对象，对象包括单个$http请求的Promise以及取消请求的方法
  - multiquery方法返回多个$http请求的promise

``` javascript
app.factory('qService', ['$http', '$q', function($http, $q) {
	return {
		query: function(param) {
			var deferred = $q.defer(), //声明承诺
				cancel = function(reason) { //取消promise事件
					deferred.reject(reason);
				};
			$http(param).
			success(function(data) {
				deferred.resolve(data); //请求成功
			}).
			error(function(data) {
				deferred.reject(data); //请求失败
			});
			return {
				promise: deferred.promise, // 返回承诺
				cancel: cancel // 返回取消事件
			};
		},
		multiquery: function(params) {
			var promises = [];
			for (var i in params) {
				var promise = $http(params[i]); //返回$http服务
				promises.push(promise); //将$http服务添加进队列
			}
			return $q.all(promises); //返回Promise承诺
		}
	};
}])
```
注意：
- 这里取消promise的事件只适合GET请求，若在POST请求上请求可能会导致不可预测的错误哦
- 多个http服务的请求的错误回调本骚年还没想到解决办法，请小伙伴们多多赐教


### 参考
- [《AngularJS 中的Promise --- $q服务详解》](http://www.cnblogs.com/xing901022/p/4928147.html)
- [《理解 Promise 的工作原理》](https://blog.coding.net/blog/how-do-promises-work)

## 异步提交带图片的表单
-----
在Angular中要实现异步提交图片，可以使用组件或者利用HTML5属性formdata和fileapi自己实现图片的提交哦。
- Angular的组件或者服务本骚年木有找到...
- 既然已经使用了jQuery，推荐一个异步提交表单的插件jQuery.form

### XMLHttpRequest Level 2
- XMLHttpRequest是一个浏览器接口，使得Javascript可以进行HTTP(S)通信
- 新版本的XMLHttpRequest对象(XMLHttpRequest Level 2)功能
  - 1.可以设置HTTP请求的时限
  - 2.可以使用FormData对象管理表单数据
  - 3.可以上传文件
  - 4.可以请求不同域名下的数据（跨域资源共享，Cross-origin resource sharing，简称CORS）
  - 5.可以获取服务器端的二进制数据
  - 6.可以获得数据传输的进度信息

这里主要使用FromData，具体其他请查看[《触碰jQuery：AJAX异步详解》](http://www.cnblogs.com/heyuquan/archive/2013/05/13/3076465.html)

### FormData对象
HTML5新增了一个FormData对象，可以模拟表单
使用方法如下：
``` javascript
window.FormData //检测兼容性
var formData = new FormData(); //新建FormData对象
formData.append(name, value); //添加表单项
xhr.send(formData); //发送FormData对象
//以下方法可直接获取网页表单的值
var form = document.getElementById('form'); //获取form对象
var formData = new FormData(form); //生成FormData对象
formData.append(name, value); // 添加表单项
xhr.open('POST', form.action);
xhr.send(formData);//发送FormData对象
```

### File API
HTML5提供了File API，允许js读取本地文件。主要用于本地预览图片。
- FileList接口: 可以用来代表一组文件的JS对象，比如用户通过input[type="file"]元素选中的本地文件列表
- Blob接口: 用来代表一段二进制数据，并且允许我们通过JS对其数据以字节为单位进行“切割”
- File接口: 用来代步一个文件，是从Blob接口继承而来的，并在此基础上增加了诸如文件名、MIME类型之类的特性
- FileReader接口: 提供读取文件的方法和事件
- 检查File API兼容性： window.File&&window.FileReader&&window.FileList&&window.Blob

其他方法可参考[《HTML 5中的文件处理之FileAPI》](http://bulaoge.net/topic.blg?dmn=g3g4&tid=2344378#Content)


### 编写异步提交带图片表单的服务
现在我们利用FormData和FileAPI，可以开始编写异步提交带图片表单的服务了。
添加工厂服务，代码如下：
``` javascript
/* params:
 * {
 * 	fileinput: 传入file input的dom对象,
 * 	url: 服务器地址,
 * 	other: 其他需要发送的参数{键：值}
 *  callback: 成功回调
 *  errback: 失败回调
 * }
 */
.factory('AsyncForm', function() {
	var feature = {}; //用于检查FormData和fileAPI的兼容性
	feature.fileapi = (window.File && window.FileReader && window.FileList && window.Blob);
	feature.formdata = window.FormData !== undefined;
	var fileAPI = feature.fileapi && feature.formdata,
		formData,
		xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP'),
		AsyncForm = function(params) {
			if (fileAPI) {
				var otherparams = params.other, //其他需要发送的参数{键：值}
					callback = params.callback, //成功回调
					errback = params.errback, //失败回调
					files = (params.fileinput && params.fileinput.files) ? params.fileinput.files : {}, //传入file input的dom对象
					onreadystatechange;
				//设置onreadystatechange
				onreadystatechange = function(func, _xhr, errfunc) {
					_xhr.onreadystatechange = function() {
						if (_xhr.readyState == 4) {
							if (_xhr.status == 200) {
								//判断若有成功回调，则执行
								if (typeof func == 'function') {func(_xhr.responseText);} 
							} else {
								//判断若有失败回调，则执行
								if (typeof errfunc == 'function') {errfunc();}
							}
						}
					}
				};
				//新建formData对象
				formData = new FormData();
				//判断是否有图片对象，有则添加进队列
				if (files) {
					for (var i = 0; i < files.length; i++) {
						formData.append('file', files[i]);
					}
				}
				//若有其他表单项，添加进队列
				for (i in otherparams) {
					formData.append(i, otherparams[i]);
				}
				//设置POST方法，以及服务器地址
				xhr.open('post', params.url);
				onreadystatechange(callback, xhr, errback);
			} else {
				alert("浏览器不支持FormData或fileAPI");
			}
		};
	AsyncForm.prototype = {
		//提交表单事件
		submit: function() {
			xhr.send(formData);
		},
	};
	return AsyncForm;
});
```
- 这里的fileinput参数传入file input的dom对象，其实可以直接传入file的，大家可以进行优化哦。

### 使用异步提交带图片表单的服务
- 在控制器中需注入依赖AsyncForm

``` javascript
//创建表单
var asform = new AsyncForm({
	fileinput: $input, //传入file input的dom对象
	url: url, //服务器地址
	other: { //其他需要发送的参数{键：值}
		name: value,
		name: value,
	},
	callback: function(data) {}, //成功回调
	errback: function() {} //失败回调
});
//提交表单
asform.submit();
```

## 结束语
-----
这里没有考虑不支持HTML5时候的处理办法，大家可以私底下试试哦，提示：）可使用iframe实现哦。
[此处查看项目代码（仅包含app部分）](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular-notes/6-asyncchronous-submit-form)