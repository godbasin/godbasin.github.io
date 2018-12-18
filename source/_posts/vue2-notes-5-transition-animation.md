---
title: Vue2使用笔记5--transition过渡效果使用
date: 2016-12-03 21:51:05
categories: vue八宝粥
tags: 笔记
---
最近在使用Vue2作为项目中前端的框架，《Vue2使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录vue中过渡效果，以及在路由切换以及下拉菜单中的使用过程。
<!--more-->

## 过渡效果
---
Vue 在插入、更新或者移除 DOM 时，提供多种不同方式的应用过渡效果。
包括以下工具：
- 在CSS过渡和动画中自动应用class
- 可以配合使用第三方CSS动画库，如Animate.css
- 在过渡钩子函数中使用JavaScript直接操作DOM
- 可以配合使用第三方JavaScript动画库，如Velocity.js

### transition封装组件
- 在下列情形中，可以给任何元素和组件添加entering/leaving过渡
  - 条件渲染（使用 v-if）
  - 条件展示（使用 v-show）
  - 动态组件
  - 组件根节点

- 元素封装成过渡组件之后，在遇到插入或删除时，Vue 将
  - 自动嗅探目标元素是否有CSS过渡或动画，并在合适时添加/删除CSS类名
  - 如果过渡组件设置了过渡的JavaScript钩子函数，会在相应的阶段调用钩子函数
  - 如果没有找到JavaScript钩子并且也没有检测到CSS过渡/动画，DOM操作（插入/删除）在下一帧中立即执行

### 过渡的-CSS-类名
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/transition.png)
有4个(CSS)类名在enter/leave的过渡中切换
- v-enter
  - 定义进入过渡的开始状态
  - 在元素被插入时生效，在下一个帧移除
- v-enter-active
  - 定义进入过渡的结束状态
  - 在元素被插入时生效，在 transition/animation 完成之后移除
- v-leave
  - 定义离开过渡的开始状态
  - 在离开过渡被触发时生效，在下一个帧移除。
- v-leave-active
  - 定义离开过渡的结束状态
  - 在离开过渡被触发时生效，在transition/animation完成之后移除

- 自定义过渡类名
  - 可以通过以下特性来自定义过渡类名：
    - enter-class
    - enter-active-class
    - leave-class
    - leave-active-class
  - 他们的优先级高于普通的类名，这对于Vue的过渡系统和其他第三方CSS动画库，如Animate.css结合使用十分有用

### JavaScript 钩子
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
这些钩子函数可以结合CSS transitions/animations使用，也可以单独使用。

当只用JavaScript过渡的时候，在enter和leave中，回调函数done是必须的。 否则，它们会被同步调用，过渡会立即完成。

推荐对于仅使用JavaScript过渡的元素添加v-bind:css="false"，Vue会跳过CSS的检测。这也可以避免过渡过程中CSS的影响。

### 多个元素的过渡
- 使用<transition-group>组件
  - 不同于<transition>，它会以一个真实元素呈现：默认为一个<span>。你也可以通过tag特性更换为其他元素
  - 元素一定需要指定唯一的key特性值
  - 还可以改变定位。要使用这个新功能只需了解新增的v-move特性，它会在元素的改变定位的过程中应用
- 通过data属性与JavaScript通信，就可以实现列表的渐进过渡

### 参考
过渡可以通过Vue的组件系统实现复用。要创建一个可复用过渡组件，你需要做的就是将<transition>或者<transition-group>作为根组件，然后将任何子组件放置在其中就可以了。
[vue2过渡效果](https://vuefe.cn/guide/transitions.html)
[vue-router2过渡动效](http://router.vuejs.org/zh-cn/advanced/transitions.html)

## 添加过渡效果
---
下面我们将给路由切换以及Sidebar的下拉菜单加上过渡效果。

### vue-router过渡动效
给路由添加动态效果，可以在<router-view></router-view>外面添加transition，也可以在路由里面组件外面加一层transition。

- 在路由里层组件添加transition

这里我们分别在App组件和Login组件最外层添加：
``` vue
<template>
	<transition name="fade">
		...
	</transition>
</template>
```

然后我们添加fade的css过渡：
``` vue
.fade-enter-active,
.fade-leave-active {
    transition: opacity .4s
}
.fade-enter,
.fade-leave {
    opacity: 0
}
```

- 在<router-view></router-view>外面添加transition

这里我们在App组件内嵌路由外层添加transition:
``` vue
<transition name="fade">
	<router-view></router-view>
</transition>
```

上面两种方法都可以实现路由切换时的过渡效果。

### Sidebar下拉菜单过渡效果
Sidebar组件中，下拉菜单过渡效果乍一看属于列表过渡。
但其实分析一下，我们便会发现它其实属于最简单的单个元素过渡。
- 在下拉菜单外层<ul></ul>添加transition

``` js
<transition name="slide">
	<ul class="nav child_menu slide" v-on:click.stop v-show="menu.class">
		<router-link v-for="childMenu in menu.childMenus" v-bind:key="childMenu.text" class="slide-item" :to="childMenu.href" tag="li" active-class="current-page">
			<a>{{ childMenu.text }}</a>
		</router-link>
	</ul>
</transition>
```

- 添加slide过渡样式
这里有个需要注意的地方，像height:auto和width:auto这种，是无法实现宽高的改变的，所以这里我们应该使用max-height和max-width来进行。

``` vue
.slide {
	transition: all .5s ease-in-out;
	overflow: hidden;
	max-height: 100px;
}
.slide-enter,
.slide-leave-active {
	max-height: 0;
}
```

### 给Services组件简单添加列表过渡效果
本骚年这里就不啰嗦啦，直接上代码：
``` vue
<template>
	<div id="list-demo" class="demo">
		<button v-on:click="add">Add</button>
		<button v-on:click="remove">Remove</button>
		<transition-group name="list" tag="div">
			<p v-for="item in items" v-bind:key="item" class="list-item">
                Service组件{{ item }}
            </p>
		</transition-group>
	</div>
</template>


<script>
    export default {
        name: 'Sevices',
        data() {
            return {
                items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                nextNum: 10
            }
        },
        methods: {
            // 生成items数组的随机索引
            randomIndex: function() {
                return Math.floor(Math.random() * this.items.length)
            },
            // 随机添加一项
            add: function() {
                this.items.splice(this.randomIndex(), 0, this.nextNum++)
            },
            // 随机移除一项
            remove: function() {
                this.items.splice(this.randomIndex(), 1)
            },
        }
    }
</script>

<style>
    .list-item {
        margin-bottom: 10px;
    }
    
    .list-enter-active,
    .list-leave-active {
        transition: all 1s;
    }
    
    .list-enter,
    .list-leave-active {
        opacity: 0;
        transform: translateX(100px);
    }
</style>
```

## 结束语
-----
这里只是用到最简单的css过渡，但是vue的过渡效果以及过渡状态还是很牛逼的，大家有兴趣的可以去看看[官方文档](https://vuefe.cn/guide/transitions.html)然后多尝试一下呢，酷酷的。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/vue2-notes/5-transition-animation)
[此处查看页面效果](http://vue2-notes.godbasin.com/5-transition-animation/index.html#/app/services)