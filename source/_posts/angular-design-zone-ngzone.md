---
title: Angular框架解读--Zone区域之ngZone
date: 2021-05-30 11:38:21
categories: Angular源码
tags: 功能设计
---

作为“为大型前端项目”而设计的前端框架，Angular 其实有许多值得参考和学习的设计，本系列主要用于研究这些设计和功能的实现原理。本文主要围绕 Angular 中的 NgZone 的设计和实现来介绍。

<!--more-->

上一篇我们介绍了 [zone.js](https://godbasin.github.io/2021/05/01/angular-design-zonejs/)，它解决了很多 Javascript 异步编程时上下文的问题。

NgZone 基于 zone.js 集成了适用于 Angular 框架的一些能力。其中，对于 Angular 中的数据变更检测（脏检查）的性能优化，则主要依赖了 NgZone 的设计，我们一起来看一下。

## NgZone
虽然 zone.js 可以监视同步和异步操作的所有状态，但 Angular 还提供了一项名为 NgZone 的服务。

NgZone 是一种用于在 Angular 区域内部或外部执行工作的可注射服务，对于不需要 Angular 处理 UI 更新或错误处理的异步任务来说，进行了性能优化的工作。

### NgZone 设计
我们来看看 NgZone 的实现：

``` ts
export class NgZone {
  readonly hasPendingMacrotasks: boolean = false;
  readonly hasPendingMicrotasks: boolean = false;
  readonly isStable: boolean = true;
  readonly onUnstable: EventEmitter<any> = new EventEmitter(false);
  readonly onMicrotaskEmpty: EventEmitter<any> = new EventEmitter(false);
  readonly onStable: EventEmitter<any> = new EventEmitter(false);
  readonly onError: EventEmitter<any> = new EventEmitter(false);
  constructor({
    enableLongStackTrace = false,
    shouldCoalesceEventChangeDetection = false,
    shouldCoalesceRunChangeDetection = false
  }) {
    ...
    // 在当前区域创建子区域，作为 Angular 区域
    forkInnerZoneWithAngularBehavior(self);
  }
  // 是否在 Angular 区域里
  static isInAngularZone(): boolean {
    return Zone.current.get('isAngularZone') === true;
  }
  // 在 Angular 区域内同步执行 fn 函数，并返回该函数返回的值
  // 通过 run 运行可让在 Angular 区域之外执行的任务重新进入 Angular 区域
  run<T>(fn: (...args: any[]) => T, applyThis?: any, applyArgs?: any[]): T {
    return (this as any as NgZonePrivate)._inner.run(fn, applyThis, applyArgs);
  }
  // 在 Angular 区域内作为任务同步执行 fn 函数，并返回该函数返回的值
  runTask<T>(fn: (...args: any[]) => T, applyThis?: any, applyArgs?: any[], name?: string): T {
    const zone = (this as any as NgZonePrivate)._inner;
    const task = zone.scheduleEventTask('NgZoneEvent: ' + name, fn, EMPTY_PAYLOAD, noop, noop);
    try {
      return zone.runTask(task, applyThis, applyArgs);
    } finally {
      zone.cancelTask(task);
    }
  }
  // 与 run 相同，除了同步错误是通过 onError 捕获并转发的，而不是重新抛出
  runGuarded<T>(fn: (...args: any[]) => T, applyThis?: any, applyArgs?: any[]): T {
    return (this as any as NgZonePrivate)._inner.runGuarded(fn, applyThis, applyArgs);
  }
  // 在 Angular 区域外同步执行 fn 函数，并返回该函数返回的值
  runOutsideAngular<T>(fn: (...args: any[]) => T): T {
    return (this as any as NgZonePrivate)._outer.run(fn);
  }
}
```

NgZone 基于 zone.js 之上再做了一层封装，通过`fork`创建出子区域作为 Angular 区域：

``` ts
function forkInnerZoneWithAngularBehavior(zone: NgZonePrivate) {
  ...
  // 创建子区域，为 Angular 区域
  zone._inner = zone._inner.fork({
    name: 'angular',
    properties: <any>{'isAngularZone': true},
    ...
  });
}
```

除此之外，NgZone 里添加了用于表示没有微任务或宏任务的属性`isStable`，可用于状态的检测。另外，NgZone 还定义了四个事件：

- `onUnstable`: 通知代码何时进入 Angular Zone，首先会在 VM Turn 上触发
- `onMicrotaskEmpty`: 通知当前的 VM Turn 中没有更多的微任务排队。这是 Angular 进行更改检测的提示，它可能会排队更多的微任务（此事件可在每次 VM 翻转时触发多次）
- `onStable`: 通知最后一个`onMicrotaskEmpty`已运行并且没有更多的微任务，这意味着即将放弃 VM 转向（此事件仅被调用一次）
- `onError`: 通知已传送错误

上一节我们讲到，zone.js 处理了大多数异步 API，比如`setTimeout()`、`Promise.then()`和`addEventListener()`等。对于一些 zone.js 无法处理的第三方 API，NgZone 服务的`run()`方法可允许在 angular Zone 中执行函数。

通过使用 Angular Zone，函数中的所有异步操作会在正确的时间自动触发变更检测。

### 自动触发变更检测
当 NgZone 满足以下条件时，会创建一个名为 angular 的 Zone 来自动触发变更检测：

- 当执行同步或异步功能时（zone.js 内置变更检测，最终会通过`onMicrotaskEmpty`来触发）
- 已经没有已计划的 Microtask（`onMicrotaskEmpty`）

`onMicrotaskEmpty`条件的触发监听，以及检测逻辑位于`ApplicationRef`中：

``` ts
@Injectable()
export class ApplicationRef {
  ...
  constructor(
      private _zone: NgZone, private _injector: Injector, private _exceptionHandler: ErrorHandler,
      private _componentFactoryResolver: ComponentFactoryResolver,
      private _initStatus: ApplicationInitStatus) {
    // Microtask 为空时，触发变更检测
    this._onMicrotaskEmptySubscription = this._zone.onMicrotaskEmpty.subscribe({
      next: () => {
        this._zone.run(() => {
          // tick 为变更检测的逻辑，会重新进行 template 的计算和渲染
          this.tick();
        });
      }
    });
    ...
}
```

我们来看看，在什么时候会触发`onMicrotaskEmpty`事件：

``` ts
function checkStable(zone: NgZonePrivate) {
  if (zone._nesting == 0 && !zone.hasPendingMicrotasks && !zone.isStable) {
    try {
      zone._nesting++;
      zone.onMicrotaskEmpty.emit(null);
    } finally {
      zone._nesting--;
      if (!zone.hasPendingMicrotasks) {
        try {
          zone.runOutsideAngular(() => zone.onStable.emit(null));
        } finally {
          zone.isStable = true;
        }
      }
    }
  }
}
```

当`onInvokeTask`和`onInvoke`两个钩子被触发时，微任务队列中可能会发生变化，因此 Angular 必须在每次钩子被触发时运行检查。除此之外，`onHasTask`挂钩还用于执行检查，因为它跟踪整个队列更改：

``` ts
function forkInnerZoneWithAngularBehavior(zone: NgZonePrivate) {
  const delayChangeDetectionForEventsDelegate = () => {
    // delayChangeDetectionForEvents 内部调用了 checkStable()
    delayChangeDetectionForEvents(zone);
  };
  zone._inner = zone._inner.fork({
    ...
    onInvokeTask:
        (delegate: ZoneDelegate, current: Zone, target: Zone, task: Task, applyThis: any, applyArgs: any): any => {
          ...
          // 进行检测
          delayChangeDetectionForEventsDelegate();
        },

    onInvoke:
        (delegate: ZoneDelegate, current: Zone, target: Zone, callback: Function, applyThis: any, applyArgs?: any[], source?: string): any => {
          ...
          // 进行检测
          delayChangeDetectionForEventsDelegate();
        },

    onHasTask:
        (delegate: ZoneDelegate, current: Zone, target: Zone, hasTaskState: HasTaskState) => {
          ...
          if (current === target) {
            // 只检查当前区域的任务
            if (hasTaskState.change == 'microTask') {
              zone._hasPendingMicrotasks = hasTaskState.microTask;
              updateMicroTaskStatus(zone);
              // 跟踪 MicroTask 队列，并进行检查
              checkStable(zone);
            }
            ...
          }
        },
  });
}
```

默认情况下，所有异步操作都在 Angular Zone 内，这会自动触发变更检测。

另一个常见的情况是我们不想触发变更检测（比如不希望像`scroll`等事件过于频繁地进行变更检测，从而导致性能问题），此时可以使用 NgZone 的`runOutsideAngular()`方法。

zone.js 能帮助 Angular 知道何时要触发变更检测，使得开发人员专注于应用开发。默认情况下，zone.js 已加载且无需其他配置即可工作。如果希望选择自己触发变更检测，则可以通过禁用 zone.js 的方式来处理。

## 总结
本文介绍了 NgZone 在 zone.js 的基础上进行了封装，从而使得在 Angular Zone 内函数中的所有异步操作可以在正确的时间自动触发变更检测。

可以根据自身的需要，使用 NgZone 的`runOutsideAngular()`方法减少变更检测，也可以通过禁用 zone.js 的方式，来自己实现变更检测的逻辑。

### 参考
- [Angular-NgZone](https://angular.cn/guide/zone)
- [Do you still think that NgZone (zone.js) is required for change detection in Angular?](https://indepth.dev/posts/1059/do-you-still-think-that-ngzone-zone-js-is-required-for-change-detection-in-angular)