---
title: 前端性能优化--卡顿的监控和定位
date: 2024-01-21 21:21:06
categories: 前端解决方案
tags: 性能优化
---

卡顿大概是前端遇到的问题的最棘手的一个，尤其是卡顿产生的时候常常无法进行其他操作，甚至控制台也打开不了。

<!--more-->

但是这活落到了咱们头上，老板说啥就得做啥。能本地复现的我们还能打开控制台，打个断点或者录制 Performance 来看看到底哪些地方占用较大的耗时。如果没法本地复现呢？

## 卡顿检测

首先，我们来看看可以怎么主动检测卡顿的出现。

卡顿，顾名思义则是代码执行产生长耗时，导致浏览器无法及时响应用户的操作。那么，我们可以基于不同的方案，来监测当前页面响应的延迟。

### Worker 心跳方案

对应浏览器来说，由于 JavaScript 是单线程的设计，当卡顿发生的时候，往往是由于 JavaScript 在执行过长的逻辑，常见于大量数据的遍历操作，甚至是进入死循环。

利用这个特效，我们可以在页面打开的时候，就启动一个 Worker 线程，使用心跳的方式与主线程进行同步。假设我们希望能监测 1s 以上的卡顿，我们可以设置主线程每间隔 1s 向 Worker 发送心跳消息。（当然，线程通讯本身需要一些耗时，且 JavaScript 的计时器也未必是准时的，因此心跳需要给予一定的冗余范围）

由于页面发生卡顿的时候，主线程往往是忙碌状态，我们可以通过 Worker 里丢失心跳的时候进行上报，就能及时发现卡顿的产生。

但是其实 Worker 更多时候用于检测网页崩溃，用来检测卡顿的效果其实还不如使用`window.requestAnimationFrame`，因为线程通信的耗时和延迟导致该方案不大准确。

### window.requestAnimationFrame 方案

前面[前端性能优化--卡顿篇](https://godbasin.github.io/2022/06/04/front-end-performance-no-responding/)有简单提到一些卡顿的检测方案，市面上大多数的方案也是基于`window.requestAnimationFrame`方法来检测是否有卡顿出现。

`window.requestAnimationFrame()`会在浏览器下次重绘之前调用，常常用来更新动画。这是因为`setTimeout`/`setInterval`计时器只能保证将回调添加至浏览器的回调队列(宏任务)的时间，不能保证回调队列的运行时间，因此使用`window.requestAnimationFrame`会更合适。

通常来说，大多数电脑显示器的刷新频率是 60Hz，也就是说每秒钟`window.requestAnimationFrame`会被执行 60 次。因此可以使用`window.requestAnimationFrame`来监控卡顿，具体的方案会依赖于我们项目的要求。

比如，有些人会认为[连续出现 3 个低于 20 的 FPS 即可认为网页存在卡顿](https://zhuanlan.zhihu.com/p/39292837)，这种情况下我们则针对这个数值进行上报。

除此之外，假设我们认为页面中存在超过特定时间（比如 1s）的长耗时任务即存在明显卡顿，则我们可以判断两次`window.requestAnimationFrame`执行间超过一定时间，则发生了卡顿。

使用`window.requestAnimationFrame`监测卡顿需要注意的是，他是一个被十分频繁执行的代码，不应该处理过多的逻辑。

### Long Tasks API 方案

熟悉前端性能优化的开发都知道，阻塞主线程达 50 毫秒或以上的任务会导致以下问题：

- 可交互时间（TTI）延迟
- 严重不稳定的交互行为 (轻击、单击、滚动、滚轮等) 延迟
- 严重不稳定的事件回调延迟
- 紊乱的动画和滚动

因此，W3C 推出 [Long Tasks API](https://w3c.github.io/longtasks/)。长任务（Long task）定义了任何连续不间断的且主 UI 线程繁忙 50 毫秒及以上的时间区间。比如以下常规场景：

- 长耗时的事件回调
- 代价高昂的回流和其他重绘
- 浏览器在超过 50 毫秒的事件循环的相邻循环之间所做的工作

> 参考 [Long Tasks API -- MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceLongTaskTiming)

我们可以使用`PerformanceObserver`这样简单地获取到长任务：

```js
var observer = new PerformanceObserver(function (list) {
  var perfEntries = list.getEntries();
  for (var i = 0; i < perfEntries.length; i++) {
    // 分析和上报关键卡顿信息
  }
});
// 注册长任务的观察
observer.observe({ entryTypes: ["longtask"] });
```

相比`requestAnimationFrame`，使用 Long Tasks API 可避免调用过于频繁的问题，并且`performance timeline`的任务优先级较低，会尽可能在空闲时进行，可避免影响页面其他任务的执行。但需要注意的是，该 API 还处于实验性阶段，兼容性还有待完善，而我们卡顿常常发生在版本较落后、性能较差的机器上，因此兜底方案也是十分需要的。

### PerformanceObserver 卡顿检测

前面也提到，卡顿产生于用户操作后网页无法及时响应。根据这个原理，我们可以使用`PerformanceObserver`监听用户操作，检测是否产生卡顿：

```js
new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    const duration = entry.duration;

    const delay = entry.processingStart - entry.startTime;
    const eventHandlerTime = entry.processingEnd - entry.processingStart;

    console.log(`Total duration: ${duration}`);
    console.log(`Event delay: ${delay}`);
    console.log(`Event handler duration: ${eventHandlerTime}`);
  });
}).observe({ type: "event" });
```

这种方式的好处是避免频繁在`requestAnimationFrame`中执行任务，这也是官方鼓励开发者使用的方式，它避免了轮询，且被设计为低优先级任务，甚至可以从缓存中取出过往数据。

但该方式仅能发现卡顿，至于具体的定位还是得配合埋点和心跳进行会更有效。

## 卡顿埋点上报

不管是哪种卡顿监控方式，我们使用检测卡顿的方案发现了卡顿之后，需要将卡顿进行上报才能及时发现问题。但如果我们仅仅上报了卡顿的发生，是不足以定位和解决问题的。

### 卡顿打点

那么，我们可以通过打点的方式来大概获取卡顿发生的位置。

举个例子，假设我们一个网页中，关键的点和容易产生长耗时的操作包括：

1. 加载数据。
2. 计算。
3. 渲染。
4. 批量操作。
5. 数据提交。

那么，我们可以在这些操作的地方进行打点。假设我们卡顿工具的能力主要有两个：

```js
interface IJank {
  _jankLogs: Array<IJankLogInfo & { logTime: number }>;
  // 打点
  log(jankLogInfo: IJankLogInfo): void;
  // 心跳
  _heartbeat(): void;
}
```

那么，当我们在页面加载的时候分别进行打点，我们的堆栈可能是这样的：

```js
_jankLogs = [
  {
    module: "数据层",
    action: "加载数据",
    logTime: xxxxx,
  },
  {
    module: "渲染层",
    action: "计算",
    logTime: xxxxx,
  },
  {
    module: "渲染层",
    action: "渲染",
    logTime: xxxxx,
  },
  {
    module: "数据层",
    action: "批量操作计算",
    logTime: xxxxx,
  },
  {
    module: "数据层",
    action: "数据提交",
    logTime: xxxxx,
  },
];
```

当卡顿心跳发现卡顿产生时，我们可以拿到堆栈的数据，比如当用户在批量操作之后发生卡顿，假设此时我们拿到堆栈：

```js
_jankLogs = [
  {
    module: "数据层",
    action: "加载数据",
    logTime: xxxxx,
  },
  {
    module: "渲染层",
    action: "计算",
    logTime: xxxxx,
  },
  {
    module: "渲染层",
    action: "渲染",
    logTime: xxxxx,
  },
  {
    module: "数据层",
    action: "批量操作计算",
    logTime: xxxxx,
  },
];
```

这意味着卡顿发生时，最后一次操作是`数据层--批量操作计算`，则我们可以认为是该操作产生了卡顿。

我们可以将`module`/`action`以及具体的卡顿耗时一起上报，这样就方便我们监控用户的大盘卡顿数据了，也较容易地定位到具体卡顿产生的位置。

### 心跳打点

当然，上述方案如果能达到最优效果，则我们需要在代码中关键的位置进行打点，常见的比如数据加载、计算、事件触发、JavaScript 加载等。

我们可以将打点方法做成装饰器，自动给`class`中的方法进行打点。如果埋点数据过少，可能会产生误报，那么我们可以增加心跳的打点：

```js
IJank._heartbeat = () => {
  IJank.log({
    module: "Jank",
    action: "heartbeat",
    logTime: xxxxx,
  });
};
```

当我们心跳产生的时候，会更新堆栈数据。假设发生卡顿的时候，我们拿到这样的堆栈信息：

```js
_jankLogs = [
  {
    module: "数据层",
    action: "加载数据",
    logTime: xxxxx,
  },
  {
    module: "Jank",
    action: "heartbeat",
    logTime: xxxxx,
  },
  {
    module: "Jank",
    action: "heartbeat",
    logTime: xxxxx,
  },
  {
    module: "渲染层",
    action: "计算",
    logTime: xxxxx,
  },
  {
    module: "Jank",
    action: "heartbeat",
    logTime: xxxxx,
  },
  {
    module: "渲染层",
    action: "渲染",
    logTime: xxxxx,
  },
  {
    module: "Jank",
    action: "heartbeat",
    logTime: xxxxx,
  },
  {
    module: "数据层",
    action: "批量操作计算",
    logTime: xxxxx,
  },
  {
    module: "Jank",
    action: "heartbeat",
    logTime: xxxxx,
  },
];
```

显然，卡顿发生时最后一次打点为`Jank--heartbeat`，这意味着卡顿并不是产生于`数据层---批量操作计算`，而是产生于该逻辑后的一个不知名逻辑。在这种情况下，我们可能还需要再在可疑的地方增加打点，再继续观察。

### JavaScript 加载打点

有一个用于监控一些懒加载的 JavaScript 代码的小技巧，我们可以使用`PerformanceObserver`获取到 JavaScript 代码资源拉取回来后的时机，然后进行打点：

```js
performanceObserver = new PerformanceObserver((resource) => {
  const entries = resource.getEntries();

  entries.forEach((entry: PerformanceResourceTiming) => {
    // 获取 JavaScript 资源
    if (entry.initiatorType !== "script") return;

    // 打点
    this.log({
      moduleValue: "compileScript",
      actionValue: entry.name,
    });
  });
});

// 监测 resource 资源
performanceObserver.observe({ entryTypes: ["resource"] });
```

当卡顿产生时，堆栈的最后一个日志如果为`compileScript--bundle_xxxx`之类的，则可以认为该 JavaScript 资源在加载的时候耗时较久，导致卡顿的产生。

通过这样的方式，我们可以有效监控用户卡顿的发生，以及卡顿产生较多的逻辑，然后进行相应的问题定位和优化。

## 结束语

对于计算逻辑较多、页面逻辑复杂的项目来说，卡顿常常是一个较大痛点。

关于日常性能的数据监控和优化方案之前也有介绍不少，相比一般的性能优化，卡顿往往产生于不合理的逻辑中，比如死循环、过大数据的反复遍历等等，其监控和定位方式也与普通的性能优化不大一致。
