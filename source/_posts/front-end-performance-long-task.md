---
title: 让你的长任务在 50 毫秒内结束
date: 2024-04-03 20:28:02
categories: 前端解决方案
tags: 性能优化
---

虽然之前有跟大家分享过不少卡顿相关的内容，实际上网页里卡顿的产生基本上都是由于长任务导致的。当然，能阻塞用户操作的，我们说的便是主线程上的长任务。

浏览器中的长任务可能是 JavaScript 的编译、解析 HTML 和 CSS、渲染页面，或者是我们编写的 JavaScript 中产生了长任务导致。

# 让你的长任务保持在 50 ms 内

之前在介绍[前端性能优化--卡顿篇](https://godbasin.github.io/2022/06/04/front-end-performance-no-responding/)时，提到可以将大任务进行拆解：

> 考虑将任务执行耗时控制在 50 ms 左右。每执行完一个任务，如果耗时超过 50 ms，将剩余任务设为异步，放到下一次执行，给到页面响应用户操作和更新渲染的时间。

为什么是 50 毫秒呢？

这个数值并不是随便写的，主要来自于 Google 员工开发的 [RAIL 模型](https://web.dev/articles/rail)。

## RAIL 模型

RAIL 表示 Web 应用生命周期的四个不同方面：**响应（Response）**、**动画（Animation）**、**空闲（Idel）**和**加载（Load）**。由于用户对每种情境有不同的性能预期，因此，系统会根据情境以及关于用户如何看待延迟的用户体验调研来确定效果目标。

人机交互学术研究由来已久，在 [Jakob Nielsen’s work on response time limits](https://www.nngroup.com/articles/response-times-3-important-limits/) 中提出三个阈值：

- 100 毫秒：大概是让用户感觉系统立即做出反应的极限，这意味着除了显示结果之外不需要特殊的反馈
- 1 秒：大概是用户思想流保持不间断的极限，即使用户会注意到延迟。一般情况下，大于 0.1 秒小于 1.0 秒的延迟不需要特殊反馈，但用户确实失去了直接操作数据的感觉
- 10 秒：大概是让用户的注意力集中在对话上的极限。对于较长的延迟，用户会希望在等待计算机完成的同时执行其他任务，因此应该向他们提供反馈，指示计算机预计何时完成。如果响应时间可能变化很大，则延迟期间的反馈尤其重要，因为用户将不知道会发生什么。

在此基础上，如今机器性能都有大幅度的提升，因此基于用户的体验，RAIL 增加了一项：

- 0-16 ms：大概是用户感受到流畅的动画体验的数值。只要每秒渲染 60 帧，这类动画就会感觉很流畅，也就是每帧 16 毫秒（包括浏览器将新帧绘制到屏幕上所需的时间），让应用生成一帧大约 10 毫秒

由于这篇文章我们讨论的是长任务相关，因此主要考虑生命周期中的响应（Response），目标便是要求 100 毫秒内获得可见响应。

## 在 50 毫秒内处理事件

RAIL 的目标是在 100 毫秒内完成由用户输入发起的转换，让用户感觉互动是瞬时完成的。

目标是 100 毫秒，但是页面运行时除了输入处理之外，通常还会执行其他工作，并且这些工作会占用可用于获得可接受输入响应的部分时间。

因此，为确保在 100 毫秒内获得可见响应，RAIL 的准则是在 50 毫秒内处理用户输入事件：

> 为确保在 100 毫秒内获得可见响应，请在 50 毫秒内处理用户输入事件。这适用于大多数输入，例如点击按钮、切换表单控件或启动动画。这不适用于轻触拖动或滚动。

除了响应之外，RAIL 对其他的生命周期也提出了对应的准则，总体为：

- 响应（Response）：在 50 毫秒内处理事件
- 动画（Animation）：在 10 毫秒内生成一帧
- 空闲（Idel）：最大限度地延长空闲时间
- 加载（Load）：提交内容并在 5 秒内实现互动

具体每个行为的目标和准则是如何考虑和确定的，大家可以自行学习，这里不再赘述。

# 长任务优化

网页加载时，长时间任务可能会占用主线程，使页面无法响应用户输入（即使页面看起来已就绪）。点击和点按通常不起作用，因为尚未附加事件监听器、点击处理程序等。

基于前面介绍的 RAIL 模型，我们可以将超过 50 毫秒的任务称之为长任务，即：任何连续不间断的且主 UI 线程繁忙 50 毫秒及以上的时间区间。

实际上，Chrome 浏览器中的 Performance 面板也是如此定义的，我们录制一段 Performance，当主线程同步执行的任务超过 50 毫秒时，该任务块会被标记为红色。

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/a-devtools-performance-pa-938d4fa393ba4_1440.png)

## 识别长任务

一般来说，在前端网页中容易出现的长任务包括：

- 大型的 JavaScript 代码加载
- 解析 HTML 和 CSS
- DOM 查询/DOM 操作
- 运算量较大的 JavaScript 脚本的执行

### 使用 Chrome Devtools

我们可以在 Chrome 开发者工具中，通过录制 Performance 的方式，手动查找时长超过 50 毫秒的脚本的“长红/黄色块”，然后分析这些任务块的执行内容，来识别出长任务。

我们可以选择 Bottom-Up 和 Group by Activity 面板来分析这些长任务（关于如何使用 Performance 面板，可以参考[分析运行时性能](https://developer.chrome.com/docs/devtools/performance?hl=zh-cn)一文）：

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/selecting-long-task-lab-acf1b77536fe5_1440.png)

比如在上图中，导致任务耗时较长的原因是一组成本高昂的 DOM 查询。

### 使用 Long Tasks API

我们还可以使用 [Long Tasks API](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceLongTaskTiming) 来确定哪些任务导致互动延迟：

```js
new PerformanceObserver(function (list) {
  const perfEntries = list.getEntries();
  for (let i = 0; i < perfEntries.length; i++) {
    // 分析长任务
  }
}).observe({ entryTypes: ["longtask"] });
```

### 识别大型脚本

大型脚本通常是导致耗时较长的任务的主要原因，我们可以想办法来识别。

除了使用上述的方法，我们还可以使用`PerformanceObserver`识别：

```js
new PerformanceObserver((resource) => {
  const entries = resource.getEntries();

  entries.forEach((entry: PerformanceResourceTiming) => {
    // 获取 JavaScript 资源
    if (entry.initiatorType !== "script") return;
    const startTime = new Date().getTime();

    window.requestAnimationFrame(() => {
      // JavaScript 资源加载完成
      const endTime = new Date().getTime();
      // 如果此时耗时大于 50 ms，则可任务出现了长任务
      const isLongTask = endTime - startTime > 50;
    });
  });
}).observe({ entryTypes: ["resource"] });
```

这种方式我们还可以通过`entry.name`拿到对应的加载资源，针对性地进行处理。

### 自定义性能指标

除此之外，我们还可以通过在代码中埋点，自行计算执行耗时，从而针对可预见的场景识别出长任务：

```js
// 可预见的大任务执行前打点
performance.mark("bigTask:start");
await doBigTask();
// 执行后打点
performance.mark("bigTask:end");

// 测量该任务
performance.measure("bigTask", "bigTask:start", "bigTask:end");
```

再配合`PerformanceObserver`获取对应的性能数据，大于 50 毫秒则可以判断为长任务、

## 优化长任务

发现长任务之后，我们就可以进行对应的长任务优化。

### 过大的 JavaScript 脚本

大型脚本通常是导致耗时较长的任务的主要原因，尤其是首屏加载时尽量避免加载不必要的代码。

我们可以考虑拆分这些脚本：

1. 首屏加载，仅加载必要的最小 JavaScript 代码。
2. 其他 JavaScript 代码进行模块化，进行分包加载。
3. 通过预加载、闲时加载等方式，完成剩余所需模块的代码加载。

拆分 JavaScript 脚本，使得用户打开页面时，只发送初始路由所需的代码。这样可以最大限度地减少需要解析和编译的脚本量，从而缩短网页加载时，也有助于提高 First Input Delay (FID) 和 Interaction to Next Paint (INP) 时间。

有很多工具可以帮助我们完成这项工作：

- [webpack](https://webpack.js.org/guides/code-splitting/)
- [Parcel](https://parceljs.org/code_splitting.html)
- [Rollup](https://rollupjs.org/guide/en#dynamic-import)

这些热门的模块打包器，都支持动态加载的方式来拆分 JavaScript 脚本。我们甚至可以限制每个构建模块的大小，来防止某个模块的 JavaScript 脚本过大，具体的使用方式大家可以自行搜索。

### 过长的 JavaScript 执行任务

主线程一次只能处理一个任务。如果任务的延时时间超过某一点（确切来说是 50 毫秒），则会被归类为耗时较长的任务。

对于这种过长的执行任务，优化方案也十分直接：**任务拆分**，直观来看就是这样：

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/a-single-long-task-versus-724bb5ecd4b3f_1440.png)

一般来说，任务拆分可以分为两种：

1. 串行执行的不同执行任务。
2. 单个超大的执行任务。

#### 串行任务的拆分

对于串行执行的不同任务，可以将不同任务的调用从同步改成异步即可，比如 [Optimize long tasks](https://web.dev/articles/optimize-long-tasks) 这篇文章中详细介绍的：

`saveSettings()`的函数，该函数会调用五个函数来完成某些工作：

```js
function saveSettings() {
  validateForm();
  showSpinner();
  saveToDatabase();
  updateUI();
  sendAnalytics();
}
```

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/the-savesettings-function-b71e8e42d8bf7_1440.png)

对这些串行任务进行拆分有很多种方式，比如：

- 使用`setTimeOut()`/`postTask()`实现异步
- 自行实现任务管理器，管理串行任务执行，每执行一个任务后释放主线程，再执行下一个任务（还需考虑优先级执行任务）

具体的代码可以参考 [Optimize long tasks](https://web.dev/articles/optimize-long-tasks) 该文章，理想的优化效果为：

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/the-same-savesettings-fun-689035655ea7a_1440.png)

#### 单个超大任务的拆分

有时候我们的应用中需要做大量的运算，比如对上百万个数据做一系列的计算，此时我们可以考虑进行分批拆分。

拆分的时候需要注意几个事情：

1. 尽量将每个小任务拆成 50 毫秒左右的执行时间。
2. 大任务分批执行，会由同步执行变为异步执行，需要考虑中间态（是否有新的任务插入，是否会重复执行）。

之前在介绍复杂渲染引擎的时候，有详细讲解使用分批计算的方法进行性能优化，具体可以参考[《复杂渲染引擎架构与设计--5.分片计算》](https://godbasin.github.io/2023/09/16/render-engine-calculate-split/)一文。

### 参考

- [Measure performance with the RAIL model](https://web.dev/articles/rail)
- [Reduce JavaScript payloads with code splitting](https://web.dev/articles/reduce-javascript-payloads-with-code-splitting)
- [Preload critical assets to improve loading speed](https://web.dev/articles/preload-critical-assets)
- [Are long JavaScript tasks delaying your Time to Interactive?](https://web.dev/articles/long-tasks-devtools)
- [Optimize long tasks](https://web.dev/articles/optimize-long-tasks)

# 结束语

对于大型复杂的前端应用来说，卡顿和长任务都是家常便饭。

性能优化没有捷径，有的都是一步步定位，一点点分析，一处处解决。每一个问题都是独立的问题，但我们还可以识别它们的共性，提供更高效的解决路径。
