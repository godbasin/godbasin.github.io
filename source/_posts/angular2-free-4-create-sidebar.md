---
title: 玩转Angular2(4)--制作左侧自动定位菜单
date: 2017-06-02 21:52:32
categories: angular2火锅
tags: 笔记
---
因为项目原因又玩上了Angular2(v4.0+)，《玩转Angular2》系列用于探索一些灵活或者新的用法。
本文记录制作左侧菜单，并使用路由自动定位的过程。
<!--more-->

## 调整配置
-----
上一篇有些配置不是很合适，故这里我们先进行调整。

### 全局注入jQuery
上篇我们是这样注入jQuery的：

``` js
// jquery
window['$'] = window['jQuery'] = require('./assets/js/jquery.min.js');
```

这样的全局注入其实可能会导致一些问题（不知道是不是配置不正确，导致本骚年的其他jQuery插件失效），所以我们还是用webpack来注入。
首先安装jQuery的依赖：

``` js
npm install jquery --save
```

然后在webpack的插件配置`plugins`中添加：

``` js
	plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ]
```

就可以挪掉上面不够优雅的注入方式了。

### 开启source-map
之前我们的webpack配置中也添加了`devtool: 'source-map'`，但是这个需要配合`source-map-loader`才能生效：

``` js
npm install -D source-map-loader
```

然后在webpack中添加loader：

``` js
    rules: [
        {
            test: /\.js$/,
            use: ["source-map-loader"],
            enforce: "pre",
            exclude: [
                path.join(__dirname, 'node_modules', '@angular/compiler'),
                path.join(__dirname, 'node_modules', 'rxjs')
            ]
        }
    ]
```

这里我们需要排除`@angular/compiler`以及`rxjs`，可能还有其他一些依赖，不然会有webpack的`warning`。详细也可以查看类似的[issue-Warnings displayed by webpack when using source-map-loader](https://github.com/angular-redux/store/issues/64)。

### 压缩代码
webpack自带了一个压缩插件`UglifyJsPlugin`，我们添加以下配置就可以生效：

``` js
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
```

压缩后的代码体积大大减小，但会消耗一定的编译速度，故一般打包到生产环境才会使用。

### 分离代码
如果说我们需要分离其他的代码，像一些依赖的代码，或者是css代码，也可以通过配置实现。

1. 抽离依赖`vender.js`文件

``` js
new CommonsChunkPlugin({
    name: 'vendors',
    filename: 'vendors.js',
    minChunks: function(module) {
        return isExternal(module);
    }
})
```

关于`isExternal()`函数，用了很简单的方式进行：

``` js
function isExternal(module) {
    var userRequest = module.userRequest;
    if (typeof userRequest !== 'string') {
        return false;
    }
    return userRequest.indexOf('node_modules') >= 0; // 是否位于node_modules里
}
```

2. 将样式从js中抽出，生成单独的`.css`样式文件。即把所以的css打包合并：

``` js
new ExtractTextPlugin('style.css', {
    allChunks: true // 提取所有的chunk（默认只提取initial chunk，而上面CommonsChunkPlugin已经把部分抽离了）
})
```

这些大家下来可以配置，本骚年就不在项目这使用了。


## 创建左侧菜单
---
### 添加配置文件
这里我们为了方便拓展，使用配置的方式来自定义菜单，这样每次我们需要修改的时候只需要调整配置文件就好了：

``` js
// sidebar.config.ts
export const menus = [{
    icon: 'fa-home', // icon用于储存菜单对应的图标
    text: '页面管理', // text用于储存该菜单显示名称
    childMenus: [{
        link: '/home/page-setting', // link用于设定该菜单跳转路由
        text: '页面配置' // text用于储存该菜单显示名称
    }, {
        link: '/home/page-rebuild',
        text: '页面重现'
    }]
}, {
    icon: 'fa-cubes',
    text: '使用说明',
    link: '/home/page-handbook'
}];
```

这里暂时限定我们最多为二级菜单，跟之前搭建管理项目的方式一致。

### 添加html文件
这里我们可以遍历配置文件生成菜单：

``` html
<div class="col-md-3 left_col menu_fixed">
    <div class="left_col scroll-view">
        <!-- 其他省略，重点在下面 -->

        <!-- sidebar menu -->
        <div class="main_menu_side hidden-print main_menu">
            <div class="menu_section">
                <!-- 其他省略，重点在下面 -->
                <ul class="nav side-menu metismenu" id="sidebar-menu">
                    <li class="topper-menu" *ngFor="let menu of menus;" [ngClass]="menu.link && isActive(menu.link) ? 'active' : ''">
                        <a *ngIf="menu.link" [routerLink]="menu.link"><i class="fa" [ngClass]="menu.icon"></i> {{menu.text}}</a>
                        <a *ngIf="!menu.link" class="has-arrow"><i class="fa" [ngClass]="menu.icon"></i> {{menu.text}}</a>
                        <ul class="nav child_menu slide">
                            <li *ngFor="let childMenu of menu.childMenus;" class="slide-item" routerLinkActive="current-page">
                                <a [routerLink]="childMenu.link">{{ childMenu.text }}</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    <!-- /sidebar menu -->
    </div>
</div>
```

这里可以看到，我们使用`*ngFor`来进行遍历，然后我们大致可以得到我们的component需要以下功能：
- `[routerLink]`： 链接跳转
- `routerLinkActive`： 路由激活时样式
- `isChildMenuActived`： 判断该菜单下是否有子菜单的路由处于激活状态

这里我们需要注意的是：
1. 使用angular自带的常用指令，像`*ngFor`、`ngClass`等，需要在注册`@NgModule`时引入`CommonModule`。
2. 使用angular里面路由常用指令，像`[routerLink]`、`routerLinkActive`等，需要在注册`@NgModule`时引入`RouterModule`。
3. 使用angular里面表单常用指令，像`[(ngModel)]`等，需要在注册`@NgModule`时引入`FormModule`。

像我们的`HomeModule`：

``` js
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { HomeRoutes } from './home.routes';
import { HomeComponent } from './home.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [
    HomeComponent,
    SidebarComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule.forChild(HomeRoutes)
  ],
  providers: []
})
export class HomeModule { }
```

### 添加component
组件使用了简单的jQuey插件[metisMenu](https://github.com/onokumus/metismenu)，详细说明请参考文档，这里我们只需要知道调用`$().metisMenu()`的时候，若有`<li class="active">`则自动将该`<li>`设置为激活形式，此时我们在路由跳转结束的时候就可以获取对应激活路由然后初始化菜单状态了。

我们直接在代码中说明吧：

``` js
import {Component, ElementRef} from '@angular/core';
import {ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import {menus} from './sidebar.config';
import 'rxjs/Rx';

@Component({
    selector: 'home-sidebar',
    templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
    menus: any[] = menus;

    constructor(private route: ActivatedRoute, private router: Router, el: ElementRef) {
        this.router.events.subscribe(event => {
            // 判断路由结束
            if (event instanceof NavigationEnd) {
                const $menu = $(el.nativeElement).find('#sidebar-menu');
                this.menus.forEach((menu, index) => {
                    if (this.isChildMenuActived(menu)) {
                        // 将被激活的路由对应的li添加“active”的class
                        $menu.find('li.topper-menu').eq(index).addClass('active');
                    }
                });
                // 初始化菜单状态
                $menu.metisMenu();
            }
        });
    }

    // 判断路由是否激活状态
    isActive(url: string): boolean {
        return this.router.isActive(url, false);
    }

    // 判断菜单是否有子路由处于激活状态
    isChildMenuActived(menu: any): boolean {
        let hasOneActive = false;
        if (menu.childMenus) {
            // 遍历子路由看是否被激活
            menu.childMenus.forEach(child => {
                hasOneActive = hasOneActive || this.isActive(child.link);
            });
        }
        return hasOneActive;
    }
}
```

在Angular2-release版本里，一般路由的状态是通过事件监听获取的：

``` js
// 使用`ActivatedRoute`的API获取路由信息。
import { ActivatedRoute } from '@angular/router';
@Component({
    ... // 略
})
export class SidebarComponent {
    constructor(private route: ActivatedRoute) {}
   	ngOnInit() {
      this.route.params
        .subscribe((params) => {
          this.id = parseInt(params['id']); // 获取params
         ... // 其余代码
        });
    }
    ... // 其余代码
}
```

这里我们也可以使用`filter()`来过滤监听我们想要的事件：

``` js
// 监听导航事件变更完毕
router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {});
```

更多有关路由的我们上节也说过，可以点击回顾[《玩转Angular2(3)--启用路由和添加静态资源》](https://godbasin.github.io/2017/05/30/angular2-free-3-init-routes-and-assets/)。

最终效果图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1495970603%281%29.png)

## 结束语
-----
这节主要讲了一些基础环境配置的调整，以及制作路由自动定位左侧菜单的过程，主要涉及的可能还是路由相关。
看菜单列表的内容，大家猜猜本骚年接下来想要做什么？就不告诉你，哈哈。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular2-free/4-create-sidebar)
[此处查看页面效果](http://oqntc49tn.bkt.clouddn.com/4-create-sidebar/index.html#/home/page-setting)