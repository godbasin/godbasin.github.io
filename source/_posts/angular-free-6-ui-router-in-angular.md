---
title: 玩转Angular1(6)--ui-router与嵌套路由
date: 2017-02-25 11:07:08
categories: angular混搭
tags: 笔记
---
AngularJS(v1.5.8)已经成为项目们的基本框架，《玩转Angular1》系列用于记录项目中的一些好玩或者比较特别的思路。
本文记录在angular中使用ui-router建立嵌套路由，以及路由状态相关的过程。
<!--more-->
## ui-router
-----
### ui-router与ngRoute
angular.js为我们封装好了一个路由工具ngRoute，它靠url改变去驱动视图。
angularUI也为我们封装了一个独立的路由模块ui-router,它靠状态state来驱动视图。

- 两者区别
  - UI-Router支持嵌套视图，ngRoute不支持
  - UI-Router支持多视图，ngRoute不支持
  - UI-Router是应用程序内的一个区域，ngRoute只是应用程序中的url
  - UI-Router名称可以自定义，ngRoute名称只能是url
  - UI-Router通过名称或url导航，ngRoute只能通过url导航
  - UI-Router通过状态填充某一部件，ngRoute通过指令将填充某一部件

### 使用ui-router
- 管理状态
  - 在应用程序的整个用户界面和导航中，一个状态对应于一个页面位置
  - 通过定义controller、template和view等属性，来定义指定位置的用户界面和界面行为
  - 通过嵌套的方式来解决页面中的一些重复出现的部位

- 嵌套状态和视图
  - 当一个状态是活动状态时，其所有的父状态都将成为活跃状态
  - 状态可以相互嵌套

这里主要参考[《学习 ui-router 系列文章》](http://bubkoo.com/2014/01/02/angular/ui-router/guide/index/)，后面我们会在使用到的时候再简单讲解相关的内容。


## 添加Sidebar组件
---
像其他几个框架讲解一样，我们依然使用Sidebar组件进行应用程序主界面的侧边栏。
如图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1485074649%281%29.png)

这里我们在维护公用组件的时候，放置在`app/shared/components`文件夹里。

### sidebar.template.html
``` html
...
<ul class="nav side-menu">
    <!--父菜单遍历，若href激活或者起子菜单激活则为激活状态-->
    <li ng-repeat="menu in menus" ng-class="(menu.href === $state.current.name || menu.show) ? 'active' : ''" ng-click="toggleMenu(menu)">
        <!--若有子菜单，则添加侧边下拉图标-->
        <a><i class="fa" ng-class="menu.icon"></i> {{menu.text}} <span class="fa" ng-show="menu.childMenus && menu.childMenus.length" ng-class="menu.class ? 'fa-chevron-down' : 'fa-chevron-right'"></span></a>
        <!--若有子菜单，则遍历加载-->
        <ul class="nav child_menu slide" ng-click="$event.stopPropagation();" ng-show="menu.show">
            <!--ui-serf-active用于匹配子元素ui-sref的href时激活class-->
            <li ng-repeat="childMenu in menu.childMenus" class="slide-item" ui-sref-active="current-page">
                <!--ui-sref可用于跳转-->
                <a ui-sref="{{ childMenu.href }}">{{ childMenu.text }}</a>
            </li>
        </ul>
    </li>
</ul>
...
```

这里我们只把关键部分进行展示，如菜单遍历、状态加载、下拉处理等等。

从代码中我们可以发现，模板中涉及两个在ui-router中比较关键的属性：
- ui-sref用于链接跳转和激活
- ui-sref-active用于查看当前激活状态并设置Class

- 有三种方法来激活状态：
  - 调用$state.go()方法，这是一个高级的便利方法
  - 点击包含ui-sref指令的链接
  - 导航到与状态相关联的url

另外，我们这里使用到了$state，这个其实是从控制器传入的，属于ui-router的状态管理，下面我们会讲到。

### sidebar.directive.ts
``` javascript
// app/shared/components/sidebar.directive.ts
export default (ngModule) => {
    ngModule.directive('sidebar', ['$state', function ($state) {
        return {
            restrict: 'AE',
            templateUrl: './shared/components/sidebar.template.html',
            transclude: true,
            replace: false,
            link(scope, element, attrs) {
                const menuShowAll = false;
                scope.$state = $state;
                // 初始化菜单数据
                const menus = [{
                    icon: 'fa-home', // icon用于储存菜单对应的图标
                    text: '账户管理', // text用于储存该菜单显示名称
                    show: false,
                    childMenus: [{
                        href: 'home.accounts', // href用于设定该菜单跳转路由
                        text: '账户信息' // text用于储存该菜单显示名称
                    }, {
                        href: 'home.accountsadd',
                        text: '新建'
                    }]
                }, {
                    icon: 'fa-cubes',
                    text: '系统管理',
                    show: false,
                    href: 'home.system'
                }];
                scope.menus = menus;

                // 点击父菜单
                scope.toggleMenu = menu => {
                    // 将其他菜单设置为非激活状态
                    scope.menus.forEach(m => m.show = false);
                    if (menu.childMenus && menu.childMenus.length) {
                        // 若当前菜单有子菜单，则切换激活状态
                        menu.show = !menu.show;
                    } else if (menu.href) {
                        // 若当前菜单没有子菜单，则进行跳转 
                        $state.go(menu.href);
                    }

                };

                checkActive();

                // 初始化的时候检测菜单是否激活
                function checkActive() {
                    menus.forEach((menu: any) => {
                        menu.show = !!(menu.childMenus && menu.childMenus.find(item => item.href === $state.current.name));
                    });
                }
            }
        };
    }]);
};
```

在控制器中，我们主要做了以下几件事：
- 初始化菜单数据
- 设置一级菜单点击的事件：切换下拉/跳转
- 初始化时检测并记载菜单状态

这里面主要用到ui-router的$state服务，该服务主要用于状态管理。


## 嵌套路由
---
该应用中，主要的嵌套路由使用，在登录后的home主界面。
### 添加路由状态
在`app.ts`文件中，我们添加路由状态处理：

``` javascript
// app.ts
// ui-router路由的参数
const routerStates = [{
    name: 'login',
    url: '/login',
    templateUrl: './modules/login/login.template.html',
    controller: 'LoginCtrl'
}, {
    name: 'home',
    url: '/home',
    templateUrl: './modules/home/home.template.html'
}, {
    name: 'home.accounts',
    url: '/accounts',
    templateUrl: './modules/home/account/account.template.html'
}, {
    name: 'home.accountsadd',
    url: '/accountsadd',
    templateUrl: './modules/home/account/accountAdd.template.html'
}, {
    name: 'home.system',
    url: '/system',
    templateUrl: './modules/home/system/system.template.html'
}];
```

状态可以相互嵌套。有三个嵌套的方法：
- 使用“点标记法”，例如：`.state('contacts.list', {})`
- 使用parent属性，指定一个父状态的名称字符串，例如：`parent: 'contacts'`
- 使用parent属性，指定一个父状态对象，例如：`parent: contacts`（contacts 是一个状态对象）

### 在home.template.ts中嵌套路由视图
子状态将把其对应的模板加载到父状态对应模板的ui-view中。

``` html
<!--home.template.ts-->
<div class="container body">
    <div class="main_container">
        <!--添加Sidebar组件-->
        <div sidebar></div>

        <div class="right_col" role="main">
            <!--嵌套路由视图-->
            <div ui-view></div>
        </div>
        
        <footer>...</footer>
    </div>
</div>
```

这样，我们就实现了路由嵌套，以及路由跳转、状态激活等功能。

## 结束语
-----
这节主要简单介绍了使用ui-router代替ngRoute，并通过创建Sidebar组件以及添加路由、嵌套视图等，展示ui-router特性。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular-free/6-ui-router-in-angular)
[此处查看页面效果](http://ok2o5vt7c.bkt.clouddn.com/angular-free-6-ui-router-in-angular/index.html)