---
title: Vue2动画2--CSS过渡与动画
date: 2018-03-17 11:15:38
categories: vue八宝粥
tags: 笔记
---

最近在捣鼓Vue动画的内容，《Vue2 动画》系列用于记录一些使用方法、demo以及原理分析。本文在 Vue 中使用 CSS 过渡、 CSS 动画的方式来实现动画效果。

<!--more-->

# CSS 过渡与动画

---

来，我们先认识下 CSS 过渡。

## CSS transition
CSS transitions 提供了一种在更改CSS属性时控制动画速度的方法。 其可以让属性变化成为一个持续一段时间的过程，而不是立即生效的。比如，将一个元素的颜色从白色改为黑色，通常这个改变是立即生效的，使用 CSS transitions 后该元素的颜色将逐渐从白色变为黑色，按照一定的曲线速率变化。这个过程可以自定义。

通常将两个状态之间的过渡称为隐式过渡（implicit transitions），因为开始与结束之间的状态由浏览器决定。

### transition使用
CSS transitions 可以决定哪些属性发生动画效果 (明确地列出这些属性)，何时开始 (设置 delay），持续多久 (设置 duration) 以及如何动画 (定义 timing funtion，比如匀速地或先快后慢)。

CSS 过渡 由简写属性 transition 定义是最好的方式：

``` css
div {
    transition: <property> <duration> <timing-function> <delay>;
}
```

**property**
指定哪个或哪些 CSS 属性用于过渡。只有指定的属性才会在过渡中发生动画，其它属性仍如通常那样瞬间变化。all 则为全部属性。

**duration**
指定过渡的时长。或者为所有属性指定一个值，或者指定多个值，为每个属性指定不同的时长。

**timing-function**
指定一个函数，定义属性值怎么变化。常用如 linear、ease，更多可参考[缓动函数](http://easings.net/zh-cn)。

**delay**
指定延迟，即属性开始变化时与过渡开始发生时之间的时长。

下面的简写和不简写的例子：

``` css
.short-for-transition {
    transition: margin-left 4s ease 2s;
}

.transition-detail {
  transition-property: margin-left;
  transition-duration: 4s;
  transition-timing-function: ease;
  transition-delay: 2s;
}
```

关于每一个属性的详情，可以参考[CSS transition | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions)。

## Vue与CSS transition

### 简单的demo
上面我们已经大概讲了 CSS transition 的使用方式，这里与Vue的结合也变得很简单，我们还是看官方的例子：

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

``` js
new Vue({
  el: '#demo',
  data: {
    show: true
  }
})
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

### 过渡的类名
我们在 transition 上设置了 name 的值为 fade，然后效果是 Vue 匹配对应的 fade-status 的类名。我们先来看看 Vue 里面提供了哪些类名：

- **v-enter**：定义进入过渡的开始状态。
  - 在元素被插入时生效，在下一个帧移除。
- **v-enter-active**：定义过渡的状态。
  - 在元素整个过渡过程中作用，在元素被插入时生效，在 transition/animation 完成之后移除。
  - 这个类可以被用来定义过渡的过程时间，延迟和曲线函数。
- **v-enter-to**: (2.1.8版及以上)定义进入过渡的结束状态。
  - 在元素被插入一帧后生效 (与此同时 v-enter 被删除)，在 transition/animation 完成之后移除。
- **v-leav**e: 定义离开过渡的开始状态。
  - 在离开过渡被触发时生效，在下一个帧移除。
- **v-leave-active**：定义过渡的状态。
  - 在元素整个过渡过程中作用，在离开过渡被触发后立即生效，在 transition/animation 完成之后移除。
  - 这个类可以被用来定义过渡的过程时间，延迟和曲线函数。
- **v-leave-to**: (2.1.8版及以上)定义离开过渡的结束状态。
  - 在离开过渡被触发一帧后生效 (与此同时 v-leave 被删除)，在 transition/animation 完成之后移除。

文字很多，读起来有点费力气，是时候贴上官网的这个图了：

2.1.8版本前：
![image](http://o905ne85q.bkt.clouddn.com/transition.png)

2.1.8版及以上：
![image](http://o905ne85q.bkt.clouddn.com/transition2.1.8.png)

### 实现逻辑
上一节[《Vue2动画1--transition组件》]()我们简单介绍了一些实现原理相关的函数和事件，这里我们再详细分析下。

根据上一节，我们获得以下的信息：
- 可以使用 requestAnimationFrame 来请求浏览器在下一次重绘之前调用指定的函数来更新动画
- 当 CSS transition 结束时，会触发 transitionend 事件

所以结合之前的猜想和 Vue 的源码，能大概得到这里的实现方式：
1. transition 组件关注子元素是否展示，包括使用 v-if/v-else/v-for 等指令绑定数据生成的元素。
2. 当元素状态变更（display -> none 或 none -> display）时，预埋的钩子检测是否应用了CSS 过渡。
3. 若使用了CSS 过渡，则分两种情况讨论。

**进入动画**
当新元素插入时，我们按照以下方式实现进入动画：
- 当元素插入完成后（mounted），给元素添加对应 v-enter 和 v-enter-active 类名，此时元素开始动画过渡
- 同时通过 requestAnimationFrame 来指定下一帧绘制前，给元素添加 v-enter-to 类名，同时移除 v-enter 类名
- 设置动画结束时间，或者通过 transitionend 事件监听，在过渡结束后，移除 v-enter-to 和 v-enter-active 类名

**离开动画**
当新元素被删除时，我们按照以下方式实现离开动画：
- 当元素删除前（beforeDestroy），给元素添加对应 v-leave 和 v-leave-active 类名，此时元素开始动画过渡
- 同时通过 requestAnimationFrame 来指定下一帧绘制前，给元素添加 v-leave-to 类名，同时移除 v-leave 类名
- 设置动画结束时间，或者通过 transitionend 事件监听，在过渡结束后，移除 v-leave-to 和 v-leave-active 类名，同时执行元素删除操作

以上是整体实现方式，可见在我们使用CSS 过渡的时候，最关键的是 v-enter-active 和 v-leave-active 两个样式。


我们来看看 Vue 里面的部分代码：

``` js
  // start enter transition
  if (expectsCSS) {
    // 添加v-enter和v-enter-active类名
    addTransitionClass(el, startClass)
    addTransitionClass(el, activeClass)
    // nextFrame为下一帧前的执行函数
    // 使用setTimeout向下兼容requestAnimationFrame
    nextFrame(() => {
      // 添加v-enter-to类名，移除v-enter类名
      addTransitionClass(el, toClass)
      removeTransitionClass(el, startClass)
      if (!cb.cancelled && !userWantsControl) {
        if (isValidDuration(explicitEnterDuration)) {
          // 若获取过渡的duration成功，则通过定时器来触发结束后逻辑
          setTimeout(cb, explicitEnterDuration)
        } else {
          // 若获取过渡的duration失败，则通过监听transitionend事件来触发结束后逻辑
          whenTransitionEnds(el, type, cb)
        }
      }
    })
  }
```

当然，完整的 CSS 过渡、相关的钩子等会有更多的考虑和处理，这里只展示核心的实现逻辑部分。

## CSS animation
CSS animations 使得可以将从一个 CSS 样式配置转换到另一个 CSS 样式配置。动画包括两个部分:描述动画的样式规则和用于指定动画开始、结束以及中间点样式的关键帧。

创建动画序列，需要使用 animation 属性或其子属性，该属性允许配置动画时间、时长以及其他动画细节。
和 transition 不一样的是，该属性不能配置动画的实际表现，动画的实际表现是由 @keyframes 规则实现。

### 使用 animation
我们来看看 animation 的使用方式，其实跟 transition 很相像的，子属性如下：
- animation-delay：设置延时，即从元素加载完成之后到动画序列开始执行的这段时间
- animation-direction：设置动画在每次运行完后是反向运行还是重新回到开始位置重复运行
- animation-duration：设置动画一个周期的时长
- animation-iteration-count：设置动画重复次数， 可以指定 infinite 无限次重复动画
- animation-name：指定由 @keyframes 描述的关键帧名称
- animation-play-state：允许暂停和恢复动画
- animation-timing-function：设置动画速度， 即通过建立加速度曲线，设置动画在关键帧之间是如何变化
- animation-fill-mode：指定动画执行前后如何为目标元素应用样式

同样的，CSS animation 属性也是一个简写属性形式:

``` css
/* @keyframes duration | timing-function | delay |
   iteration-count | direction | fill-mode | play-state | name */
  animation: 3s ease-in 1s 2 reverse both paused slidein;

/* @keyframes duration | timing-function | delay | name */
  animation: 3s linear 1s slidein;

/* @keyframes duration | name */
  animation: 3s slidein;
```

我们也可以用详细的子属性方式来写，这里就不详细描述啦。

### 关键帧动画
一旦完成动画的时间设置， 接下来就需要定义动画的表现。

通过使用 @keyframes 建立两个或两个以上关键帧来实现。每一个关键帧都描述了动画元素在给定的时间点上应该如何渲染。

因为动画的时间设置是通过 CSS 样式定义的，**关键帧使用percentage来指定动画发生的时间点。0%表示动画的第一时刻，100%表示动画的最终时刻。**因为这两个时间点十分重要，所以还有特殊的别名：**from**和**to**。

当然，也可包含额外可选的关键帧，描述动画开始和结束之间的状态。

来看个云在天上飘来飘去的demo：

``` css
.clouldmove {
    position: absolute;
    width: 20%;
    margin: 5%;
    float: left;
    margin-left: 70%;
    top: 0;
    animation-name: ClouldMove;
    animation-duration: 8s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-play-state: running;
}
@keyframes ClouldMove {
    0% {
        left: 0;
    }
    25% {
        left: 5%;
    }
    50% {
        left: 0;
    }
    75% {
        left: 5%;
    }
    100% {
        left: 0;
    }
}
```

还有很多的动画效果，包括轮回播放、来回运动等，这里不详细说明，大家感兴趣可以参考[《使用 CSS 动画 | MDN》](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Animations/Using_CSS_animations)。总之要记住，CSS animation 是个超级变态的动画效果实现。

### animation 事件监听器
上面我们讲到了 transitionend，animation 比它还多了些事件。

``` js
// animationstart事件在动画一开始时就被触发
e.addEventListener("animationstart", listener, false);
// 每个周期完成后（除了最后一个周期），会触发animationiteration事件
e.addEventListener("animationend", listener, false);
// 最后一个周期完成后，不会触发animationiteration事件，而触发animationend事件
e.addEventListener("animationiteration", listener, false);
```

### Vue 与 animation
对于 Vue 来说，不管是 transition 还是 animation，都是通过 CSS 和类名来实现动画的，所以基本逻辑原理相似，除去动画结束监听的事件不一样而已。

这里就不多描述啦。

# 结束语

---

本节我们介绍了 Vue 中组件 CSS 过渡和 CSS 动画的使用方式，以及实现逻辑的分析。很多时候，我们的工作时间限制了自己手动造轮子的能动性，但是思路的整理和部分源码的分析也能帮助我们来提升自己。
