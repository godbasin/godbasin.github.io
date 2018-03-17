---
title: Vue2动画1--transition组件
date: 2018-03-11 15:53:30
categories: vue八宝粥
tags: 笔记
---

最近在捣鼓Vue动画的内容，《Vue2 动画》系列用于记录一些使用方法、demo以及原理分析。本文介绍 transition 组件，和创建简单 demo 的过程。

<!--more-->

# 动画过渡

---

Vue的动画过渡做得挺强大的，不过平时总是做的管理类项目，几乎不怎么用到动画。这次也是因为要弄个讲课PPT才来仔细研究这块，开始以为照着官网看看差不多就可以了，后来才发现这块的内容超出本骚年的想象。嘛，还挺有意思的。

## Vue过渡常用方式

Vue过渡主要分为两类：**CSS动画**和**Javascript动画**。

根据[官网](https://cn.vuejs.org/v2/guide/transitions.html#%E6%A6%82%E8%BF%B0)的说法，Vue 在插入、更新或者移除 DOM 时，提供多种不同方式的应用过渡效果，举例如下：

- 在 CSS 过渡和动画中自动应用 class（CSS动画）
- 可以配合使用第三方 CSS 动画库，如 Animate.css（CSS动画）
- 在过渡钩子函数中使用 JavaScript 直接操作 DOM（Javascript动画）
- 可以配合使用第三方 JavaScript 动画库，如 Velocity.js（Javascript动画）

嗯，也就是上面所说的两类，主要区分是否手动实现还是借用工具实现而已。


## 动画过渡的方法和原理

### 强大的requestAnimationFrame

关于 requestAnimationFrame ，如果说没怎么写过动画的，或许几乎没听过。一般来说，大家常用的方式主要是来解决传说中浏览器刷新频率的问题。

在本骚年以前也写动画的日子里，通常是使用 jQuery ，各种计算然后调用 `animate()` 等。后面也接触了 CSS3 ， transform 到 animation ， CSS 的动画能力简直要上天了。

我们来看看[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)上是怎么介绍的吧。

`window.requestAnimationFrame()` 方法告诉浏览器您希望执行动画，并请求浏览器在下一次重绘之前调用指定的函数来更新动画。该方法使用一个回调函数作为参数，这个回调函数会在浏览器重绘之前调用。

``` js
window.requestAnimationFrame(callback);
```

**callback**
一个在每次需要重新绘制动画时调用的包含指定函数的参数。这个回调函数有一个传参，DOMHighResTimeStamp，指示从触发 requestAnimationFrame 回调到现在（重新渲染页面内容之前）的时间。

**返回值**
一个 long 整数，请求 ID ，也是回调列表中唯一的标识。
可以传此值到 `window.cancelAnimationFrame()` 以取消回调函数。

关于 requestAnimationFrame 能做到的一些 CSS 不能做的，可以参考[《CSS3动画那么强，requestAnimationFrame还有毛线用？》](http://www.zhangxinxu.com/wordpress/2013/09/css3-animation-requestanimationframe-tween-%E5%8A%A8%E7%94%BB%E7%AE%97%E6%B3%95/)看看。

总之，我们来看看Vue里面的相关代码：

``` js
// binding to window is necessary to make hot reload work in IE in strict mode
// 此处在不兼容时使用setTimeout进行向下兼容
const raf = inBrowser && window.requestAnimationFrame
  ? window.requestAnimationFrame.bind(window)
  : setTimeout

export function nextFrame (fn: Function) {
  raf(() => {
    raf(fn)
  })
}
```

nextFrame 就是 Vue 中用来 CSS 动画过渡的方法，可以在下一次重绘之前进行一些处理。后面讲 CSS 动画过渡的时候我们会再详细点分析。

### 关键的transitionend和animationend
这两个分别是 CSS 动画中的结束事件， transitionend 是 CSS transition（如transform/scale等）结束的触发事件，animationend则是CSS动画（keyframe）结束的触发事件。

**transitionend**
transitionend 事件会在 CSS transition 结束后触发。以下两种情况不会触发：
1. 当 transition 完成前移除 transition 时，比如移除 css 的 transition-property 属性。
2. 在 transition 完成前设置  display 为"none"。

``` js
// 在指定的元素上监听transitionend事件
element.addEventListener("transitionend", callback, false);
```

**animationend**
animationend 事件会在一个 CSS 动画完成时触发。与 transitionend 相似，animationend 的触发不包括完成前就已终止的情况，例如元素变得不可见或者动画从元素中移除。

``` js
// 在指定的元素上监听animationend事件
element.addEventListener("animationend", callback, false);
```

相比 CSS transition，CSS 动画还有相关的事件，包括：
- **animationstart**: animationstart 事件会在 CSS 动画开始时触发。如果有 animation-delay 延时，事件会在延迟时效过后立即触发
- **animationiteration**: 循环动画中，在每次循环结束时触发
- **animationcancel**: animationcancel 事件会在 CSS 异常终止时触发（即在未触发animationend事件的情况下停止运行）

Vue 的 CSS 过渡中会使用到这两个事件，后续会讲到。

## transition 组件
Vue 提供了 transition 的封装组件，可以给元素和组件添加 entering/leaving 过渡。

### transition 的使用
我们看看有哪些情况下可以使用 transition：
- 条件渲染 (使用 v-if )
- 条件展示 (使用 v-show )
- 动态组件
- 组件根节点

transition 的封装组件，主要是结合组件生命周期，在一些特殊逻辑（如v-if、v-show、v-for）里增加钩子，来触发动画的实现。

我们知道，Vue 里面实现动画过渡有 CSS 和 Javascript 两种，而两种又是可以结合的，当然这是通过预埋的钩子以及上面讲到的 CSS 事件的方式来实现的。

至于具体的实现，后面分篇来讲一下，这里就不过多讲述了。

### 来个demo
废话少说，直接甩个[官网的例子](https://cn.vuejs.org/v2/guide/transitions.html#%E5%8D%95%E5%85%83%E7%B4%A0-%E7%BB%84%E4%BB%B6%E7%9A%84%E8%BF%87%E6%B8%A1)：

``` html
<!-- transition的使用 -->
<div id="demo">
  <button v-on:click="show = !show">
    Toggle
  </button>
  <transition name="fade">
    <p v-if="show">hello</p>
  </transition>
</div>
```

``` css
/* 简单的css transition实现动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
```

这里是使用的 CSS transition 方式来实现动画过渡的，我们看看在切换 v-if 的时候都发生了什么。

1. v-if 绑定值的变更，导致插入或删除包含在 transition 组件中的元素。
2. 自动嗅探目标元素是否应用了 CSS 过渡或动画。这里的确使用 CSS 过渡，于是会在元素添加时添加 CSS 类名，并判断动画加载完之后删除 CSS 类名。
3. 如果过渡组件提供了 JavaScript 钩子函数，这些钩子函数将在恰当的时机被调用。（这里由于没有使用到，故不会执行）
4. 如果没有找到 JavaScript 钩子并且也没有检测到 CSS 过渡/动画，DOM 操作 (插入/删除) 在下一帧中立即执行。（当然在我们的例子中，这一步也不会生效）

## 结束语

---

本节我们简单介绍了 Vue 中 transition 封装组件的使用和 demo ，以及一些实现原理相关的基础知识。由于直接举的官方例子，这里效果页面大家可以到官网上看看就好啦。
