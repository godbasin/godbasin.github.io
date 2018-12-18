---
title:  Vue使用笔记4--Vue事件、过渡和制作index页面
date: 2016-09-11 11:01:02
categories: vue八宝粥
tags: 笔记
---
最近在学习使用Vue作为前端的框架，《Vue使用笔记》系列用于记录过程中的一些使用和解决方法。
本文简单介绍vue的过渡效果，以及记录制作首页的过程。
<!--more-->
## Vue事件
-----
### 方法处理器
- 可以用v-on指令监听DOM事件
- 类似于内联表达式，事件处理器限制为一个语句
- 当一个ViewModel被销毁时，所有的事件处理器都会自动被删除
- 有时也需要在内联语句处理器中访问原生DOM事件，可以用特殊变量$event把它传入方法

``` vue
<button v-on:click="say('hello!', $event)">Submit</button>
```

### 事件修饰符
Vue封装了常用的事件处理：
- .prevent： event.preventDefault()
- .stop： event.stopPropagation()

### 按键修饰符
在监听键盘事件时，我们经常需要检测keyCode。

``` vue
<input v-on:keyup.13="submit">
```

## Vue过渡
-----
通过Vue.js的过渡系统，可以在元素从DOM中插入或移除时自动应用过渡效果。
Vue.js会在适当的时机为你触发CSS过渡或动画，你也可以提供相应的JavaScript钩子函数在过渡过程中执行自定义的DOM操作。

### 使用过渡
在目标元素上使用transition特性。transition 特性可以与下面资源一起用：
- v-if
- v-show
- v-for（只在插入和删除时触发，使用vue-animated-list插件）
- 动态组件（is和切换组件）
- 在组件的根节点上，并且被Vue实例DOM方法（如 vm.$appendTo(el)）触发

当插入或删除带有过渡的元素时，Vue 将：
1. 尝试查找JavaScript过渡钩子对象——通过Vue.transition(id, hooks)或transitions选项注册，将在过渡的不同阶段调用相应的钩子。
2. 自动嗅探目标元素是否有CSS过渡或动画，并在合适时添加/删除CSS类名。
3. 如果没有找到JavaScript钩子并且也没有检测到CSS过渡/动画，DOM操作（插入/删除）在下一帧中立即执行。

### CSS过渡
- 过渡的CSS类名
  - .name-transition: 始终保留在元素上
  - .name-enter: 定义进入过渡的开始状态。只应用一帧然后立即删除
  - .name-leave: 定义离开过渡的结束状态。在离开过渡开始时生效，在它结束后删除
当然配合css3的帧动画效果会更好。

我们这里的菜单展开/收起用的CSS过渡。
- 在目标元素上使用transition特性

``` html
<li v-for="item in menu.menus" v-show="menu.show" transition="staggered">{{ item.text }}</li>
```

- 为.staggered-transition，.staggered-enter和.staggered-leave添加CSS规则:

``` css
.staggered-transition {
    transition: all .2s ease-in-out;
    overflow: hidden;
    margin: 0;
    height: 50px;
}
.staggered-enter, .staggered-leave {
    height: 0px;
    opacity: 0;
    padding: 0;
}
```

### JavaScript过渡
可以只使用JavaScript钩子，不用定义任何CSS规则。
当只使用JavaScript过渡时，enter和leave钩子需要调用done回调，否则它们将被同步调用，过渡将立即结束。
``` javascript
Vue.transition('fade', {
  css: false, // Vue.js将跳过CSS检测
  enter: function (el, done) {
    // 元素已被插入 DOM
    // 在动画结束后调用 done
    $(el)
      .css('opacity', 0)
      .animate({ opacity: 1 }, 1000, done)
  },
  enterCancelled: function (el) {
    $(el).stop()
  },
  leave: function (el, done) {
    // 与 enter 相同
    $(el).animate({ opacity: 0 }, 1000, done)
  },
  leaveCancelled: function (el) {
    $(el).stop()
  }
})
```
然后用在transition特性中。

### 渐近过渡
transition与v-for一起用时可以创建渐近过渡。
- 给过渡元素添加一个特性stagger，enter-stagger或 eave-stagger

``` html
<!--每个过渡项目增加100ms延时-->
<div v-for="item in list" transition="stagger" stagger="100"></div>
```

- 提供一个钩子stagger, enter-stagger或leave-stagger，以更好的控制

``` javascript
Vue.transition('stagger', {
  stagger: function (index) {
    // 每个过渡项目增加50ms延时
    // 但是最大延时限制为300ms
    return Math.min(300, index * 50)
  }
})
```

## 制作index页面
-----
页面结构如下：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/F3A2.tmp.png)

### 添加模板
这里使用了上一节创建的头部组件，在component属性中引入。
``` html
<template>
  <div is="my-header" current="index"></div><!--使用is绑定组件，current传入prop数据-->
  <div class="container-fluid row">
	<aside class="col-md-2  col-md-offset-1" id="according">
		<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
			<div class="panel panel-default list-group" v-for="menu in asidemenus">
				<div class="panel-heading" role="tab">
					<ul class="panel-title ">
						<li data-toggle="collapse" v-on:click="toggleContent($index)">
							{{ menu.title }}
						</li>
					</ul>
				</div>
				<div class="panel-collapse collapse in">
					<ul class="list-group">
						<li v-for="item in menu.menus" v-show="menu.show" transition="staggered" class="list-group-item" role="button" v-on:click.stop="changeLoading(item.click)">{{ item.text }}</li>
					</ul>
				</div>
			</div>
		</div>
	</aside>
	<article class="col-md-7">
		<section class="index-content">
			<p v-show="loading === 'init' || loading === 'name'">昵称：被删</p>
			<p v-show="loading === 'init' || loading === 'email'">邮箱：wangbeishan@163.com</p>
			<p v-show="loading === 'init' || loading === 'github'">github: <a href="https://github.com/godbasin">github.com/godbasin</a></p>
			<div v-show="loading === 'sethead'">这里是修改头像页面</div>
			<div v-show="loading === 'setinfo'">这里是修改资料页面</div>
			<div v-show="loading === 'other'">这里是其他页面</div>
		</section>
	</article>
</div>
</template>
```

### 添加Vue组件
``` javascript
<script>
// 导入Header组件
import MyHeader from './Header.vue'
export default {
  components: { // 导入Header组件
    MyHeader
  },
  data () {
    return {
      loading: 'init',
      asidemenus: [{
        title: '基本资料', // title用于储存该菜单显示名称
        click: 'init', // click用于储存该菜单对应点击时loading的状态值
        show: true, // show用于保存菜单是否隐藏的状态
        menus: [{
          text: '名字', // title用于储存该菜单显示名称
          click: 'name' // click用于储存该菜单对应点击时loading的状态值
        }, {
          text: '邮箱',
          click: 'email'
        }, {
          text: 'github',
          click: 'github'
        }]
      }, {
        title: '设置头像',
        click: 'sethead',
        show: true
      }, {
        title: '修改资料',
        click: 'setinfo',
        show: true
      }, {
        title: '其他',
        click: 'other',
        show: true
      }]
    }
  },
  // 在 `methods` 对象中定义方法
  methods: {
    changeLoading: function (view) { // 更新loading
      this.loading = view
    },
    toggleContent: function (index) { // 过渡菜单效果并更新loading
      this.asidemenus[index].show = !this.asidemenus[index].show
      this.changeLoading(this.asidemenus[index].click)
    }
  }
}
</script>
```

### 添加样式
样式包括一些组件的样式，还有过渡css样式，这里就不列出来了。

## 结束语
-----
这里我们没有用到bootstrap中的组件，毕竟用Vue过渡很简单的呢。不得不说，Vue的动画过渡做的真的不错，事件的封装也做的很方便呢。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/vue-notes/4-fullfill-index)
[此处查看页面效果](http://vue-notes.godbasin.com/4-fullfill-index/index.html?#!/index)