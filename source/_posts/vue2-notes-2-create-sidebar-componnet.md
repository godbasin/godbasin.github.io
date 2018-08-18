---
title: Vue2使用笔记2--创建左侧菜单栏Sidebar
date: 2016-11-20 11:37:07
categories: vue八宝粥
tags: 笔记
---
最近在使用Vue2作为项目中前端的框架，《Vue2使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录创建Sidebar组件，包括模板与下拉点击事件的过程。
<!--more-->

## Vue1.x vs Vue2.x
---
### issue
具体vue1.x到vue2的改变，大家可以参考官方发布的[issues](https://github.com/vuejs/vue/issues/2873)。

### 一些改变
这里本骚年只是简述一下接触到的一些改变：
- [生命周期的改变](https://vuefe.cn/guide/instance.html#生命周期图示)
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/f847b38a-63fe-11e6-9c29-38e58d46f036.png)
如图，大概最重要的是ready和mounted钩子函数的改变吧。

- 组件间通信
  - [$on/$emit事件](https://vuefe.cn/guide/components.html#使用-v-on-绑定自定义事件)，$dispatch、$broadcast废弃
  - [使用ref属性为子组件索引](https://vuefe.cn/guide/components.html#子组件索引)，v-ref、v-el弃用

- v-for循环中常用的$index、$key也已不支持使用，track-by被key属性替换

- [过渡效果组件<transition></transition>](https://vuefe.cn/guide/transitions.html)

- [Render函数](https://vuefe.cn/guide/render-function.html#基础)，需要JavaScript的完全编程的能力时使用

- [vue-router2.0](http://router.vuejs.org/zh-cn/index.html)，这个我们后面章节会再次讲述

## 添加Sidebar组件
---
首先我们在src/components文件夹里面创建Siderbar.vue文件。
### 添加组件模板
这里我们把gentelella模板里面的左侧菜单部分移植过来后，然后进行相关的列表渲染v-for和事件绑定v-on。
``` html
<template>
	<div class="col-md-3 left_col menu_fixed">
		<div class="left_col scroll-view">
			<div class="navbar nav_title" style="border: 0;">
				<a href="index.html" class="site_title"><i class="fa fa-paw"></i> <span>管理系统</span></a>
			</div>

			<div class="clearfix"></div>

			<!-- menu profile quick info -->
			<div class="profile">
				<div class="profile_pic"></div>
				<div class="profile_info">
					<h2><span>欢迎回来, </span> 老大</h2>
				</div>
			</div>
			<div class="clearfix"></div>

			<!-- sidebar menu -->
			<div id="sidebar-menu" class="main_menu_side hidden-print main_menu">
				<div class="menu_section">
					<br />
					<h2>通用设置</h2>
					<br />
					<ul class="nav side-menu">
                        <!--通过v-for来进行菜单列表的显示，并绑定v-on:click事件进行点击控制-->
						<li v-for="menu in menus" v-on:click="toggleMenu(menu)" v-bind:class="menu.class">
                            <!--class的绑定需要使用v-bind:class来实现-->
							<a><i class="fa" v-bind:class="menu.icon"></i> {{menu.text}} <span class="fa" v-show="!menu.href" v-bind:class="menu.class ? 'fa-chevron-down' : 'fa-chevron-right'"></span></a>
							<!--通过判断class是否active来进行显示和隐藏的控制-->
                            <ul class="nav child_menu slide" v-on:click.stop v-show="menu.class">
								<router-link v-for="childMenu in menu.childMenus" v-bind:key="childMenu.text" class="slide-item" :to="childMenu.href" tag="li"
									active-class="current-page">
									<a>{{ childMenu.text }}</a>
								</router-link>
							</ul>
						</li>
					</ul>
				</div>
			</div>
			<!-- /sidebar menu -->
		</div>
	</div>
</template>
```
大家可以看到，这里我们使用了router-link这个组件，后面章节我们会较详细描述vue-router2.0的使用，所以这里我们就先略过吧。

### 添加组件数据
这里我们添加菜单数据，这里注意的是有个设定，就是一级菜单若有链接则不带有子菜单。
``` js
 	export default {
  data() {
    return {
      menus: [{
        icon: 'fa-home', // icon用于储存菜单对应的图标
        text: '服务管理', // text用于储存该菜单显示名称
        class: '',
        childMenus: [{
          href: '/app/services', // href用于设定该菜单跳转路由
          text: '服务信息' // text用于储存该菜单显示名称
        }, {
          href: '/app/add/service', // href用于设定该菜单跳转路由
          text: '新建' // text用于储存该菜单显示名称
        }]
      }, {
        icon: 'fa-cubes',
        text: '产品管理',
        class: '',
        childMenus: [{
          href: '/app/products',
          text: '产品信息'
        }, {
          href: '/app/add/product',
          text: '新建'
        }]
      }, {
        icon: 'fa-file-o',
        text: '日志管理',
        class: '',
        href: '/app/logs'
      }],
      menuShowAll: true,
      post: null,
      error: null
    }
  }
}

```

### 添加点击事件
从Html模板我们可以看到，点击菜单时的事件未toggleMenu，这里我们通过将其添加active的样式，并绑定v-show判断是否展示来实现。
``` js
// 在 `methods` 对象中定义方法
methods: {
	toggleMenu(menu) {
	// 当菜单有href属性时，代表其将进行路由跳转而不是展开收起子菜单
	// 此时将其余菜单收起
	if (menu.href) {
		this.$router.push(menu.href);
		this.menus.forEach(item => {
			item.class = '';
		});
		menu.class = 'active';
		return;
	}
	// 其他时候默认进行子菜单的切换
	switch (menu.class) {
		case 'active':
			menu.class = '';
			break;
		case '':
			menu.class = 'active';
		}
	}
}
```

### 在App组件中使用Sidebar
- 引入该组件

``` js
import Sidebar from './components/Sidebar'
```

- 在App组件中注入该组件

``` js
export default {
	name: 'App',
	components: {
		Sidebar
	}
}
```

- 模板中使用

``` html
<template>
	<div id="app">
		<div class="container body">
			<div class="main_container">
                <!--使用Sidebar组件-->
				<Sidebar></Sidebar>
                <!-- page content -->
				<div class="right_col" role="main"></div>
			</div>
		</div>
	</div>
</template>
```

### 页面最终效果
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/9063.tmp.png)

### 参考
[Vue2.0中文文档](https://vuefe.cn/guide/)

## 结束语
-----
突然发现，调用别人写好的页面模板，还是好方便呀。省去了码样式的时间，当然最重要的还是模板好看哈哈，这里表扬一下[gentelella](https://github.com/puikinsh/gentelella)才行。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/vue2-notes/2-create-sidebar-componnet)
[此处查看页面效果](http://ofyya1gfg.bkt.clouddn.com/2-create-sidebar-componnet/index.html#/App)