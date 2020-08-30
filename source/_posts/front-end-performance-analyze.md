---
title: 补齐Web前端性能分析的工具盲点
date: 2020-08-29 09:55:23
categories: 前端解决方案
tags: 逻辑实现
---

最近依然在研究大型项目，而大型项目最容易遇到的问题便是性能问题。一般来说，当我们遇到性能瓶颈的时候，才会开始去进行相应的分析。分析的方向除了业务本身的特点相关之外，常见的我们还可以借助一些工具来发现问题。本文一起来研究下，前端性能分析可以怎么走~

<!--more-->

# 前端性能分析工具（Chrome DevTools）
一般来说，前端的性能分析通常可以从**时间**和**空间**两个角度来进行：
- **时间**：常见耗时，如页面加载耗时、渲染耗时、网络耗时、脚本执行耗时等
- **空间**：资源占用，包括 CPU 占用、内存占用、本地缓存占用等

那么，下面来看看有哪些常见的工具可以借来用用。由于我们的网页基本上跑在浏览器中，所以基本上大多数的工具都来源于浏览器自身提供，首当其冲的当然是 [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)。本文我们也主要围绕 Chrome DevTools 来进行说明。

## Lighthouse
[Lighthouse](https://github.com/GoogleChrome/lighthouse) 的前身是 Chrome DevTools 面板中的 Audits。在 Chrome 60 之前的版本中, 这个面板只包含网络使用率和页面性能两个测量类别，从 Chrome 60 版本开始， Audits 面板已经被 Lighthouse 的集成版取代。而在最新版本的 Chrome 中，则需要单独安装 Lighthouse 拓展程序来使用，也可以通过脚本来使用。

### 架构
![Lighthouse 架构](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/front-end-performance-analyze_7.png)

下面是 Lighthouse 的组成部分：
- 驱动（Driver）：和 [Chrome Debugging Protocol](https://chromedevtools.github.io/devtools-protocol/) 进行交互的接口
- 收集器（Gatherers）：使用驱动程序收集页面的信息，收集器的输出结果被称为 Artifact
- 审查器（Audits）：将 Artifact 作为输入，审查器会对其运行测试，然后分配通过/失败/得分的结果
- 报告（Report）：将审查的结果分组到面向用户的报告中（如最佳实践），对该部分应用加权和总体然后得出评分

### 主要功能
Lighthouse 会在一系列的测试下运行网页，比如不同尺寸的设备和不同的网络速度。它还会检查页面对辅助功能指南的一致性，例如颜色对比度和 ARIA 最佳实践。

在比较短的时间内，Lighthouse 可以给出这样一份报告（可将报告生成为 JSON 或 HTML）：

![Lighthouse 架构](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/front-end-performance-analyze_2.png)

这份报告从 5 个方面来分析页面： **性能**、**辅助功能**、**最佳实践**、**搜索引擎优化**和 **PWA**。像性能方面，会给出一些常见的耗时统计。除此以外，还会给到一些详细的优化方向。

如果你希望短时间内对你的网站进行较全面的评估，可以使用 Lighthouse 来跑一下分数，确定大致的优化方向。

## Performance 面板
[Performance](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/reference) 面板同样有个前身，叫 [Timeline](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/timeline-tool?hl=zh-cn)。该面板用于记录和分析**运行时性能**，运行时性能是页面运行时（而不是加载）的性能。

### 使用步骤
Performance 面板功能特别多，具体的分析也可以单独讲一篇了。这里我们简单说一下使用的步骤：
1. 在隐身模式下打开 Chrome。隐身模式可确保 Chrome 以干净状态运行，例如浏览器的扩展可能会在性能评估中产生影响。
2. 在 DevTools 中，单击“Performance”选项卡，并进行一些基础配置（更多参考[官方说明](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance)）。
3. 按照提示单击记录，开始记录。进行完相应的操作之后，点击停止。
4. 当页面运行时，DevTools 捕获性能指标。停止记录后，DevTools 处理数据，然后在 Performance 面板上显示结果。

### 主要功能
关于 Performance 怎么使用的文章特别多，大家网上随便搜一下就能搜到。一般来说，主要使用以下功能：

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/front-end-performance-analyze_5.jpg)

- **查看 FPS 图表**：当在 FPS 上方看到红色条形时，表示帧速率下降得太低，以至于可能损害用户体验。通常，绿色条越高，FPS 越高
- **查看 CPU 图表**：CPU 图表在 FPS 图表下方。CPU 图表的颜色对应于性能板的底部的 Summary 选项卡
- **查看 火焰图**：火焰图直观地表示出了内部的 CPU 分析，横轴是时间，纵轴是调用指针，调用栈最顶端的函数在最下方。启用 JS 分析器后，火焰图会显示调用的每个 JavaScript 函数，可用于分析具体函数
- **查看 Buttom-up**：此视图可以看到某些函数对性能影响最大，并能够检查这些函数的调用路径

具体要怎么定位某些性能瓶颈，可以参考[官方文档系列文章](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/reference)，这里就不详细介绍啦。

### Performance Monitor
打开 Chrome 控制台后，按组合键`ctrl + p`(Mac 快捷键为`command + p`)，输入`> Show Performance Monitor`，就可以打开 Performance Monitor 性能监视器。主要的监控指标包括：
- CPU usage：CPU 占用率
- JS head size：JS 内存使用大小
- DOM Nodes：内存中挂载的 DOM 节点个数
- JS event listeners：事件监听数
- ...：其他等等

大多数情况下，我们在进行性能优化的时候，使用上面一些工具也足以确定大致的优化方向。更多的细节和案例，就不在这里详述了。

# 前端性能监控
除了具体的性能分析和定位，我们也经常需要对业务进行性能监控。前端性能监控包括两种方式：合成监控（Synthetic Monitoring，SYN）、真实用户监控（Real User Monitoring，RUM）。

## 合成监控
合成监控就是在一个模拟场景里，去提交一个需要做性能审计的页面，通过一系列的工具、规则去运行你的页面，提取一些性能指标，得出一个审计报告。例如上面介绍的 Lighthouse 就是合成监控。

合成监控的使用场景不多，一般可能出现在开发和测试的过程中，例如结合流水线跑性能报告、定位性能问题时本地跑的一些简单任务分析等。该方式的优点显而易见：
- 可采集更丰富的数据指标，例如结合 [Chrome Debugging Protocol](https://chromedevtools.github.io/devtools-protocol/) 获取到的数据
- 较成熟的解决方案和工具，实现成本低
- 不影响真实用户的性能体验

## 真实用户监控
真实用户监控，就是用户在我们的页面上访问，访问之后就会产生各种各样的性能指标。我们在用户访问结束的时候，把这些性能指标上传到我们的日志服务器上，进行数据的提取清洗加工，最后在我们的监控平台上进行展示的一个过程。

我们提及前端监控的时候，大多数都包括了真实用户监控。常见的一些性能监控包括加载耗时、DOM 渲染耗时、接口耗时统计等，而对于页面加载过程，可以看到它被定义成了很多个阶段：

![RUM 性能模型](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/front-end-performance-analyze_6.png)

而我们要做的，则是在力所能及的地方进行打点、计算、采集、上报，该过程常常需要借助 Performance Timeline API。将需要的数据发送到服务端，然后再对这些数据进行处理，最终通过可视化等方式进行监控。因此，真实用户监控往往需要结合业务本身的前后端架构设计来建设，其优点也比较容易理解：
- 完全还原真实场景，减去模拟成本
- 数据样本足够抹平个体的差异
- 采集数据可用于更多场景的分析和优化

对比合成监控，真实用户监控在有些场景下无法拿到更多的性能分析数据（例如具体哪里 CPU 占用、内存占用高），因此更多情况下作为优化效果来参考。这些情况下，具体的分析和定位可能还是得依赖合成监控。

但真实用户监控也有自身的优势，例如 TCP、DNS 连接耗时过高，在各种环境下的一些运行耗时问题，合成监控是很难发现的。

# 性能分析自动化
我们在开发过程中，也常常需要进行性能分析。而前端的性能分析上手成本也不低，除了基本的页面加载耗时、网络耗时，更具体的定位往往需要结合前面介绍的 Performance 面板、FPS、CPU、火焰图等一点点来分析。

如果这一块想要往自动化方向发展，我们可以怎么做呢？

## 使用 Lighthouse
前面也有介绍 Lighthouse，它提供了脚本的方式使用。因此，我们可以通过自动化任务跑脚本的方式，使用 Lighthouse 跑分析报告，通过对比以往的数据来进行功能变更、性能优化等场景的性能回归。

使用 Lighthouse 的优势在于开发成本低，只需要按照[官方提供的配置](https://github.com/GoogleChrome/lighthouse/blob/master/docs/configuration.md)来调整、获取自己需要的一些数据，就可以快速接入较全面的 Lighthouse 拥有的性能分析能力。

不过由于 Lighthouse 同样基于 CDP(Chrome DevTools Protocol)，因此除了实现成本降低了，CDP 缺失的一些能力它也一样会缺失。

## Chrome DevTools Protocol
[Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) 允许第三方对基于 Chrome 的 Web 应用程序进行检测、检查、调试、分析等。有了这个协议，我们就可以自己开发工具获取 Chrome 的数据了。

### 认识 Chrome DevTools 协议
Chrome DevTools 协议基于 WebSocket，利用 WebSocket 建立连接 DevTools 和浏览器内核的快速数据通道。

我们使用的 Chrome DevTools 其实也是一个 Web 应用。我们使用 DevTools 的时候，浏览器内核 Chromium 本身会作为一个服务端，我们看到的浏览器调试工具界面，通过 Websocket 和 Chromium 进行通信。建立过程如下：
1. DevTools 将作为 Web 应用程序，Chromium 作为服务端提供连接。
2. 通过 HTTP 提取 HTML、JavaScript 和 CSS 文件。
3. 资源加载后，DevTools 会建立与浏览器的 Websocket 连接，并开始交换 JSON 消息。

同样的，当我们通过 DevTools 从 Windows、Mac 或 Linux 计算机远程调试 Android 设备上的实时内容时，使用的也是该协议。当 Chromium 以一个`--remote-debugging-port=0`标志启动时，它将启动 Chrome DevTools 协议服务器。

### Chrome DevTools 协议域划分
Chrome DevTools协议具有与浏览器的许多不同部分（例如页面、Service Worker 和扩展程序）进行交互的 API。该协议把不同的操作划分为了不同的域（domain），每个域负责不同的功能模块。比如`DOM`、`Debugger`、`Network`、`Console`和`Performance`等，可以理解为 DevTools 中的不同功能模块。

使用该协议我们可以：
- 获取 JS 的 Runtime 数据，常用的如`window.performance`和`window.chrome.loadTimes()`等
- 获取`Network`及`Performance`数据，进行自动性能分析
- 使用 [Puppeteer](https://github.com/GoogleChrome/lighthouse/blob/master/docs/puppeteer.md) 的 [CDPSession](https://pptr.dev/#?product=Puppeteer&version=v1.13.0&show=api-class-cdpsession)，与浏览器的协议通信会变得更加简单

### 与性能相关的域
本文讲性能分析相关，因此这里我们只关注和性能相关的域。

**1. Performance。**
从`Performance`域中`Performance.getMetrics()`可以拿到获取运行时性能指标包括：
- `Timestamp`: 采取度量样本的时间戳
- `Documents`: 页面中的文档数
- `Frames`: 页面中的帧数
- `JSEventListeners`: 页面中的事件数
- `Nodes`: 页面中的 DOM 节点数
- `LayoutCount`: 全部或部分页面布局的总数
- `RecalcStyleCount`: 页面样式重新计算的总数
- `LayoutDuration`: 所有页面布局的合并持续时间
- `RecalcStyleDuration`: 所有页面样式重新计算的总持续时间
- `ScriptDuration`:  JavaScript 执行的持续时间
- `TaskDuration`: 浏览器执行的所有任务的合并持续时间
- `JSHeapUsedSize`: 使用的 JavaScript 栈大小
- `JSHeapTotalSize`: JavaScript 栈总大小

**2. Tracing。**
`Tracing`域可获取页面加载的 DevTools 性能跟踪。可以使用`Tracing.start`和`Tracing.stop`创建可在 Chrome DevTools 或时间轴查看器中打开的跟踪文件。

我们能看到生成的 JSON 文件长这样：
![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/front-end-performance-analyze_8.png)

这样的 JSON 文件，我们可以丢到 [DevTools Timeline Viewer](https://chromedevtools.github.io/timeline-viewer/) 中，可以看到对应的时间轴和火焰图：

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/front-end-performance-analyze_9.jpg)

**3. Runtime。**
`Runtime`域通过远程评估和镜像对象暴露 JavaScript 的运行时。可以通过`Runtime.getHeapUsage`获取 JavaScript 栈的使用情况，通过`Runtime.evaluate`计算全局对象的表达式，通过`Runtime.queryObjects`迭代 JavaScript 栈并查找具有给定原型的所有对象（可用于计算原型链中某处具有相同原型的所有对象，衡量 JavaScript 内存泄漏）。

除了上面介绍的这些，还有`Network`可以分析网络相关的性能，以及其他可能涉及 DOM 节点、JS 执行等各种各样的数据分析，更多的可能需要大家自己去研究了。

### 自动化性能分析
通过使用 Chrome DevTools 协议，我们可以获取 DevTools 提供的很多数据，包括网络数据、性能数据、运行时数据。

对于如何使用该协议，其实已经有很多大神针对这个协议封装出不同语言的库，包括 Node.js、Python、Java等，可以根据需要在 [awesome-chrome-devtools](https://github.com/ChromeDevTools/awesome-chrome-devtools#chrome-devtools-protocol) 这个项目中找到。

至于我们到底能拿到怎样的数据，可以做到怎样的自动化程度，就不在本文里讲述啦，后面有机会再开篇文章详细讲讲。

# 参考
- [你一定要知道的 Chrome DevTool 新功能](https://www.zcfy.cc/article/the-new-chrome-devtool-feature-you-want-to-know-about-3318.html)
- [前端性能分析利器-Chrome性能分析&性能监视器](https://juejin.im/post/6844904045774110733)
- [蚂蚁金服如何把前端性能监控做到极致?](https://www.infoq.cn/article/Dxa8aM44oz*Lukk5Ufhy)
- [chrome devtools protocol——Web 性能自动化实践介绍](https://testerhome.com/topics/15817)
- [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)
- [Web Performance Recipes With Puppeteer](https://addyosmani.com/blog/puppeteer-recipes/#measuring-memory-leaks)

# 结束语
前端性能分析相关的文章不算多，而由于性能分析本身的场景就跟业务特性结合比较紧密，可以用来借鉴的内容、较统一的解决方案也不多。而性能的监控、自动化等方向的介绍比较少，也希望这篇文章能给到你们一些方向吧~