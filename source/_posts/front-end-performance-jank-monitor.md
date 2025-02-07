---
title: 前端性能优化--卡顿链路追踪
date: 2024-10-15 22:17:25
categories: 前端解决方案
tags: 性能优化
---

我们在上一篇[《前端性能优化--卡顿心跳检测》](https://godbasin.github.io/2024/06/04/front-end-performance-jank-heartbeat-monitor/)一文中介绍过基于`requestAnimationFrame`的卡顿的检测方案实现，这一篇文章我们将会介绍基于该心跳检测方案，要怎么实现链路追踪，来找到产生卡顿的地方。

## 卡顿监控实现

上一篇我们提到的心跳检测，实现的功能很简单，就是卡顿和心跳事件、开始和停止，那么我们卡顿监控使用的时候也比较简单：

```ts
class JankMonitor {
  // 心跳 SDK
  private heartBeatMonitor: HeartbeatMonitor;

  constructor() {
    // 初始化并绑定事件
    this.heartBeatMonitor = new HeartbeatMonitor();
    // PS：此处 addEventListener 为伪代码，可自行实现一个事件转发器
    this.heartBeatMonitor.addEventListener("jank", this.handleJank);
    this.heartBeatMonitor.addEventListener("heartbeat", this.handleHeartBeat);

    // 可以初始化的时候就启动
    this.heartBeatMonitor.start();
  }

  /**
   * 处理卡顿
   */
  private handleJank() {}

  /**
   * 处理心跳
   */
  private handleHeartBeat() {}
}
```

这时候可以检测到卡顿了，接下来便是在卡顿发生的时候找到问题并上报了。前面[《前端性能优化--卡顿的监控和定位》](https://godbasin.github.io/2024/01/21/front-end-performance-no-response-solution/)中有大致介绍堆栈的方法，这里我们来介绍下具体要怎么实现吧~

### 堆栈追踪卡顿

同样的，假设我们通过打堆栈的方式来追踪，堆栈信息包括：

```ts
interface IJankLog {
  module: string;
  action: string;
  logTime: number;
}
```

那么，我们的卡顿检测还需要对外提供`log`打堆栈的能力：

```ts
class JankMonitor {
  // 卡顿链路堆栈
  private jankLogStack: IJankLog[] = [];

  log(logPosition: { module: string; action: string }) {
    this.jankLogStack.push({
      ...logPosition,
      logTime: Date.now(),
    });
  }

  private handleHeartBeat() {
    // 心跳的时候，可以将堆栈清空，因为正常心跳发生意味着没有卡顿，此时堆栈内信息可以移除
    this.jankLogStack = [];

    // 清空后，添加心跳信息，方便计算耗时
    this.jankLogStack.push({
      module: "jank",
      action: "heartbeat",
      logTime: Date.now(),
    });
  }

  // ...其他内容省略
}
```

当卡顿发生时，我们可以根据堆栈计算出卡顿产生的位置：

```ts
class JankMonitor {
  private jankLogStack: IJankLog[] = [];

  private handleJank() {
    const jankPosition = this.calculateJankPosition();
    // 拿到卡顿位置后，可以进行上报
    // PS: reportJank 为伪代码，可以根据项目情况自行实现
    reportJank(jankPosition);
    // 打印异常
    console.error("产生了卡顿，位置信息为：", jankPosition);

    // 上报结束后，则需要清空堆栈，继续监听
    this.jankLogStack = [];
  }

  // ...其他内容省略
}
```

下面我们来详细看一下，要怎么计算出卡顿产生的位置。

### 卡顿位置定位

我们在代码中，使用`log`方法来打关键链路日志，那么我们拿到的堆栈信息大概会长这样：

```ts
jankLogStack = [
  {
    module: "数据模块",
    action: "拉取数据",
    logTime: logTime1,
  },
  {
    module: "数据模块",
    action: "加载数据",
    logTime: logTime2,
  },
  {
    module: "Feature 模块",
    action: "处理数据",
    logTime: logTime3,
  },
  {
    module: "渲染模块",
    action: "渲染数据",
    logTime: logTime4,
  },
];
```

当卡顿发生的时候，我们可以将堆栈取出来计算最大耗时的位置：

```ts
class JankMonitor {
  private jankLogStack: IJankLog[] = [];

  private calculateJankPosition() {
    // 记录产生卡顿的位置
    let jankPosition;
    // 记录最大耗时
    let maxCostTime = 0;

    // 遍历堆栈，计算每一步耗时
    // 第一个信息为心跳信息，可从第二个开始算起
    for (let i = 1; i < this.jankLogStack.length; i++) {
      // 上个位置
      const previousPosition = this.jankLogStack[i - 1];
      // 当前位置
      const currentPosition = this.jankLogStack[i];
      // 链路耗时
      const costTime = currentPosition.logTime - previousPosition.logTime;

      // 可以将链路打出来，方便定位
      console.log(
        `${previousPosition.module}-${previousPosition.action} -> ${currentPosition.module}-${currentPosition.action}, 耗时 ${costTime} ms`
      );

      // 找出最大耗时和最大位置
      if (costTime > maxCostTime) {
        maxCostTime = costTime;
        jankPosition = {
          ...currentPosition,
          costTime,
        };
      }
    }

    return jankPosition;
  }

  // ...其他内容省略
}
```

这样我们就可以计算出产生卡顿时，代码执行的整个链路（需要使用`log`记录堆栈），同时可找到耗时最大的位置并进行上报。当然，有时候卡顿产生并不只是一个地方，这里也可以调整为将执行超过一定时间的链路全部进行上报。

现在，我们可以拿到产生卡顿的有效位置，当然前提是需要使用`log`方法记录关键的链路信息。为了方便，我们可以将其做成一个装饰器来使用。

### @jankTrace 装饰器

该装饰器功能很简单，就是调用`JankMonitor.log`方法：

```ts
/**
 * 装饰器，可用于装饰类中的成员方法和箭头函数
 */
export const JankTrace: MethodDecorator | PropertyDecorator = (
  target,
  propertyKey,
  descriptor
) => {
  const className = target.constructor.name;
  const methodName = propertyKey.toString();
  const isProperty = !descriptor;
  const originalMethod = isProperty
    ? (target as any)[propertyKey]
    : descriptor.value;
  if (typeof originalMethod !== "function") {
    throw new Error("JankTrace decorator can only be applied to methods");
  }

  const newFunction = function (...args: any[]) {
    // 打印卡顿堆栈
    jankMonitor.log({
      moduleValue: className,
      actionValue: methodName,
    });
    const syncResult = originalMethod.apply(this, args);
    return syncResult;
  };

  if (isProperty) {
    (target as any)[propertyKey] = newFunction;
  } else {
    descriptor!.value = newFunction as any;
  }
};
```

至此，我们可以直接在一些类方法上去添加装饰器，来实现自动跟踪卡顿链路：

```ts
class DataLoader {
  @JankLog
  getData() {}

  @JankLog
  loadData() {}
}
```

## 结束语

本文简单介绍了卡顿检测的一个实现思路，实际上在项目中还有很多其他问题需要考虑，比如需要设置堆栈上限、状态管理等等。

技术方案在项目中落地时，都需要因地制宜做些调整，来更好地适配自己的项目滴~
