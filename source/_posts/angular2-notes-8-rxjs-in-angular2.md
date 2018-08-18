---
title: Angular2使用笔记8--在Angular2中使用Observable对象
date: 2016-11-06 09:46:47
categories: angular2火锅
tags: 笔记
---
最近在学习Angular2作为前端的框架，《Angular2使用笔记》系列用于记录过程中的一些使用和解决方法。
本文介绍Observor、Subject相关，以及在Angular2中Http服务以及Observable对象的使用。
<!--more-->

## 认识Rxjs
-----
可能比较多的java小伙伴会比较熟悉吧，rx这个东西。不知不觉前端又把各种精华吸取进来了呢。哈哈。
### Rxjs基本概念
- Observable(可观察对象) : 是一个包含来自未来、可以被使用的值(value)或事件(event)的集合
- Observe(观察者)：是一个知道如何监听、处理来自Obervable的值的函数集合 
- Subscription(订阅)：代表着Observable的执行动作，我们可以使用它来停止Obervable继续执行
- Operators(操作)：一系列可以操作集合的pure function，像是过滤(filter)、转换(map)等等
- Subject：相当于一个事件发射器，是唯一能够向多个Observer广播值(value)的唯一手段
- Schedulers(调度)：是一个中央调度员，帮助我们控制并发，协调计算(setTimeout、requestAnimationFrame等)

这里我们重点介绍一下Observable和Subject，其他的Observer、Subscription等都相对比较简单。

### Observable(可观察对象)
Observable（可观察对象）是基于推送（Push）运行时执行（lazy）的多值集合。

- 拉取(Pull)和推送(Push)
拉取和推送是数据生产者和数据消费者之间通信的两种不同机制。
  - 拉取：在拉取系统中，总是由消费者决定何时从生产者那里获得数据。生产者对数据传递给消费者的时间毫无感知（被动的生产者，主动的消费者）
  - 推送：在推送系统中生产者决定何时向消费者传递数据，消费者对何时收到数据毫无感知（被动的消费者）

- js中的Promise和Observable
  - 现代JavaScript中Promise是典型的推送系统。作为数据生产者的Promise通过resolve()向数据消费者——回调函数传递数据：与函数不同，Promise决定向回调函数推送值的时间
  - RxJS在JavaScript中引入了Observable(可观察对象)这个新的推送系统。Observable是多数据值的生产者，向Observer(被动的消费者)推送数据

- Observable与函数、promsise
  - 函数是当调用才同步计算，并最终只返回一个值的
  - promise是会或者不会返回一个值
  - Observable是当调用才同步或者异步地计算，并可能产生0到无穷多个值的

- Observable是函数概念的拓展
  - Observable就像一个没有参数的函数，并不断生成一些值供我们使用，因此它也像是一个事件发射机(EventEmitters)
  - 在Observable中subscribe就像call一个函数，你订阅它，它才会被'启动'。同一个Observable对于不同的subscribe，是不会共享结果的(通常情况下这样子的，但可以通过调用api来共享)

### Observable四大核心
- 创建
  - Rx.Observable.create是Observable构造函数的别名，接受一个参数：subscribe函数
  - 除了使用create创建Observable，我们通常还使用创建操作符, 如of，from，interval,等来创建Observable
- 订阅
  - observable.subscribe和Observable.create(function subscribe(observer) {...})中的subscribe不是同一个对象，但在工程中可以在概念上视两者为等价物
  - 调用subscribe的观察者并不会共享同一个Observable
  - 订阅机制与处理事件的addEventListener/removeEventListenerAPI完全不同。通过observable.subscribe，观察者并不需要在Observable中进行注册，Observable也不需要维护订阅者的列表
  - 订阅后便进入了Observable的执行阶段，在执行阶段值和事件将会被传递给观察者供其消费
- 执行
  - 只有在被订阅之后Observable才会执行，执行的逻辑在Observable.create(function subscribe(observer){...})中描述，执行后将会在特定时间段内，同步或者异步地成产多个数据值
  - Observable在执行过程中，可以推送三种类型的值：
    - "Next" 通知： 实际产生的数据，包括数字、字符串、对象等
    - "Error" 通知：一个JavaScript错误或者异常
    - "Complete" 通知：一个不带有值的事件
  - 在Observable的执行过程中，0个或者多个“Next”通知会被推送
  - 在错误或者完成通知被推送后，Observable不会再推送任何其他通知
- 终止
  - Observable的执行可能是无限的，作为观察者需要主动中断执行：我们需要特定的API去终止执行过程
  - 因为特定的观察者都有特定的执行过程，一旦观察者获得想要的数据后就需要终止执行过程以免带来计算时对内存资源的浪费
  - 在observable.subscribe被调用时，观察者会与其执行作用域绑定，同时返回一个Subscription类型的对象，通过调用subscription.unsubscribe()你可以终止执行过程

### 参考
对于Observable和Subject的理解很多时候我也是从网上读到的呢，所以可能本篇博客相对来说粘贴别人的东西会比较多吧。
[《RxJs 核心概念之Observable》](https://segmentfault.com/a/1190000005051034)
[《不要把Rx用成Promise》](https://zhuanlan.zhihu.com/p/20531896)
[RxJS4.0](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api)

## 使用Observable
---
这里我们创建一个Other页面组件，用于展示通过Angular的Http服务返回的Observable对象中获取的数据。
### 创建Other组件
- 在app.routes.ts文件中添加该页面路由

``` typescript
export const routes: RouterConfig = [
  ... // 其他路由
  { path: 'other',  component: Other }
];
```

- 新建other文件夹
- 添加组件模板other.template.ts

``` typescript
<!--插入头部组件，注入指令后生效-->
<my-header></my-header>
<div class="container">
    <h3>RxJS相关</h3>
    <table class="table">
        <tbody>
            <tr *ngFor="let item of rxjsDate">
                <td>
                    <h4>{{ item.name }} : </h4>
                    <h5>{{ item.content }}</h5>
                </td>
            </tr>
        </tbody>
    </table>
</div>
```

- other文件夹下index.ts中输出组件

``` typescript
import { Component } from '@angular/core';
// 添加Header组件，默认从header文件夹的index.ts中获取
import { Header } from '../header';

@Component({
  selector: 'other', // 设置模板元素
  templateUrl: './other.template.html', // 模板文件引入
  directives: [Header] // 注入指令
})
export class Other {
  // 定义并初始化数据
  rxjsDate: Array<any> = [];
}
```

### 创建获取数据的Http服务
这里我们把该服务写在other.service.ts文件中。
``` typescript
// 获取Injectable服务
import { Injectable } from '@angular/core';
// 获取Http服务
import { Http, Response } from '@angular/http';
// 获取Observable服务
import { Observable } from 'rxjs/Observable';
// 获取rxjs相关操作服务（map等）,后面我们会提到
import '../rxjs-operators';

@Injectable()
export class OtherService {
  // 注入Http服务
  constructor(public http: Http) {}
  // 设置获取数据的地址，这里我们使用本地的json文件模拟
  private dataUrl: string = 'app/info.json';

  // 定义方法，用于获取Observable服务
  getDatas(): Observable<any> {
    // 使用angular的http服务获取数据，默认返回observable
    return this.http.get(this.dataUrl)
      // 响应数据是JSON字符串格式的。 我们必须把这个字符串解析成JavaScript对象
      .map(res => res.json().data)
      // 异常的捕获并进行处理
      .catch(this.handleError);
  }

  // 定义私有方法来处理异常
  private handleError(error: any) {
    // 我们的服务处理器(handleError)把响应对象记录到控制台中
    // 把错误转换成对用户友好的消息，并且通过Observable.throw来
    // 把这个消息放进一个新的、用于表示“失败”的可观察对象
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // 输出异常信息
    return Observable.throw(errMsg);
  }
}
```
- 关于rxjs相关操作符
RxJS("Reactive Extensions"的缩写)是一个被Angular认可的第三方库，它实现了异步可观察对象(asynchronous observable)模式。

Angular在rxjs/Observable模块中导出了一个精简版的Observable 类，这个版本缺少很多操作符。

我们将一个一个的导入Observable的操作符和静态类方法，直到我们得到了一个精确符合我们需求的自定义Observable实现。 我们将把这些import语句放进一个app/rxjs-operators.ts文件里。
``` typescript
// import 'rxjs/Rx'; 
// adds ALL RxJS statics & operators to Observable

// See node_module/rxjs/Rxjs.js
// Import just the rxjs statics and operators we need for THIS app.

// Statics
import 'rxjs/add/observable/throw';

// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
```

### 在Other组件中注入相关服务并使用
``` typescript
... // 添加其他服务

// 添加OtherService服务，用来获取数据
import { OtherService } from './other.service';

@Component({
  ... // 其他元数据
  providers:[OtherService] // 实例化服务
})

export class Other {
  ...

  // 注入服务
  constructor(private otherService: OtherService) {}

  ngOnInit() {
    // 获得Obervable对象并进行订阅
    this.otherService.getDatas().subscribe(
      // 获取数据并保存在this.rxjsDate中
      datas => this.rxjsDate = datas,
      // 获取错误信息并保存在this.errorMessage中
      error => this.errorMessage = <any>error);
  }
}
```

页面如下：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/E597.tmp.png)

### 倒退为承诺(Promise)
Angular的http客户端API返回的是Observable<Response>类型的对象，但我们也可以把它转成Promise。

这很容易，并且在简单的场景中，一个基于承诺(Promise)的版本看起来很像基于可观察对象(Observable)的版本。

- 把可观察对象转变成承诺，调用toPromise(success, fail)

``` typescript
return this.http.get(this.dataUrl)
       .toPromise()
       .then(this.extractData)
       .catch(this.handleError);
```

- 对调用方组件进行调整，让它期待一个Promise而非Observable，调用这个返回的承诺的then方法，而不再是subscribe

``` typescript
this.otherService.getDatas().then(
     datas => this.rxjsDate = datas,
     error => this.errorMessage = <any>error);
}
```

## 结束语
-----
从刚开始接触http服务，到ajax，然后是Promise，如今发现还有个Observable。
不得不说，前端发展真的很快呢，不断地幻化，然后大步往前。这种不断自我演进的属性真的捕获了本骚年的心呢。
[此处查看项目代码（仅包含src部分）](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular2-notes/8-rxjs-in-angular2)
[此处查看页面效果](http://oc8qsv1w6.bkt.clouddn.com/8-rxjs-in-angular2/index.html#/other)