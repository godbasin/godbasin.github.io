---
title: Angular2使用笔记4--路由和导航
date: 2016-10-16 22:19:53
categories: angular2火锅
tags: 笔记
---
最近在学习Angular2作为前端的框架，《Angular2使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录ng2路由的一些特别的地方。
<!--more-->
## 组件路由器
-----
### 路由的实现原理
虽然之前的一些文章也有讲过但也应用路由的一些原理，这里再简单介绍一下一般路由功能的实现原理
- 通过hash（location.href.hash）获取位置
- 设置全局拦截器
  - 匹配路径：通配/string/:number
  - 判断后加载对应模块
- 通过window.onhashchange监听路由变化

### ng2路由器基础知识
- 组件路由器
  - 为应用提供了一个配置过的路由器
  - 组件中有一个RouterOutlet，它能显示路由器所生成的视图
  - 有一些RouterLink，用户可以点击它们，来通过路由器进行导航

- 关键词
  - Router（路由器）：为激活的 URL 显示应用组件。管理从一个组件到另一个组件的导航
  - RouterModule（路由器模块）：一个独立的Angular模块，用于提供所需的服务提供商，以及用来在应用视图之间进行导航的指令
  - Routes（路由数组）：定义了一个路由数组，每一个都会把一个URL路径映射到一个组件
  - Route（路由）：定义路由器该如何根据URL模式（ pattern ）来导航到组件。大多数路由都由路径和组件类构成
  - RouterOutlet（路由插座）：该指令（ <router-outlet> ）用来标记出路由器该在哪里显示视图
  - RouterLink（路由链接）：该指令用来把一个可点击的HTML元素绑定到路由。 点击带有绑定到字符串或链接参数数组的routerLink指令的A标签就会触发一次导航
  - RouterLinkActive（活动路由链接）：当HTML元素上或元素内的routerLink变为激活或非激活状态时，该指令为这个HTML元素添加或移除CSS类
  - ActivatedRoute（激活的路由）：为每个路由组件提供提供的一个服务，它包含特定于路由的信息，比如路由参数、静态数据、解析数据、全局查询参数和全局碎片（fragment）
  - RouterState（路由器状态）：路由器的当前状态包含了一棵由程序中激活的路由构成的树。它包含一些用于遍历路由树的快捷方法

- <base href>
  - index.html的<head>标签下添加一个<base>元素，来告诉路由器该如何合成导航用的URL
  - 很多时候我都使用相对路径

``` html
<base href="./">
```

- 从路由库中导入
Angular 的组件路由器是一个可选的服务，它用来呈现指定的URL所对应的视图。 它并不是Angular 2核心库的一部分，而是在它自己的@angular/router包中

``` typescript
import { Routes, RouterModule }   from '@angular/router';
```

- 参考
  - [路由与导航](https://angular.cn/docs/ts/latest/guide/router.html#!#navigate)

## 有意思的ng2路由器
---
### 热拔插的路由器
- 使用路由插座
  - 可以在任意层级的组件中使用
  - 注入服务并在Component的directives中使用

``` ts
// 获取路由指令
import { ROUTER_DIRECTIVES } from '@angular/router';
// 在Component的directives中使用
@Component({
  directives: [ROUTER_DIRECTIVES]
})
```

  - 在视图模板中插入路由

``` html
<!-- 路由视图在此处插入 -->
<router-outlet></router-outlet>
```

- 配置路由组件
  - 当浏览器的地址变化时，该路由器会查找相应的Route（路由定义，简称路由），并据此确定所要显示的组件
  - RouterConfig是一个路由数组，它会决定如何导航
    - 每个Route会把一个URL的path映射到一个组件
    - data属性用来存放于每个具体路由有关的任意信息。该数据可以被任何一个激活路由访问，并能用来保存诸如 页标题、面包屑以及其它只读数据
    - :id是一个路由参数的令牌(Token)
    - **代表该路由是一个通配符路径。如果当前URL无法匹配上我们配置过的任何一个路由中的路径，路由器就会匹配上这一个

``` ts
/* 这里举一个例子
 * 任务组件Task下分了几个模块，分别是
 * - 任务列表TaskList组件
 * - 任务详情TaskDetail组件
 * - 任务编辑TaskEdit组件
 */
// 引入路由类
import { RouterConfig } from '@angular/router';

// 分别获取组件
import { Task } from './index.component';
import { TaskDetail } from './detail';
import { TaskEdit } from './edit';
import { TaskList } from './list';

// 定义并输出路由类
export const taskRoutes: RouterConfig = [{
  path: 'task', component: Task,
  children: [
    { path: 'detail', component: TaskDetail },
    { path: 'edit', component: TaskEdit },
    { path: 'list', component: TaskList },
    { path: '', component: TaskList }
  ]
}];
```

- 在启动路由中使用路由实例
上面我们定义的任务组件相关的路由，可以直接在启动路由中使用拓展方式添加进去，这样我们就可以直接在某个组件里详细定义该组件的路由，对外只需注入就可以了。

``` ts
// 获取该路由类
import { taskRoutes } from './task/routes';

export const routes: RouterConfig = [
  ...taskRoutes, // 拓展路由
  { path: 'login', component: Login }
];
```

### 路由器链接
该属性我们在上一节中也有用过，具体看[《Angular2使用笔记3--创建头部组件》](https://godbasin.github.io/2016/10/07/angular2-notes-3-create-header/)。
- RouterLink绑定
  - A标签中，有一个绑定RouterLink指令的属性绑定
  - 可以通过提供查询字符串参数为RouterLink提供更多情境信息
  - 可提供一个URL片段（Fragment或hash）来跳转到本页面中的其它区域
- RouterLinkActive绑定
  - 每个A标签还有一个到RouterLinkActive指令的属性绑定
  - 等号（=）右侧的模板表达式包含用空格分隔的一些CSS类，还可以把RouterLinkActive指令绑定到一个CSS类组成的数组
  - 用于在相关的RouterLink被激活时为所在元素添加或移除CSS类。 该指令可以直接添加到该元素上，也可以添加到其父元素上
``` html
<!--当path路由被激活时，active的class将会被添加上-->
<a routerLink="/path" routerLinkActive="active">Temple</a>
```

## 结束语
-----
Angular2中路由根据组件树和状态能生产自己的状态树，路由器状态为我们提供了从任意激活路由开始向上或向下遍历路由树的一种方式。
总感觉这些特性能拿来干很有趣的事情呢。