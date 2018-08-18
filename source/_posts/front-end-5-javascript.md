---
title: 前端入门5--Javascript
date: 2018-05-05 14:59:18
categories: js什锦
tags: 分享
---
《前端入门》系列主要为个人对前端一些经验和认识总结。Javascript 包括三块：ECMAScript、DOM 和 BOM，本文主要介绍 ECMAScript。
<!--more-->

# JavaScript
## ECMAScript
我们常说的`JavaScript`，其实指的是`ECMAScript`。
`ECMAScript`是形成`JavaScript`语言基础的脚本语言。

我们常说的`ES6`/`ES7`，其实是一些`ECMAScript`新特性，主要是语法糖，来提升开发效率。

## 单线程的 Javascript
为什么 javascript 是单线程的吗？其实更多是因为对页面交互的同步处理。作为浏览器脚本语言，`JavaScript`的主要用途是与用户互动，以及操作`DOM`，若是多线程会导致严重的同步问题。

### 异步事件与任务队列
**同步任务**
在主线程上排队执行的任务，只有前一个任务执行完毕，才能执行后一个任务。

**异步任务**
不进入主线程、而进入“任务队列”的任务，只有“任务队列”通知主线程，某个异步任务可以执行了，该任务才会进入主线程执行。

回调函数，就是那些会被主线程挂起来的代码。异步任务必须指定回调函数，当主线程开始执行异步任务，就是执行对应的回调函数。

### 异步执行机制
1. 所有同步任务都在主线程上执行，形成一个执行栈。
2. 主线程之外，还存在一个“任务队列”。只要异步任务有了运行结果，就在“任务队列”之中放置一个事件。
3. 一旦"执行栈"中的所有同步任务执行完毕，系统就会读取“任务队列”，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。
4. 主线程不断重复上面的第三步。

### EventLoop
参考偷来的图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/bg2014100802.png)
图中，主线程运行的时候，产生堆（`heap`）和栈（`stack`），栈中的代码调用各种外部`API`，它们在“任务队列”中加入各种事件（`click`，`load`，`done`）。只要栈中的代码执行完毕，主线程就会去读取“任务队列”，依次执行那些事件所对应的回调函数。
执行栈中的代码（同步任务），总是在读取“任务队列”（异步任务）之前执行。

以上内容，大部分参考自[《JavaScript 运行机制详解：再谈Event Loop》](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)。

## 原型和继承
`Javascript`的原型和继承处处围绕着一点展开：**`JavaScript`中几乎所有的对象都是位于原型链顶端的`Object`的实例。**

当谈到继承时，`JavaScript`只有一种结构：对象。

### 原型和原型链
每个对象都有一个私有属性（称之为`[[Prototype]]`），它持有一个连接到另一个称为其`prototype`对象（原型对象）的链接。该`prototype`对象又具有一个自己的原型，层层向上直到一个对象的原型为`null`。

``` js
Object.getPrototypeOf(Object.prototype) === null; // true
```

根据定义，`null`没有原型，并作为这个原型链中的最后一个环节。

**属性的查找**
`JavaScript`对象是动态的属性“包”（指其自己的属性）。`JavaScript`对象有一个指向一个原型对象的链。
当试图访问一个对象的属性时，它不仅仅在该对象上搜寻，还会搜寻该对象的原型，以及该对象的原型的原型，依次层层向上搜索，直到找到一个名字匹配的属性或到达原型链的末尾。

我们来看个例子：

``` js
// 让我们假设我们有一个对象 o, 其有自己的属性 a 和 b：
var o = {a: 1, b: 2};
// o 的原型 o.__proto__有属性 b 和 c：
o.__proto__ = {b: 3, c: 4};
// 最后, o.__proto__.__proto__ 是 null.
// 这就是原型链的末尾，即 null，
// 根据定义，null 没有__proto__.
// 综上，整个原型链如下: 
{a:1, b:2} ---> {b:3, c:4} ---> null

console.log(o.a); // o.a => 1
console.log(o.b); // o.b => 2
console.log(o.c); // o.c => o.__proto__.c => 4
console.log(o.d); // o.c => o.__proto__.d => o.__proto__.__proto__ == null => undefined
```

属性的查找会带来性能问题：
在原型链上查找属性比较耗时，对性能有副作用，这在性能要求苛刻的情况下很重要。另外，试图访问不存在的属性时会遍历整个原型链。

遍历对象的属性时，原型链上的每个可枚举属性都会被枚举出来。要检查对象是否具有自己定义的属性，而不是其原型链上的某个属性，则必须使用所有对象从`Object.prototype`继承的`hasOwnProperty`方法。

### 创建对象和生成原型链
1. 使用普通语法创建对象（注释为原型链）。

``` js
var o = {a: 1}; // o ---> Object.prototype ---> null
var a = ["yo", "whadup", "?"]; // a ---> Array.prototype ---> Object.prototype ---> null
function f(){ return 2; } // f ---> Function.prototype ---> Object.prototype ---> null
```

2. 使用构造器（曾经最常使用的方式）。

``` js
function Graph() {
  this.vertices = [];
  this.edges = [];
}

Graph.prototype = {
  addVertex: function(v){
    this.vertices.push(v);
  }
};

var g = new Graph();
// g是生成的对象,他的自身属性有'vertices'和'edges'.
// 在g被实例化时,g.__proto__指向了Graph.prototype.
```

当继承的函数被调用时，`this`指向的是当前继承的对象，而不是继承的函数所在的原型对象。

3. 使用`Object.create`，这里不详细论述。

4. 使用`class`关键字（`ECMAScript6`，只是语法糖，`JavaScript`仍然是基于原型的）。

``` js
class Graph {
  constructor() {
    this.vertices = [];
    this.edges = [];
  }
  addVertex(v) {
    this.vertices.push(v);
  }
}

var g = new Graph();
```

除了`class`，还包括`constructor`，`static`，`extends`和`super`关键字，这里也不详细说明。

### __proto__ 与 prototype
`prototype`为显式原型：每一个函数在创建之后都会拥有一个名为`prototype`的属性，这个属性指向函数的原型对象。
 显式原型的作用：用来实现基于原型的继承与属性的共享。

`__proto__`为隐式原型，指向创建这个对象的构造函数（`constructor`）的原型（`prototype`）。
 隐式原型的作用：构成原型链，同样用于实现基于原型的继承。

 附上一张从别人那扒来珍藏多年的图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/e83bca5f1d1e6bf359d1f75727968c11_hd.jpg)

## 作用域和闭包
**作用域链使得我们在函数内部可以直接读取外部以及全局变量。**
**闭包使得我们可以从外部读取局部变量。**

### 作用域链
**上下文**
上下文定义了一个函数正在执行时的作用域环境。

**作用域链**
当代码在一个环境中执行时，会创建变量对象的一个作用域链，来保证对执行环境有权访问的变量和函数的有序访问。
作用域第一个对象始终是当前执行代码所在环境的变量对象，常被称之为“活跃对象”。

每个`JavaScript`执行环境都有一个和它关联在一起的作用域链。这个作用域链是一个对象列表或对象链。

**搜寻标识符**
在函数运行过程中标识符的解析是沿着作用域链一级一级搜索的过程，从第一个对象开始，逐级向后回溯，直到找到同名标识符为止，找到后不再继续遍历，找不到就报错。

当函数执行结束之后，执行期上下文将被销毁。也就会销毁作用域链，激活对象也同样被销毁。

### 闭包
闭包是使用被作用域封闭的变量，函数，闭包等执行的一个函数的作用域。

**闭包的出现**
在`Javascript`语言中，只有函数内部的子函数才能读取局部变量。我们看下面的例子：

``` javascript
function B(){
	var b = 2;
}
B();
alert(b); //undefined
```

在全局环境下无法访问函数`B`内的变量，这是因为全局函数的作用域链里，不含有函数`B`内的作用域。
现在如果我们想要访问内部函数的变量，可以这样做：

``` javascript
function B(){
	var b = 2;
	function C(){
		alert(b); //2
	}
	return C;
}
var A = B();
A(); //2
```

此处，`A`变成一个闭包了。闭包是一种特殊的对象。它由两部分构成：函数，以及创建该函数的环境。环境由闭包创建时在作用域中的任何局部变量组成。
在本质上，闭包就是将函数内部和函数外部连接起来的一座桥梁。

**闭包的用途**
- 用于读取其他函数内部变量的函数
- 让这些变量的值始终保持在内存中

## 参考
[继承与原型链 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
[闭包 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)
[《谈谈js的闭包》](https://godbasin.github.io/2016/07/03/js-closure/)

## 结束语
---
这里面主要介绍了一些Javascript比较基础的原理，像原理这样的东西呀，可以多去理解和深入学习。为什么这样设计呀，历史缘由呀，主要解决什么问题，又是在怎样的情况下提出的。
当我们对一个事物有了较完整的认识，对它的使用和打交道的效率，也会有质的提升的。