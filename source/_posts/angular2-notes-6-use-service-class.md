---
title: Angular2使用笔记6--使用服务类
date: 2016-10-30 01:40:42
categories: angular2火锅
tags: 笔记
---
最近在学习Angular2作为前端的框架，《Angular2使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录将一些数据封装到服务类进行获取的过程。
<!--more-->
## 模块化和依赖注入
-----
模块是组织应用程序和使用外部程序库的最佳途径。
### Angular模块化
- Angular模块把组件、指令和管道打包成内聚的功能块儿，每一个都聚焦于一个特性分区、业务领域、工作流，或一组通用的工具
  - 模块还能用来把服务加到应用程序中
  - 模块可能在应用启动时立即加载，也可能由路由器进行异步延迟加载
- Angular模块是一个由@NgModule装饰器提供元数据的类，元数据包括
  - 声明哪些组件、指令、管道属于该模块
  - 公开某些类，以便其它的组件模板可以使用它们
  - 隐藏那些属于实现细节的非公开类
  - 导入其它模块，以获得所需的组件、指令和管道
  - 在应用程序级提供服务，以便应用中的任何组件都能使用它
- 每个Angular应用至少有一个模块类—— 根模块 ，我们将通过引导根模块来启动应用

### 依赖注入
前面我们也有稍微介绍过angular2的依赖注入，可查看[《Angular2使用笔记3--创建头部组件》](/2016/10/07/angular2-notes-3-create-header/)。本骚年稍微偷个懒，直接拿过来吧。
- 全局依赖
  - 在应用程序根组件AppComponent中注册那些被应用程序全局使用的依赖提供商
  - 这些全局注册的依赖，能在应用程序的任何地方注入到任何组件和服务的构造函数里
- 外部模块
  - @Injectable和嵌套服务依赖
    - @Injectable()标志着一个类可以被一个注入器实例化
    - @Injectable()装饰器只在一个服务类有自己的依赖的时候，才是不可缺少
  - 把服务作用域限制到一个组件支树
    - 被注入的服务依赖都是单例的，在任意一个依赖注入器("injector")中，每个服务只有唯一的实例
    - Angular应用程序有多个依赖注入器，组织成一个与组件树平行的树状结构
    - 在多个组件中注入，服务就会被新建出多个实例，分别提供给不同的组件
    - 通过在组件树的子级根组件中提供服务，可以把一个被注入服务的作用域局限在应用程序结构中的某个分支中
- 常用依赖注入
  - 指令（组件）：通过Component中directives注入
  - 服务：通过Component中providers注入

### 服务提供商
- 模块与服务
  - 模块是为模块中的所有组件提供服务的最佳途径
  - 模块可以往应用的“根依赖注入器”中添加提供商，让那些服务在应用中到处可用
- 服务提供商
  - 提供商提供所需依赖值的一个具体的运行期版本
  - 注入器依靠提供商们来创建服务的实例，它会被注入器注入到组件或其它服务中
  - 我们必须为注入器注册一个服务的提供商，否则它就不知道该如何创建此服务
- 提供商的使用
  - 把提供商添加到根模块上，则任何地方使用的都是服务的同一个实例
  - 把它注册在组件级表示该组件的每一个新实例都会有一个(在该组件注册的)服务的新实例

## 创建并使用服务
---
### 创建服务
这里我们用头部Header组件为例子，其中我们将菜单的数据获取单独封装成一个服务HeaderService在header.service.ts文件中。如下：
``` ts
// 获取@Injectable装饰器
import {Injectable} from '@angular/core';

// @Injectable()标志着一个类可以被一个注入器实例化
Injectable()
// 输出HeaderService服务类
export class HeaderService {
  // menus用于储存主菜单
  private menus: Array<any> = [{
    title: 'index', // title用于储存路由对应的路径
    href: '/index', // href用于设定该菜单跳转路由
    text: '首页', // text用于储存该菜单显示名称
  }, {
    title: 'others',
    href: '/other',
    text: '其他',
  }];

  // usermenus用于储存侧边下拉菜单
  private usermenus: Array<any> = [{
    href: '/login', // href用于设定该菜单跳转路由
    text: '退出', // text用于储存该菜单显示名称
  }];

  // 提供获取menus的接口
  getMenus(){
    return this.menus;
  }

  // 提供获取usermenus的接口
  getUsermenus(){
    return this.usermenus;
  }
}
```

### 注入并使用服务
我们在header.component.ts文件中，进行HeaderService服务的注入和使用。
- 获取服务类

``` typescript
// 获取HeaderService服务类
import { HeaderService } from './header.service';
```

- 在元数据中实例化服务类

``` typescript
@Component({
  ... // 其他元数据
  providers:[HeaderService] // 实例化服务
})
```

- 在组件中注入服务

``` typescript
 constructor(private headerService: HeaderService) {}
```

- 组件初始化时初始化相应的数据

``` typescript
  // 生命周期钩子：初始化
  ngOnInit() {
    // 设定menus的初始值
    this.menus = this.headerService.getMenus();
    // 设定usermenus的初始值
    this.usermenus = this.headerService.getUsermenus();
    ... //其他初始化事件
  }
```

经过上述的步骤，我们实现了服务的创建、实例化、注入和使用。
需要注意的是，Angular应用是一个组件树。每个组件实例都有自己的注入器！组件的树与注入器的树平行。
所以当我们需要共享或者隔断服务的时候就要想起来这个与组件树平行的注入器树。

## 结束语
-----
angular2中，不管是组件类，还是是服务类，这样的创建、输出、获取等等模块化的操作还是很棒的。
[此处查看项目代码（仅包含src部分）](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular2-notes/6-use-service-class)
[此处查看页面效果](http://oc8qsv1w6.bkt.clouddn.com/6-use-service-class/index.html#/index)