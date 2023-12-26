---
title: 复杂渲染引擎架构与设计--7.离屏渲染
date: 2023-10-13 10:06:11
categories: 前端解决方案
tags: 性能优化
---

前面我们介绍了增量渲染的解决方案，其中有提到复用 Canvas 进行性能优化的解决方案。

本文我们将结合 Canvas 的能力提出进一步的优化方案：离屏渲染。

<!--more-->

上一篇[《6.增量渲染》](https://godbasin.github.io/2023/10/11/render-engine-diff-render/)提到页面滚动时 Canvas 复用的场景，这种场景下我们还可以考虑两种方式：

1. 使用 Canvas 上一帧画像，直接转换成图片复用到下一帧的绘制中。
2. 维护两个 Canvas，滚动时使用两个 Canvas 交替绘制。

第二种方式中，当前渲染的 Canvas 与隐藏的缓存 Canvas 交替渲染，由于会使用一个屏幕外（非可视）的 Canvas 进行提前绘制，我们也可以称之为离屏渲染。

## 离屏渲染

离屏渲染可以提前将更大范围的内容绘制好，在滚动时可直接取对应的区域进行截取和绘制。

当然，两个 Canvas 的维护和绘制成本会比一个 Canvas 要更高，同时如果需要提前绘制更大区域的单元格范围，那么必然会面临一个问题：需要更多的计算和渲染消耗。

我们可以考虑另外一个优化方案：使用 [OffscreenCanvas](https://developer.mozilla.org/zh-CN/docs/Web/API/OffscreenCanvas) 实现真正的离屏。

### OffscreenCanvas API 能力

OffscreenCanvas 是一个实验中的新特性，主要用于提升 Canvas 2D/3D 绘图应用和 H5 游戏的渲染性能和使用体验。OffscreenCanvas 目前主要用于两种不同的使用场景：

1. 同步显示 OffscreenCanvas 中的帧。在 Worker 线程创建一个 OffscreenCanvas 做后台渲染，然后再把渲染好的缓冲区 Transfer 回主线程显示。
2. 异步显示 OffscreenCanvas 中的帧。主线程从当前 DOM 树中的 Canvas 元素产生一个 OffscreenCanvas，再把这个 OffscreenCanvas 发送给 Worker 线程进行渲染，渲染的结果直接 Commit 到浏览器的 Display Compositor 输出到当前窗口，相当于在 Worker 线程直接更新 Canvas 元素的内容。

整体的离屏方案依赖 [OffscreenCanvas](https://developer.mozilla.org/zh-CN/docs/Web/API/OffscreenCanvas) 提供的能力，关于此能力现有的技术方案和文档较少，可参考：

- [OffscreenCanvas - 概念说明及使用解析](https://zhuanlan.zhihu.com/p/34698375)
- [](https://developers.google.com/web/updates/2018/08/offscreen-canvas)

在我们的架构设计下，更适合使用第一种方案，即同步显示 OffscreenCanvas 中的帧。这样设计的优势在于：当主线程繁忙时，依然可以通过 OffscreenCanvas 在 worker 中更新画布内容，避免给用户造成页面卡顿的体验。

除此之外，还可以进一步考虑在兼容性支持的情况下，通过将局部计算运行在 worker 中，减少渲染引擎的计算耗时，提升渲染引擎的渲染性能。

当然，如果要实现在 Worker 中进行提前渲染，则需要考虑如何将渲染引擎提供给 Worker，以及将数据及时同步到 Worker 的问题。

### 渲染引擎与 Worker

如果想完全发挥到 OffscreenCanvas 的作用，要支持真正意义上的离屏渲染，而不是在主线程使用一个隐藏的 Canvas 交替绘制，需要考虑：

1. 渲染引擎放置在 worker 中是否合适？

由于渲染引擎本身是需要实时响应用户的操作的，因此大部分的内容更新是需要同步计算、并更新到 Canvas 中的。如果提取到 worker 中进行，需要考虑是否由于线程通信的原因导致响应速度的降低，反而影响用户体验。

2. 哪些计算可以放到 worker 中异步运行？

方向一：每次有数据更新，渲染引擎都会全量更新和计算，可以考虑将非可视区域范围的部分（即可视范围往后的部分）放置到 worker 和离屏 Canvas 中进行计算

方向二：前面提到，渲染引擎的渲染分为两部分：

- 表格主体内容渲染（单元格内容、边框线、背景色等）
- 业务通过插件添加额外的内容渲染（图标、背景高亮等）

对于插件部分内容，可以考虑将其放到 worker 中计算并更新。但局部内容异步渲染，可能需要考虑对当前 Canvas 进行改造，进行分层渲染，即可按照堆叠顺序进行 Canvas 拆分，结合每块内容的更新频率，仅更新某种类型的绘制内容。

## 结束语

对于项目中是否适合使用该离屏方案，需要结合项目自身的架构设计、改造成本和兼容性问题等情况，考虑好上述问题，才能决定。即使是在 Worker 中不阻塞主线程，依然需要考虑计算量过大可能会导致渲染延迟等问题。

它会带来不小的改造成本，但收益是否可观还需要观察，你也可以先编写一个 demo 来确认效果，再尝试在项目中接入使用。
