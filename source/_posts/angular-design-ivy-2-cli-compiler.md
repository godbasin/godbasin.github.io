---
title: Angular框架解读--Ivy编译器之CLI编译器
date: 2021-10-31 11:01:12
categories: Angular源码
tags: 功能设计
---

作为“为大型前端项目”而设计的前端框架，Angular 其实有许多值得参考和学习的设计，本系列主要用于研究这些设计和功能的实现原理。本文围绕 Angular 的核心功能 Ivy 编译器，介绍其中CLI层面的编译器编译过程。

<!--more-->

在 Angular 中实现了自己的编译器，来处理 TypeScript 编译器无法完全做到的一些事情。在 Ivy 编译器中，这部分的能力又做了进一步的提升，比如模板类型检查、模块依赖解析等等。

## Ivy 编译器

在前面[Angular 框架解读--Ivy 编译器整体设计](https://godbasin.github.io/2021/08/15/angular-design-ivy-0-design/)一文中，我有介绍 Ivy 编译器主要包括两部分：

1. `ngtsc`：作为主要的 Ivy 编译器，将 Angular 装饰器化为静态属性。
2. `ngcc`：作为兼容性的 Ivy 编译器，主要负责处理来自 NPM 的代码并生成等效的 Ivy 版本。

本文将会主要围绕`ngtsc`该编译器进行介绍。

### Angular 中的 AST 解析

要实现 AST 的解析和转换，离不开解析器。对于 Typescript 代码来说，编译器的整体流程为：

```
                                                                |------------|
                           |----------------------------------> | TypeScript |
                           |                                    |   .d.ts    |
                           |                                    |------------|
                           |
|------------|          |-----|               |-----|           |------------|
| TypeScript | -parse-> | AST | ->transform-> | AST | ->print-> | JavaScript |
|   source   |    |     |-----|       |       |-----|           |   source   |
|------------|    |        |          |                         |------------|
                  |    type-check     |
                  |        |          |
                  |        v          |
                  |    |--------|     |
                  |--> | errors | <---|
                       |--------|
```

该过程包括四个步骤：

1. parse 解析：它是一个传统的递归下降解析器，稍微调整以支持增量解析，它发出一个抽象语法树 (AST)，有助于识别文件中导入了哪些文件。
2. type-check 类型检查器：类型检查器构建一个符号表，然后对文件中的每个表达式进行类型分析，报告它发现的错误。
3. transform 转换：转换步骤是一组 AST 到 AST 转换，它们执行各种任务，例如删除类型声明、将模块和类声明降低到 ES5、将异步方法转换为状态机等。
4. print 打印：TS 到 JS 的实际转换是整个过程中最昂贵的操作。

在了解 Angular 是如何处理之前，我们需要知道，对 TypeScript 编译器 API 的任何使用都遵循一个多步骤过程，包括：

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/angular-design-ivy-2-ast-1.jpg)

- 一个`ts.CompilerHost`被创建
- `ts.CompilerHost`加上一组“根文件”，用于创建`ts.Program`,`ts.Program`用于收集各种诊断（类型检查）
- `ts.Program`被要求`emit`，并生成 JavaScript 代码

将 Angular 编译集成到此过程中的编译器遵循非常相似的流程，但有一些额外的步骤：

- 一个`ts.CompilerHost`被创建
- `ts.CompilerHost`包含在`NgCompilerHost`中，它将 Angular 特定文件添加到编译中
- `ts.Program`是从`NgCompilerHost`及其增强的根文件集创建的
- 一个`CompilationTicket`被创建，可选择合并来自先前编译运行的任何状态
- `NgCompiler`是使用`CompilationTicket`创建的
- 诊断信息可以正常从`ts.Program`收集，也可以从`NgCompiler`收集
- 在发射之前，调用`NgCompiler.prepareEmit`以检索需要馈送到`ts.Program.emit`的 Angular 转换器
- 使用上面的 Angular 转换器在`ts.Program`上调用发射，它生成带有 Angular 扩展的 JavaScript 代码

在这些 Angular 特定的步骤中，主要进行几件事：

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/angular-design-ivy-2-ast-2.jpg)

1. 会将特定于 Angular 的文件添加到编译过程中，比如`NgModele`、`Component`的解析。
2. 修改生成的`d.ts`，来保存 Angular 中模块和文件间的依赖关系。
3. 会增加 Angular 中的类型校验，包括`<tmeplate>`模板的类型校验。

而在自定义 TypeScript 编译器中执行 Angular 编译，主要依赖于`NgCompiler`，我们来看一下核心的一些方法：

``` ts
export class NgCompiler {
  // 将一个 CompilationTicket 转换为一个用于请求编译的 NgCompiler 实例
  // 根据编译请求的性质，NgCompiler 实例可能会从以前的编译中重用并随着任何更改进行更新
  // 它可能是一个新实例，它可以增量地重用以前编译中的状态，或者它可能代表一个完全新的编译 
  static fromTicket(ticket: CompilationTicket, adapter: NgCompilerAdapter, perfRecorder?: PerfRecorder) {}

  // 获取文件的资源依赖
  getResourceDependencies(file: ts.SourceFile): string[] {}

  // 获取此编译的所有与 Angular 相关的诊断信息
  getDiagnostics(): ts.Diagnostic[] {}

  // 将 Angular.io 错误指南链接添加到此编译的诊断中
  private addMessageTextDetails(diagnostics: ts.Diagnostic[]): ts.Diagnostic[] {}
  
  // 获取 ts.Program 以用作生成后续增量编译的起点
  // NgCompiler 产生一个内部增量 TypeScript 编译（为了模板类型检查的目的，将消费者的 `ts.Program` 继承到一个新的编译器中）
  // 此操作后，消费者的 ts.Program 不再可用于启动新的增量编译，getNextProgram 检索可以替代使用的 ts.Program
  getNextProgram(): ts.Program {}

  // 异步执行 Angular 的分析步骤
  // 通常，每当调用 getDiagnostics 或 prepareEmit 时，都会延迟执行此操作
  // 然而，某些消费者可能希望允许分析的异步阶段，其中诸如 “styleUrls” 之类的资源被异步解析
  // 在这些情况下，必须首先调用 analyzeAsync，并且在调用 NgCompiler 的任何其他 API 之前等待它的 Promise
  async analyzeAsync(): Promise<void> {}

  // 列出在分析过程中检测到的惰性路由
  listLazyRoutes(entryRoute?: string): LazyRoute[] {}
}
```

可见，`NgCompiler`主要负责将 Angular 编译集成到 TypeScript 编译器的编译流程中，并支持了上述提到的错误信息诊断（类型检查）、依赖关系检索，其中的设计还支持了增量编译、异步编译等能力。

## ngtsc 编译器

`ngtsc`是一个 Typescript-to-Javascript 编译器。它是一个最小包装器，包裹在`tsc`之外，而`tsc`中则包含一系列的 Angular 变换。

### 编译器流程
和`tsc`一样，当`ngtsc`开始运行时，它首先解析`tsconfig.json`文件，然后创建一个`ts.Program`。在上述转换可以运行之前，需要进行几件事情：

- 为包含修饰符的输入源文件收集元数据
- `@Component`装饰器中列出的资源文件必须异步解析
  - 例如 CLI 中，可能希望运行的 WebPack 以产生`.css`输入到`styleUrls`的属性`@Component`
- 运行诊断程序，这会创建`TypeChecker`并触及程序中的每个节点（一个相当昂贵的操作）

因为资源加载是异步的（特别是可能通过子进程并发），所以最好在做任何昂贵的事情之前启动尽可能多的资源加载。

`ngtsc`的运行入口位于`NgtscProgram`中，可直接替代传统的 View Engine 编译器到诸如命令行`main()`函数或 Angular 之类的工具命令行界面。

```ts
export class NgtscProgram implements api.Program {
  readonly compiler: NgCompiler;
  // 主要的 TypeScript 程序，用于分析和发出
  private tsProgram: ts.Program;

  private closureCompilerEnabled: boolean;
  private host: NgCompilerHost;
  private incrementalStrategy: TrackedIncrementalBuildStrategy;

  // 其他方法
}
```

编译器流程如下所示：

1. 创建`ts.Program`。
2. 扫描源文件以查找具有微不足道的可检测`@Component`注释的顶级声明，这避免了创建`TypeChecker`。
  - 对于每个具有`templateUrlor`的此类声明`styleUrls`，启动该 URL 的资源加载并将加入`Promise`队列
3. 获取诊断信息并报告任何初始错误消息。此时，`TypeChecker`已准备就绪。
4. 对`@Component`注释进行彻底扫描，使用`TypeChecker`和元数据系统来解析任何复杂的表达式。
5. 等待所有资源得到解决。
6. 计算需要应用的一组变换。
7. 启动`Tsickle`发射，它运行变换。
8. 在`.d.ts`文件的发出回调期间，重新解析发出的`.d.ts`并合并来自`Angular`编译器的任何请求更改。

Angular 编译涉及将 Angular 装饰器转换为静态定义字段。在构建时，这是在 TypeScript 编译的整个过程中完成的，其中 TypeScript 代码经过类型检查，然后降级为 JavaScript 代码。在此过程中，还可以生成特定于 Angular 的诊断。

### 增量编译

前面我们介绍了 Ivy 编译器的一些特性，其中包括了通过增加增量编译，来缩短构建时间。

作为在 TypeScript 编译器中执行 Angular 编译的核心 API，`NgCompiler`的每个实例都支持单个编译，因此也支持增量编译。

Angular 编译器能够进行增量编译，其中来自先前编译的信息用于加速下一次编译。在编译期间，编译器产生两种主要信息：本地信息（如组件和指令元数据）和全局信息（如具体化的`NgModule`范围）。增量编译通过两种方式进行管理：

1. 对于大多数更改，新的`NgCompiler`可以有选择地从以前的实例继承本地信息，并且只需要在底层 TypeScript 文件发生更改的地方重新计算它。在这种情况下，全局信息总是从头开始重新计算。
2. 对于特定的更改，例如组件资源中的更改，`NgCompiler`可以整体重用，并更新以合并此类更改的影响，而无需重新计算任何其他信息。

请注意，这两种模式在是否需要新`NgCompiler`实例或是否可以重用之前的实例方面有所不同。为了防止泄漏这种实现的复杂性并保护消费者不必管理`NgCompiler`如此具体的生命周期，这个过程通过`CompilationTicket`进行了抽象。

``` ts
export type CompilationTicket =
  // 从头开始 Angular 编译操作
  FreshCompilationTicket | 
  // 开始包含对 TypeScript 代码的更改的 Angular 编译操作
  IncrementalTypeScriptCompilationTicket | 
  IncrementalResourceCompilationTicket;
```

`CompilationTicket`用于初始化（或更新）`NgCompiler`实例，该实例为 Angular 编译器的核心。`CompilationTicket`抽象了编译的起始状态，并允许独立于任何增量编译生命周期管理`NgCompiler`。

消费者首先获得一个`CompilationTicket`（取决于传入更改的性质），然后使用该票据获取`NgCompiler`实例。在创建`CompilationTicket`时，编译器可以决定是重用旧`NgCompiler`实例还是创建新实例。

### 异步编译

在某些编译环境（例如 Angular CLI 中的 Webpack 驱动编译）中，编译的各种输入只能以异步方式生成。例如，`styleUrls`链接到 SASS 文件的 SASS 编译需要产生一个子 Webpack 编译。为了支持这一点，Angular 有一个异步接口来加载这些资源。

如果使用此接口，则`NgCompiler`创建后的另一个异步步骤是调用`NgCompiler.analyzeAsync`并等待其`Promise`：

```ts
export class NgtscProgram implements api.Program {
   ...
  /**
    * 确保 NgCompiler 已正确分析程序，并允许在此过程中异步加载任何资源。
    * Angular CLI 使用它来允许为 styleUrls 中使用的 SASS 文件等内容生成（异步）子编译。
    */
  loadNgStructureAsync(): Promise<void> {
    return this.compiler.analyzeAsync();
  }
}
```

此操作完成后，所有资源均已加载，其余`NgCompilerAPI`可以同步使用。

## 总结
Angular 是一套大而全的解决方案，想必大家早已对此有所了解。但实际上 Angular 做了很多深度的设计和能力，包括给开发者更好的体验，比如模板类型检查中，是如何将这些 Angular 特定的类型检查能力添加到 TypeScript 编译过程中，并且能通过文件映射能准确反馈给用户具体的代码位置，这些都是作为开发者的我未曾考虑过的。

感觉 Angular 里面还有特别多值得学习的东西。

### 参考

- [DESIGN DOC(Ivy): Compiler Architecture](https://github.com/angular/angular/blob/master/packages/compiler/design/architecture.md)
- [A Deep Dive into @Injectable and providedIn in Ivy](https://indepth.dev/posts/1151/a-deep-dive-into-injectable-and-providedin-in-ivy)
- [Ivy engine in Angular: first in-depth look at compilation, runtime and change detection](https://indepth.dev/posts/1062/ivy-engine-in-angular-first-in-depth-look-at-compilation-runtime-and-change-detection)
- [Everything you need to know about change detection in Angular](https://indepth.dev/posts/1053/everything-you-need-to-know-about-change-detection-in-angular)
- [Deep Dive into the Angular Compiler | Alex Rickabaugh](https://www.youtube.com/watch?v=anphffaCZrQ)
