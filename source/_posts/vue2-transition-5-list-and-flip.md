---
title: Vue2动画5--FLIP与列表过渡
date: 2018-03-31 20:27:57
categories: vue八宝粥
tags: 笔记
---

最近在捣鼓 Vue 动画的内容，《Vue2 动画》系列用于记录一些使用方法、demo 以及原理分析。本文讲述 Vue 中列表的过渡，以及介绍下 FLIP。

<!--more-->

# FLIP

---

关于 FLIP，在了解之后会有“卧槽还有这种骚操作”的感觉。

## 什么是FLIP
这里有个简单的文章来说明 FLIP，包括[原文](https://aerotwist.com/blog/flip-your-animations/)和[译文](http://web.jobbole.com/83598/)。

这里借助翻译人员的力量，贴出FLIP四个字母的解释啦。

FLIP 代表 First、Last、Invert、Play：
- **First**：元素参与 transtion 的初始状态。
- **Last**：元素的最终状态。
- **Invert**：这里有点意思。你弄清楚了元素从开始到结束是如何改变的，如它的 width、height、opacity。下一步，你应用 transform 和 opacity 的变化来扭转或反转它们。如果元素已经向下移动到初始和结束状态之间的 90px，然后在 Y 轴上应用 transform -90px。这让元素看起来仍然在初始的位置，所以元素并没有达到最终的位置。
- **Play**：为你之前改变的属性开启过渡，然后移除反转的改变。因为当移除 transform 和 opacity 时，元素都在它们的最终位置。这会缓解从伪造的初始位置到最终位置的计算量。

## 如何理解FLIP
最初看到这些解释的时候，也是不是很明白在说啥。后面仔细看了下，好骚的操作~

那本骚年就以自身的理解来讲一下这个操作是怎么骚的~

### 动画的性能
故事要从很多年前说起，当年 CSS3 还没普遍兼容，我们使用着最原始的jQuery来做动画。那时候怎么做的呢？通常是通过定时器和直接改变元素的 style 来实现动画的，jQuery 的话，一般就是用`.animate()`来做的。

但是这样做会有什么问题呢？这要从浏览器渲染说起啦。大家可以看看[《浏览器的渲染原理简介》](https://coolshell.cn/articles/9666.html)这篇文章，里面讲得比较详细。

这里描述下两个概念：
- **Repaint**：屏幕的一部分要重画，比如某个 CSS 的背景色变了。但是元素的几何尺寸没有变。
- **Reflow**：意味着元件的几何尺寸变了，我们需要重新验证并计算 Render Tree。是 Render Tree 的一部分或全部发生了变化。

简单说就是，Reflow 的成本比 Repaint 的成本高得多的多。而我们手动设置这些动画的时候，则可能会中了死穴。

但是不是所有属性动画消耗的性能都一样，其中消耗最低的是 transform 和 opacity 两个属性（当然还有会触发 Composite 的其他 CSS 属性），其次是 Paint 相关属性。相关的分析大家可以参考下[《CSS Animation性能优化》](https://www.w3cplus.com/animation/animation-performance.html)。

所以从某种角度来说，我们使用 CSS3 的 transform 这些，是可以优化动画性能的。

### 元素的样式规整
更多的情况是，我们在计算动画时，通常很难计算最终状态，例如一些元素的重新排列，而我们又希望能有个过渡动画的时候。

通常来说，我们如果真的需要完整地计算整个样式过渡的动画，很多时候只能将元素设置`position: absolute/fixed`这样实现，但是这样存在很多性能、兼容和响应式问题，不好维护同时也不够灵活。

看看本骚年曾经写过的一个[《jQuery响应式瀑布流》](https://godbasin.github.io/2016/06/20/responsive-waterfall/)就知道有多蛋疼了。

### FLIP 过渡
FLIP，本质上它是一个准则，而不是一个框架或库。这是对动画的一种思考，试图在浏览器中能更轻易地让动画达到 60 fps（关于后者，这里先不做过多讨论哈）。

**FLIP 将动画翻转**，可以这样理解：
1. 正常动画过渡，会计算最终B状态，再减去初始A状态，然后根据想要的过渡时间，定时器设置每段时间的变化，应用到元素上。
2. FLIP 的做法是，A状态到B状态，不用手动计算每一帧的改变，而是计算从B到A的反向动画，然后下一帧直接切换B状态，在把反向动画应用在B上。

其实真实元素是直接从 A->B，但是由于在B状态上加了反向动画，所以用户看起来像是过渡。

还是看不懂？亮出代码：

``` js
// 获取初始位置A
var first = el.getBoundingClientRect();
 
// 将其移动到最终位置B
el.classList.add('totes-at-the-end');
 
// 获取最终位置B
var last = el.getBoundingClientRect();
 
// 翻转，计算B->A需要的移动
var invert = first.top - last.top;
 
// 从翻转的位置到最终位置
var player = el.animate([
  { transform: 'translateY(' + invert + 'px)' },
  { transform: 'translateY(0)' }
], {
  duration: 300,
  easing: 'cubic-bezier(0,0,0.32,1)',
});
 
// 动画结束后做一些处理，如移除样式什么的。
```

嗯，大概差不多就酱啦。


# 列表过渡

---

## transition-group 组件
前面我们讲到 transition 组件，多半用于单个节点，或者是同一时间中只渲染单个节点的情况。

这里我们要渲染多个节点的过渡效果，需要用到 transition-group 组件：
- 不同于 transition（transition 不会转换为真实元素），它会以一个真实元素呈现：默认为一个 `<span>`。你也可以通过 tag 特性更换为其他元素
- 内部元素 总是需要 提供唯一的 key 属性值（transition是当有相同标签名的元素切换时，需要通过 key 特性设置唯一的值来标记）

### demo
这里看看[官网](https://cn.vuejs.org/v2/guide/transitions.html#%E5%88%97%E8%A1%A8%E7%9A%84%E4%BA%A4%E9%94%99%E8%BF%87%E6%B8%A1)的例子：

``` html
<div id="list-demo" class="demo">
  <button v-on:click="add">Add</button>
  <button v-on:click="remove">Remove</button>
  <transition-group name="list" tag="p">
    <span v-for="item in items" v-bind:key="item" class="list-item">
      {{ item }}
    </span>
  </transition-group>
</div>
```

我们稍微改一下，每次随机添加两个、删除两个：

``` js
new Vue({
  el: '#list-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9],
    nextNum: 10
  },
  methods: {
    randomIndex: function () {
      return Math.floor(Math.random() * this.items.length)
    },
    add: function () {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)    
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove: function () {
      this.items.splice(this.randomIndex(), 1)
      this.items.splice(this.randomIndex(), 1)
    },
  }
})
```

``` CSS
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
```

或者看[JSFiddle这里](https://jsfiddle.net/godbasin/xubvz597/3/)。

这里我们能看到，只有新加和删除的元素才会有过渡效果，其他的元素会瞬间移动，没有过渡效果。
然后为了解决这个问题，我们需要用到 FLIP。

## 排序过渡
什么是排序过渡？大概是：
1. 新增的元素有进入动画。
2. 移除的元素有离开动画。
3. 位置移动的元素有移动动画。

前面两点我们已经可以通过之前的方式实现了，关于第三点，我们使用 FLIP。

比较关键的，我们看看 Vue 中的实现代码：

``` js
// we divide the work into three loops to avoid mixing DOM reads and writes
// in each iteration - which helps prevent layout thrashing.
children.forEach(callPendingCbs);     // 1. 之前如果有没结束的过渡，先结束掉
children.forEach(recordPosition);     // 2. 记录新的位置
children.forEach(applyTranslation);   // 3. 计算反向动画，生成个CSS动画

// force reflow to put everything in position
const body: any = document.body;
const f: number = body.offsetHeight; // eslint-disable-line

children.forEach((c: VNode) => {
  if (c.data.moved) {
    var el: any = c.elm;
    var s: any = el.style;
    // 添加反向CSS动画
    addTransitionClass(el, moveClass);
    s.transform = s.WebkitTransform = s.transitionDuration = "";
    // 监听动画结束，结束之后要移除CSS动画类名啦
    el.addEventListener(
      transitionEndEvent,
      (el._moveCb = function cb(e) {
        if (!e || /transform$/.test(e.propertyName)) {
          el.removeEventListener(transitionEndEvent, cb);
          el._moveCb = null;
          removeTransitionClass(el, moveClass);
        }
      })
    );
  }
});
```

这里还有个反向动画的计算可能大家会稍微感兴趣：

``` js
function applyTranslation (c: VNode) {
  const oldPos = c.data.pos
  const newPos = c.data.newPos
  const dx = oldPos.left - newPos.left
  const dy = oldPos.top - newPos.top
  if (dx || dy) {
    c.data.moved = true
    const s = c.elm.style
    s.transform = s.WebkitTransform = `translate(${dx}px,${dy}px)`
    s.transitionDuration = '0s'
  }
}
```

其实也不难，跟上面的 FLIP demo 逻辑相似。

排序过渡中，官方文档提到一个 v-move 特性，它会在元素的改变定位的过程中应用。像前面的类名一样，可以通过 name 属性来自定义前缀，也可以通过 move-class 属性手动设置。

``` CSS
.flip-list-move {
  transition: transform 1s;
}
```

但其实这只是一个设置 transition 的过渡时间和过渡曲线而已，真正的亮点是藏在 FLIP 里面。

具体能实现怎样的效果呢？像[这个小伙的实现](https://jsfiddle.net/chrisvfritz/sLrhk1bc/)就比较有趣啦~

## 列表交错过渡
交错过渡听起来好厉害的样子，其实说白了就是：设置延时，给元素设置顺序延时的动画效果，通过 data 属性与 JavaScript 通信就可以实现啦。

大概就是获取元素的序号，计算延时，然后设置定时器动画啦。看看[官方](https://cn.vuejs.org/v2/guide/transitions.html#%E5%88%97%E8%A1%A8%E7%9A%84%E4%BA%A4%E9%94%99%E8%BF%87%E6%B8%A1)的demo：

``` js
new Vue({
  el: '#staggered-list-demo',
  data: {
    query: '',
    list: [
      { msg: 'Bruce Lee' },
      { msg: 'Jackie Chan' },
      { msg: 'Chuck Norris' },
      { msg: 'Jet Li' },
      { msg: 'Kung Fury' }
    ]
  },
  computed: {
    computedList: function () {
      var vm = this
      return this.list.filter(function (item) {
        return item.msg.toLowerCase().indexOf(vm.query.toLowerCase()) !== -1
      })
    }
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
      el.style.height = 0
    },
    enter: function (el, done) {
      // 看看这里的定时器延时
      var delay = el.dataset.index * 150
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 1, height: '1.6em' },
          { complete: done }
        )
      }, delay)
    },
    leave: function (el, done) {
      // 还有这里的定时器延时
      var delay = el.dataset.index * 150
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 0, height: 0 },
          { complete: done }
        )
      }, delay)
    }
  }
})
```

# 结束语

---

本节我们介绍了 Vue 中列表过渡，同时介绍了 Vue 实现位移过渡的很重要的方式-- FLIP。当然使用FLIP能实现更多酷炫和好玩的效果，取决于你的想象力啦。
Vue 后面还讲到动态过渡、可服用过渡和状态过渡，但其实很多都是基于 Javascript 来实现哒。重要的是思想和想法，关于动画，本骚年就不再仔细讲述啦。