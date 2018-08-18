---
title:  Angular2使用笔记3--创建头部组件
date: 2016-10-07 11:17:48
categories: angular2火锅
tags: 笔记
---
最近在学习Angular2作为前端的框架，《Angular2使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录创建头部组件的过程。
<!--more-->

## 创建头部菜单
-----
该头部菜单与前几个框架的使用笔记中完全一致。如图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/C902.tmp.png)

### 添加头部组件相关文件
- 添加header文件夹，用于管理Header组件的相关文件
Header组件文件如下：

``` cmd
header/
 ├──index.ts                   * 导出该目录下组件
 ├──header.component.ts        * 定义并导出Header组件
 ├──header.style.css           * Header组件的css样式
 └──header.template.html       * Header组件的html模板
```

### 添加组件模板
header.template.html文件，如下
``` typescript
<nav class="navbar navbar-default header">
    <div class="container-fluid">
        <div class="navbar-header">
            <a class="navbar-brand" href="#">Godbasin</a>
        </div>
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav">
                <!--menus为主菜单-->
                <li *ngFor="let menu of menus" routerLinkActive="active"><a routerLink="{{ menu.href }}">{{ menu.text }}<span [hidden]="!menu.current" class="sr-only">(current)</span></a></li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
                <li><a>{{ clock }}</a></li>
                <li class="dropdown">
                    <a href="" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">菜单 <span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <!--usermenus为右侧下拉菜单-->
                        <li *ngFor="let usermenu of usermenus"><a href="{{ usermenu.href }}">{{ usermenu.text }}</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</nav>
```

这里我们用到了ng2的路由器携带的属性绑定
- RouterLink绑定
  - A标签中，有一个绑定RouterLink指令的属性绑定
  - 可以通过提供查询字符串参数为RouterLink提供更多情境信息
  - 可提供一个URL片段（Fragment或hash）来跳转到本页面中的其它区域
- RouterLinkActive绑定
  - 每个A标签还有一个到RouterLinkActive指令的属性绑定
  - 等号（=）右侧的模板表达式包含用空格分隔的一些CSS类，还可以把RouterLinkActive指令绑定到一个CSS类组成的数组
  - 用于在相关的RouterLink被激活时为所在元素添加或移除CSS类。 该指令可以直接添加到该元素上，也可以添加到其父元素上

### 定义Header组件
- 添加组件样式header.style.css，这里就不展示出来了
- 在header.component.ts文件中，如下

``` typescript
import { Component } from '@angular/core';

@Component({
  selector: 'my-header',
  styles: [`
  `],
  templateUrl: './header.template.html'
})
export class Header {
  // clock用于保存时间
  clock: string = '';
  clockTime;
  // menus用于储存主菜单
  menus = [{
    title: 'index', // title用于储存路由对应的路径
    href: '/index', // href用于设定该菜单跳转路由
    text: '首页', // text用于储存该菜单显示名称
  }, {
      title: 'others',
      href: '/other',
      text: '其他',
    }];
  // usermenus用于储存侧边下拉菜单
  usermenus = [{
    href: '/login', // href用于设定该菜单跳转路由
    text: '退出', // text用于储存该菜单显示名称
  }];

  // 用于格式化时间（少于10在前面增加0）
  numberStandard(num) {
    let _val = Number(num), _num;
    _num = (_val < 10) ? ('0' + _val) : ('' + _val);
    return _num;
  }

  // 用于渲染时钟
  renderClock() {
    let _date = new Date(), clock = '';
    clock += _date.getFullYear() + '年' + (_date.getMonth() + 1) + '月' + _date.getDate() + '日';
    clock += ' ' + this.numberStandard(_date.getHours()) +
      ':' + this.numberStandard(_date.getMinutes()) +
      ':' + this.numberStandard(_date.getSeconds());
    this.clock = clock;
  }

  ngOnInit() {
    // 使用bind解决setInterval的执行环境问题
    this.clockTime = setInterval(this.renderClock.bind(this), 500);
  }

  ngOnDestroy() {
    // 控件摧毁时移除定时事件
    clearInterval(this.clockTime);
  }
}
```

- 这里使用到的生命周期的钩子
  - ngOnInit：当每个输入属性的值都被触发了一次ngOnChanges之后才会调用ngOnInit，此时所有输入属性都已经有了正确的初始绑定值
  - ngOnDestroy：当Angular每次销毁指令/组件之前调用
  - 其他生命周期的钩子请参照[组件生命周期](https://angular.cn/docs/ts/latest/guide/lifecycle-hooks.html)

此时，我们已经完成了一个组件的创建了，接下来我们要把这个组件注入到其他模板。

### 参考
- [路由与导航](https://angular.cn/docs/ts/latest/guide/router.html#!#navigate)

## 组件的使用和依赖注入
---
在angular1中，我们已经了解到依赖注入这个词，而ng2和ng1中的依赖注入也有区别。

### 依赖注入
- 什么是依赖注入
  - “依赖注入”是提供类的新实例的一种方式，还负责处理好类所需的全部依赖
  - 大多数依赖都是服务
  - Angular也使用依赖注入提供我们需要的组件以及这些组件所需的服务
- 有关依赖注入
  - 依赖注入渗透在整个Angular框架中，并且被到处使用
  - 注入器（Injector）是本机制的核心
    - 注入器负责维护一个容器，用于存放它创建过的服务实例
    - 注入器能使用提供商创建一个新的服务实例
  - 提供商是一个用于创建服务的“配方”
  - 把提供商注册到注入器

### ng2中的依赖注入
- 当Angular创建组件时，会首先为组件所需的服务找一个注入器（Injector）
- 注入器是一个维护服务实例的容器，存放着以前创建的实例
- 如果容器中还没有所请求的服务实例，注入器就会创建一个服务实例，并且添加到容器中，然后把这个服务返回给Angular
- 当所有的服务都被解析完并返回时，Angular会以这些服务为参数去调用组件的构造函数

### 通过指令注入组件
上一节虽然我们也创建了一个登陆页面的组件，Login组件直接在路由中使用。这里我们将尝试在主页面app.component.ts中使用Header组件。
``` jsx
// 这里只展示相关的代码
// 添加Header组件，默认从header文件夹的index.ts中获取
import { Header } from './header';
// 定义主页面组件
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.style.css'
  ],
  template: `
    <!--插入头部组件，注入指令后生效-->
    <my-header></my-header>
     <main>
      <router-outlet></router-outlet>
    </main>
  `,
  // 注入指令
  directives: [Header]
})
```

此时算是完成了一个组件的创建以及使用，如图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/15D3.tmp.png)

### 参考
- [依赖注入--烹饪宝典](https://angular.cn/docs/ts/latest/cookbook/dependency-injection.html)
- [依赖注入--基础知识](https://angular.cn/docs/ts/latest/guide/dependency-injection.html)

## 结束语
-----
不得不说，使用angular2-webpack-starter快速搭建项目之后，对ng2的很多使用方法也比较了解了。
毕竟ng2虽然有很详细的官方教程，但是要看完也是很需要耐心和恒心的呢，哈哈哈哈:)
[此处查看项目代码（仅包含src部分）](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular2-notes/3-create-header)
[此处查看页面效果](http://oc8qsv1w6.bkt.clouddn.com/3-create-header/index.html)
