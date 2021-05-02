---
title: Angular框架解读--Zone区域之zone.js
date: 2021-05-01 10:58:22
categories: Angular源码
tags: 功能设计
---

作为“为大型前端项目”而设计的前端框架，Angular 其实有许多值得参考和学习的设计，本系列主要用于研究这些设计和功能的实现原理。本文主要围绕 Angular 中的 NgZone 核心能力，这些能力主要基于 zone.js 来实现，因此本文先介绍 zone.js。

<!--more-->

在 Angular 中，对于数据变更检测使用的是脏检查（dirty check），这曾经在 AngularJS 版本中被诟病，认为存在性能问题。而在 Angular(2+) 版本之后，通过引入模块化组织，以及 NgZone 的设计，提升了脏检查的性能。

对于 NgZone 的引入，并不只是为了解决脏检查的问题，它解决了很多 Javascript 异步编程时上下文的问题，其中 zone.js 便是针对异步编程提出的作用域解决方案。

## zone.js

Zone 是跨异步任务而持久存在的执行上下文，zone.js 提供以下能力：

- 提供异步操作之间的执行上下文
- 提供异步生命周期挂钩
- 提供统一的异步错误处理机制

### 异步操作的困惑
在 Javascript 中，[代码执行过程中会产生堆栈，函数会在堆栈中执行](https://blog.sessionstack.com/how-does-javascript-actually-work-part-1-b0bacc073cf#6e11)。

对于异步操作来说，异步代码和函数执行的时候，上下文可能发生了变化，为此可能导致一些难题。比如：

- 异步代码执行时，上下文发生了变更，导致预期不一致
- `throw Error`时，无法准确定位到上下文
- 测试某个函数的执行耗时，但因为函数内有异步逻辑，无法得到准确的执行时间

一般来说，异步代码执行时的上下文问题，可以通过传参或是全局变量的方式来解决，但两种方式都不是很优雅（尤其全局变量）。zone.js 正是为了解决以上问题而提出的，我们来看看。

### zone.js 的设计
zone.js 的设计灵感来自 [Dart Zones](https://dart.dev/articles/archive/zones)，你也可以将其视为 JavaScript VM 中的 [TLS--线程本地存储](https://en.wikipedia.org/wiki/Thread-local_storage)。

zone 具有当前区域的概念：当前区域是随所有异步操作一起传播的异步上下文，它表示与当前正在执行的堆栈帧/异步任务关联的区域。

当前上下文可以使用`Zone.current`获取，可比作 Javascript 中的`this`，在 zone.js 中使用`_currentZoneFrame`变量跟踪当前区域。每个区域都有`name`属性，主要用于工具和调试目的，zone.js 还定义了用于操纵区域的方法：

- `zone.fork(zoneSpec)`: 创建一个新的子区域，并将其`parent`设置为用于分支的区域
- `zone.run(callback, ...)`：在给定区域中同步调用一个函数
- `zone.runGuarded(callback, ...)`：与`run`捕获运行时错误相同，并提供了一种拦截它们的机制。如果任何父区域未处理错误，则将其重新抛出。
- `zone.wrap(callback)`：产生一个新的函数，该函数将区域绑定在一个闭包中，并在执行`zone.runGuarded(callback)`时执行，与 JavaScript 中的`Function.prototype.bind`工作原理类似。

我们可以看到`Zone`的主要实现逻辑（`new Zone()`/`fork()`/`run()`）也相对简单：

``` ts
class Zone implements AmbientZone {
  // 获取根区域
  static get root(): AmbientZone {
    let zone = Zone.current;
    // 找到最外层，父区域为自己
    while (zone.parent) {
      zone = zone.parent;
    }
    return zone;
  }
  // 获取当前区域
  static get current(): AmbientZone {
    return _currentZoneFrame.zone;
  }
  private _parent: Zone|null; // 父区域
  private _name: string; // 区域名字
  private _properties: {[key: string]: any};
  // 拦截区域操作时的委托，用于生命周期钩子相关处理
  private _zoneDelegate: ZoneDelegate;

  constructor(parent: Zone|null, zoneSpec: ZoneSpec|null) {
    // 创建区域时，设置区域的属性
    this._parent = parent;
    this._name = zoneSpec ? zoneSpec.name || 'unnamed' : '<root>';
    this._properties = zoneSpec && zoneSpec.properties || {};
    this._zoneDelegate =
        new ZoneDelegate(this, this._parent && this._parent._zoneDelegate, zoneSpec);
  }
  // fork 会产生子区域
  public fork(zoneSpec: ZoneSpec): AmbientZone {
    if (!zoneSpec) throw new Error('ZoneSpec required!');
    // 以当前区域为父区域，调用 new Zone() 产生子区域
    return this._zoneDelegate.fork(this, zoneSpec);
  }
  // 在区域中同步运行某段代码
  public run(callback: Function, applyThis?: any, applyArgs?: any[], source?: string): any;
  public run<T>(
      callback: (...args: any[]) => T, applyThis?: any, applyArgs?: any[], source?: string): T {
    // 准备执行，入栈处理
    _currentZoneFrame = {parent: _currentZoneFrame, zone: this};
    try {
      // 使用 callback.apply(applyThis, applyArgs) 实现
      return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
    } finally {
      // 执行完毕，出栈处理
      _currentZoneFrame = _currentZoneFrame.parent!;
    }
  }
  ...
}
```

除了上面介绍的，Zone 还提供了许多方法来运行、计划和取消任务，包括：

``` ts
interface Zone {
  ...
  // 通过在任务区域中恢复 Zone.currentTask 来执行任务
  runTask<T>(task: Task, applyThis?: any, applyArgs?: any): T;
  // 安排一个 MicroTask
  scheduleMicroTask(source: string, callback: Function, data?: TaskData, customSchedule?: (task: Task) => void): MicroTask;
  // 安排一个 MacroTask
  scheduleMacroTask(source: string, callback: Function, data?: TaskData, customSchedule?: (task: Task) => void, customCancel?: (task: Task) => void): MacroTask;
  // 安排一个 EventTask
  scheduleEventTask(source: string, callback: Function, data?: TaskData, customSchedule?: (task: Task) => void, customCancel?: (task: Task) => void): EventTask;
  // 安排现有任务（对重新安排已取消的任务很有用）
  scheduleTask<T extends Task>(task: T): T;
  // 允许区域拦截计划任务的取消，使用 ZoneSpec.onCancelTask​​ 配置拦截
  cancelTask(task: Task): any;
}
```

### 让异步逻辑运行在指定区域中
在 zone.js 中，通过`zone.fork`可以创建子区域，通过`zone.run`可让函数（包括函数里的异步逻辑）在指定的区域中运行。举个例子：

``` ts
const zoneBC = Zone.current.fork({name: 'BC'});
function c() {
    console.log(Zone.current.name);  // BC
}
function b() {
    console.log(Zone.current.name);  // BC
    setTimeout(c, 2000);
}
function a() {
    console.log(Zone.current.name);  // <root>
    zoneBC.run(b);
}

a();
```

执行的效果如图：
![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/angular-zone-1.png)

实际上，每个异步任务的调用堆栈会以根区域开始。因此，在 zone.js 中该区域会使用与任务关联的信息来还原正确的区域，然后调用该任务：

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/angular-zone-2.png)

对于`Zone.fork()`和`Zone.run()`的作用和实现，上面已经介绍过了。那么，zone.js 是如何识别出异步任务的呢？其实 zone.js 主要是通过猴子补丁拦截异步 API（包括 DOM 事件、`XMLHttpRequest`和 NodeJS 的 API 如`EventEmitter`、`fs`等）来实现这些功能：

``` ts
// 为指定的本地模块加载补丁
static __load_patch(name: string, fn: _PatchFn, ignoreDuplicate = false): void {
  // 检查是否已经加载补丁
  if (patches.hasOwnProperty(name)) {
    if (!ignoreDuplicate && checkDuplicate) {
      throw Error('Already loaded patch: ' + name);
    }
  // 检查是否需要加载补丁
  } else if (!global['__Zone_disable_' + name]) {
    const perfName = 'Zone:' + name;
    // 使用 performance.mark 标记时间戳
    mark(perfName);
    // 拦截指定异步 API，并进行相关处理
    patches[name] = fn(global, Zone, _api);
    // 使用 performance.measure 计算耗时
    performanceMeasure(perfName, perfName);
  }
}
```

以`setTimeout`等定时器为例子，通过拦截和捕获特定 API：

``` ts
Zone.__load_patch('timers', (global: any) => {
  const set = 'set';
  const clear = 'clear';
  patchTimer(global, set, clear, 'Timeout');
  patchTimer(global, set, clear, 'Interval');
  patchTimer(global, set, clear, 'Immediate');
});
```

`patchTimer`做了很多兼容性的逻辑处理，包括 Node.js 和浏览器环境的检测和处理，其中比较关键的实现逻辑在：

``` ts
// 检测该函数属性是否可写
if (isPropertyWritable(desc)) {
  const patchDelegate = patchFn(delegate!, delegateName, name);
  // 修改函数默认行为
  proto[name] = function() {
    return patchDelegate(this, arguments as any);
  };
  attachOriginToPatched(proto[name], delegate);
  if (shouldCopySymbolProperties) {
    copySymbolProperties(delegate, proto[name]);
  }
}
// patchFn 用于使用当前的区域创建 MacroTask 任务
const patchFn = function(self: any, args: any[]) {
  if (typeof args[0] === 'function') {
    ...
    const callback = args[0];
    args[0] = function timer(this: unknown) {
      try {
        // 执行该函数
        return callback.apply(this, arguments);
      } finally {
        // 一些清理工作，比如删除任务的引用等
        }
      }
    };
    // 使用当前的区域创建 MacroTask 任务，调用 Zone.current.scheduleMacroTask
    const task = scheduleMacroTaskWithCurrentZone(setName, args[0], options, scheduleTask, clearTask);
    if (!task) {
      return task;
    }
    // 一些兼容性处理工作，比如对于nodejs 环境，将任务引用保存在 timerId 对象中，用于 clearTimeout
    return task;
  } else {
    // 出现异常时，直接返回调用
    return delegate.apply(window, args);
  }
};
```

在这里，计时器相关的 Timer 会被创建 MacroTask 任务并添加到 Zone 的任务中进行处理。在 zone.js 中，有将各种异步任务拆分为三种：

``` ts
type TaskType = 'microTask'|'macroTask'|'eventTask';
```

zone.js 可以支持选择性地打补丁，具体更多的补丁机制可以参考 [Zone.js's support for standard apis](https://github.com/angular/angular/blob/master/packages/zone.js/STANDARD-APIS.md)。

### 任务执行的生命周期
zone.js 提供了异步操作生命周期钩子，有了这些钩子，Zone 可以监视和拦截异步操作的所有生命周期：

- `onScheduleTask`：此回调将在`async`操作为之前被调用`scheduled`，这意味着`async`操作即将发送到浏览器（或 NodeJS ）以计划在以后运行时
- `onInvokeTask`：此回调将在真正调用异步回调之前被调用
- `onHasTask`：当任务队列的状态在`empty`和之间更改时，将调用此回调`not empty`

完整的生命周期钩子包括：

``` ts
interface ZoneSpec {
  // 允许拦截 Zone.fork，对该区域进行 fork 时，请求将转发到此方法以进行拦截
  onFork?: (parentZoneDelegate: ZoneDelegate, currentZone: Zone, targetZone: Zone, zoneSpec: ZoneSpec) => Zone;
  // 允许拦截回调的 wrap
  onIntercept?: (parentZoneDelegate: ZoneDelegate, currentZone: Zone, targetZone: Zone, delegate: Function, source: string) => Function;
  // 允许拦截回调调用
  onInvoke?: (parentZoneDelegate: ZoneDelegate, currentZone: Zone, targetZone: Zone, delegate: Function, applyThis: any, applyArgs?: any[], source?: string) => any;
  // 允许拦截错误处理
  onHandleError?: (parentZoneDelegate: ZoneDelegate, currentZone: Zone, targetZone: Zone, error: any) => boolean;
  // 允许拦截任务计划
  onScheduleTask?: (parentZoneDelegate: ZoneDelegate, currentZone: Zone, targetZone: Zone, task: Task) => Task;
  // 允许拦截任务回调调用
  onInvokeTask?: (parentZoneDelegate: ZoneDelegate, currentZone: Zone, targetZone: Zone, task: Task, applyThis: any, applyArgs?: any[]) => any;
  // 允许拦截任务取消
  onCancelTask?: (parentZoneDelegate: ZoneDelegate, currentZone: Zone, targetZone: Zone, task: Task) => any;
  // 通知对任务队列为空状态的更改
  onHasTask?: (parentZoneDelegate: ZoneDelegate, currentZone: Zone, targetZone: Zone, hasTaskState: HasTaskState) => void;
}
```

这些生命周期的钩子回调会在`zone.fork()`时，通过`new Zone()`创建子区域并创建和传入到`ZoneDelegate`中：

``` ts
class Zone implements AmbientZone {
  constructor(parent: Zone|null, zoneSpec: ZoneSpec|null) {
    ...
    this._zoneDelegate = new ZoneDelegate(this, this._parent && this._parent._zoneDelegate, zoneSpec);
  }
}
```

以`onFork`为例：

``` ts
class ZoneDelegate implements AmbientZoneDelegate {
  constructor(zone: Zone, parentDelegate: ZoneDelegate|null, zoneSpec: ZoneSpec|null) {
    ...
    // 管理 onFork 钩子回调
    this._forkZS = zoneSpec && (zoneSpec && zoneSpec.onFork ? zoneSpec : parentDelegate!._forkZS);
    this._forkDlgt = zoneSpec && (zoneSpec.onFork ? parentDelegate : parentDelegate!._forkDlgt);
    this._forkCurrZone =
        zoneSpec && (zoneSpec.onFork ? this.zone : parentDelegate!._forkCurrZone);
  }
  // fork 调用时，会检查是否有 onFork 钩子回调注册，并进行调用
  fork(targetZone: Zone, zoneSpec: ZoneSpec): AmbientZone {
    return this._forkZS ? this._forkZS.onFork!(this._forkDlgt!, this.zone, targetZone, zoneSpec) : new Zone(targetZone, zoneSpec);
  }
}
```

这便是 zone.js 中生命周期钩子的实现。有了这些钩子，我们可以做很多其他有用的事情，例如分析、记录和限制函数的执行和调用。

## 总结
本文我们主要介绍了 zone.js，它被设计用于解决异步编程中的执行上下文问题。

在 zone.js 中，当前区域是随所有异步操作一起传播的异步上下文，可比作 Javascript 中的`this`。通过`zone.fork`可以创建子区域，通过`zone.run`可让函数（包括函数里的异步逻辑）在指定的区域中运行。

zone.js 提供了丰富的生命周期钩子，可以使用 zone.js 的区域能力以及生命周期钩子解决前面我们提到的这些问题：

- 异步代码执行时，上下文发生了变更，导致预期不一致：使用 Zone 来执行相关代码
- `throw Error`时，无法准确定位到上下文：使用生命周期钩子`onHandleError`进行处理和跟踪
- 测试某个函数的执行耗时，但因为函数内有异步逻辑，无法得到准确的执行时间：使用生命周期钩子配合可得到具体的耗时

### 参考
- [Deep dive into Zone.js [Part 1: Execution Context]](https://medium.com/ngconf/deep-dive-into-zone-js-part-1-execution-context-92166bbb957)
- [Deep dive into Zone.js [Part 2: LifeCycle Hooks]](https://medium.com/ngconf/deep-dive-into-zone-js-part-2-lifecycle-hooks-169da568227e)
- [I reverse-engineered Zones (zone.js) and here is what I’ve found](https://indepth.dev/posts/1135/i-reverse-engineered-zones-zone-js-and-here-is-what-ive-found)