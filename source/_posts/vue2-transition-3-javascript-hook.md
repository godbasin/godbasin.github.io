---
title: Vue2动画3--Javascript钩子
date: 2018-03-18 17:05:46
categories: vue八宝粥
tags: 笔记
---

最近在捣鼓 Vue 动画的内容，《Vue2 动画》系列用于记录一些使用方法、demo 以及原理分析。本文介绍使用 Javascript 钩子来实现动画效果的过程。

<!--more-->

# JavaScript 钩子

---

## 完整的钩子信息
这里我们直接贴出[官网](https://cn.vuejs.org/v2/guide/transitions.html#JavaScript-%E9%92%A9%E5%AD%90)的展示：

``` html
<transition
  v-on:before-enter="beforeEnter"
  v-on:enter="enter"
  v-on:after-enter="afterEnter"
  v-on:enter-cancelled="enterCancelled"

  v-on:before-leave="beforeLeave"
  v-on:leave="leave"
  v-on:after-leave="afterLeave"
  v-on:leave-cancelled="leaveCancelled"
>
  <!-- ... -->
</transition>
```

``` js
// ...
methods: {
  // --------
  // 进入中
  // --------

  beforeEnter: function (el) {
    // ...
  },
  // 此回调函数是可选项的设置
  // 与 CSS 结合时使用
  enter: function (el, done) {
    // ...
    done()
  },
  afterEnter: function (el) {
    // ...
  },
  enterCancelled: function (el) {
    // ...
  },

  // --------
  // 离开时
  // --------

  beforeLeave: function (el) {
    // ...
  },
  // 此回调函数是可选项的设置
  // 与 CSS 结合时使用
  leave: function (el, done) {
    // ...
    done()
  },
  afterLeave: function (el) {
    // ...
  },
  // leaveCancelled 只用于 v-show 中
  leaveCancelled: function (el) {
    // ...
  }
}
```

这里对进入和离开的动画钩子说明也比较清晰了，我们来看个 demo：




### 使用 jQuery 的例子
官方提供一个使用 Velocity.js 的例子，这块本骚年不熟悉，就直接拿个最简单的 jQuery 动画来写把~

``` html
<div id="example-4">
  <button @click="show = !show">
    Toggle
  </button>
  <transition
    v-on:enter="enter"
    v-on:leave="leave"
    v-bind:css="false"
  >
    <p v-if="show">
      Demo
    </p>
  </transition>
</div>
```

``` js
new Vue({
  el: '#example-4',
  data: {
    show: false
  },
  methods: {
    enter: (el, done) => {
       // 元素已被插入 DOM
    	// 在动画结束后调用 done
    	$(el)
      	.css('opacity', 0)
      	.animate({ opacity: 1, fontSize: '100px' }, 1000, done)    
    },
    leave: (el, done) => {
        // 与 enter 相同
        $(el).animate({ opacity: 0, fontSize: '0px' }, 1000, done)
    }
  }
})
```

可以看看[这里的demo](https://jsfiddle.net/41fuumkz/6/)。

![image](http://o905ne85q.bkt.clouddn.com/transition2.1.8.png)

### 初始渲染
Vue 的动画提供了一个初始渲染的开关，指的是第一次展示（而不是第一次切换）的时候是否需要动画效果。

具体可以看看上面的例子，当我们把 show 的默认值设置为 true 的时候，初次展示并不会加载进入动画。

但是当我们在 transition 组件中添加 appear 属性时，则在初次展示时也会加载进入动画：

``` html
<div id="example-4">
  <button @click="show = !show">
    Toggle
  </button>
  <transition appear
    v-on:enter="enter"
    v-on:leave="leave"
    v-bind:css="false"
  >
    <p v-if="show">
      Demo
    </p>
  </transition>
</div>
```

可以查看[demo](https://jsfiddle.net/godbasin/41fuumkz/8/)，尝试将 appear 去掉试试（[demo](https://jsfiddle.net/godbasin/41fuumkz/7/)），看看区别就能理解了~

当然，你也可以绑定 appear 专属的动画效果：

``` html
<transition
  appear
  v-on:before-appear="customBeforeAppearHook"
  v-on:appear="customAppearHook"
  v-on:after-appear="customAfterAppearHook"
  v-on:appear-cancelled="customAppearCancelledHook"
>
  <!-- ... -->
</transition>
```

### 实现逻辑
上一节[《Vue2动画1--transition组件》](https://godbasin.github.io/2018/03/11/vue2-transition-1-transition-component/)中，我们详细描述了在使用 CSS 过渡和动画的时候，具体的实现原理。

而 Javascript 钩子的实现逻辑其实很简单：
1. 检测组件是否使用了 Javascript 钩子。
2. 若使用了 Javascript 钩子，则这些钩子函数将在恰当的时机被调用。

当然这些钩子分别穿插在各个地方，顺序的话也很明了。这里以离开动画为例子，我们来看看这段被我简化后的代码：

``` js
export function leave (vnode: VNodeWithData, rm: Function) {
  // el是被动画的元素
  const el: any = vnode.elm

  // 当然如果进入动画还没结束，就取消吧~
  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true
    el._enterCb()
  }

  // 嗯，这里获取该获取的东西，包括Javascript钩子和CSS类名
  const data = resolveTransition(vnode.data.transition)
  const {
    css,
    type,
    leaveClass,
    leaveToClass,
    leaveActiveClass,
    beforeLeave,
    leave,
    afterLeave,
    leaveCancelled,
    delayLeave,
    duration
  } = data

  // 这个cb比较重要啦，将
  const cb = el._leaveCb = once(() => {
    // 移除v-leave-to和v-leave-active类名
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass)
      removeTransitionClass(el, leaveActiveClass)
    }
    
    if (cb.cancelled) {
      // 如果离开被取消，则移除v-leave类名
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass)
      }
      // 看到了吧，这里埋下了leaveCancelled的Javascript钩子
      leaveCancelled && leaveCancelled(el)
    } else {
      rm()
      // 这里埋下了afterLeave的Javascript钩子
      afterLeave && afterLeave(el)
    }
    // 这个离开动画的函数只调用一次啦
    el._leaveCb = null
  })

  // 看看要不要延迟执行啦
  if (delayLeave) {
    delayLeave(performLeave)
  } else {
    performLeave()
  }

  // 嗯，这个才是真正执行的函数
  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    
    // 看，这里埋下了beforeLeave的Javascript钩子
    beforeLeave && beforeLeave(el)
    // 下面这是上一节讲到的逻辑，执行CSS过渡动画的
    // cb是上面定义的回调啦，里面包括afterLeave钩子
    if (expectsCSS) {
      addTransitionClass(el, leaveClass)
      addTransitionClass(el, leaveActiveClass)
      nextFrame(() => {
        addTransitionClass(el, leaveToClass)
        removeTransitionClass(el, leaveClass)
        if (!cb.cancelled && !userWantsControl) {
          if (isValidDuration(explicitLeaveDuration)) {
            setTimeout(cb, explicitLeaveDuration)
          } else {
            whenTransitionEnds(el, type, cb)
          }
        }
      })
    }

    // 看，这里还埋下了leave的Javascript钩子
    // 和其他钩子不同的是，这里传进去cb了
    leave && leave(el, cb)
    if (!expectsCSS && !userWantsControl) {
      cb()
    }
  }
}
```

嗯，大概是这些的逻辑啦，现在大家明白了`leave: function (el, done)`里的 done 是什么了吧~

## 结束语

---

本节我们介绍了 Vue 动画中的 Javascript 钩子，以及相关的一些源码分析。很多时候我们看一个框架内容好多好复杂，其实慢慢理解和思考，一点点拆分下来也不是特别难的啦。
