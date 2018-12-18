---
title: Cycle.js学习笔记8--双向绑定Input值
date: 2017-10-07 19:30:33
categories: cyclejs哈根达斯
tags: 笔记
---
因为对Rxjs的好感玩上了Cycle.js，《Cycle.js学习笔记》系列用于记录使用该框架的一些笔记。
本文我们从了解Driver驱动开始，完成Input值的设置`set value`，然后实现Input的双向绑定。
<!--more-->

## Input输入流
---
有小伙伴们把Cycle.js翻译中文了，大家可以看看[中文文档](http://cyclejs.cn/)。

### Driver驱动
这里我们先来看看什么是Driver。
Driver其实是一些函数，它用来监听输入流，然后执行必要的副作用操作，最后可能会返回输出流。

至于抽象想象什么的，本骚年已经在[《Cycle.js学习笔记5--关于框架设计和抽象》](https://godbasin.github.io/2017/09/16/cyclejs-notes-5-design-and-abstraction/)中发挥过脑洞的力量了。

Driver应该始终与某些`I/O effect`联系在一起。
大多数Driver，比如`DOM Driver`，以`sink`（为了描述`write`）作为输入，以`source`（为了捕获`read`）作为输出。

像我们要实现一个Websocket的Driver：

``` js
import {adapt} from '@cycle/run/lib/adapt';

function makeSockDriver(peerId) {
  let sock = new Sock(peerId);

  function sockDriver(outgoing$) {
    // 添加流监听
    outgoing$.addListener({
      next: outgoing => {
        sock.send(outgoing));
      },
      error: () => {},
      complete: () => {},
    });

    // 创建流
    const incoming$ = xs.create({
      start: listener => {
        sock.onReceive(function (msg) {
          listener.next(msg);
        });
      },
      stop: () => {},
    });

    return adapt(incoming$);
  }

  return sockDriver;
}
```

### 实现流创建和监听
我们希望能通过`set value`的方式注入流，我们可以创建一个流，然后调用监听器：
1. 创建流，提取出监听器。
2. 将1步骤创建的流作为输入更新Input的value。
3. 在调用`setValue()`方法时触发监听器。
4. 将Input的`change`或者`keyup`事件流，合并3步骤更新的流，作为输出。

我们大概能得到这样一个Input：

``` js
@bindMethods
export class InputComponent {
  id;
  listener;
  DOM;
  inputGet;
  inputSet;
  constructor(domSource, type) {
    this.id = id++;

    // 初始化流，并提取出监听器
    this.inputSet = xs.create({
      start: listener => {
        this.listener = listener;
      },
      stop: () => {},
    }).startWith(undefined);

    // 接上设置流
    this.DOM = xs.merge(this.inputSet).map(val =>
      <input type={type} id={'input' + this.id} className="form-control" value={val} />
    );

    // 合并输入流和源流，然后输出更新值
    this.inputGet = xs.merge(domSource.select('#input' + this.id).events('keyup')
    .map(ev => ev.target.value), this.inputSet).startWith('');
  }
  getDOM() {
    return this.DOM;
  }
  getValue() {
    return this.inputGet;
  }
  setValue(val) {
    // 触发监听器
    this.listener.next(val);
  }
}
```

### 检验实现
检验的时候到了，我们通过设置一个定时器，触发Input输入的自动更新，当然，你也可以自己手动输入验证。

``` js
export function LoginComponent(sources) {
    const domSource = sources.DOM;

    // 登录点击和路由切换
    const loginClick$ = domSource.select('#submit').events('click')

    // 通过InputComponent注册的Input和值
    const unameInputSource = new InputComponent(domSource, 'text')
    const unameInputDOM$ = unameInputSource.getDOM()
    const unameInputValue$ = unameInputSource.getValue()

    // 设计一个定时器，每秒自增1，并输入到username的input
    let a = 1;
    setInterval(() => {
        unameInputSource.setValue(a++);
    }, 1000);

    // 合流生成最终DOM流
    const loginView$ = xs.combine(unameInputDOM$, unameInputValue$).map(([unameDOM, unameValue]) => {
        return (
            <form>
                <h1>System</h1>
                <div>
                    {unameDOM}
                </div>
                {unameValue}
                <div>
                    <a className="btn btn-default" id="submit">Login</a>
                </div>
            </form>
        )
    }
    );
    return {
        DOM: loginView$,
        router: loginClick$.mapTo("/app")
    };
}
```

### 双向绑定
我们能看到，在定时器的作用下，Input值每秒自增，同时获取到的值也触发更新。
当我们讲输入和输出连接到一起的时候，我们就实现了简单的双向绑定。前面也说过了，双向绑定只是个语法糖而已，拆开来说也就是能设置输入，并获取输出。

这时候，我们巧妙地使用`get`和`set`，就可以实现双向绑定：

``` js
@bindMethods
export class InputComponent {
  // 其他没有改变
  // 将 getValue 和 setValue 调整为 get 和 set 的方式
  get value() {
    return this.inputGet;
  }
  set value(val) {
    // 触发监听器
    this.listener.next(val);
  }
}
```

这样，我们在使用的时候：

``` js
export function LoginComponent(sources) {
  // ...其他

  // 通过InputComponent注册的Input和值
  const unameInputSource = new InputComponent(domSource, 'text')
  const unameInputDOM$ = unameInputSource.getDOM()
  // 通过获取值的方式
  const unameInputValue$ = unameInputSource.value

  // 设计一个定时器，每秒自增1，并输入到username的input
  let a = 1;
  setInterval(() => {
    // 通过设置的方式
    unameInputSource.value = a++;
  }, 1000);
}
```

塔嗒！是不是好了。

## 结束语
-----
这节主要简单（真的很简单）介绍了驱动Driver，并成功地完成了之前没有完成的部分，完成Input的输入，并将Input的输入和输出衔接在一起，对外呈现出一种双向绑定的方式。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/cyclejs-notes/8-two-way-binding)
[此处查看页面效果](http://cyclejs-notes.godbasin.com/8-two-way-binding/index.html)