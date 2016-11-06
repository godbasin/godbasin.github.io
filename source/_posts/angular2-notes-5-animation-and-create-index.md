---
title: Angular2使用笔记5--动画和制作index页面
date: 2016-10-29 09:51:17
categories: angular2火锅
tags: 笔记
---
最近在学习Angular2作为前端的框架，《Angular2使用笔记》系列用于记录过程中的一些使用和解决方法。
本文简单介绍angular2的动画效果，以及记录制作首页的过程。
<!--more-->
## angular2动画
-----
### 关于Angular2动画
- 使用动画使得用户界面能在不同的状态之间更平滑的转场
- Angular2的动画系统赋予了制作各种动画效果的能力，以构建出与原生CSS动画性能相同的动画
- Angular2动画是基于标准的Web动画API(Web Animations API)构建的，它们在支持此API的浏览器中会用原生方式工作。至于其它浏览器，就需要一个填充库(polyfill)

### 状态与转场
Angular2动画是由状态和状态之间的转场效果所定义的。
- 状态
  - 动画状态是一个由程序代码中定义的字符串值
  - 状态的来源可以是简单的对象属性，也可以是由方法计算出来的值。能从组件模板中读取它
  - state具体定义了每个状态的最终样式
    - 一旦元素转场到那个状态，样式就会被应用到此元素上
    - 当留在此状态时，样式也会一直保持着
- 转场
  - 转场控制一条在一组样式和下一组样式之间切换的时间线
  - 如果多个转场都有同样的时间线配置，就可以把它们合并进同一个transition定义中
  - 对同一个转场的两个方向都使用相同的时间线，可以使用<=>简写语法
  - *(通配符)状态：匹配任何动画状态，可用于定义那些不需要管当前处于什么状态的样式及转场
  - void状态：表示元素没有被附加到视图，在定义“进场”和“离场”的动画时非常有用

### 可动的(Animatable)属性与单位
- 可以参与动画的属性
  - 位置(position)
  - 大小(size)
  - 变换(transform)
  - 颜色(color)
  - 边框(border)
尺寸类属性(如位置、大小、边框等)包括一个数字值和一个用来定义长度单位的后缀。

- 动画时间线
  - 持续时间(duration)：控制动画从开始到结束要花多长时间
  - 延迟(delay)：控制在动画已经触发但尚未真正开始转场之前要等待多久
  - 缓动(easing)函数：用于控制动画在运行期间如何加速和减速

- 基于关键帧(Keyframes)的多阶段动画
  - 每个关键帧都可以被指定一个偏移量，用来定义该关键帧将被用在动画期间的哪个时间点
  - 偏移量是一个介于0(表示动画起点)和1(表示动画终点)之间的数组

- 并行动画组(Group)
  - 为同时发生的几个动画配置不同的时间线

## 制作index页面
-----
页面结构如下：
![image](http://o905ne85q.bkt.clouddn.com/F3A2.tmp.png)

### 添加index组件相关文件
- 添加index文件夹，用于管理Index组件的相关文件
Index组件文件如下：
``` cmd
index/
 ├──index.ts                   * 导出该目录下组件
 ├──index.component.ts         * 定义并导出Index组件
 ├──index.style.css            * Index组件的css样式
 └──index.template.html        * Index组件的html模板
```

### 定义Index组件
这里使用了前面章节创建的头部组件。前面我们将该组件放在主页面组件app.component.js中，这里我们将其移动到index页面组件中。
在index.component.js中：
``` typescript
import { Component, trigger, state, style, transition, animate } from '@angular/core';

// 添加Header组件，默认从header文件夹的index.ts中获取
import { Header } from '../header';

@Component({
  selector: 'index', // 设置模板元素
  styleUrls: ['./index.style.css'], // 样式文件引入
  templateUrl: './index.template.html', // 模板文件引入
  directives: [Header], // 注入指令
  animations: [
    // 设置动画，@menuState属性动画效果
    trigger('menuState', [ 
      state('false', style({ // menu.show为false时状态
        height: '0px',
        padding: '0px',
        opacity: '0'
      })),
      // 转场的动画效果
      transition('* => *', animate('100ms ease-in'))
    ])
  ]
})
export class Index {
  // 定义并初始化菜单显示状态
  loading: string = 'init';
  asidemenus: Array<any>;

  // 更新loading
  changeState (view) {
    this.loading = view;
  }

  // 显示隐藏子菜单效果并更新loading
  toggleContent (index) {
    this.asidemenus[index].show = !this.asidemenus[index].show;
    this.changeState(this.asidemenus[index].click);
  }

  ngOnInit () {
    // 设定menu的初始值
    this.asidemenus = [{
        title: '基本资料', // title用于储存该菜单显示名称
        click: 'init', // click用于储存该菜单对应点击时loading的状态值
        show: true, // show用于保存菜单是否隐藏的状态
        menus: [{
          text: '名字', // title用于储存该菜单显示名称
          state: 'active', // state用于储存该菜单状态
          click: 'name' // click用于储存该菜单对应点击时loading的状态值
        }, {
          text: '邮箱',
          state: 'active',
          click: 'email'
        }, {
          text: 'github',
          state: 'active',
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
      }];
  }
}
```
- 添加组件样式index.style.css，这里就不展示出来了
- index文件夹下index.ts中输出组件
``` typescript
export * from './index.component';
```

### 添加组件模板
index.template.html文件，如下
``` html
<!--插入头部组件，注入指令后生效-->
<my-header></my-header>
<div class="container-fluid row">
    <aside class="col-md-2  col-md-offset-1" id="according">
        <div class="panel-group" class="according" role="tablist" aria-multiselectable="true">
            <!--
                *ng-for 中的*是Angular2中template语法的缩写，如果是全部的话，应该为
                <div ng-for #menu="$implicit" [ng-for-of]="asidemenus" #i="index"></div>
            -->
            <div class="panel panel-default list-group" *ngFor="#menu of asidemenus; #i = index">
                <div class="panel-heading" role="tab">
                    <ul class="panel-title ">
                        <li data-toggle="collapse" (click)="toggleContent(i)">
                            {{ menu.title }}
                        </li>
                    </ul>
                </div>
                <div class="panel-collapse">
                    <ul class="list-group">
                        <!--@menuState属性动画效果-->
                        <li *ngFor="#item of menu.menus; #j = index;" @menuState="menu.show" class="list-group-item" role="button" (click)="changeState(item.click)">{{ item.text }}</li>
                    </ul>
                </div>
            </div>
        </div>
    </aside>
    <article class="col-md-7">
        <section class="index-content">
            <p [hidden]="!(loading === 'init' || loading === 'name')">昵称：被删</p>
            <p [hidden]="!(loading === 'init' || loading === 'email')">邮箱：wangbeishan@163.com</p>
            <p [hidden]="!(loading === 'init' || loading === 'github')">github: <a href="https://github.com/godbasin">github.com/godbasin</a></p>
            <div [hidden]="!(loading === 'sethead')">这里是设置头像页面</div>
            <div [hidden]="!(loading === 'setinfo')">这里是修改资料页面</div>
            <div [hidden]="!(loading === 'other')">这里是其他页面</div>
        </section>
    </article>
</div>
```

### 添加Index路由
我们在app.routes.ts中添加index页面的路由。
- 引入Index组件
这里因为该文件夹下也有一个index.ts的文件，所以直接使用"./index"路径的话会有问题，所以我们写到具体的路径。
``` typescript
// 当然最好大家不要使用这种易冲突的名字
import { Index } from './index/index';
```
- 添加路由
``` typescript
export const routes: RouterConfig = [
  { path: 'login',  component: Login },
  { path: 'index',  component: Index },
  { path: '**',    component: Login }
];
```

### 添加样式
样式包括一些组件的样式，还有过渡css样式，这里就不列出来了。

## 结束语
-----
不得不说，angular2中的动画效果跟Vue过渡也是很相像的呢。这些贴心的设定，很多时候都能帮我们减轻不少的负担呢。
[此处查看项目代码（仅包含src部分）](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular2-notes/5-animation-and-create-index)
[此处查看页面效果](http://oc8qsv1w6.bkt.clouddn.com/5-animation-and-create-index/index.html#/index)