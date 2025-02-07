---
title: 前端性能优化--数据指标体系
date: 2024-03-17 21:28:33
categories: 前端解决方案
tags: 性能优化
---

常常进行前端性能优化的小伙伴们会发现，实际开发中性能优化总是阶段性的：页面加载很慢/卡顿 -> 性能优化 -> 堆叠需求 -> 加载慢/卡顿 -> 性能优化。

这是因为我们的项目往往也是阶段性的：快速功能开发 -> 出现性能问题 -> 优化性能 -> 快速功能开发。

建立一个完善的性能指标体系，便可以在需求开发阶段发现页面性能的下降，及时进行修复。

## 前端性能指标体系

为什么需要进行性能优化呢？这是因为一个快速响应的网页可以有效降低用户访问的跳出率，提升网页的留存率，从而收获更多的用户。参考[《经济时报》如何超越核心网页指标阈值，并使跳出率总体提高了 43%](https://web.dev/case-studies/economic-times-cwv?hl=zh-cn)，这个例子中主要优化了两个指标：Largest Contentful Paint (LCP) 和 Cumulative Layout Shift (CLS)。

除此之外，页面速度是一个重要的搜索引擎排名因素，它影响到你的网页是否能被更多用户访问。

### 常见的前端性能指标 
我们来看下常见的前端性能指标，由于网页的响应速度往往包含很多方面（页面内容出现、用户可操作、流畅度等等），因此性能数据也由不同角度的指标组成：
- [First Contentful Paint (FCP)](https://web.dev/articles/fcp?hl=zh-cn)：首次内容绘制，衡量从网页开始加载到网页任何部分呈现在屏幕上所用的时间
- [Largest Contentful Paint (LCP)](https://web.dev/articles/lcp?hl=zh-cn)：最大内容绘制，衡量从网页开始加载到屏幕上渲染最大的文本块或图片元素所用的时间
- [First Input Delay (FID)](https://web.dev/articles/fid?hl=zh-cn)：首次输入延迟，衡量从用户首次与您的网站互动（点击链接、点按按钮或使用由 JavaScript 提供支持的自定义控件）到浏览器实际能够响应该互动的时间
- [Interaction to Next Paint (INP)](https://web.dev/articles/inp?hl=zh-cn)：衡量与网页进行每次点按、点击或键盘交互的延迟时间，并根据互动次数选择该网页最差的互动延迟时间（或接近最高延迟时间）作为单个代表性值，以描述网页的整体响应速度
- [Time to Interactive (TTI)](https://web.dev/articles/tti?hl=zh-cn)：可交互时间，衡量的是从网页开始加载到视觉呈现、其初始脚本（若有）已加载且能够快速可靠地响应用户输入的时间
- [Total Blocking Time (TBT)](https://web.dev/articles/tbt?hl=zh-cn)：总阻塞时间，测量 FCP 和 TTI 之间的总时间，在此期间，主线程处于屏蔽状态的时间够长，足以阻止输入响应
- [Cumulative Layout Shift (CLS)](https://web.dev/articles/cls?hl=zh-cn)：衡量从页面开始加载到其生命周期状态更改为隐藏之间发生的所有意外布局偏移的累计得分
- [Time to First Byte (TTFB)](https://web.dev/articles/ttfb?hl=zh-cn)：首字节时间，测量网络使用资源的第一个字节响应用户请求所需的时间

这些是 [User-centric performance metrics](https://web.dev/articles/user-centric-performance-metrics) 中介绍到的指标，其中 FCP、LCP、FID、INP/TTI 在我们常见的前端开发中会比较经常用到。

最简单的，一般前端应用都会关心以下几个指标：
1. FCP/LCP，该指标影响内容呈现给用户的体验，对页面跳出率影响最大。
2. FID/INP，该指标影响用户与网页交互的体验，对功能转化率和网页留存率影响较大。
3. TTI，该指标也为前端网页常用指标，页面可交互即用户可进行操作了。

除了这些简单的指标外，我们要如何建立起对网页完整的性能指标呢？一套成熟又完善的解决方案为 Google 的 [PageSpeed Insights (PSI) ](https://developers.google.com/speed/docs/insights/v5/about)。

### PageSpeed Insights (PSI) 
PageSpeed Insights (PSI) 是一项免费的 Google 服务，可报告网页在移动设备和桌面设备上的用户体验，并提供关于如何改进网页的建议。

前面在[《补齐Web前端性能分析的工具盲点》](https://godbasin.github.io/2020/08/29/front-end-performance-analyze/)一文中，我们简单介绍过 Google 的另外一个服务--[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview)。

PageSpeed Insights 和 Lighthouse 的区别主要为：

| 特征 | PageSpeed Insights | Lighthouse |
| - | - | - |
| 如何访问 | [https://pagespeed.web.dev/](https://pagespeed.web.dev/)（浏览器访问；无需登录） | [Google Chrome 浏览器扩展](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk)（推荐非开发人员使用）<br /> [Chrome DevTools](https://developer.chrome.com/docs/lighthouse/overview/#devtools) <br /> [Node CLI 工具](https://developer.chrome.com/docs/lighthouse/overview/#cli) <br /> [Lighthouse CI](https://github.com/GoogleChrome/lighthouse) |
| 数据来源 | Chrome 用户体验报告（真实数据）<br />Lighthouse API（模拟实验室数据） | Lighthouse API |
| 评估 | 一次一页 | 一次一页或一次多页 |
| 指标 | 核心网络生命、页面速度性能指标（首次内容绘制、速度指数、最大内容绘制、交互时间、总阻塞时间、累积布局偏移） | 性能（包括页面速度指标）、可访问性、最佳实践、SEO、渐进式 Web 应用程序（如果适用） |
| 建议 | 标有`Opportunities and Diagnostics`的部分提供了提高页面速度的具体建议。 | 标有`Opportunities and Diagnostics`的部分提供了提高页面速度的具体建议。堆栈包可用于定制改进建议。 |

简单来说，PageSpeed Insights 可同时获取实验室性能数据和用户实测数据，而 Lighthouse 则可获取实验室性能数据以及网页整体优化建议（包括但不限于性能建议）。

[我们之前提到过](https://godbasin.github.io/2020/08/29/front-end-performance-analyze/)，前端性能监控包括两种方式：合成监控（Synthetic Monitoring，SYN）、真实用户监控（Real User Monitoring，RUM）。这两种监控的性能数据，便是分别对应着实验室数据和用户实测数据。

实测数据是通过监控访问网页的所有用户，并针对其中每个用户的各自的体验，衡量一组给定的性能指标来确定的。和实验室数据不同，由于现场数据基于真实用户访问数据，因此它反映了用户的实际设备、网络条件和用户的地理位置。

当然，实测数据也可以由用户真实访问页面时进行上报收集，稍微大一点的前端应用都会这么做。但在此之前，如果你的前端网页没有做数据上报监控，也可以使用 PageSpeed Insights 工具进行简单的测试。但考虑到 PageSpeed Insights 收集的用户皆基于 Chrome 浏览器（CrUX），且需要登录的应用无法有效地获取真实数据，那么自行搭建一套性能指标体系则是最好的。

虽然实际上 PageSpeed Insights 服务并不能解决我们所有的问题，但是我们可以参考它的性能指标，来搭建自己的性能体系呀。

### 核心网页指标
参考 Google 的 [PageSpeed Insights](https://developers.google.com/speed/docs/insights/v5/about)，我们知道 PSI 会报告真实用户在上一个 28 天收集期内的 First Contentful Paint (FCP)、First Input Delay (FID)、Largest Contentful Paint (LCP)、Cumulative Layout Shift (CLS) 和 Interaction to Next Paint (INP) 体验，同时 PSI 还报告了实验性指标首字节时间 (TTFB) 的体验。

其中，核心网页指标包括 FID/INP、LCP 和 CLS。

#### FID
[First Input Delay (FID)](https://web.dev/articles/fid) 衡量的是从用户首次与网页互动（即，点击链接、点按按钮或使用由 JavaScript 提供支持的自定义控件）到浏览器能够实际开始处理事件处理脚本以响应该互动的时间。

我们可以使用 [Event Timing API](https://wicg.github.io/event-timing) 在 JavaScript 中衡量 FID：

``` js
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    const delay = entry.processingStart - entry.startTime;
    console.log('FID candidate:', delay, entry);
  }
}).observe({type: 'first-input', buffered: true});
```

实际上，从 2024 年 3 月开始，FID 将替换为 Interaction to Next Paint (INP)，后面我们会着重介绍。

#### LCP
[Largest Contentful Paint (LCP)](https://web.dev/articles/lcp) 指标会报告视口内可见的最大图片或文本块的呈现时间（相对于用户首次导航到页面的时间）。

我们可以使用 [Largest Contentful Paint API](https://wicg.github.io/largest-contentful-paint/) 在 JavaScript 中测量 LCP: 

``` js
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    console.log('LCP candidate:', entry.startTime, entry);
  }
}).observe({type: 'largest-contentful-paint', buffered: true});
```

#### CLS
许多网站都面临布局不稳定的问题：DOM 元素由于内容异步加载而发生移动。

[Cumulative Layout Shift (CLS)](https://web.dev/articles/cls) 指标便是用来衡量在网页的整个生命周期内发生的每次意外布局偏移的最大突发布局偏移分数。我们可以从`Layout Instability`方法中获得布局偏移：

``` js
addEventListener("load", () => {
    let DCLS = 0;
    new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            if (entry.hadRecentInput)
                return;  // Ignore shifts after recent input.
            DCLS += entry.value;
        });
    }).observe({type: "layout-shift", buffered: true});
});
```

布局偏移分数是该移动两个测量的乘积：影响比例和距离比例。

``` js
layout shift score = impact fraction * distance fraction
```

#### Interaction to Next Paint (INP) 
FID 仅在用户首次与网页互动时报告响应情况。尽管第一印象很重要，但首次互动不一定代表网页生命周期内的所有互动。此外，FID 仅测量首次互动的“输入延迟”部分，即浏览器在开始处理互动之前必须等待的时间（由于主线程繁忙）。

[Interaction to Next Paint (INP)](https://web.dev/articles/inp) 用于通过观察用户在访问网页期间发生的所有符合条件的互动的延迟时间，评估网页对用户互动的总体响应情况。

INP 不仅会衡量首次互动，还会考虑所有互动，并报告网页整个生命周期内最慢的互动。此外，INP 不仅会测量延迟部分，还会测量从互动开始，一直到事件处理脚本，再到浏览器能够绘制下一帧的完整时长。因此是 Interaction to Next Paint。这些实现细节使得 INP 能够比 FID 更全面地衡量用户感知的响应能力。

从 2024 年 3 月开始，INP 将替代 FID 加入 Largest Contentful Paint (LCP) 和 Cumulative Layout Shift (CLS)，作为三项稳定的核心网页指标。

INP 的计算方法是观察用户与网页进行的所有互动，而互动是指在同一逻辑用户手势触发的一组事件处理脚本。例如，触摸屏设备上的“点按”互动包括多个事件，如`pointerup`、`pointerdown`和`click`。互动可由 JavaScript、CSS、内置浏览器控件（例如表单元素）或由以上各项驱动。

我们同样可以使用 [Event Timing API](https://wicg.github.io/event-timing) 在 JavaScript 中衡量 FID：

``` js
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    const delay = entry.processingStart - entry.startTime;
  }
}).observe({type: 'event', buffered: true});
```

关于 INP 的优化，可以参考 [Optimize Interaction to Next Paint](https://web.dev/articles/optimize-inp)。

#### web-vitals JavaScript 库
[web-vitals JavaScript 库](https://github.com/GoogleChrome/web-vitals) 使用`PerformanceObserver`，用于测量真实用户的所有 Web Vitals 指标，其方式准确匹配 Chrome 的测量方式，提供了上述提到的各种指标数据：CLS、FID、LCP、INP、FCP、TTFB。

我们可以使用 web-vitals 库来收集到所需的数据。

### 评估体验质量
PSI 根据网页指标计划设置了阈值，将用户体验质量分为三类：良好、需要改进或较差，具体可参考 [PageSpeed Insights 简介](https://developers.google.com/speed/docs/insights/v5/about?hl=zh-cn)。

值得注意的是，PSI 报告所有指标的第 75 百分位。

为便于开发者了解其网站上最令人沮丧的用户体验，选择第 75 百分位。通过应用上述相同阈值，这些字段指标值被归类为良好/需要改进/欠佳。

这与我们常见的前端性能指标监控不大一样，因为一般来说大家会取平均值来评估指标。而取 75 百分位这种方式，值得我们去好好思考哪种计算方式更能真实反应用户的体验。

当然，上述 PSI 的性能指标体系，也未必完全适合我们网页使用，我们还可以针对网页的实际情况做出调整。举个例子，网页的 FCP/LCP 虽然十分影响用户的留存，但如果是对于专注服务于老用户、操作频繁、使用时长长的应用来说，网页运行过程中的流畅性更值得关注。

### 参考
- [Why lab and field data can be different (and what to do about it)](https://web.dev/articles/lab-and-field-data-differences)
- [Advancing Interaction to Next Paint](https://web.dev/blog/inp-cwv)
- [在 PageSpeed Insights 中针对网站进行移动设备浏览体验分析](https://developers.google.com/speed/docs/insights/mobile?hl=zh-cn)
- [Long Animation Frames (LoAF)](https://github.com/w3c/longtasks/blob/main/loaf-explainer.md)
- [以用户为中心的效果指标](https://web.dev/articles/user-centric-performance-metrics?hl=zh-cn)
- [Towards an animation smoothness metric](https://web.dev/articles/smoothness)

## 结束语
性能优化的事项很多，事情也往往很杂。当我们去针对我们网页进行性能优化事项的时候，如何评估我们的成果也是一个永恒不变的话题。

建立起有效的性能指标体系，就能更直观地展示出网页存在的性能问题，以及优化后的效果。

但需要注意的是，一味地追求指标数据并不都是一件好事情，因为为了指标好看往往我们会牺牲掉一些其他的体验。最终在平衡取舍下，呈现给用户最合适的体验才是开发的责任所在。