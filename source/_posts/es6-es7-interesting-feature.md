---
title: ES6/ES7好玩实用的特性介绍
date: 2017-05-26 22:09:10
categories: js什锦
tags: 分享
---
本文介绍一些ES6/ES7好玩实用又简单的特性，或许对写代码的效率也有一定帮助噢。
<!--more-->

ES6/ES7的出现已经有一段时间了，里面的一些新特性你们是否了解呢？本骚年将结合自身的一些使用经历介绍一些简单实用的新特性/语法糖。
基础常用的一些如`let`、`const`等这里就不详细介绍了，关于ES6/ES7的一些具体说明介绍大家可以参考[ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/string)。

## 「解构」知多少
---
### 解构赋值
- 数组和对象

数组的变量的取值与位置相关，而对象的属性与变量名有关。

``` js
// 数组
let [a, b, c] = [1, 'abc', [3, 4]];
// a = 1, b = 'abc', c = [3, 4]

// 对象
let { x, y } = { x: "a", y: 1 };
// x="a", y=1
```

数组和对象的解构赋值其实用得不多，毕竟这样代码阅读性可能不大好，尤其数组的解构赋值和变量顺序紧紧关联。

### 默认值
解构赋值允许指定默认值。我猜你们很多都用到对象的默认值，数组的用过吗？

``` js
// 数组
let [x, y = 'b', c = true] = ['a', undefined];
// x = 'a', y = 'b', c = true

// 对象
let {x, y = 5, z = 3} = {x: 1, y: undefined, z: null};
// x=1, y=5, z=null

let [x = f()] = [1]; // 这里的f()并不会执行
let [x = f()] = [undefined]; // 这里的f()会执行
```

从上面代码我们可以发现两点：
1. ES6内部使用严格相等运算符（`===`），如果一个数组成员不严格等于`undefined`，默认值是不会生效的。
2. 默认值是表达式时候，会遵守惰性求值（只有在用到的时候，才会求值）。

### 函数参数的解构
函数参数的解构就比较有趣了，当然应用场景会更多。

参数解构，同时设置默认值，再也不需要长长的if判断和处理了:

``` js
function plus({x = 0, y = 0}){
    return (x + y);
}
```

## 牛逼的点--拓展运算符(...)
---
### 数组和对象
别小看这三个点`...`，身为拓展运算符，它们还是很方便的。

``` js
// 数组
const [a, ...b] = [1, 2, 3];
// a = 1, b = [2, 3]

// 对象
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
// x = 1, y = 2, z = { a: 3, b: 4 }
```

这里面需要注意的是：
1. 解构赋值必须是最后一个参数，否则会报错。
2. 解构赋值不会拷贝继承自原型对象的属性（即不会继承来自`__proto__`的属性）。

### 配合解构赋值
解构赋值配合拓展运算符，还可以很方便地扩展某个函数的参数，引入其他操作。

``` js
function newFunction({ x, y, ...restConfig }) {
  // 使用x和y参数进行操作
  // 其余参数传给原始函数
  return originFunction(restConfig);
}
```

### 快速拷贝拓展对象
1. 取出参数对象的所有可遍历属性，拷贝到当前对象之中。

``` js
let z = { a: 1, b: 2 };
let n = { ...z }; // n = { a: 1, b: 2 }
```

2. 快速合并两个对象。

``` js
let ab = { ...a, ...b };
```

我们会发现，使用拓展运算符`...`进行对象的拷贝和合并，其实与ES6中另外一个语法糖`Object.assign()`效果一致：

``` js
// 上面的合并等同于
let ab = Object.assign({}, a, b);
```

需要注意的有：
- 它们都只会拷贝源对象自身的并且可枚举的属性到目标对象身上
- 它们都是浅拷贝，即对象数组等将拷贝引用值
- 对多个对象进行拷贝时，相同的属性名，后面的将覆盖前面的

### rest参数
ES6引入rest参数（形式为`...rest`），用于获取函数的多余参数，这样就不需要使用`arguments`对象了。
rest参数搭配的变量是一个数组，该变量将多余的参数放入数组中。

``` js
function add(...values) {
  let sum = 0;
  values.forEach(x => {sum += x;})
  return sum;
}
add(1, 2, 3) // 6
```

替换`arguments`:

``` js
// arguments变量的写法
function sortNumbers() {
  return Array.prototype.slice.call(arguments).sort();
}

// rest参数的写法
const sortNumbers = (...numbers) => numbers.sort();
```

同样要注意的是，rest只能是最后一个参数。

说到`arguments`，这里插播一下尾调用优化。

- 尾递归

递归非常耗费内存，因为需要同时保存成千上百个调用帧，很容易发生“栈溢出”错误（stack overflow）。
但对于尾递归来说，由于只存在一个调用帧，所以永远不会发生“栈溢出”错误。

- 尾调用优化

ES6的尾调用优化只在严格模式下开启，正常模式是无效的。因为在正常模式下，函数内部有两个变量，可以跟踪函数的调用栈：
1. `func.arguments`：返回调用时函数的参数。
2. `func.caller`：返回调用当前函数的那个函数。

## 一起来「拓展」
---
### 对象的拓展
对象拓展了一些很方便的属性，简化了我们很多的工作。常用的：

- `Object.assign()`

用于将所有可枚举的属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。

- `Object.keys()`

返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键名。

听着好复杂，但是很多时候当我们需要遍历某个对象的时候就很方便了：

``` js
Object.keys(someObj).forEach((key, index) => {
    // 需要处理的操作
});
```

- `Object.values()`：与`Object.keys()`相似，返回参数对象属性的键值
- `Object.entries`：同上，返回参数对象属性的键值对数组

### 数组的拓展
数组也拓展了一些属性：
- `Array.from()`：用于将两类对象转为真正的数组
- `Array.of()`：用于将一组值，转换为数组
- 其它的`entries()`、`keys()`、`values()`等

这里只介绍可能比较常用的：

- `Array.find()`：用于找出第一个符合条件的数组成员

参数是一个回调函数，所有数组成员依次执行该回调函数，直到找出第一个返回值为true的成员，然后返回该成员。如果没有符合条件的成员，则返回`undefined`。

``` js
[1, 4, -5, 10].find((n) => n < 0); // -5
```

- `Array.findIndex()`：用法与find方法非常类似，返回第一个符合条件的数组成员的位置，如果所有成员都不符合条件，则返回-1。

- `Array.includes()`：返回一个布尔值，表示某个数组是否包含给定的值

### 数据结构的拓展
- `Set`

它类似于数组，但是成员的值都是唯一的，没有重复的值。
`Set`本身是一个构造函数，用来生成`Set`数据结构。

从此我们的去重就可以这样写了：

``` js
let newArray = Array.from(new Set(oldArray));
```

- `Map`

JavaScript的对象（`Object`），本质上是键值对的集合（Hash结构），但是传统上只能用字符串当作键。

``` js
// 不信你可以试试看
const obj = {a: 123};
const a = [];
a[obj] = 1;
console.log(a["[object Object]"]);
```

原因是对象只接受字符串作为键名，所以obj被自动转为字符串`[object Object]`。

`Map`数据结构类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。
也就是说，`Object`结构提供了“字符串—值”的对应，Map结构提供了“值—值”的对应，是一种更完善的Hash结构实现。

## 关于简写那些事
---
### 属性的简写
ES6允许直接写入变量和函数，作为对象的属性和方法。

``` js
// 属性简写
function f(x, y) {
  return {x, y}; 
  // 等同于
  return {x: x, y: y};
}

// 方法简写
var obj = {
  method() {}
  // 等同于
  method: function() {}
};
```

### 箭头函数
ES6允许使用“箭头”（`=>`）定义函数。

``` js
var f = () => 5;
// 等同于
var f = function () { return 5 };
```

箭头函数有几个使用注意点：
1. 函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象。
2. 不可以当作构造函数，即不可以使用new命令。
3. 不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用Rest参数代替。

最关键的是第一点：this对象的指向是可变的，但是在箭头函数中，它是固定的。

``` js
function normalFunction() {
  setTimeout(function(){
    console.log(this.name);
  }, 100);
}
function arrowFunction() {
  setTimeout(() => {
    console.log( this.name);
  }, 100);
}

var name = 'outer';

normalFunction.call({ name: 'inner' }); // 'outer'
arrowFunction.call({ name: 'inner' }); // 'inner'
```

## 结束语
-----
这里我们介绍了ES6/ES7一些基础比较普遍的点，像解构、拓展表达式(`...`)、数组对象等拓展属性等等，基本上是一些提高开发效率，减少冗余重复的代码的新特性和新语法。
而像改变我们设计思维、甚至是解决方案的则是一些较复杂的，像`Class`、`Module`、`Promise`、`async/await`等等，咱们分篇讲，或者查[ECMAScript 6 入门手册](http://es6.ruanyifeng.com/)吧哈哈。