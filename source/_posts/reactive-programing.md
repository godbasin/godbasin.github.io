---
title: 响应式编程在前端领域的应用
date: 2020-07-04 12:03:21
categories: 前端解决方案
tags: 逻辑实现
---

其实在几年前因为 Angular 的原因接触过响应式编程，而这些年的一些项目经验，让我在再次回顾响应式编程的时候又有了新的理解。

<!--more-->

# 什么是响应式编程

响应式编程基于观察者模式，是一种面向数据流和变化传播的声明式编程方式。

## 异步数据流

响应式编程常常用在异步数据流，通过订阅某个数据流，可以对数据进行一系列流式处理，例如过滤、计算、转换、合流等，配合函数式编程可以实现很多优秀的场景。

除了天然异步的前端、客户端等 GUI 开发以外，响应式编程在大数据处理中也同样拥有高并发、分布式、依赖解耦等优势，在这种同步阻塞转异步的并发场景下会有较大的性能提升，淘宝业务架构就是使用响应式的架构。

## 响应式编程在前端领域

在前端领域，常见的异步编程场景包括事件处理、用户输入、HTTP 响应等。对于这类型的数据流，可以使用响应式编程的方式来进行设计。

不少开发者基于响应式编程设计了一些工具库，包括 Rxjs、Mobx、Cycle.js 等。其中，Rxjs 提供了基于可观察对象（Observable）的 functional reactive programming 服务，Mobx 提供了基于状态管理的 transparent functional reactive programming 服务，而 Cycle.js 则是一个响应式前端框架。

我们可以结合具体场景来介绍下使用，这里会以 Rxjs 来说明。

### HTTP 请求与重试

基于响应式编程，我们可以很简单地实现一个请求的获取和自动重试：

```js
import { ajax } from "rxjs/ajax";
import { map, retry, catchError } from "rxjs/operators";

const apiData = ajax("/api/data").pipe(
  // 可以在 catchError 之前使用 retry 操作符。它会订阅到原始的来源可观察对象，此处为重新发起 HTTP 请求
  retry(3), // 失败前会重试最多 3 次
  map((res) => {
    if (!res.response) {
      throw new Error("Value expected!");
    }
    return res.response;
  }),
  catchError((err) => of([]))
);

apiData.subscribe({
  next(x) {
    console.log("data: ", x);
  },
  error(err) {
    console.log("errors already caught... will not run");
  },
});
```

### 用户输入

对应用户的一些交互，也可以通过订阅的方式来获取需要的信息：

```js
const observable = Rx.Observable.fromEvent(input, "input") // 监听 input 元素的 input 事件
  .map((e) => e.target.value) // 一旦发生，把事件对象 e 映射成 input 元素的值
  .filter((value) => value.length >= 1) // 接着过滤掉值长度小于 1 的
  .distinctUntilChanged() // 如果该值和过去最新的值相等，则忽略
  .subscribe(
    // subscribe 拿到数据
    (x) => console.log(x),
    (err) => console.error(err)
  );
// 订阅
observable.subscribe((x) => console.log(x));
```

在用户频繁交互的场景，数据的流式处理可以让我们很方便地进行节流和防抖。除此之外，模块间的调用和事件通信同样可以通过这种方式来进行处理。

## 比较其他技术

接触响应式编程这个概念的时候，大多数人都会对它产生困惑，也比较容易与 Promise、事件订阅这些设计混淆。我们来一起看看。

### Promise

Promise 相信大家也都很熟悉，在这里拿出来比较，其实更多是将 Rxjs 中的 Observable 与之比较。这两个其实很不一样：

- Promise 会发生状态扭转，状态扭转不可逆；而 Observable 是无状态的，数据流可以源源不断，可用于随着时间的推移获取多个值
- Promise 在定义时就会被执行；而 Observable 只有在被订阅时才会执行
- Promise 不支持取消；而 Observable 可通过取消订阅取消正在进行的工作

### 事件

同样是基于观察者模式，相信很多人都对事件和响应式编程之间的关系比较迷惑。而根据具体的设计实现，事件和响应式编程模式可以达到高度相似。

一个比较显著的区别在于，由于响应式编程是面向数据流和变化传播的模式，意味着我们可以对数据流进行配置处理，使其在把事件传给事件处理器之前先进行转换。同样由于流式处理，响应式编程可以把包含一堆异步/事件的组合从开头到结尾用流的操作符清晰表示，而原始事件回调只能表示一堆相邻节点的关系，对于数据流动方向和过程都可以进一步掌握。

同时，结合响应式编程的合流、缓存等能力，我们可以收获更多。

# 响应式编程提供了怎样的服务

前面说了很多，相信大家对响应式编程的概念和使用有一定的理解了。现在，我们一起来看看它还能给我们带来怎样的服务。

## 热观察与冷观察

在 Rxjs 中，有热观察和冷观察的概念。其中的区别：

- Hot Observable，可以理解为现场直播，我们进场的时候只能看到即时的内容
- Cold Observable，可以理解为点播（电影），我们打开的时候会从头播放

```js
let liveStreaming$ = Rx.Observable.interval(1000).take(5);

liveStreaming$.subscribe(
	data => console.log('subscriber from first second')
	err => console.log(err),
	() => console.log('completed')
)

setTimeout(() => {
	liveStreaming$.subscribe(
		data => console.log('subscriber from 2nd second')
		err => console.log(err),
		() => console.log('completed')
	)
}, 2000)
// 事实上两个订阅者接收到的值都是 0,1,2,3,4，此处为冷观察
```

Rxjs 中 Observable 默认为冷观察，而通过`publish()`和`connect()`可以将冷的 Observable 转变成热的：

``` js
let publisher$ = Rx.Observable.interval(1000).take(5).publish();

publisher$.subscribe(
	data => console.log('subscriber from first minute',data),
	err => console.log(err),
	() => console.log('completed')
)

setTimeout(() => {
    publisher$.subscribe(
        data => console.log('subscriber from 2nd minute', data),
        err => console.log(err),
        () => console.log('completed')
    )
}, 3000)

publisher$.connect();
// 第一个订阅者输出的是0,1,2,3,4，而第二个输出的是3,4，此处为热观察
```

热观察和冷观察根据具体的场景可能会有不同的需要，而 Observable 提供的缓存能力也能解决不少业务场景。例如，如果我们想要在拉群后，自动同步之前的聊天记录，通过冷观察就可以做到。同样的，热观察的用途也很广泛。

## 合流
流的处理大概是响应式编程中最有意思的部分了。一般来说，合流有两种方式：

``` bash
# 1. merge
--1----2-----3--------4---
----a-----b----c---d------
           merge
--1-a--2--b--3-c---d--4---

# 2. combine
--1----2-----3--------4---
----a-----b-----c--d------
         combine
----1a-2a-2b-3b-3c-3d-4d--
```

那这样的合流方式，可以具体应用到哪里呢？

例如，merge 的合流方式可以用在群聊天、聊天室，一些多人协作的场景、公众号订阅的场景就可以通过这样的方式合流，最终按照顺序地展示出对应的操作记录。

再举个例子，我们在 Excel 中，通过函数计算了 A1 和 B2 两个格子的相加。这种情况下，使用 combine 方式合流符合预期，那么我们可以订阅这么一个流：

``` js
const streamA1 = Rx.Observable.fromEvent(inputA1, "input"); // 监听 A1 单元格的 input 事件
const streamB2 = Rx.Observable.fromEvent(inputB2, "input"); // 监听 B2 单元格的 input 事件

const subscribe = combineLatest(streamA1, streamB2).subscribe((valueA1, valueB2) => {
	// 从 streamA1 和 streamB2 中获取最新发出的值
    return valueA1 + valaueB2;
});
// 获取函数计算结果
observable.subscribe((x) => console.log(x));
```

在一个较大型的前端应用中，通常会拆分成渲染层、数据层、网络层、其他服务等多个功能模块。虽然服务按照功能结构进行拆分了，但依然会存在服务间调用导致依赖关系复杂、事件触发和监听满天飞等情况，这种情况下，只能通过全局搜索关键字来找到上下游数据流、信息流，通过一个接一个的节点和关键字搜索才能大概理清楚某个数据来源哪里。

那么，如果使用了响应式编程，我们可以通过各种合流的方式、订阅分流的方式，来将应用中的数据流动从头到尾串在一起。这样，我们可以很清晰地当前节点上的数据来自于哪里，是用户的操作还是来自网络请求。

## 其他使用方式
除了上面提到的一些 HTTP 请求、用户操作、事件管理等可以使用响应式编程的方式来实现，我们还可以将定时器、数组/可迭代对象变量转换为可观察序列。

### timer
也就是说，如果我们界面中有个倒计时，就可以以定时器为数据源，订阅该数据流进行响应：

``` js
// timerOne 在 0 秒时发出第一个值，然后每 1 秒发送一次
const timerOne = timer(0, 1000).subscribe(x => {
	// 触发界面更新
});
```

定时器结合合流的方式，我们还可以玩出更多的花样。例如，界面中有三个倒计时，我们需要在倒计时全部结束之后展示一些内容，这个时候我们就可以通过将三个倒计时 combine 合流，当三个流都处于倒计时终止的状态时，触发相应的逻辑。

### 数组/可迭代对象
我们可以将数组或者可迭代的对象，转换为可观察的序列。

``` js
var array = [1,2,3,4,5];

// 打印出每个项目
const subscription = Rx.Observable.from(array).subscribe(
	x => console.log('onNext: %s', x),
    e => console.log('onError: %s', e),
	() => console.log('onCompleted')
);

// => onNext: 1
// => onNext: 2
// => onNext: 3
// => onNext: 4
// => onNext: 5
// => onCompleted
```

乍一看，似乎只是将遍历换了种写法，其实这样的能力可以用在更多的地方。例如，我们在离线编辑文档的时候，做了很多操作，这些操作在本地会用一个操作记录数组的方式缓存下来。当应用检测到网络状态恢复的时候，可以将这样的操作组转换为有序的一个个操作同步到远程服务器。（当然，更好的设计应该是支持批量有序地上传操作到服务器）

# 结束语
对响应式编程的介绍暂告一段落。

可见对于很多复杂程度较低的前端应用来说，其实入门成本比较高。但在一些复杂应用的场景，合理地使用响应式编程，可以有效地降低各个模块间的依赖，更加容易地进行整体数据流动管理和维护。

这么有意思的东西，你要不要来试试看？


