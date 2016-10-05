---
title: Angular2使用笔记2--创建登录页面
date: 2016-10-05 08:49:32
categories: angular2火锅
tags: 笔记
---
最近在学习Angular2作为前端的框架，《Angular2使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录搭建登录页面的过程。
<!--more-->
## 根据产品规划划分模块
-----
### 主要页面逻辑
在这里，本骚年就建一个比较简单的项目。该项目与之前的Angular使用笔记项目长得完全一致，但我们这里用React来实现吧。
- 我们的主要页面逻辑如下：
  - 1.登录页面，输入账号和密码即可
  - 2.模块页面

### 定义登录组件
- 首先我们在app文件夹内添加一个login文件夹
ng2里面，我们使用与其他框架不同的目录组织方式，即将同个组件相关的文件放置在一个文件夹中，方便管理。
- Login组件文件如下：
``` cmd
login/
 ├──index.ts                   * 导出该目录下组件
 ├──login.component.ts         * 定义并导出Login组件
 ├──login.template.html        * Login组件的html模板
 └──login.style.css            * Login组件的样式文件
```

### 添加路由
- 设置路由
打开app.roytes.ts，设置如下路由：

``` typescript
import { RouterConfig } from '@angular/router';
import { Login } from './login';

export const routes: RouterConfig = [
  { path: 'login',  component: Login },
  { path: '**',    component: Login },
];
```
- 主组件app.component.ts中添加路由输出

``` typescript
template: `
 <main>
   <router-outlet></router-outlet>
 </main>
 `
```

从上面可以看到，Angular2中路由也是与组件一样导出该功能，具体的我们会在后面的文章中介绍。

## 编写Login组件
---
前面也提到过，Login组件相关文件统一管理在login文件夹中。
### 添加模板
- 添加该组件模板login.template.ts，如下

``` html
<div class="container login">
    <!--(ngSubmit)为绑定表单事件-->
    <form id="login-form" (ngSubmit)="submitForm(name, password)">
        <h3 class="text-center">login</h3>
        <div class="form-group">
            <label>account</label>
            <!--[value]绑定该组件作用域的值，而(input)用于处理输入事件，实现双向绑定-->
            <input class="form-control" type="text" [value]="name" (input)="name = $event.target.value" placeholder="username" autofocus required>
        </div>
        <div class="form-group">
            <label>Password</label>
            <!--[value]绑定该组件作用域的值，而(input)用于处理输入事件，实现双向绑定-->
            <input class="form-control" type="password" [value]="password" (input)="password = $event.target.value" placeholder="password" required>
        </div>
        <button type="submit" class="btn btn-default">登录</button>
    </form>
</div>
```

### 添加样式
Angular 2应用使用标准的CSS来设置样式。这意味着我们可以把关于CSS的那些知识和技能直接用于我们的Angular程序中，比如：样式表、选择器、规则，以及媒体查询等。

在此基础上，Angular还能把组件样式紧紧的“捆绑”在我们的组件上，以实现一种比标准样式表更加模块化的设计。

- 添加样式的方式
  - 元数据中的样式：给@Component装饰器添加一个styles数组型属性
  - 模板内联样式：放到<style>标签中来直接在 HTML 模板中嵌入样式
  - 元数据中的样式表URL：给组件的@Component装饰器中添加一个styleUrls属性来从外部CSS文件中加载样式
  - 模板中的link 标签：在组件的HTML模板中嵌入<link>标签
  - CSS@imports：利用标准的CSS@import规则来把其它CSS文件导入到我们的CSS文件中

- 控制视图的包装模式
  - 原生Native模式：使用浏览器原生的Shadow DOM实现来为组件的宿主元素附加一个Shadow DOM。组件的样式被包裹在这个Shadow DOM中
  - 仿真Emulated模式（默认值）通过预处理（并改名）CSS代码来仿真Shadow DOM的行为，以达到把CSS样式局限在组件视图中的目的（默认选项）
  - 无None：Angular不使用视图包装。Angular会把CSS添加到全局样式中。而不会应用上前面讨论过的那些局限化规则、隔离和保护等规则。 从本质上来说，这跟把组件的样式直接放进HTML是一样的

- 特殊的选择器
  - :host：使用:host伪类选择器，用来选择组件宿主元素中的元素 （相对于组件模板内部的元素）
  - :host-context：在当前组件宿主元素的祖先节点中查找CSS类， 直到文档的根节点为止

- 添加该组件样式login.style.css，如下

``` css
.login {
    padding: 200px 20px;
}

.login > form {
    border: solid 1px #999;
    padding: 20px;
    border-radius: 5px;
}
```

不得不说，ng2中组件样式的作用域仅在于该组件内，真正做到了组件的解耦。
当然，我们查看元素的时候便可以发现，ng2通过给组件设定随机的代号属性来管理每个组件的样式，如图：
![image](http://o905ne85q.bkt.clouddn.com/F11E.tmp.png)

- 参考：[组件样式](https://angular.cn/docs/ts/latest/guide/component-styles.html)

### 定义Login组件
- 在login.component.ts文件中定义Login组件

``` typescript
import { Component } from '@angular/core';

@Component({
  selector: 'login', // 设置元素选择器，<login></login>
  styleUrls: ['./login.style.css'], // 样式文件引入
  templateUrl: './login.template.html' // 模板文件引入
})
export class Login {
  // 定义并初始化用户名和密码以及其类型
  name: string = '';
  password: string = '';

  // 定义提交表单事件
  submitForm(name, password) {
    console.log(name, password);
  }
}
```

### 输出Login组件
- 在index.ts文件中，我们输出Login组件

``` typescript
export * from './login.component';
```

## 结束语
-----
本骚年也是Angular2的初体验者，如果小伙伴们有好的资源请千万千万要分享呀。
[此处查看项目代码（仅包含src部分）](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular2-notes/2-create-login)
[此处查看页面效果](http://oc8qsv1w6.bkt.clouddn.com/2-create-login/index.html)