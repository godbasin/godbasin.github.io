---
title: 如何设计一个任务管理器
date: 2020-11-01 10:13:02
categories: 前端解决方案
tags: 逻辑实现
---

一般来说，我们在遇到对顺序要求严格的任务执行时，就需要维护一个任务管理器，保证任务的执行顺序。前端开发过程中，设计队列/栈的场景比较多，而需要用到任务管理器的场景偏少，本文主要介绍如何实现一个任务管理器。

<!--more-->

理解任务管理器比较好的场景大概是协同文档编辑的场景，比如 Google Docs、腾讯文档、Sketch 协同等。我们在进行协同编辑的时候，对版本和消息时序有比较严格的要求，因此常常需要维护一个任务管理器来管理版本相关的任务。

以上是一些科普知识，用于辅助大家理解接下来的任务管理器设计，下面我们来进入正文。

## 单个任务的设计
对于单个任务的设计，主要考虑任务的执行。一个任务的作用就是用来运行的，那么对于任务来说，可能会有几个状态：待执行、正在执行、执行失败、执行成功等：

``` ts
enum TASK_STATUS {
    INIT = 'INIT', // 初始状态
    READY = 'READY', // 可执行
    RUNNING = 'RUNNING', // 执行中
    SUCCESS = 'SUCCESS', // 执行成功
    FAILED = 'FAILED', // 执行失败
    DESTROY = 'DESTROY', // 已销毁
}
```

### 生命周期
既然涉及到任务的各个状态，我们也可以赋予任务一些生命周期。这里我们举一些例子，但最终的生命周期设计应该要和自己业务实际情况结合。

**onReady: 任务执行前准备工作**

在每个任务执行之前，我们都需要再次确认下这个任务的状态（是否已经失效），也可能需要做些准备工作，这个阶段可以命名为`onReady`：

``` ts
export interface ICommonTask {
	onReady(): Promise<boolean>;
}
```

可以看到，该生命周期以返回 Promise 的方式来运行，该 Promise 包括一个布尔值，用于判断任务是否继续执行。比如我们需要在执行任务之前，从服务端获取一些数据，那么可以这么实现：

``` ts
class ATask implements ICommonTask {
    async onReady() {
        const result = await getSomeDate();
        if (result.isSuccess) {
            return true;
        }
        return false
    }
}
```

**onRun: 任务执行中**

任务准备工作完成之后，任务就需要开始真正运行了。同样的，我们将这个阶段命名为`onRun`：

``` ts
export interface ICommonTask {
	onReady(): Promise<boolean>;
	onRun(): Promise<CommonTask[] | void>;
}
```

这里我们看到，`onRun`阶段执行同样返回一个 Promise，但 Promise 内容和`onReady`阶段不一致，它可能返回一个或者多个`CommonTask`组成的数组。这是因为一个任务执行的过程中，可能会产生新的任务，也可能由于其他条件限制，导致它需要创建一个别的任务先执行完毕，才能继续执行自己原本的任务。比如，B 任务在执行的时候，如果条件不满足，则需要先执行一个 A 任务：

``` ts
class BTask implements ICommonTask {
    // 其他省略
    async onRun() {
        if (needATask) {
            return [new ATask(), this.resetTask()];
        }
        // 其他正常执行任务逻辑
    }
}
```

**onDestroy: 任务执行完毕，即将销毁**

很多时候我们实现一些模块功能，都会产生一些临时变量，也可能有一些事件绑定、DOM 元素需要在该模块注销的时候清除，因此进行主动的销毁和清理是一个很好的习惯。对于一个任务的执行来说也是一样的，我们将这个阶段命名为`onDestroy`：

``` ts
export interface ICommonTask {
	onReady(): Promise<boolean>;
    onRun(): Promise<CommonTask[] | void>;
    onDestroy(): Promise<void>;
}
```

对于任务的生命周期相关，我们暂时讲到这里，接下来我们来看任务的执行。

### 任务执行
由于每个任务都会有状态、生命周期、执行功能、重置功能，我们可以实现一个通用的任务：

``` ts
abstract class CommonTask implements ICommonTask {
    /** 生命周期钩子 **/
    abstract onReady: () => Promise<boolean>;
    abstract onRun: () => Promise<CommonTask[] | void>;
    abstract onDestroy: () => Promise<void>;

    /** 执行任务 **/
    public async execute(): Promise<CommonTask[] | void> {
        // step 1 准备任务
        if (!await this.onReady()) {
            // 任务准备校验不通过，直接没必要执行了
            return this.onDestroy();
        }
        // step 2 执行任务
        const runResult = await this.onRun();
        if (runResult) {
            // 若分裂出新的任务，返回并不再继续执行了
            return runResult;
        }
        // step 3 销毁任务
        this.onDestroy();
    }
}
```

这里 CommonTask 提供了一个通用的`execute`方法用于执行任务，我们能看到其中的实现也是根据生命周期依次执行。当然，这里其实还需要在执行到对应生命周期的时候，扭转任务状态。除此之外，任务执行异常的处理也并不在这里，因此外界需要进行`try catch`处理。

那么到底在哪里需要进行异常处理呢？我们接下来看看任务管理器。

## 任务管理器
显然，任务管理器的职责主要是保证任务队列中的任务有序、顺利地执行，其中会包括任务执行时的异常处理。除此之外，任务管理器还需要对外提供添加任务，以及暂停、恢复、停止这样的能力。

### 任务管理器状态
既然任务管理器有对任务的管理，当然它也需要维护自身的状态，例如：

``` ts
enum QUEUE_STATUS {
    WORKING = 'WORKING', // 工作中
    PAUSE = 'PAUSE', // 暂停
    IDLE = 'IDLE', // 空闲
    SHUTDOWN = 'SHUTDOWN', // 关停
}
```

这些是任务管理器基本的状态，包括空闲状态、工作中、暂停、停止等。对于每一个不同的状态来说，相应的任务管理器也会有一些更新状态的方法：

``` ts
class TaskManager {
    status: QUEUE_STATUS = QUEUE_STATUS.IDLE;
    // 暂停任务管理器
    public pause() {
        this.status = QUEUE_STATUS.PAUSE;
        // 当前正在运行的任务需要处理
    }
    // 恢复任务管理器
    public resume() {
        // 如果被关停了，则不能恢复啦
        if (isShutDown) { return; }
        this.status = QUEUE_STATUS.WORKING;
        this.work();
    }
    // 关停任务管理器
    public resume() {
        this.status = QUEUE_STATUS.SHUTDOWN;
    }
    // 任务管理器工作
    private work() {
        if(!isWorking && hasNextTask) {
            // 如果有会继续执行下一个任务
            // 直到任务管理器被暂停、或者任务队列为空
            runNextTask();
        }
    }
}
```

这里面比较关键的点有两个：
1. 暂停任务管理器的时候，需要考虑如何处理正在运行的任务。
2. 执行任务的时候，需要进行一些异常处理。同时，任务的运行可能会进行分裂并产生新的任务，需要对新任务进行处理。

### 暂停与恢复
我们先来看第一点：任务管理器暂停和恢复时的处理。

一个简单粗暴的处理方式是，将当前正在运行的任务继续运行完成。但这种处理方式，与我们对于暂停的理解有一些误差。因此，我们可以考虑让任务本身支持重置的功能，比如运行过程中判断任务状态是否需要继续执行，结合销毁当前任务、并将原有任务进行重置。

``` ts
abstract class CommonTask {
    /** 重置任务 **/
    // 会返回任务本身，该任务应该是被重置过的最初状态
    abstract reset(): CommonTask;
}
```

实现起来其实也不会很难：

``` ts
class ATask extends CommonTask {
    public reset() {
        // 销毁当前任务
        this.destroy();
        // 并返回一个重置后的新任务
        return new ATask();
    }
}
```

对于任务管理器来说，要做的事情也比较简单了：暂停任务管理器的时候，将当前任务重置、并扔回任务队列的头部。

``` ts
class TaskManager {
    // 暂停任务管理器
    public pause() {
        this.status = QUEUE_STATUS.PAUSE;
        // 将当前任务重置，并扔回任务队列头部
        taskList.unshift(currentTask.reset());
    }
}
```

### 任务管理器工作
任务管理器工作的时候，主要工作内容包括依次运行任务、处理任务异常、处理任务运行后分裂产生的新任务。

``` ts
class TaskManager {
    // 任务管理器工作
    private async work() {
        if(!isWorking && hasNextTask) {
            // 如果满足条件，会继续执行下一个任务
            currentTask = getNextTask();
            const resultTask = await currentTask.execute().catch((error) => {
	            // 异常处理
            });
            // 判断是否有分裂的新任务
	        if (resultTask) {
	            // 如果有，就塞回到任务队列的头部，需要优先处理
	            taskList.unshift(resultTask);
            }
            // 继续执行下一个任务
            checkContinueWork();
        }
    }
}
```

以上大概是我们在设计一个任务管理器的过程中，需要进行思考的一些问题、和简单的实现方式。除此之外，在一个更加复杂的应用场景下，我们还可能会遇到多个任务队列的管理和资源调度、同步任务和异步任务的管理、任务支持优先级设置等各式各样的功能设计。

## 结束语
任务管理也好、队列/堆栈的设计也好，都会在工程中经常遇到。而随着应用场景的不一样，我们的设计并不能简单地进行复用，每一次都可以结合业务本身、工程本身而设计出更加合适的调整，每一次我们也都可以给自己提出不一样的要求。
