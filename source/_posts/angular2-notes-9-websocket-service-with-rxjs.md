---
title: Angular2使用笔记9--使用Subject创建Websocket服务
date: 2016-11-12 10:16:04
categories: angular2火锅
tags: 笔记
---
最近在学习Angular2作为前端的框架，《Angular2使用笔记》系列用于记录过程中的一些使用和解决方法。
本文在Angular2中使用Subject创建Websocket服务的过程。
<!--more-->

关于RxJS的Observable相关的请移步上一篇[《在Angular2中使用Observable对象》](/2016/11/06/angular2-notes-8-rxjs-in-angular2/)。

## 认识Subject
-----
### Subject
在RxJS中，Subject是一类特殊的Observable，它可以向多个Observer多路推送数值。普通的Observable并不具备多路推送的能力（每一个Observer都有自己独立的执行环境），而Subject可以共享一个执行环境。

Subject是一种可以多路推送的可观察对象。与EventEmitter类似，Subject维护着自己的Observer。

每一个Subject都是一个Observable（可观察对象）对于一个Subject，你可以订阅（subscribe）它，Observer会和往常一样接收到数据。从Observer的视角看，它并不能区分自己的执行环境是普通Observable的单路推送还是基于Subject的多路推送。

Subject的内部实现中，并不会在被订阅（subscribe）后创建新的执行环境。它仅仅会把新的Observer注册在由它本身维护的Observer列表中，这和其他语言、库中的addListener机制类似。

每一个Subject也可以作为Observer（观察者）Subject同样也是一个由next(v)，error(e)，和complete()这些方法组成的对象。调用next(theValue) 方法后，Subject会向所有已经在其上注册的Observer多路推送theValue。

- BehaviorSubject
BehaviorSubject是Subject的一个衍生类，具有“最新的值”的概念。它总是保存最近向数据消费者发送的值，当一个Observer订阅后，它会即刻从BehaviorSubject收到“最新的值”。

- ReplaySubject
ReplaySubject如同于BehaviorSubject是Subject 的子类。通过 ReplaySubject可以向新的订阅者推送旧数值，就像一个录像机 ReplaySubject可以记录Observable的一部分状态（过去时间内推送的值）。一个ReplaySubject 可以记录Observable执行过程中推送的多个值，并向新的订阅者回放它们。

- AsyncSubject
AsyncSubject是Subject的另外一个衍生类，Observable仅会在执行完成后，推送执行环境中的最后一个值。

### 参考
上面的内容都是从下面这篇文章里面粘贴过来的，该文章还有一些比较详细的例子，这里就不放出来，有兴趣的小伙伴自行进入呀。
[《RxJS 核心概念之Subject》](http://www.open-open.com/lib/view/open1462525661610.html)

## 使用Subject创建Websocket服务
---
上面也说过，Subject可以向多个Observer多路推送数值，这样的方式很适合用来写websocket的订阅呢。

### 注入相关的服务
``` typescript
// 注入Rx对象
import * as Rx from 'rxjs/Rx';
import {Injectable} from '@angular/core';
```

### 创建Subject
``` typescript
// 创建websocket对象
let ws = new WebSocket(this.wsUrl);
// 创建Observable对象
let observable = Rx.Observable.create(
	(obs: Rx.Observer < any > ) => {
		// 当websocket获得推送内容的时候，调用next方法，并传入推送内容
        ws.onmessage = obs.next.bind(obs);
		// 当websocket出错的时候，调用error方法，并传入失败信息
		ws.onerror = obs.error.bind(obs);
		// 当websocket关闭的时候，调用complete方法
		ws.onclose = obs.complete.bind();
		return ws.close.bind(ws);
	}
);
// 创建observer对象，用于向websocket发送信息
let observer = {
	next: (value) => {
		if (ws.readyState === WebSocket.OPEN) {
			ws.send(value.toString());
		}
	},
};
// 使用Rx.Subject.create创建Subject对象
return Rx.Subject.create(observer, observable);
```

### 创建完整的websocket服务
``` typescript
Injectable()
export class WsService {
    // 定义websocket服务地址，这里由于是同一个websocket，故在服务中写死
    wsUrl: string = 'ws://ip:port/websocket';
    // 用于保存当前subject对象
    subject: Rx.Subject<any>;
    // 用于保存当前subject对象publish后返回的可观察对象
    publish: Rx.ConnectableObservable<any>;
    num: number = 0;

    private create(): Rx.Subject<any>{
        // 创建websocket对象
        let ws = new WebSocket(this.wsUrl);
        // 创建Observable对象
        let observable = Rx.Observable.create(
            (obs: Rx.Observer<any>) => {
                // 当websocket获得推送内容的时候，调用next方法，并传入推送内容
                ws.onmessage = obs.next.bind(obs);
                // 当websocket出错的时候，调用error方法，并传入失败信息
                ws.onerror = obs.error.bind(obs);
                // 当websocket关闭的时候，调用complete方法
                ws.onclose = obs.complete.bind();
                return ws.close.bind(ws);
            }
        );
        // 创建observer对象，用于向websocket发送信息
        let observer = {
            next: (value) => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(value.toString());
                }
            },
        };
        // 使用Rx.Subject.create创建Subject对象
        return Rx.Subject.create(observer, observable);
    }

    // 获取subject对象接口
    getSubject() {
      if (!this.subject) {
        this.subject = this.create();
      }
      return this.subject;
    }

    // 获取publish对象接口
    getPublish() {
        if (!this.publish) {
            this.publish = this.subject.publish();
        }
        return this.publish;
    }
}

```

### 使用服务订阅websocket的推送消息
注入、实例化和获取服务这些我在这里就不详细讲啦，直接说明一下怎样使用。
``` typescript
// 获得可观察对象
this.wsPublish = this.monitorWsService.getPublish();
// 订阅消息，并保存到this.response中
this.wsPublish.subscribe(res => this.response);
// 使用connect进行连接
this.wsPublish.connect();
```
之前本骚年也一直在调试这个代码，总是无法多个地方同时订阅，最后是在一篇RxJava的issue里面看到publish和connect的两个方法相关，才知道怎么使用。
毕竟在Rx发布的文档里面也没找到呢。

### 使用服务向websocket推送消息
同上，在这里直接贴上使用的代码。
``` typescript
// 获得subject对象
this.wsSubject = this.monitorWsService.getSubject();
// 调用next方法向websocket发送消息
this.wsSubject.next('pitpat');
```

到这里，我们的websocket服务已经是可用的啦。不过使用的时候要注意angular2中依赖注入以及服务实例化、组件树这些呢，如果要多个组件使用同一个服务，就需要是同一个实例化的服务啦。

### 参考
这里很大程度上参考了歪果仁的[《WebSockets with Angular2 and RxJS》](https://medium.com/@lwojciechowski/websockets-with-angular2-and-rxjs-8b6c5be02fac#.bxql1v9b5)。

## 结束语
-----
在使用Angular2的过程中，接触到了很多新的东西，像Observable、Subject等等，用不一样的方法编写一样的服务，其实也是个很有意思的事情呢，对于思维的拓展和转换很有帮助哟。