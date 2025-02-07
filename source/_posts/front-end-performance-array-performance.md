---
title: 前端性能优化--JavaScript 数组解构
date: 2024-09-03 21:37:22
categories: 前端解决方案
tags: 性能优化
---

之前在给大家介绍性能相关内容的时候，经常说要给大家讲一些更具体的案例，而不是大的解决方案。

这不，最近刚查到一个数组的性能问题，来给大家分享一下~

## 数组解构的性能问题

ES6 的出现，让前端开发小伙伴们着实高效工作了一番，我们常常会使用解构的方式拼接数组，比如：

```ts
// 浅拷贝新数组
const newArray = [...originArray];
// 拼接数组
const newArray = [...array1, ...array2];
```

这样的代码经常会出现，毕竟对于大多数场景来说，很少会因为这样简单的数组结构导致性能问题。

但实际上，如果在数据量大的场景下使用，数组解构不仅有性能问题，还可能导致 JavaScript 爆栈等问题。

### 两者差异

使用`concat`和`...`拓展符的最大区别是：`...`使用对象需为可迭代对象，当使用`...`解构数组时，它会尝试迭代数组的每个元素，并将它们展开到一个新数组中。

```ts
a = [1, 2, 3, 4];
b = "test";

console.log(a.concat(b)); // [1, 2, 3, 4, 'test']
console.log([...a, ...b]);
// [1, 2, 3, 4, 't', 'e', 's', 't']
```

如果解构对象不可迭代，则会报错：

```js
a = [1, 2, 3, 4];
b = 100;

console.log(a.concat(b)); // [1, 2, 3, 4, 100]
console.log([...a, ...b]); // TypeError: b is not iterable
```

除此之外，`concat()`用于在数组末尾添加元素，而`...`用于在数组的任何位置添加元素：

```js
a = [1, 2, 3, 4];
b = [5, 6, 7, 8];

console.log(a.concat(b)); // [1, 2, 3, 4, 5, 6, 7, 8]
console.log([...b, ...a]); // [5, 6, 7, 8, 1, 2, 3, 4]
```

### 性能差异

由于`concat()`方法的使用对象为数组，基于次可以进行很多优化，而`...`拓展符在使用时还需要进行检测和迭代，性能上会是`concat()`更好。

```ts
let big = new Array(1e5).fill(99);
let i, x;

console.time("concat-big");
for (i = 0; i < 1e2; i++) x = [].concat(big);
console.timeEnd("concat-big");

console.time("spread-big");
for (i = 0; i < 1e2; i++) x = [...big];
console.timeEnd("spread-big");

let a = new Array(1e3).fill(99);
let b = new Array(1e3).fill(99);
let c = new Array(1e3).fill(99);
let d = new Array(1e3).fill(99);

console.time("concat-many");
for (i = 0; i < 1e2; i++) x = [1, 2, 3].concat(a, b, c, d);
console.timeEnd("concat-many");

console.time("spread-many");
for (i = 0; i < 1e2; i++) x = [1, 2, 3, ...a, ...b, ...c, ...d];
console.timeEnd("spread-many");
```

上述代码在我的 Chrome 浏览器上输出结果为：

```log
concat-big: 35.491943359375 ms
spread-big: 268.485107421875 ms
concat-many: 0.55615234375 ms
spread-many: 6.807861328125 ms
```

也有网友提供的测试数据为：

| 浏览器      | `[...a, ...b]` | `a.concat(b)` |
| ----------- | -------------- | ------------- |
| Chrome 113  | 350 毫秒       | 30 毫秒       |
| Firefox 113 | 400 毫秒       | 63 毫秒       |
| Safari 16.4 | 92 毫秒        | 71 毫秒       |

以及不同数据量的对比数据：

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/array-performance-2.jpg)

更多数据可参考[How slow is the Spread operator in JavaScript?](https://jonlinnell.co.uk/articles/spread-operator-performance)：

### `Array.push()`爆栈

当数组数据量很大时，使用`Array.push(...array)`的组合还可能出现 JavaScript 堆栈溢出的问题，比如这段代码：

```ts
const someArray = new Array(600000).fill(1);
const newArray = [];
let tempArray = [];

newArray.push(...someArray); // JS error
tempArray = newArray.concat(someArray); // can work
```

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/array-performance-1.jpg)

这是因为解构会使用`apply`方法来调用函数，即`Array.prototype.push.apply(newArray, someArray)`，而参数数量过大时则可能超出堆栈大小，可以这样使用来解决这个问题：

```ts
newArray = [...someArray];
```

### 内存占用

之前在项目中遇到的特殊场景，两份代码的差异只有数组的创建方式不一致：

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/array-performance-5.jpg)

使用`newArray = [].concat(oldArray)`的时候，内存占用并没有涨，因此不会触发浏览器的 GC：

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/array-performance-3.png)

但使用`newArray = [...oldArray]`解构数组的时候，内存占用会持续增长，因此也会带来频繁的 GC，导致函数执行耗时直线上涨：

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/array-performance-4.jpg)

可惜的是，对于这个困惑的程度只达到了把该问题修复，但依然无法能建立有效的 demo 复现该问题（因为项目代码过于复杂无法简单提取出可复现 demo）。

个人认为或许跟前面提到的 JavaScript 堆栈问题有些关系，但目前还没有更多的时间去往底层继续研究，只能在这里小小地记录一下。

## 参考

- [spread operator vs array.concat()](https://stackoverflow.com/questions/48865710/spread-operator-vs-array-concat)
- [How slow is the Spread operator in JavaScript?](https://jonlinnell.co.uk/articles/spread-operator-performance)

## 结束语

今天给大家介绍了一个比较具体的性能问题，可惜没有更完整深入地往下捞到 v8 的实现和内存回收相关的内容，以后有机会有时间的话，可以再翻出来看看叭~

希望有一天能有机会和能力解答今天的疑惑~
