---
title: Angular框架解读--视图抽象定义
date: 2021-04-05 21:37:23
categories: Angular源码
tags: 功能设计
---

作为“为大型前端项目”而设计的前端框架，Angular 其实有许多值得参考和学习的设计，本系列主要用于研究这些设计和功能的实现原理。本文主要围绕 Angular 中与视图有关的一些定义进行介绍。

<!--more-->

# Angular 中的视图抽象
Angular 版本可在不同的平台上运行：在浏览器中、在移动平台上或在 Web Worker 中。因此，需要特定级别的抽象来介于平台特定的 API 和框架接口之间。

Angular 中通过抽象封装了不同平台的差异，并以下列引用类型的形式出现：`ElementRef`，`TemplateRef`，`ViewRef`，`ComponentRef`和`ViewContainerRef`。

## 各抽象类视图定义
在阅读源码的时候，如果不清楚这些定义之间的区别，很容易搞混淆。所以，这里我们先来理解下它们之间的区别。

### 元素 ElementRef
`ElementRef`是最基本的抽象。如果观察它的类结构，可以看到它仅包含与其关联的本地元素：

``` ts
export class ElementRef<T = any> {
  // 基础原生元素
  // 如果不支持直接访问原生元素（例如当应用程序在 Web Worker 中运行时），则为 null
  public nativeElement: T;
  constructor(nativeElement: T) {
    this.nativeElement = nativeElement;
  }
  ...
}
```

该 API 可用于直接访问本地 DOM 元素，可以比作`document.getElementById('myId')`。但 Angular 并不鼓励直接使用，尽可能使用 Angular 提供的模板和数据绑定。

### 模板 TemplateRef
在 Angular 中，模板用来定义要如何在 HTML 中渲染组件视图的代码。

模板通过`@Component()`装饰器与组件类类关联起来。模板代码可以作为`template`属性的值用内联的方式提供，也可以通过 `templateUrl`属性链接到一个独立的 HTML 文件。

用`TemplateRef`对象表示的其它模板用来定义一些备用视图或内嵌视图，它们可以来自多个不同的组件。`TemplateRef`是一组 DOM 元素（`ElementRef`），可在整个应用程序的视图中重复使用：

``` ts
export abstract class TemplateRef<C> {
  // 此嵌入视图的父视图中的 anchor 元素
  abstract get elementRef(): ElementRef;
  // 基于此模板实例化嵌入式视图，并将其附加到视图容器
  abstract createEmbeddedView(context: C): EmbeddedViewRef<C>;
  ...
}
```

就其本身而言，`TemplateRef`类是一个简单的类，仅包括：

- `elementRef`属性：拥有对其宿主元素的引用
- `createEmbeddedView`方法：它允许我们创建视图并将其引用作为`ViewRef`返回。

模板会把纯 HTML 和 Angular 的数据绑定语法、指令和模板表达式组合起来。Angular 的元素会插入或计算那些值，以便在页面显示出来之前修改 HTML 元素。

## Angular 中的视图
在 Angular 中，视图是可显示元素的最小分组单位，它们会被同时创建和销毁。Angular 哲学鼓励开发人员将 UI 视为视图的组合（而不是独立的 html 标签树）。

组件(`component`) 类及其关联的模板(`template`)定义了一个视图。具体实现上，视图由一个与该组件相关的`ViewRef`实例表示。 

### ViewRef
`ViewRef`表示一个 Angular 视图：

``` ts
export declare abstract class ViewRef extends ChangeDetectorRef {
    // 销毁该视图以及与之关联的所有数据结构
    abstract get destroyed(): boolean;
    // 报告此视图是否已被销毁
    abstract destroy(): void;
    // 生命周期挂钩，为视图提供其他开发人员定义的清理功能
    abstract onDestroy(callback: Function): any;
}
```

其中，`ChangeDetectorRef`提供更改检测功能的基类，用于更改检测树收集所有要检查更改的视图：

``` ts
export declare abstract class ChangeDetectorRef {
    // 当输入已更改或视图中触发了事件时，通常会将组件标记为脏（需要重新渲染）
    // 调用此方法以确保即使没有发生这些触发器，也要检查组件
    abstract checkNoChanges(): void;
    // 从变更检测树中分离该视图。在重新连接分离视图之前，不会对其进行检查。
    // 与 detectChanges() 结合使用可实现本地变更检测检查
    abstract detach(): void;
    // 检查此视图及其子级，与 detach() 结合使用可实现本地更改检测检查
    abstract detectChanges(): void;
    // 检查变更检测器及其子级，如果检测到任何变更，则抛出该异常
    abstract markForCheck(): void;
    // 将先前分离的视图重新附加到变更检测树
    // 默认情况下，视图将附加到树上
    abstract reattach(): void;
}
```

### 两种类型的视图

Angular 支持两种类型的视图：

**(1) 链接到模板（`template`）的嵌入式视图（`embeddedView`）。**

嵌入式视图表示视图容器中的 Angular 视图。模板只是保存视图的蓝图，可以使用上述的`createEmbeddedView`方法从模板实例化视图。

**(2) 链接到组件（`component`）的宿主视图（`hostView`）。**

直属于某个组件的视图叫做宿主视图。

宿主视图是在动态实例化组件时创建的，可以使用`ComponentFactoryResolver`动态创建实例化一个组件。在 Angular 中，每个组件都绑定到特定的注入器实例，因此在创建组件时我们将传递当前的注入器实例。

视图中各个元素的属性可以动态修改以响应用户的操作，而这些元素的结构（数量或顺序）则不能。你可以通过在它们的视图容器（`ViewContainer`）中插入、移动或移除内嵌视图来修改这些元素的结构。

### ViewContainerRef
`ViewContainerRef`是可以将一个或多个视图附着到组件中的容器：

``` ts
export declare abstract class ViewContainerRef {
    // 锚元素，用于指定此容器在包含视图中的位置
    // 每个视图容器只能有一个锚元素，每个锚元素只能有一个视图容器
    abstract get element(): ElementRef;
    // 此视图容器的 DI
    abstract get injector(): Injector;
    // 此容器当前附加了多少视图
    abstract get length(): number;
    // 销毁此容器中的所有视图
    abstract clear(): void;
    // 实例化单个组件，并将其宿主视图插入此容器
    abstract createComponent<C>(componentFactory: ComponentFactory<C>, index?: number, injector?: Injector, projectableNodes?: any[][], ngModule?: NgModuleRef<any>): ComponentRef<C>;
    // 实例化一个嵌入式视图并将其插入
    abstract createEmbeddedView<C>(templateRef: TemplateRef<C>, context?: C, index?: number): EmbeddedViewRef<C>;
    // 从此容器分离视图而不销毁它
    abstract detach(index?: number): ViewRef | null;
    // 从此容器检索视图
    abstract get(index: number): ViewRef | null;
    // 返回当前容器内视图的索引
    abstract indexOf(viewRef: ViewRef): number;
    // 将视图移动到此容器中的新位置
    abstract insert(viewRef: ViewRef, index?: number): ViewRef;
    abstract move(viewRef: ViewRef, currentIndex: number): ViewRef;
    // 销毁附加到此容器的视图
    abstract remove(index?: number): void;
}
```

任何 DOM 元素都可以用作视图容器，Angular 不会在元素内插入视图，而是将它们附加到绑定到`ViewContainer`的元素之后。

> 通常，标记`ng-container`元素是标记应创建`ViewContainer`的位置的最佳选择。它作为注释呈现，因此不会在 DOM 中引入多余的 HTML 元素。

通过`ViewContainerRef`，可以用`createComponent()`方法实例化组件时创建宿主视图，也可以用 `createEmbeddedView()`方法实例化`TemplateRef`时创建内嵌视图。

视图容器的实例还可以包含其它视图容器，以创建层次化视图（视图树）。

### 视图树（View hierarchy）

在 Angular 中，通常会把视图组织成一些视图树（view hierarchies）。视图树是一棵相关视图的树，它们可以作为一个整体行动，是 Angular 变更检测的关键部件之一。

视图树的根视图就是组件的宿主视图。宿主视图可以是内嵌视图树的根，它被收集到了宿主组件上的一个视图容器（`ViewContainerRef`）中。当用户在应用中导航时（比如使用路由器），视图树可以动态加载或卸载。

视图树和组件树并不是一一对应的：

- 嵌入到指定视图树上下文中的视图，也可能是其它组件的宿主视图
- 组件可能和宿主组件位于同一个`NgModule`中，也可能属于其它`NgModule`

### 组件、模板、视图与模块
在 Angular 中，可以通过组件的配套模板来定义其视图。模板就是一种 HTML，它会告诉 Angular 如何渲染该组件。

视图通常会分层次进行组织，让你能以 UI 分区或页面为单位进行修改、显示或隐藏。与组件直接关联的模板会定义该组件的宿主视图。该组件还可以定义一个带层次结构的视图，它包含一些内嵌的视图作为其它组件的宿主。

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/component-tree.png)

带层次结构的视图可以包含同一模块（`NgModule`）中组件的视图，也可以（而且经常会）包含其它模块中定义的组件的视图。

## 总结
本文简单介绍了 Angular 中元素、视图、模板、组件中与视图相关的一些定义，包括`ElementRef`，`TemplateRef`，`ViewRef`，`ComponentRef`和`ViewContainerRef`。

其中，视图是 Angular 中应用程序 UI 的基本构建块，它是一起创建和销毁的最小元素组。

`ViewContainerRef`主要用于创建和管理内嵌视图或组件视图。组件可以通过配置模板来定义视图，与组件直接关联的模板会定义该组件的宿主视图，同时组件还可以包括内嵌视图。

### 参考
- [Angular-组件简介](https://angular.cn/guide/architecture-components)
- [Angular 词汇表](https://angular.cn/guide/glossary)
- [Exploring Angular DOM manipulation techniques using ViewContainerRef](https://hackernoon.com/exploring-angular-dom-abstractions-80b3ebcfc02)