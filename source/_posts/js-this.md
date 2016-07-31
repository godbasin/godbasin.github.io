---
title: 谈谈js的this
date: 2016-07-02 15:32:32
categories: js什锦
tags: 笔记
---
有个同事一直问我代码里面为啥要return this。今天就简单聊聊关于javascript中的this吧。
<!--more-->

首先，在js里面，this指针代表的是执行当前代码的对象的所有者。

## js对象
-----
### 一切皆对象
一切皆对象相信大家都很熟悉了吧。与其他面向对象语言不同的是，JS并没有Class的概念，在其他语言中，我们基本都需要实例化某个具体类的实例，但JS里却不同，它的做法是：任何函数都可以被实例化为一个对象。
JavaScript中的所有事物都是对象：字符串、数值、数组、函数...此外，JavaScript允许自定义对象。

### javascript对象
JavaScript提供多个内建对象，比如 String、Date、Array等等。
对象只是带有属性和方法的特殊数据类型。
- 访问对象的属性
属性是与对象相关的值。访问对象属性的语法是：
``` javascript
objectName.propertyName
```
- 访问对象的方法
方法是能够在对象上执行的动作。可以通过以下语法来调用方法：
``` javascript
objectName.methodName()
```

### 判断对象类型
- typeof运算符
  - typeof的返回值，主要有五种： undefined, boolean, number, string, object。
  - 对于typeof的返回值，容易混淆object和null，因为null在js中指的是一个空对象。
  - 使用typeof的一个不好的地方就是它会把Array还有用户自定义函数都返回为object。
- instanceof运算符
  - instanceof也是一个运算符，运算过程中也需要一个参数(Object, Boolean, Number, String, Function)，判断某一个对象是否是所给的构造函数的一个实例，返回值是true或者false。
- object.constructor
  - constructor属性返回对创建此对象的数组函数的引用。

### 创建对象的方法
- 使用内置对象
  - JavaScript语言原生对象（语言级对象），如String、Object、Function等； 
  - JavaScript运行期的宿主对象（环境宿主级对象），如window、document、body等。 
- 使用JSON符号 
``` javascript
{name:"name", key:"value"} 
```
- 自定义对象构造 
方法很多，工厂方法、构造函数方法、原型方法、混合的构造函数/原型方法等。《javascript高级程序设计》里面讲得很详细，又或者大家可以上网自行谷哥。
  - 使用this关键字构造
  - 使用原型prototype构造

### 参考
[《JavaScript 对象》](http://www.w3school.com.cn/js/js_objects.asp)

## js执行环境
-----
执行环境定义了变量和函数有权访问的其他数据，决定了他们各自的行为。

### 全局执行环境
- 在一个页面中，第一次载入JS代码时创建一个全局执行环境，全局执行环境是最外围的执行环境
- 在Web浏览器中，全局执行环境被认为是window对象
  - 因此，所有的全局变量和函数都是作为window对象的属性和方法创建的。
  - 全局执行环境直到应用程序退出后---例如关闭浏览器和网页---时才被销毁。

### 函数执行环境
- ECMAScript程序中的执行流
  - 每个函数都有自己的执行环境，当执行进入一个函数时，函数的执行环境就会被推入一个执行环境栈的顶部并获取执行权。
  - 当这个函数执行完毕，它的执行环境又从这个栈的顶部被删除，并把执行权并还给之前执行环境。
  - 该执行环境中的所有代码执行完毕后，该环境被销毁，保存在其中的所有变量和函数定义也随之销毁。
- 定义期
  - 全局函数A创建了一个A的[[scope]]属性，包含全局[[scope]]
  - 函数A里定义函数B，则B的[[scope]]包含全局[[scope]]和A的[[scope]]
- 执行期
当函数被执行的时候，就是进入这个函数的执行环境，首先会创一个它自己的活动对象，包含
  - this
  - 参数(arguments，全局对象没有arguments)
  - 局部变量(包括命名的参数)
  - 一个变量对象的作用域链[[scope chain]]

### 作用域 
- 没有块级作用域
- 延长作用域链
  - try-catch语句的catch块
  - with语句

### 参考
[《javascript高级程序第三版学习笔记【执行环境、作用域】》](http://www.cnblogs.com/pigtail/archive/2012/07/19/2570988.html)

## js的this
-----
讲了那么多，终于来到本节的重点了。不过前面讲的也跟接下来的有关系的哦。

### this指向什么
this指针代表的是执行当前代码的对象的所有者。即有以下两种：
- this指向全局变量
- this指向某个对象

### this与全局变量
我们来看以下代码（例1）：
``` javascript
var x;
function example(x) { 
 this.x = x; 
} 
example(5); 
alert(x); //5
```
在这里，x和函数example均是全局变量，因此它们的全局执行环境是window对象。所以在example中的this也是指向全局的window对象。

### this与某个对象
来看下面的代码（例2）
``` javascript
var x;
var example = {
	fun: function(x){
		this.x = x;
		alert(this.x); //5
	}
};
example.fun(5); 
alert(x); //undefined
alert(this.x); //undefined
```
在这里，我们定义了一个example对象，同时给该对象添加了x属性和fun方法，因此在调用fun方法时其执行环境为example的fun函数，而this指向该函数的所有者为example对象。
故最后全局变量x并没有改变，仍然是undefined。

当然上面我们也提到过，js对象的创建办法有几种，刚才的是通过json创建，我们还可以使用其它自定义对象构造方法。
（例3）：
``` javascript
//构造函数，就是通过这个函数生成一个新对象（object），this就指这个新对象
function obj(){
	this.x = 5;
	alert(this.x); //5
}
var example = new obj();
alert(example.x); //5
alert(this.x); //undefined
```

现在我们再看看下面的代码（例4）：
``` javascript
var x;
var example = {
	fun: function(x){
		var fun2 = function(x){
			this.x = x;
			alert(this.x); //5
		};
		fun2(x);
		alert(this.x); //undefined
	}
};
example.fun(5); 
alert(example.x); //undefined
alert(this.x); //5
```
当我们在对象的方法内定义新的函数，这时候该函数内的this绑定到全局window对象。是不是有点不可思议？
这也是我们在写代码过程中容易遇到的一些问题，这里补充一下函数的调用方法一起说明吧。

### JavaScript中函数的调用方式
- 作为对象方法调用
  - 在JavaScript中，函数也是对象，因此函数可以作为一个对象的属性。
  - 此时该函数被称为该对象的方法，在使用这种调用方式时，this被自然绑定到该对象。
- 作为函数调用
这是我们刚才遇到的现象（例4），也即函数作为函数调用。
  - 函数也可以直接被调用，此时this绑定到全局对象。
  - 在浏览器中，window就是该全局对象。
我们可以使用下面变量替代的方法规避这一缺陷：
``` javascript
var x;
var example = {
	fun: function(x){
		var that = this;
		var fun2 = function(x){
			that.x = x;
			alert(this.x); //undefined
			alert(that.x); //5
		};
		fun2(x);
		alert(this.x); //5
	}
};
example.fun(5); 
alert(example.x); //5
alert(this.x); //undefined
```
同时，像setTimeout和setInterval这样的异步回调函数，经常也会遇到执行环境变更的问题，此时我们也可以使用该方法进行规避。
- 作为构造函数调用（例3）
  - JavaScript并没有类（class）的概念，而是使用基于原型（prototype）的继承方式。
  - JavaScript中的构造函数也很特殊，如果不使用new调用，则和普通函数一样。（例1）
- 使用apply或call调用
  - 在JavaScript中函数也是对象，对象则有方法，apply和call就是函数对象的方法。
  - 这两个方法异常强大，他们允许切换函数执行的上下文环境（context），即this绑定的对象。
现在我们定义一个obj对象，并使它的一个方法等于全局函数：
``` javascript
function example(){
	this.x = 5;
	alert(this.x); //5
}
var obj = {};
obj.x = 1;
obj.fun = example;
alert(obj.x); //1
alert(this.x); //undefined
```
1.此时我们直接调用该方法，会修改该对象的属性值。
``` javascript
obj.fun();
alert(obj.x); //5
alert(this.x); //undefined
```
2.如果我们在该方法上进行apply，则会出现以下结果。说明apply()的参数为空时，默认调用全局对象。
``` javascript
obj.fun.apply();
alert(obj.x); //1
alert(this.x); //5
```
3.我们给apply添加该对象作为参数。apply()的作用是改变函数的调用对象，它的第一个参数就表示改变后的调用这个函数的对象。。
``` javascript
obj.fun.apply(obj);
alert(obj.x); //5
alert(this.x); //undefined
```

另外，call方法可以用来代替另一个对象调用一个方法。call方法可将一个函数的对象上下文从初始的上下文改变为由thisObj指定的新对象。
- apply和call两者在作用上是相同的，但两者在参数上有区别的：
  - 对于第一个参数意义都一样
  - 对第二个参数：apply传入的是一个参数数组，也就是将多个参数组合成为一个数组传入，而call则作为call的参数传入（从第二个参数开始

### return this链式调用
最后我们回到最开始的问题，为什么要在代码中使用return this呢？
其实这是个链式调用的小技巧，我们只需要在对象的方法最后return this，就可以返回该对象，继续调用该对象的其它方法。看以下代码：
``` javascript
var x;
var example = {
	fun1: function(x){
		this.x = x;
		alert("fun1: " + this.x);
		return this;
	},
	fun2: function(){
		this.x += 1;
		alert("fun2: " + this.x);
		return this;
	}
};
example.fun1(5).fun2().fun1(2).fun2(); //链式调用对象的方法
//fun1: 5
//fun2: 6
//fun1: 2
//fun2: 3
alert(example.x); //3
alert(this.x); //undefined
```
链式调用是个挺有趣的东西，本骚年当初也是在研究jQuery的源码的时候看到的呢。

### 参考
[《深入浅出JavaScript中的this》](http://www.ibm.com/developerworks/cn/web/1207_wangqf_jsthis/)
[《Javascript的this用法》](http://www.ruanyifeng.com/blog/2010/04/using_this_keyword_in_javascript.html)

## 结束语
-----
有些人觉得jQuery已经过时了，现在都流行像AngularJS/ReactJS/Backbone.js这些框架。
其实jQuery只是个库，它帮我们解决了很多兼容问题，也简化了js代码，跟框架不一样。而且本骚年认为jQuery库还是有很多精华的逻辑和思维呢，这些是永远都不会过时的呀。