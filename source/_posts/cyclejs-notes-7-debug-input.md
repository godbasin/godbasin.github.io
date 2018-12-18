---
title: Cycle.js学习笔记7--定位Input组件值获取bug
date: 2017-10-03 23:06:57
categories: cyclejs哈根达斯
tags: 笔记
---
因为对Rxjs的好感玩上了Cycle.js，《Cycle.js学习笔记》系列用于记录使用该框架的一些笔记。
本文将继续针对第四节中未完成的input值获取进行debug，详细记录debug过程。
<!--more-->

## Input获取value
---
这里我们可以先回放第四节--[《Cycle.js学习笔记4--使用Class和装饰器》](https://godbasin.github.io/2017/09/08/cyclejs-notes-4-use-class-build-input/)。

### Input Class
我们使用Class建立的Input组件是酱紫的：

``` js
import xs from 'xstream';
import { run } from '@cycle/run';
import { makeDOMDriver } from '@cycle/dom';

// id主要是用来注册多个Input的时候抓取到对应的id
// 有点简陋，但木有关系啦
let id = 0;

export class InputComponent{
  DOM;
  value;
  constructor(domSources, type){
    // value
    const inputValue$ = domSources.select('#input' + id).events('keyup')
      .map(ev => {console.log(ev.target.value); return ev.target.value}).startWith('')
    // dom
    const input$ = inputValue$.map(val => {
      return <input type={type} id={'input' + id++} className="form-control" value={val} />
    })
    this.DOM = input$
    this.value = inputValue$
  }
}
```

### 使用InputComponent
我们希望通过`new InputComponent`的方式来注册这样一个双向绑定的`Input`，第四节中，我们的结果是，每次只有第一次监听和更新状态是生效的。

这里我们通过对比的方式来进行debug：

``` js
export function LoginComponent(sources) {
    const domSource = sources.DOM;

    // 登录点击和路由切换
    const loginClick$ = domSource.select('#submit').events('click')

    // 手动获取的Input值
    const inputValue$ = domSource.select('#uname').events('keyup')
        .map(ev => { console.log(ev.target.value); return ev.target.value }).startWith('')

    // 通过InputComponent注册的Input和值
    const pwdInputSource = new InputComponent(domSource, 'password')
    const pwdInputDOM$ = pwdInputSource.DOM
    const pwdInputValue$ = pwdInputSource.value

    // 合流生成最终DOM流
    const loginView$ = xs.combine(inputValue$, pwdInputDOM$, pwdInputValue$).map(([inputValue, pwdDOM, pwdValue]) => {
        return (
            <form>
                <h1>System</h1>
                <div>
                    <input type="text" id="uname" className="form-control" value={inputValue} />
                </div>
                {inputValue}
                <div>
                    {pwdDOM}
                </div>
                {pwdValue}
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

很明显，手动获取的`inputValue`能响应input更新状态，但通过`InputComponent`注册的Input和值只有第一次才能更新状态。

开始的时候，本骚年一直以为是Driver驱动的问题，但是这样对比一看，原因一下子出来了[捂脸]：
因为每次更新状态后，`pwdDOM`的值更新了，虽然生成一个完全一样的input，但是由于是个变量，因此每次都是移除重新种植。

故原有的input被移除，连同在它上面绑定的监听事件一起。

### 实现
要拿到Input的实时value，本骚年想到了三种方法：
1. 只针对`value`进行绑定，即手动获取的Input值，并且手动写DOM。
2. 不更新`InputComponent`的基本DOM，只更新里面的value。
3. 将输入和输出拆离，也就是设置输入，以及将状态更新流出。

第一种方法，写了跟没写似的，没多少用处，故我们直接略过实现第二种吧。

第二种方法，我们要实现除了初始化之外，每次更新值不更新对应的DOM，其实也没有多难，我们可以通过缓存的方式来进行：
- 初始化的时候缓存DOM。
- 每次更新获取DOM并更新值。

其实这跟很多的框架是一样的，像Angular、React、Vue等，无非是实现虚拟DOM、或者其他方式的diff过程。
具体大家可以翻阅不同代码的源码，这里就不多说了。有个React的虚拟DOM实现文章可以参考：[《深度剖析：如何实现一个 Virtual DOM 算法》](https://github.com/livoras/blog/issues/13)。

好吧，我们来做第三种。

## 输入设置和输出更新
---

### 输入输出与双向绑定
其实双向绑定无非是个输入设置和输出更新的语法糖，像Angular里面就是：

``` html
<!--双向绑定 ( [(...)] ) -->
<my-sizer [(size)]="fontSizePx"></my-sizer>

<!--双向绑定=属性绑定+事件绑定-->
<my-sizer [size]="fontSizePx" (sizeChange)="fontSizePx=$event"></my-sizer>
```

这里我们的Input则会有三种方法：
1. 获取DOM。
2. 设置DOM的value。
3. 获取DOM的value。

### 实现输入设置和输出更新
我们根据上面的想法，初步预设这样的思路：
- `set value`：该流将作为DOM的源，可更新DOM值
- `get value`：该流以DOM为源，更获取DOM的更新
- `dom`：以`set value`为源，且为`get value`的源

这样我们其实可以脱离调用者的`sources`了，初步实现：

``` js
let id = 0;

@bindMethods
export class InputComponent {
  id;
  DOM;
  inputGet;
  inputSet;
  constructor(domSource, type) {
    this.id = id++
    // 给设置值预留，初始化流为undefined
    this.inputSet = xs.of(undefined)
    
    // 接上设置流
    this.DOM = xs.merge(this.inputSet).map(val => 
      <input type={type} id={'input' + this.id} className="form-control" value={val} />
    )

    // 获取对应的值
    this.inputGet = domSource.select('#input' + this.id).events('keyup')
      .map(ev => { console.log(ev.target.value); return ev.target.value }).startWith('')
        
  }
  getDOM(){
    return this.DOM
  }
  getValue(){
    return this.inputGet
  }
  setValue(val){
    // 待实现
  }
}
```

这里我们将流的入口流和出口流拆开了，这样就能拿到每次input更新的流了。至于设置值的方法还没想好，应该可以参考参考Driver的设计。

这次我们能正常获取手动设置的input，以及通过注册设置的input的值啦。

## 结束语
-----
这节主要围绕上一次的无法获取到input更新值的问题，进行debug并解决。
但目前还木有完全实现双向绑定，其中缺了一个就是`set value`的实现，这块我们后面可以跟driver驱动一起讲。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/cyclejs-notes/7-debug-input)
[此处查看页面效果](http://cyclejs-notes.godbasin.com/7-debug-input/index.html)