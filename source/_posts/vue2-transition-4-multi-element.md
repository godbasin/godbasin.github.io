---
title: Vue2动画4--多元素/组件过渡
date: 2018-03-25 14:37:59
categories: vue八宝粥
tags: 笔记
---

最近在捣鼓Vue动画的内容，《Vue2 动画》系列用于记录一些使用方法、demo 以及原理分析。本文介绍 Vue 中多个元素或是组件的过渡效果。

<!--more-->

# 多元素/组件过渡

---

## 多元素过渡
这里的多元素过渡，通常指的是 v-if 和 v-else 等指令绑定元素状态切换的动画效果。

Vue 官网里面提到一个需要注意的地方：
当有相同标签名的元素切换时，需要通过 key 特性设置唯一的值来标记以让 Vue 区分它们，否则 Vue 为了效率只会替换相同标签内部的内容。

嘛，这个就跟 v-for 中绑定 key 是差不多原理的，总之是追踪元素，然后来进行操作或是优化更新算法。

这里看看[官网](https://cn.vuejs.org/v2/guide/transitions.html#%E5%A4%9A%E4%B8%AA%E5%85%83%E7%B4%A0%E7%9A%84%E8%BF%87%E6%B8%A1)的例子：

``` html
<transition>
  <button v-if="docState === 'saved'" key="saved">
    Edit
  </button>
  <button v-if="docState === 'edited'" key="edited">
    Save
  </button>
  <button v-if="docState === 'editing'" key="editing">
    Cancel
  </button>
</transition>
```

## 多组件过渡
多个组件的过渡要使用动态组件。

什么是动态组件呢？通过使用保留的 component 元素，并对其 is 特性进行动态绑定，你可以在同一个挂载点动态切换多个组件：

``` html
<component v-bind:is="currentView">
  <!-- 组件在 vm.currentview 变化时改变！ -->
</component>
```

``` js
var vm = new Vue({
  el: '#example',
  data: {
    currentView: 'home'
  },
  components: {
    home: { /* ... */ },
    posts: { /* ... */ },
    archive: { /* ... */ }
  }
})
```

这里要加过渡的话，就是酱紫：

``` html
<transition name="component-fade">
  <component v-bind:is="currentView"></component>
</transition>
```

路由组件的过渡，大概也是属于这种吧（没仔细研究过，瞎说的）~

## 过渡模式
多元素和多组件的过渡中，会有上一个的离开以及下一个的进入的情况，于是便有了这个过渡模式。

Vue 提供了以下过渡模式：
- **in-out**：新元素先进行过渡，完成之后当前元素过渡离开。
- **out-in**：当前元素先进行过渡，完成之后新元素过渡进入。

``` html
<transition name="fade" mode="out-in">
  <!-- ... the buttons ... -->
</transition>
```

当然，在不做任何设置的时候，transition 的默认行为是：进入和离开同时发生。

## 实现逻辑
其实多元素和组件的过渡，大致总体是跟单个元素的过渡相似的，大概是多了切换的过程，也就是一个结束另外一个开始的过渡把。

所以这里可以看看以下的源码：

``` js
// replace old child transition data with fresh one
// important for dynamic transitions!
const oldData: Object = oldChild && (oldChild.data.transition = extend({}, data))
// handle transition mode
if (mode === 'out-in') {
  // return placeholder node and queue update when leave finishes
  this._leaving = true
  mergeVNodeHook(oldData, 'afterLeave', () => {
    this._leaving = false
    this.$forceUpdate()
  })
  return placeholder(h, rawChild)
} else if (mode === 'in-out') {
  if (isAsyncPlaceholder(child)) {
    return oldRawChild
  }
  let delayedLeave
  const performLeave = () => { delayedLeave() }
  mergeVNodeHook(data, 'afterEnter', performLeave)
  mergeVNodeHook(data, 'enterCancelled', performLeave)
  mergeVNodeHook(oldData, 'delayLeave', leave => { delayedLeave = leave })
}
```

这里大概的操作是：
1. 当 mode 为 'out-in' 时，将下一个元素的插入时间延后，等待上一个元素的离开动画完成后，再触发下一个元素的插入和进入动画。
2. 当 mode 为 'in-out' 时，将上一个元素的移除时间延后，等待下一个元素的进入动画完成后，再触发上一个元素的移除和离开动画。

因为前面几节我们也分析过，进入动画和元素插入捆绑，而离开动画和元素移除捆绑，所以这里只需要控制元素的延时变更，就能得到动画控制的效果了。



## 结束语

---

本节我们介绍了 Vue 中多元素和多组件的过渡，其实他们也可以算是一个东西啦。在前面几节的基础上，这块内容的理解相对简单些。
