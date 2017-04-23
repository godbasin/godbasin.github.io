---
title: 玩转Angular1(16)--常用的angular方法
date: 2017-03-25 10:07:08
categories: angular混搭
tags: 笔记
---
AngularJS(v1.5.8)已经成为项目们的基本框架，《玩转Angular1》系列用于记录项目中的一些好玩或者比较特别的思路。
本文简单介绍一些常用的angular方法，包括`angular.extend()`、`angular.merge()`，等等。
<!--more-->
## 对象的拷贝
-----
### 方法
在angular中，有以下这些方法可以进行对象的拷贝：

- `angular.extend()`
> 方法可以把任意多个的源对象自身的可枚举属性拷贝给目标对象，然后返回目标对象。
> 为浅拷贝。

``` javascript
angular.extend({}, object1, object2)
```

- `angular.merge()`
> 方法可以把任意多个的源对象自身的可枚举属性拷贝给目标对象，然后返回目标对象。
> 为深拷贝。

``` javascript
angular.merge({}, object1, object2)
```

- `angular.copy()`
> 方法可以对一源对象或数组进行拷贝，然后返回拷贝后对象。
> 为深拷贝。

``` javascript
angular.copy(object)
```

而除了在angular中，ES6也提供了一些浅拷贝的方法：

- `Object.assign()`
> 方法可以把任意多个的源对象自身的可枚举属性拷贝给目标对象，然后返回目标对象。
> 为浅拷贝。
> 等同于`angular.extend()`

``` javascript
Object.assign({}, object1, object2)
```

- `{...object}`
> 等同于`Object.assign()`和`angular.extend()`
> 浅拷贝

### 对象拷贝的应用
其实在数据处理中，对象的拷贝也会是比较常见的。

- 不可更改的状态
在组件设计中，组件对外提供查询状态接口，该状态应该是不可更改影响原状态的，此时我们需要在查询的时候提供一个状态的深拷贝对象：

``` javascript
// 状态的查询，返回原状态的深拷贝
states.get = () => angular.copy(statesObj);
// 当状态维护在不只一个对象中时
states.get = () => angular.merge({}, statesObj1, statesObj2);
```

- 有条件的初始化
在数据的初始化中，我们则可以通过固定的原始对象数据，合入初始化的数据后，然后再进行数据和状态的初始化：

``` javascript
// 原始对象数据，位于constant文件中的一部分
import constant from 'constant.ts';
const {genders, nations, races, ages} = constant;
// 初始化的对象数据，从后台获取，这里假设数据同步返回
const dataObject = getService();
// 初始化事件时，将其合入模板数据
function init(){
    angular.extend(VM, genders, nations, races, ages, {...dataObject});
}
```

- 数据的更新
有些时候，我们维护一个完整的对象数据，而当我们从后台获取更新的时候，只返回了更新的那部分，这时候我们可以合入到原对象：

``` javascript
// 待更新的对象数据，从后台获取，这里假设数据同步返回
const updatedObject = getServiceUpdated();
// 将更新的对象数据合入原数据
Object.assign(originalObject, updatedObject);
```

## 数据的判断
---
### 方法
- `angular.isObject()`
> 判断数据是否为一个对象，与typeof不一样在于，数据为null是返回false

- 其他判断方法
> `angular.isArray()`、`angular.isFunction()`、`angular.isDefined()`等，这里不详细说明了

- `angular.equal`
> 对比两个对象/值是否相等。支持值类型、正则表达式、数组和对象。
如果下列至少有一个是正确的，则将两个对象/值视为相等。
  - 两个对象/值能通过===比较
  - 两个对象/值是同一类型/他们的属性一致并且通过angular.equals详细比较
  - 两者都是NaN (在javascript中, NaN == NaN => false. 但是我们认为两个NaN是平等的)
  - 两个值都代表相同的正则表达式 (在JavaScript里, /abc/ == /abc/ => false. 但是我们认为，在文本匹配时，正则表达式是相同的)


## 结束语
---
这节主要简单介绍常用的angular方法，主要涉及对象的拷贝等等。
在ES6出来之后，angular原有设计的一些方法会有重复，如`angular.merge()`和`Object.assign()`、`{...object}`等，使用过程中我们可以约定好用哪种方法。
