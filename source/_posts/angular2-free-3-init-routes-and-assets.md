---
title: 玩转Angular2(3)--启用路由和添加静态资源
date: 2017-05-30 11:41:33
categories: angular2火锅
tags: 笔记
---
因为项目原因又玩上了Angular2(v4.0+)，《玩转Angular2》系列用于探索一些灵活或者新的用法。
本文记录启用路由Router，以及添加静态资源的过程。
<!--more-->
## 使用路由
-----
### 有关路由
现在流行的前端框架，像React/Vue/Angular等，都不可避免地自带路由模块。

要说为什么呢，本骚年是这么认为的（个人意见仅供参考）：
1. 单页应用已经十分流行了，尤其在PC端，而使用前端路由，配合模块化，便使得开发单页应用得心应手。
2. 路由的设计很简单，事件的监听配合框架自行封装的一些`[router-link]`等组件，便在开发效率锦上添花。

(本骚年也不知道为啥突然懂得这么多的成语，开心逃

- Angular的Router

Angular的Router借鉴了浏览器的导航模型。它把浏览器中的URL看做一个操作指南， 据此导航到一个由客户端生成的视图，并可以把参数传给支撑视图的相应组件，帮它决定具体该展现哪些内容。 

路由器还在浏览器的历史日志中记录下这些活动，这样浏览器的前进和后退按钮也能照常工作。

### 在视图中跳转
这里只介绍常用的两种，它们都需要在A标签上使用：

- [routerLink]属性

不用说，一看就知道`[routerLink]`属性是用来定位到具体的路由的，当然我们同样可以使用angular中常用的绑定来传入需要的变量。

- [routerLinkActive]属性

该属性可配置在带`[routerLink]`属性的A标签上，则当`[routerLink]`对应的路由被触发了，则`[routerLinkActive]`绑定的Class样式将被激活。

### 注册路由模块
在Angular的release版本开始，加入了NgModule这样一个模块设计，首先我们需注册这样一个路由模块：

``` js
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
... // 引入其他Component

const appRoutes: Routes = [
  { path: 'one-path', component: OneComponent },
  { path: 'other-path', component: OtherComponent },
  { path: '**', redirectTo: 'one-path' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
```

- 根路由注册使用`RouterModule.forRoot()`
- 子路由注册使用`RouterModule.forChild()`

对于根路由和子路由，一个应用有一个根路由，但可以有多个子路由，像我们的DOM树结构一样，层层向下伸展。

这样的设计思想现在也很流行了，像还有Angular中的依赖注入DI，或者是React的虚拟DOM设计等。

### 使用Router
- 在js中跳转

一般来说，我们使用`router.navigate()`来进行跳转，像我们的登陆页面：

``` js
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
  // 注入router
  constructor(private router: Router) {}

  // 登录事件
  onSubmit() {
    this.router.navigate(['/home']);
  }
}
```

当然，`router.navigate()`还可以传入其他的params，使用方法大家可以查阅文档。

- 监听路由

在Angular2的release版本之后，路由进行了调整，我们需要通过`subscribe()`这样的方式对事件进行订阅：

``` js
// 监听导航事件变更
// NavigationEnd表示导航事件变更完毕
// 通过对事件进行filter过滤，我们可以订阅想要的路由事件消息
router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {});
```

若要写面包屑功能，可参考该文章[Angular2 Breadcrumb using Router](http://brianflove.com/2016/10/23/angular2-breadcrumb-using-router/)。

### 获取路由信息
- ActivatedRoute：一站式获取路由信息

路由的路径和参数可以通过注入`ActivatedRoute`的路由服务来获取，包括：
- url: 该路由路径的Observable对象。它的值是一个由路径中各个部件组成的字符串数组
- data: 该路由提供的data对象的一个Observable对象。还包含从resolve中解析出来的值
- params: 包含该路由的必选参数和可选参数的Observable对象
- queryParams: 一个包含对所有路由都有效的查询参数的Observable对象
- fragment: 一个包含对所有路由都有效的片段值的Observable对象
- outlet: RouterOutlet的名字，用于指示渲染该路由的位置
- routeConfig: 与该路由的原始路径对应的配置信息
- firstChild: 包含子路由列表中的第一个ActivatedRoute对象
- children: 包含当前路由下激活的全部子路由

通常我们可能这样使用：

``` js
import { ActivatedRoute } from '@angular/router';
... // 其余代码

	// 注入route
  	constructor(private route: ActivatedRoute) {}
    ngOnInit() {
      this.route.params
        .subscribe((params) => {
		  // 获取名为id的param参数
          this.id = parseInt(params['id']);
         ... // 其余代码
        });
    }

... // 其余代码
```

### lazyload
对于一些路由子模块，我们可以通过懒加载来定义，这样就可以只在进入到该路由时进行加载，也算是首屏加载优化的一种方法吧。

一般我们在路由中这样定义：

``` js
export const AppRoutes: Routes = [
    {
        path: '', component: AppComponent, children: [
            { path: 'home', loadChildren: 'lazy/lazy.module#LazyModule' },
        ]
    }
];
```

就可以对该部分进行懒加载了，当然懒加载还需要其他依赖或者一些另外的配置支持，其实安装一个`angular-router-loader`就好了：

``` js
npm install --save-dev angular-router-loader
```

然后在webpack的rules中调整：

``` js
{
  test: /\.ts$/,
  use: ["babel-loader", "ts-loader", "angular2-template-loader", "angular-router-loader"],
  exclude: /node_modules/
}
```

打包的时候我们会发现，除了主文件`bundle.js`，每一个使用lazyload的文件都会单独打包成一个`n.bundle.js`文件（n为数字），用于异步请求和加载。

## 添加资源加载
---
一般来说，项目多业务杂，我们总不能一个个插件都自己实现，故很多时候我们需要使用到像jQuery或者Bootstrap这样很常用的库。

### 全局注入js
本骚年使用了一种最蠢的方式来实现[捂脸]：

``` js
// jquery
window['$'] = window['jQuery'] = require('./assets/js/jquery.min.js');
// boootstrap
require('../node_modules/bootstrap/dist/js/bootstrap.min.js');
```

当然，身为懒癌晚期的我还使用了typescript的杀手锏[捂脸+1]：

``` js
// declation.d.ts
declare var $: any;
declare var JQuery: any;
```

其实在typescript中使用jQuery也有很多现成的`@types`库，大家可以一键安装使用就好了：

``` js
npm install @types/jquery
```

完整的项目还是需要完善的，像本骚年这种业余玩玩的小项目就另当其说了，而且说不定后面我也会完善的吧[摊手]。

### 全局注入css
像`import 'someStyle.css'`这样的方法竟然没有成功，可能是本骚年的webpack配置或者是loader哪里出了问题吧。

然后就找了一个懒方法，利用的是`ViewEncapsulation`，在组件中将`styleUrls`定义为全局生效，如下：

``` js
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  template: ' <router-outlet></router-outlet>',
  styleUrls: [
      '../../../node_modules/bootstrap/dist/css/bootstrap.min.css',
    '../../assets/css/common.css',
    '../../assets/css/custom.css'
  ],
  encapsulation: ViewEncapsulation.None
})
```

## 项目结构
---
### 目录
如图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1495034687%281%29.png)

### 其他配置文件调整
- package.json

移除`@angular/compiler-cli`，该依赖为AOT使用，而目前本骚年还没做这方面的配置，光一个`compiler-cli`也是不够的，后面需要的时候再加吧

- tsconfig.json

这个不得不说了，项目一直起不来提示如下：

``` cmd
compiler.es5.js:15291 
Uncaught Error: Can't resolve all parameters for LoginComponent: (?).
    at syntaxError (webpack:///./~/@angular/compiler/@angular/compiler.es5.js?:1724:34)
    at CompileMetadataResolver._getDependenciesMetadata (webpack:///./~/@angular/compiler/@angular/compiler.es5.js?:15061:35)
    at CompileMetadataResolver._getTypeMetadata (webpack:///./~/@angular/compiler/@angular/compiler.es5.js?:14929:26)
    at CompileMetadataResolver.getNonNormalizedDirectiveMetadata (webpack:///./~/@angular/compiler/@angular/compiler.es5.js?:14538:24)
    at CompileMetadataResolver._getEntryComponentMetadata (webpack:///./~/@angular/compiler/@angular/compiler.es5.js?:15182:45)
    at eval (webpack:///./~/@angular/compiler/@angular/compiler.es5.js?:15168:48)
    at Array.forEach (native)
    at CompileMetadataResolver._getEntryComponentsFromProvider (webpack:///./~/@angular/compiler/@angular/compiler.es5.js?:15167:30)
    at eval (webpack:///./~/@angular/compiler/@angular/compiler.es5.js?:15131:83)
    at Array.forEach (native)
```

哭死我了，后面是改了一个`tsconfig.json`配置解决的：

``` json
"emitDecoratorMetadata": true, <= 就是这家伙
```

大家也可以尽情嘲笑我，本骚年有时候就是转不过来。

- webpack.config.js

``` js
// 加了个插件，关闭之前的黄色warning
new webpack.ContextReplacementPlugin(
  /angular(\\|\/)core(\\|\/)@angular/,
  path.resolve(__dirname, 'src'),
  {}
)
```

登录页面也还是我们熟悉的：

![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1495970476%281%29.png)

## 结束语
-----
这节主要讲了路由相关的介绍和使用，以及添加静态资源，和调整一些配置使得项目得以启动的过程。项目里代码讲得不多，大家可以自行查看。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular2-free/3-init-routes-and-assets)
[此处查看页面效果](http://angular2-free.godbasin.com/3-init-routes-and-assets/index.html)