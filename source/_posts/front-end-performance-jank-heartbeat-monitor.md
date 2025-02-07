---
title: 前端性能优化--卡顿心跳检测
date: 2024-06-04 22:00:01
categories: 前端解决方案
tags: 性能优化
---

对于重前端计算的网页来说，性能问题天天都冒出来，而操作卡顿可能会直接劝退用户。

<!--more-->

前面我们在[《前端性能优化--卡顿的监控和定位》](https://godbasin.github.io/2024/01/21/front-end-performance-no-response-solution/)一文中介绍过一些卡顿的检测方案，这里我们来讲一下具体的代码实现逻辑好了。

## requestAnimationFrame 心跳检测

这里我们使用`window.requestAnimationFrame`来作为检测卡顿的核心机制。

前面也有说过，`requestAnimationFrame()`会在浏览器下次重绘之前调用，60Hz 的电脑显示器每秒钟`requestAnimationFrame`会被执行 60 次。

那么，我们可以简单地判断，假设两次`requestAnimationFrame`之间的执行耗时超过一定值，则可以认为浏览器的重绘被阻塞了，页面响应产生了卡顿，这里我们将该值设置为 1s：

``` ts
class HeartbeatMonitor {
    // 上一次心跳的时间
    private preHeartBeatTime: number;

    private checkNextTick() {
        this.preHeartBeatTime = Date.now();
        requestAnimationFrame(() => {
            const currentTime = Date.now();
            // 取出执行耗时
            let timeDistance = currentTime - this.preHeartBeatTime;
            // 超过 1s 则认为是卡顿了
            if (timeDistance > 1000) {
                // 注：dispatchEvent 为伪代码，具体可自行实现
                // 对外抛事件表示发生了卡顿
                this.dispatchEvent('jank');
            } else {
                // 对外抛事件表示为普通心跳
                this.dispatchEvent('heartbeat');
            }
            // 继续下一次检测
            this.checkNextTick();
        });
    }
}
```

通过这种方式，我们简单判断代码执行是否产生了卡顿。当然，我们在实际使用的时候，还需要提供开启和停止检测的能力：

### 启动和停止检测

已知`requestAnimationFrame`的返回值是一个请求 ID，用于唯一标识回调列表中的条目，可以使用`window.cancelAnimationFrame()`来取消刷新回调请求，因此我们可以基于此开实现启动和停止检测的能力：

``` ts
class HeartbeatMonitor {
    // 上一次心跳的时间
    private preHeartBeatTime: number;
    // 心跳定时器
    private heartBeatTimer: number | null = null;

    /**
     * 开启卡顿监控
     */
    start() {
        if (!this.heartBeatTimer) this.checkNextTick();
    }

    /**
     * 结束卡顿监控
     */
    stop() {
        // 取消 requestAnimationFrame
        if (this.heartBeatTimer) cancelAnimationFrame(this.heartBeatTimer);
        this.heartBeatTimer = null;
    }

    private checkNextTick() {
        this.preHeartBeatTime = Date.now();
        this.heartBeatTimer = requestAnimationFrame(() => {
            const currentTime = Date.now();
            // 取出执行耗时
            let timeDistance = currentTime - this.preHeartBeatTime;
            // 超过 1s 则认为是卡顿了
            if (timeDistance > 1000) {
                // 注：dispatchEvent 为伪代码，具体可自行实现
                // 对外抛事件表示发生了卡顿
                this.dispatchEvent('jank');
            } else {
                // 对外抛事件表示为普通心跳
                this.dispatchEvent('heartbeat');
            }
            // 继续下一次检测
            this.checkNextTick();
        });
    }
}
```

当然，对于有状态的运行期，最好我们还可以给其加上一个状态位标志，来避免重复调用、外界获取状态等情况，不过这个很简单，大家可以自行实现。

### 页面隐藏

由于`requestAnimationFrame`基于页面的绘制来执行回调的，当我们页面被切走之后，显然不会触发回调，那么可能存在一个问题：此时检测的耗时很可能会超出卡顿阈值。

因此，我们还需要对页面是否被切走的场景做处理，最简单莫过于页面切走之后就停止，切回来再打开：

``` ts
class HeartbeatMonitor {
    // 上一次心跳的时间
    private preHeartBeatTime: number;
    // 心跳定时器
    private heartBeatTimer: number | null = null;

    constructor() {
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === "hidden") {
                this.stop();
            } else {
                this.start();
            }
        });
    }    

    /**
     * 开启卡顿监控
     */
    start() {
        if (!this.heartBeatTimer) this.checkNextTick();
    }

    /**
     * 结束卡顿监控
     */
    stop() {
        // 取消 requestAnimationFrame
        if (this.heartBeatTimer) cancelAnimationFrame(this.heartBeatTimer);
        this.heartBeatTimer = null;
    }

    private checkNextTick() {
        this.preHeartBeatTime = Date.now();
        this.heartBeatTimer = requestAnimationFrame(() => {
            const currentTime = Date.now();
            // 取出执行耗时
            let timeDistance = currentTime - this.preHeartBeatTime;
            // 超过 1s 则认为是卡顿了
            if (timeDistance > 1000) {
                // 注：dispatchEvent 为伪代码，具体可自行实现
                // 对外抛事件表示发生了卡顿
                this.dispatchEvent('jank');
            } else {
                // 对外抛事件表示为普通心跳
                this.dispatchEvent('heartbeat');
            }
            // 继续下一次检测
            this.checkNextTick();
        });
    }
}
```

## 结束语
现在我们实现了卡顿的检测，但是基于此我们只能得到页面在运行过程中是否产生了卡顿，但是难以定位卡顿的问题出现在哪。前面[《前端性能优化--卡顿的监控和定位》](https://godbasin.github.io/2024/01/21/front-end-performance-no-response-solution/)一文中有大致介绍堆栈的方法，我们下一篇来说一下基于当前的`HeartbeatMonitor`来看看怎么实现。

主要是分两篇来讲的话，我就可以偷个懒啦:)