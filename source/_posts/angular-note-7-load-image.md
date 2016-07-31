---
title: Angular使用笔记7--使用File API编写预览图片的指令
date: 2016-07-22 21:53:23
categories: angular混搭
tags: 笔记
---
最近的一个项目使用AngularJS(v1.2.6)作为前端的框架，《Angular使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录使用File API编写预览图片的指令的过程。
<!--more-->
## File API
-----
上一节我们已经稍微介绍了一下。
### 有关File API
- File接口提供了文件的信息，以及文件内容的存取方法
- 对象可以用来获取某个文件的信息,还可以用来读取这个文件的内容
- 通常情况下,File对象是来自用户在一个`<input>`元素上选择文件后返回的FileList对象,也可以是来自由拖放操作生成的 DataTransfer对象

### 检查File API兼容性
- window.File&&window.FileReader&&window.FileList&&window.Blob

### 参考
- [《HTML 5中的文件处理之FileAPI》](http://bulaoge.net/topic.blg?dmn=g3g4&tid=2344378#Content)
- 以下内容主要来自该文章

### FileList接口
可以用来代表一组文件的JS对象，比如用户通过`input[type="file"]`元素选中的本地文件列表
``` javascript
#FileList[index] // 得到第index个文件
```

### Blob接口
用来代表一段二进制数据，并且允许我们通过JS对其数据以字节为单位进行“切割”
``` javascript
#Blob.size // 只读特性，数据的字节数  
#Blob.slice(start, length) // 将当前文件切割并将结果返回 
```

### File接口
用来代步一个文件，是从Blob接口继承而来的，并在此基础上增加了诸如文件名、MIME类型之类的特性
``` javascript
#File.size // 继承自Blob，意义同上  
#File.slice(start, length) // 继承自Blob，意义同上  
#File.name // 只读属性，文件名  
#File.type // 只读属性，文件的MIME类型  
#File.urn // 只读属性，代表该文件的URN，几乎用不到，暂且无视 
```

### FileReader
提供读取文件的方法和事件，大多数情况下我们主要使用FileReader。
- FileReader方法

``` javascript
#FileReader.readAsBinaryString(blob/file) // 以二进制格式读取文件内容  
#FileReader.readAsText(file, [encoding]) // 以文本(及字符串)格式读取文件内容，并且可以强制选择文件编码  
#FileReader.readAsDataURL(file) // 以DataURL格式读取文件内容  
#FileReader.abort() // 终止读取操作 
```

- FileReader事件

``` javascript
#FileReader.onloadstart // 读取操作开始时触发  
#FileReader.onload // 读取操作成功时触发  
#FileReader.onloadend // 读取操作完成时触发(不论成功还是失败)  
#FileReader.onprogress // 读取操作过程中触发  
#FileReader.onabort // 读取操作被中断时触发  
#FileReader.onerror // 读取操作失败时触发 
```

- FileReader属性

``` javascript
#FileReader.result // 读取的结果(二进制、文本或DataURL格式)  
#FileReader.readyState // 读取操作的状态(EMPTY、LOADING、DONE)
```

## 编写预览图片的指令
-----
我们知道，在AngularJS中不推荐在控制器中添加DOM操作，所以我们将要把DOM封装到指令里面。
在directives文件夹里添加otherDir.js文件，并在index启动页面中引入。

### 添加模板
模板很简单，也就是一个按钮。
- 按钮的字可以自定义，这里使用了text变量
- 该按钮里面需要将file input隐藏，故使用了样式input{display: none;}
- 该按钮绑定了click事件，来触发选择图片的动作

``` javascript
template: '<div class="file-input" ng-click="click()">' +
	'<a class="btn btn-default">{{ text }}</a>' +
	'</div>',
```

### 设置作用域
指令设置单独作用域，传入两个参数：
- text: 使用@进行单向绑定，设置按钮显示的值
- loadphoto： 使用=进行双向绑定，传入函数用于获取返回的图片url

``` javascript
scope: {
	loadphoto: "=loadphoto",
	text: "@text",
},
```
有关作用域可以参照[《Angular使用笔记5--作用域简单分析以及制作index页面》](https://godbasin.github.io/2016/07/16/angular-note-5-fullfill-index/)

### 设置link函数
link函数里面主要为绑定click事件的处理。
主要逻辑：
- 从该指令根节点元素element中查找file input
- 如果不存在则创建新的file input，如果已经存在则先移除再创建（使得可后续触发点击和change事件）
- 给input绑定change事件，选中图片之后触发加载FileReader读取图片地址
- 通过函数loadphoto返回图片地址
- 设置好上述事件之后，即刻触发点击

``` javascript
link: function(scope, element, attrs) {
	scope.click = function() {
		//从该指令根节点元素element中查找input
		var $input = element[0].getElementsByTagName("input");
		//如果已经存在则先移除input
		if ($input.length) {
			element[0].removeChild($input[0]);
		}
		//创建新的file input
		$input = document.createElement("input");
		$input.setAttribute("type", "file");
		$input.setAttribute("name", "file");
		$input.setAttribute("accept", "image/*");
		//将input添加进该指令根节点元素element中
		element[0].appendChild($input);
		//绑定click事件，取消事件的传播
		$input.addEventListener("click", function() {
			event.stopPropagation();
		});
		//绑定change事件，分析获取图片url
		$input.addEventListener("change", function(e) {
			var fReader = new FileReader(),
				file = e.target.files[0];
			fReader.readAsDataURL(file); //获取图片url
			fReader.onload = function(e) {
				var url = e.target.result;
				scope.loadphoto(url); //返回图片url
			};
		}, false);
		//即刻触发点击
		$timeout(function() {
			$input.click();
		});

	};
},
```

## 使用预览图片的指令
-----
### 在index页面中添加指令
- 在该页面设置头像对应模块添加该指令
- 传入text参数以及loadphoto函数
- 添加img用于展示图片，该img绑定ng-src，参数为avatar

``` html
<a file-input text="上传头像" loadphoto="loadphoto"></a>
<img ng-src="{{ avatar }}"  />
```

### 在IndexCtrl控制器中添加loadphoto函数逻辑
``` javascript
$scope.loadphoto = function(url){
	$scope.avatar = url; //将avatar变量设置为url
}
```

### 最终效果
如图：
![image](http://o905ne85q.bkt.clouddn.com/DC13.tmp.png)

## 结束语
-----
用file API实现图片预览已经成为一种流行方式了，可能如今对兼容性要求也没有很高的，当然对自己要求高的小伙伴们可以把兼容也做了，哈哈。
[此处查看项目代码（仅包含app部分）](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular-notes/7-load-image)
[此处查看页面效果](http://o9grhhyar.bkt.clouddn.com/7-load-image/index.html#/index)