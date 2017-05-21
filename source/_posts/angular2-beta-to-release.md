---
title: 从Angular2-beta到Angular4-release框架升级总结
date: 2017-05-21 11:51:48
categories: angular2火锅
tags: 分享
---
项目之前使用的Angular-beta版本，现升级到Angular-release版本。本文记录升级过程的问题和一些解决方法。
<!--more-->

## 升级
---
### 版本说明
- 原始版本：2.0.0-beta.6
- 目标版本：4.1.1
- 新增脚手架：Angular-cli
- 脚手架版本：1.0.0-rc.1

升级后主要依赖版本如下：
``` json
"dependencies": {
    "@angular/common": "^4.0.0",
    "@angular/compiler": "^4.0.0",
    "@angular/compiler-cli": "^4.0.0",
    "@angular/core": "^4.0.0",
    "@angular/forms": "^4.0.0",
    "@angular/http": "^4.0.0",
    "@angular/platform-browser": "^4.0.0",
    "@angular/platform-browser-dynamic": "^4.0.0",
    "@angular/router": "^4.0.0",
    "core-js": "^2.4.1",
    "rxjs": "^5.1.0",
    "zone.js": "^0.8.4"
},
"devDependencies": {
    "@angular/cli": "1.0.0-rc.1",
    "ts-node": "~2.0.0",
    "tslint": "~4.5.0",
    "typescript": "~2.1.0"
}
```

### 依赖更改
- **依赖导入更改**：

``` js
'angular2/core' => '@angular/core'
'angular2/http' => '@angular/http'
'angular2/router' => '@angular/router'
// 表单相关的
'angular2/commom' => '@angular/forms'
```

### 新增NgModule
- **官方说明**
Angular模块能帮你把应用组织成多个内聚的功能块。

Angular模块是带有`@NgModule`装饰器函数的类。 @NgModule接收一个元数据对象，该对象告诉Angular如何编译和运行模块代码。 它标记出该模块拥有的组件、指令和管道， 并把它们的一部分公开出去，以便外部组件使用它们。 它可以向应用的依赖注入器中添加服务提供商。

具体请参考[官方文档](https://angular.cn/docs/ts/latest/guide/ngmodule.html)。

- **管理公用组件**

创建SharedModule管理所有公用组件：

``` js
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
// 引入公用组件
import {SomeService} from './service/some.service';
import {SomeComponent} from './component/some.component';
import {SomePipe} from './pipe/some.pipe';
import {SomeDirective} from './directive/ng-file-select.directive';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [SomeComponent, SomePipe, SomeDirective],
  exports: [CommonModule, FormsModule, SomeComponent, SomePipe],
  providers: [SomeService]
})
export class SharedModule {}
```

其他模块只需要引入SharedModule：

``` js
import {NgModule} from '@angular/core';
// 引入SharedModule
import {SharedModule} from 'shared/shared.module';
// 该模块路由
import {SomeRoutingModule} from './main-routing.module';
// 该模块相关Component
import {SomeComponent} from './main.component';

@NgModule({
  imports: [SharedModule, SomeRoutingModule],
  declarations: [SomeComponent],
  exports: [SomeComponent]
})
export class SomeModule {
}

```

### 路由相关
- **变更**

1. 拆分和新增了路由模块
  - `ActivatedRoute`：获取路由信息
  - 路由事件实例，如`NavigationEnd`表示导航事件变更完毕，等
  - ...[捂脸]反正改了挺多的，请自行查询[官方API文档](https://angular.io/docs/ts/latest/api/#!?query=router)

- **新增路由模块**

路由使用`NgModule`创建，示例如下：

``` js
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {SomeComponent} from './main.component';
import {ListComponent} from './list.component';
import {DetailComponent} from './detail.component';

const routes: Routes = [ 
  // 这里displayName主要供面包屑使用
  {path: '', component: SomeComponent, data: {displayName: '某个模块'},
  children: [
    {path: 'list', component: ListComponent, data: {displayName: '列表'}},
    {path: 'list', component: DetailComponent, data: {displayName: '详情'}},
    {path: '**', redirectTo: 'list'}
  ]},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class SomeRoutingModule {}
```

- **路由相关常用**

``` js
// 监听导航事件变更
// router: Router
router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {});
// 获取路由信息
// activatedRoute: ActivatedRoute
const rootRoute: ActivatedRoute = activatedRoute.root // 获取根路由
const children: ActivatedRoute[] = rootRoute.children; // 获取子路由
// 遍历子路由，获取其params/data/url等
for (const child of children) {
     console.log(child.snapshot.data); // 获取data
     console.log(child.snapshot.params); // 获取params
     console.log(child.snapshot.url, child.snapshot.url[0].path); // 获取url或path信息
}
```
若要写面包屑功能，可参考该文章[Angular2 Breadcrumb using Router](http://brianflove.com/2016/10/23/angular2-breadcrumb-using-router/)。

### 表单相关
- **依赖API更改**

``` js
// 依赖中某些API更改
// ControlGroup => FormGroup
import {ControlGroup} from 'angular2/commom';
=> import {FormGroup} from '@angular/forms';
// Control => FormControl
import {Control} from 'angular2/commom';
=> import {FormControl} from '@angular/forms';
```

- **原使用[ngFormModel]属性**
 
更改表单属性`[ngFormModel]`为`[formGroup]`。

``` html
<form [ngFormModel]="myform" /> => <form [formGroup]="myform" />
```

同时在module文件需引入`FormsModule`和`ReactiveFormsModule`：

``` js
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
```

更改表单内input属性`[ngFormControl]`为`formControlName`：

``` html
<input [ngFormControl]="url" /> => <input formControlName="url" />
```

若要在`[ngFormModel]`属性的`<form>`内使用`ngModel`，需添加`[ngModelOptions]="{standalone: true}"`属性：

``` html
<input name="url" [(ngModel)]="url" [ngModelOptions]="{standalone: true}" />
```

若要在`[ngFormModel]`属性的`<form>`内使用`#url="ngForm"`来进行验证，需更改验证`url.valad`为`mgform.controls.url.valid`。

- **原使用ngForm**

更改表单内`input`属性`ngControl="url"`为`#url="ngModel"`，同时需要在该`input`标签添加`name`属性

``` html
<input ngControl="url" /> => <input #url="ngModel" name="url" />
```

若不需要表单验证，则不需添加name属性，而添加`[ngModelOptions]="{standalone: true}"`。

``` html
<input #url="ngModel" /> => <input #url="ngModel" [ngModelOptions]="{standalone: true}" />
```

- **组件封装使用`[(ngModel)]`**

使用时需加上`name`以及`ngDefaultControl`两个属性：

``` html
<date-time-picker [(ngModel)]="start_time" /> 
=> <date-time-picker name="start_time" [(ngModel)]="start_time" ngDefaultControl />
```

### 其他问题
**1. http请求内容带url时后台解析错误**
原因：angular(v4.0.0)中封装的http服务对参数standardEncoding编码方法，见`node_modules/@angular/http/@angular/http.js`文件，导致后台获取图片地址失败。
解决办法：使用encodeURIComponent覆盖standardEncoding编码:

``` js
/**
 * 覆盖原有的standardEncoding方法，见http.js文件
 */
class MyQueryEncoder extends QueryEncoder {
  encodeKey(k: string): string {
    return encodeURIComponent(k);
  }
  encodeValue(v: string): string {
    return encodeURIComponent(v);
  }
}
```

**2. 组件迁移后，无法正确订阅事件**
原因：angular(v4.0.0)中依赖注入，若在不同地方声明provider，则会创建不同的实例。
解决办法：在app根组件声明provider注入ResultHandler服务，则整个app使用同一个实例。

**3. 升级`angular-cli`版本失败**
原因：angular-cli版本升级后，对应webpack版本修改了默认的`disableHostCheck`属性，导致`ng serve --port`会出现Invalid Host header。
解决办法：回退版本，或者手动更改`node_modules`里webpack相关配置（可查看[Invalid Host header after updating to 1.0.1 #6070](https://github.com/angular/angular-cli/issues/6070)）。

**4. 运行`npm run build --prod`命令失败**
原因：basically the problem is in AOT and Angular analyzer. It analyzes code in all cases whether you wanted to have aot or not.
解决办法：1) `-prod` => `--prod --aot=false` 2) `-prod` => `--env=prod`（可查看[ng build -prod Module not found: Error: Can't resolve './$$_gendir/app/app.module.ngfactory' #4551](https://github.com/angular/angular-cli/issues/4551)）
PS：运行代码可通过：即时JIT编译器动态引导、使用预编译器（ AoT - Ahead-Of-Time ）两种方式。进行静态引导.静态方案可以生成更小，启动更快的应用，默认优先使用。但此处因为有些动态计算环境的代码，故编译失败，此处手动关闭。

**5. 升级angular(v2.4.0)到(v4.1.1)版本后，左侧导航的状态定位失效**
原因：升级后，router和component的hook顺序调整（仅根据个人观察，未经验证），导致组件状态未能在路由事件结束(`NavigationEnd`)时完成更新。
解决办法：目前在路由事件结束(`NavigationEnd`)时，手动更新组件状态。

**6. html模版里，在style里使用的内嵌样式失效。**
原因：angular(v4.1.1)中，不能使用`style="color: { {someValidation ? 'red' : ''} }"`，需使用`[ngStyle]`属性方式对样式进行设置。
解决办法：
1) 更改为`[ngStyle]="{'color': someValidation ? 'red' : ''}"` 。
2) 更改为`[style.color]="someValidation ? 'red' : ''"`。

**7. 在webstorm里，更改文件不能在浏览器中更新输出。**
原因：webstorm里面默认启用"safe write"，将保存先存到临时文件。
解决办法：关闭 File > Settings... > System Settings > Use "safe write"，参见[angular-cli issue#5507](https://github.com/angular/angular-cli/issues/5507) 。

**8. 无法从`router`里获取`RouteParams`的API。**
原因：angular(v4.1.1)中，使用`ActivatedRoute`的API获取路由信息。
原代码：

``` js
import { RouteParams } from 'angular2/router';
... // 其余代码
    ngOnInit() {
        this.id = parseInt(this._routeParams.get('id'));
        this.needSaveBtn = (this._routeParams.get('action') || '') != 'detail';//查看、编辑、添加
        ... // 其余代码
    }
... // 其余代码
```

新代码：

``` js
import { ActivatedRoute } from '@angular/router';
... // 其余代码
    ngOnInit() {
      this._route.params
        .subscribe((params) => {
          this.id = parseInt(params['id']);
          this.needSaveBtn = (params['action'] || '') != 'detail';//查看、编辑、添加
         ... // 其余代码
        });
    }
... // 其余代码
```

**9. 使用angular-cli后无法自定义webpack的alias, 导致文件引入路径很长，如`../../../shared/`。**         
原因：angular-cli内部封装了webpack配置，若手动改动node_modules不方便。   
解决办法：查看[fix(build): use baseUrl and paths from tsconfig #2470](https://github.com/angular/angular-cli/pull/2470)，该issue只针对性调整shared目录，具体可查看[相关Commit信息](https://github.com/angular/angular-cli/pull/2470/files/9fae6d049d1d6ed89d14cc9cdd9c39bbc5e5c5a8)。   

使用方式:

``` js
// 在src/目录下修改tsconfig.app.json
{
  "compilerOptions": {
    ...
    // 添加路径相关
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["app/shared/*"]
    }
    ...
  },
  ...
}

// 在根目录下修改tsconfig.json
// 主要用于编译器IDE检测使用
{
  "compilerOptions": {
    ...
    // 添加路径相关
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["src/app/shared/*"]
    }
    ...
  },
  ...
}
```

**10.升级angular(v4.1.1)版本后，组件迁移状态更新失效**
原因：升级后，component的hook顺序调整，导致组件状态未能在component状态更新后完成更新。
解决办法：检测状态变更时，需手动再添加状态更新。

**11.升级angular到(v4.1.1)版本后，`<iframe>`等带动态`src`等属性触发error**
原因：angular2启用安全无害化处理，为防止XSS等攻击，具体可参考官方文档[安全](https://angular.cn/docs/ts/latest/guide/security.html)。
解决办法：注入`DomSanitizer`服务可以把一个值标记为可信任的，这里添加了一个叫`safeUrl`的pipe组件，位于`app/shared/pipe/safe-url.main.pipe.ts`。
使用方式：`<iframe [src]="url | safeUrl">`

**12.迁移一些文件后，启动app失败，出现`Cannot read property 'length' of undefined`**
原因：有些文件里面带有`/// <reference path="../../../../typings/browser.d.ts" />`，若路径不对文件找不到则无法启动。
解决办法：调整文件路径，或者删除这些内容。


## 结束语
-----
使用开源的东西踩坑是必然的，多多看看issues或者谷歌就好啦。