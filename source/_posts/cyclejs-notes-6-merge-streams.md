---
title: Cycle.js学习笔记6--合流
date: 2017-09-24 13:56:18
categories: cyclejs哈根达斯
tags: 笔记
---
因为对Rxjs的好感玩上了Cycle.js，《Cycle.js学习笔记》系列用于记录使用该框架的一些笔记。
本文介绍xStream的合流处理，并手动实现其中的combine方法。
<!--more-->

## 合流
---

### [xStream](https://github.com/staltz/xStream)
xStream和rxjs类似，都是reactive programming在js上的实现。
xStream比较轻量级一点，特别为Cycle.js做了兼容。

xStream拥有四种基础类型：
1. [流（`Stream`）](https://github.com/staltz/xstream#stream)：一个拥有多个事件监听器的事件发射器。

2. [监听器（`Listener`）](https://github.com/staltz/xstream#listener)：一个带有`next`, `error`, 和`complete`其中1-3个函数的对象。

``` js
var listener = {
  next: (value) => {
    console.log('The Stream gave me a value: ', value);
  },
  error: (err) => {
    console.error('The Stream gave me an error: ', err);
  },
  complete: () => {
    console.log('The Stream told me it is done.');
  },
}
```

3. [发射器（`Producer`）](https://github.com/staltz/xstream#producer)：发射通过流传播的事件。

``` js
var producer = {
  start: function (listener) {
    this.id = setInterval(() => listener.next('你好'), 1000)
  },

  stop: function () {
    clearInterval(this.id)
  },

  id: 0,
}

// 每隔1秒发送“你好”
var stream = xs.create(producer)
```

4. [记忆流（`MemoryStream`）](https://github.com/staltz/xstream#memorystream)：可用于保存最近一次数据。

常用工厂函数：`create`, `from`, `of`, `merge`, `combine`等。
常用方法和操作：`addListener`, `removeListener`, `subscribe`, `map`, `mapTo`, `filter`, `startWith`等。
更多说明可以查看[官方文档](https://github.com/staltz/xStream)，虽然上面说明也不是很详细。

### xstream合流
这里面有两个工厂方法：`merge` 和 `combine`。

- `merge(stream1, stream2)`

该方法会将多个流合在一起，同步更新流。

``` md
--1----2-----3--------4---
----a-----b----c---d------
           merge
--1-a--2--b--3-c---d--4---
```

- `combine(stream1, stream2)`

该方法会将多个输入流合入，并始终返回各个流上一次的合流。

``` md
--1----2-----3--------4---
----a-----b-----c--d------
         combine
----1a-2a-2b-3b-3c-3d-4d--
```

使用方式：

``` js
const stream1 = xs.of(1);
const stream2 = xs.of(2);

xs.combine(stream1, stream2).map(
  combinedEmissions => ([ ...combinedEmissions ])
)
```

### combine流的实现
这里，本骚年开始的时候没有发现`combine`方法合流，一直用的`merge`，然后自己弄了个实现方式，直至看到了`combine`[捂脸]。

既然写都写了，可以分享一下，不知道是不是`combine`的实现，但最后功能使用是一样的：

``` js
import xs from 'xstream';

export function merge(...origins) {
    // state用来缓存上次状态
    let state: any = []
    // 获取输入的次序，并将每个流匹配到对应的次序
    let keys = Object.keys(origins);
    keys.forEach(key => {
        origins[key] = origins[key].map(x => { let y = {}; y[key] = x; return y; })
    })
    return xs.merge(...origins).map((res: any) => {
        // 判断更新的流，更新对应的流
        keys.forEach(key => {
            state[key] = res[key] ? res[key] : state[key]
        })
        // 输出数组
        return [...state]
    })
}
```

当然，这个功能最后使用的时候，有个跟`combine`不一样的地方：

``` md
--1----2-----3--------4---
----a-----b-----c--d------
        my merge
--1-1a-2a-2b-3b-3c-3d-4d--

--1----2-----3--------4---
----a-----b-----c--d------
         combine
----1a-2a-2b-3b-3c-3d-4d--
```

也就是说，第一次单流流动的时候也是有更新和输出的。

## 结束语
-----
这节主要简单介绍了xStream，以及合流相关方法和其中的一些实现探索。
目前还没有解决第四节的问题，但是距离也一步步跟进了，我们慢慢深入探索，一些浅显的东西也便会出来了。