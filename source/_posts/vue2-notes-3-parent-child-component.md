---
title: Vue2使用笔记3--父子组件的通信
date: 2016-11-26 15:33:50
categories: vue八宝粥
tags: 笔记
---
最近在使用Vue2作为项目中前端的框架，《Vue2使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录父子间组件的通信方法，以及添加Top组件的过程。
<!--more-->

## 父子组件通信
---
### 使用Props传递数据
使用props传递数据，和vue1.x的使用方法一样。
- prop是父组件用来传递数据的一个自定义属性
- 子组件需要显式地用props选项声明“prop”
- 动态Props：用v-bind绑定动态props到父组件的数据。每当父组件的数据变化时，也会传导给子组件

### 使用自定义事件
上一篇我们简单提到了自定义事件，在vue1.x中，拥有$dispatch、$broadcast事件，这两个事件在vue2.x中被废弃，这里我们可以用到的事件有：
- 使用`$on(eventName)`监听事件
- 使用`$emit(eventName)`触发事件

### 子组件索引
有时需要在JavaScript中直接访问子组件，为此可以使用ref为子组件指定一个索引ID。

### 非父子组件通信
vue2.x中提供了一种方法来进行非父子组件间通信，即使用一个空的Vue实例作为中央事件总线：
``` js
var bus = new Vue()
// 触发组件 A 中的事件
bus.$emit('id-selected', 1)
// 在组件 B 创建的钩子中监听事件
bus.$on('id-selected', function (id) {
  // ...
})
```
在更多复杂的情况下，你应该考虑使用专门的[状态管理模式](https://vuefe.cn/guide/state-management.html)。

## 添加Sidebar组件展开收起事件
---
首先我们在Siderbar组件中进行以下修改。
### 添加状态记录展开或收起状态
在data中添加menuShowAll变量记录状态：
``` js
data() {
	return {
		... // 其他数据
		menuShowAll: true // 初始化为展开状态
	}
}
```

### 添加方法控制展开收起
我们使用的是(gentelella模板)[https://github.com/puikinsh/gentelella]，运行查看可知道，展开收起的控制主要由nav-md和nav-sm，以及active和active-sm来进行控制。
``` js
methods: {
	toggleMenu(menu) {
		// 当菜单有href属性时，代表其将进行路由跳转而不是展开收起子菜单
		// 此时将其余菜单收起
		if (menu.href) {
			this.$router.push(menu.href);
			this.menus.forEach(item => {
				item.class = '';
			});
			// 设置active时需判断当前状态，进行展开和收起的状态区分
			menu.class = this.menuShowAll ? 'active' : 'active-sm';
			return;
		}
		// 其他时候默认进行子菜单的切换
		switch (menu.class) {
			case 'active':
				menu.class = '';
 				break;
			case '':
				menu.class = this.menuShowAll ? 'active' : 'active-sm';
		}
	},
	toggleMenuShowAll() { // 菜单大小切换
		var $body = $('body');
		this.menus.forEach(menu => {
			let c = menu.class;
			menu.class = c === 'active' ? 'active-sm' : (c === 'active-sm' ? 'active' : c)
		})
		this.menuShowAll = !this.menuShowAll;
		$body.toggleClass('nav-md nav-sm');
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

## 添加Top组件
---
添加Top组件用于点击触发展开收起事件

### 创建组件
我们在src/components文件夹里面创建Top.vue文件。

### 添加模板
``` html
<template>
	<!-- top navigation -->
	<div class="top_nav">
		<div class="nav_menu">
			<nav>
				<div class="nav toggle">
					<!--这里添加点击事件，用来触发Sidebar的展开和收起-->
					<a id="menu_toggle" v-on:click="sidebarToggleClick"><i class="fa fa-bars"></i></a>
				</div>
				<ul class="nav navbar-nav navbar-right">
					<li class="">
						<a href="javascript:;" class="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
							用户
							<span class=" fa fa-angle-down"></span>
						</a>
						<ul class="dropdown-menu dropdown-usermenu pull-right">
							<li><a href="javascript:;">设置</a></li>
							<li><router-link to="/login"><i class="fa fa-sign-out pull-right"></i>退出</router-link></li>
						</ul>
					</li>
				</ul>
			</nav>
		</div>
	</div>
	<!-- /top navigation -->
</template>
```

### 添加点击事件
``` js
export default {
    methods: {
       // 点击事件
       sidebarToggleClick() {
            // 使用$emit触发自定义事件SidebarToggleClick
            this.$emit('SidebarToggleClick');
       }
    }
}
```

## App父组件处理事件
---

### 注入Top组件并引入
``` js
import Top from './components/Top'
export default {
	...
	components: {
		...
		Top
	}
}
```

### 模板中使用Top组件
在App模板中使用Top组件，这里我们还使用ref来获取Sidebar组件的事件。
``` html
<!--使用Sidebar组件，使用ref熟悉进行子组件索引-->
<Sidebar ref="sidebar"></Sidebar>
<!--使用Top组件，且绑定监听子组件SidebarToggleClick事件-->
<Top v-on:SidebarToggleClick="transSidebarToggle"></Top>
```

### 添加方法处理SidebarToggleClick事件
在App组件中添加方法，绑定SidebarToggleClick事件。
``` js
methods: {
	// 添加方法绑定SidebarToggleClick事件
	// 这里我们直接通过ref索引获取调用Sidebar子组件的toggleMenuShowAll方法
	transSidebarToggle() {
		this.$refs.sidebar.toggleMenuShowAll();
	}
}
```

### 页面最终效果
![image](http://o905ne85q.bkt.clouddn.com/EC9E.tmp.png)

### 参考
[Vue2.0中文文档](https://vuefe.cn/guide/)

## 结束语
-----
当然，父子组件间通信有很多实现方法。大家感兴趣的当然也可以尝试用中央事件总线或者是状态管理来实现啦。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/vue2-notes/3-parent-child-component)
[此处查看页面效果](http://ofyya1gfg.bkt.clouddn.com/3-parent-child-component/index.html#/App)