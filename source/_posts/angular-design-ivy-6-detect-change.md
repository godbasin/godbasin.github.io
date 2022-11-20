---
title:  Angular框架解读--Ivy编译器之变更检测
date: 2022-01-09 20:01:48
categories: Angular源码
tags: 功能设计
---

作为“为大型前端项目”而设计的前端框架，Angular 其实有许多值得参考和学习的设计，本系列主要用于研究这些设计和功能的实现原理。本文围绕 Angular 的核心功能 Ivy 编译器，介绍其中变更检测的过程。

<!--more-->

上一篇[《Angular框架解读--Ivy编译器之增量DOM》](https://godbasin.github.io/2021/12/05/angular-design-ivy-5-incremental-dom/)中，我介绍了 Ivy 编译器中使用了增量 DOM 的设计。在 Ivy 中，通过编译器将模板编译为`template`渲染函数，该过程会将对模板的解析编译成增量 DOM 相关的指令。其中，在`elementStart()`执行时，我们可以看到会通过`createElementNode()`方法来创建 DOM。

而增量 DOM 中的变更检测、Diff 和更新 DOM 等能力，都与`elementStart()`方法紧紧关联着。

## Ivy 中的变更检测

### ngZone 的自动变更检测
在[《Angular框架解读--Zone区域之ngZone》](https://godbasin.github.io/2021/05/30/angular-design-zone-ngzone/)一文中，我们介绍了默认情况下，所有异步操作都在 Angular Zone 内。该逻辑在创建 Angular 应用的时候便已添加，这会自动触发变更检测：

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
  }
}
```

`tick`方法中，核心的逻辑是调用了`view.detectChanges()`来检测更新。该接口来自`ChangeDetectorRef`，它提供变更检测功能的基类。

变更检测树收集所有要检查变更的视图，可以使用方法从树中添加和删除视图，启动更改检测，并将视图显式标记为`_dirty_`，这意味着它们已更改并需要重新渲染。

``` ts
export abstract class ChangeDetectorRef {
  // 当视图中的输入更改或事件触发时，组件通常被标记为脏（需要重新渲染）
  // 调用此方法以确保即使未发生这些触发器也会检查组件
  abstract markForCheck(): void;

  // 从变更检测树中分离此视图，在重新附加之前不会检查分离的视图
  // 与 detectChanges() 结合使用以实现本地更改检测检查
  abstract detach(): void;

  // 检查此视图及其子视图
  // 与 detach() 结合使用以实现本地更改检测检查
  abstract detectChanges(): void;

  // 检查更改检测器及其子项，如果检测到任何更改则抛出
  abstract checkNoChanges(): void;

  // 将先前分离的视图重新附加到更改检测树
  // 默认情况下，视图附加到树
  abstract reattach(): void;
}
```

在上述的`ChangeDetectorRef`中，变更检测`detectChanges()`中，核心逻辑调用了`refreshView()`。

### refreshView 视图更新处理

`refreshView()`用于在更新模式下处理视图：

``` ts
export function refreshView<T>(
    tView: TView, lView: LView, templateFn: ComponentTemplate<{}>|null, context: T) {
  ngDevMode && assertEqual(isCreationMode(lView), false, 'Should be run in update mode');
  const flags = lView[FLAGS];
  enterView(lView);
  const isInCheckNoChangesPass = isInCheckNoChangesMode();
  try {
    resetPreOrderHookFlags(lView);

    setBindingIndex(tView.bindingStartIndex);
    if (templateFn !== null) {
      // 1. 执行 template 模板函数
      executeTemplate(tView, lView, templateFn, RenderFlags.Update, context);
    }

    // 2. 执行预处理钩子，包括 OnInit、OnChanges、DoCheck
    if (!isInCheckNoChangesPass) {
      if (hooksInitPhaseCompleted) {
        executeCheckHooks(lView, preOrderCheckHooks, null);
      } else {
        executeInitAndCheckHooks(lView, preOrderHooks, InitPhaseState.OnInitHooksToBeRun, null);
        incrementInitPhaseFlags(lView, InitPhaseState.OnInitHooksToBeRun);
      }
    }

    // 首先将在此 lView 中声明的移植视图标记为需要在其插入点刷新
    // 这是为了避免模板在这个 LView 中定义但它的声明出现在插入组件之后的情况
    markTransplantedViewsForRefresh(lView);

    // 遍历嵌入式视图（通过 ViewContainerRef API 创建的视图）并通过执行关联的模板函数刷新它们
    refreshEmbeddedViews(lView);

    // 3. 在调用内容钩子之前，必须刷新内容查询结果
    if (tView.contentQueries !== null) {
      refreshContentQueries(tView, lView);
    }

    // 执行内容钩子，包括 AfterContentInit, AfterContentChecked
    if (!isInCheckNoChangesPass) {
      if (hooksInitPhaseCompleted) {
        executeCheckHooks(lView, contentCheckHooks);
      } else {
        executeInitAndCheckHooks(lView, contentHooks, InitPhaseState.AfterContentInitHooksToBeRun);
        incrementInitPhaseFlags(lView, InitPhaseState.AfterContentInitHooksToBeRun);
      }
    }

    // 4. 设置 host 绑定
    processHostBindingOpCodes(tView, lView);

    // 5. 刷新子组件视图
    const components = tView.components;
    if (components !== null) {
      refreshChildComponents(lView, components);
    }

    // 刷新子组件后必须执行视图查询，因为此视图中的模板可以插入子组件中
    // 如果视图查询在子组件刷新之前执行，则模板可能尚未插入
    const viewQuery = tView.viewQuery;
    if (viewQuery !== null) {
      executeViewQueryFn(RenderFlags.Update, viewQuery, context);
    }

    // 执行视图钩子，包括 AfterViewInit, AfterViewChecked
    if (!isInCheckNoChangesPass) {
      if (hooksInitPhaseCompleted) {
        executeCheckHooks(lView, viewCheckHooks);
      } else {
        executeInitAndCheckHooks(lView, viewHooks, InitPhaseState.AfterViewInitHooksToBeRun);
        incrementInitPhaseFlags(lView, InitPhaseState.AfterViewInitHooksToBeRun);
      }
    }
    // 我们需要确保我们只在成功的 refreshView 上翻转标志
    if (tView.firstUpdatePass === true) {
      tView.firstUpdatePass = false;
    }

    // 在检查无变化模式下运行时不要重置脏状态
    // 例如：在 ngAfterViewInit 钩子中将 OnPush 组件标记为脏组件以刷新 NgClass 绑定应该可以工作
    if (!isInCheckNoChangesPass) {
      lView[FLAGS] &= ~(LViewFlags.Dirty | LViewFlags.FirstLViewPass);
    }
    if (lView[FLAGS] & LViewFlags.RefreshTransplantedView) {
      lView[FLAGS] &= ~LViewFlags.RefreshTransplantedView;
      updateTransplantedViewCount(lView[PARENT] as LContainer, -1);
    }
  } finally {
    leaveView();
  }
}
```

可以看到，`refreshView()`的处理包括按特定顺序执行的多个步骤：

1. 在更新模式下，执行`template`模板函数。
2. 执行钩子。
3. 刷新 Query 查询。
4. 设置 host 绑定。
5. 刷新子（嵌入式和组件）视图。

除此之外，在变更检测的最开始执行了`enterView()`，此时 Angular 会用新的`LView`交换当前的`LView`。这样的处理主要出于性能原因，通过将`LView`存储在模块的顶层，最大限度地减少了要读取的属性数量。

`LView`用于存储从模板调用指令时处理指令所需的所有信息，在[《Angular框架解读--Ivy编译器的视图数据和依赖解析》]()中有介绍。

每个嵌入视图和组件视图都有自己的`LView`。在处理特定视图时，我们将`viewData`设置为该`LView`。当该视图完成处理后，`viewData`被设置回原始`viewData`之前的任何内容（父`LView`）。

在`refreshView()`处理中，每当进入新视图时会存储`LView`以备后用。我们也可以看到当退出视图时，通过执行`leaveView()`离开当前的`LView`，恢复原来的状态。

以上便是变更检测过程中的视图处理逻辑。

### 创建与更新视图的处理

我们可以对比下创建视图的过程，处理视图创建的过程在`renderView()`中实现。

`renderView()`用于在创建模式下处理视图，该过程包括按特定顺序执行的多个步骤：
1. 创建视图查询函数（如果有）。
2. 在创建模式下，执行`template()`模板函数。
3. 更新静态 Query 查询（如果有）。
4. 创建在给定视图中定义的子组件。

在上一篇文章中，我们介绍了这样一个组件：

``` ts
import { Component, Input } from "@angular/core";

@Component({
  selector: "greet",
  template: "<div> Hello, {{name}}! </div>",
})
export class GreetComponent {
  @Input() name: string;
}
```

经`ngtsc`编译后，产物会大概长这个样子：

```js
GreetComponent.ɵcmp = i0.ɵɵdefineComponent({
  type: GreetComponent,
  tag: "greet",
  factory: () => new GreetComponent(),
  template: function (rf, ctx) {
    // 创建模式下
    if (rf & RenderFlags.Create) {
      i0.ɵɵelementStart(0, "div");
      i0.ɵɵtext(1);
      i0.ɵɵelementEnd();
    }
    // 更新模式下
    if (rf & RenderFlags.Update) {
      i0.ɵɵadvance(1);
      i0.ɵɵtextInterpolate1("Hello ", ctx.name, "!");
    }
  },
});
```

可以看到，创建模式下的模板函数逻辑，与更新视图模式下的模板函数逻辑是有区别的。在创建模式下，`elementStart`、`elementEnd`我们在上一篇文章中有详细地介绍了。而在更新模式下，`textInterpolate1`表示当文本节点有 1 个内插值时，使用由其他文本包围的单个绑定值更新文本内容：

``` ts
export function interpolation1(lView: LView, prefix: string, v0: any, suffix: string): string|
    NO_CHANGE {
  const different = bindingUpdated(lView, nextBindingIndex(), v0);
  return different ? prefix + renderStringify(v0) + suffix : NO_CHANGE;
}
```

可以见到，在具体的模板函数指令中，会自行进行变更的检查，如果有发生了变化，则进行更新。`bindingUpdated()`方法会在需要更改时更新绑定，然后返回是否已更新。

而对于视图更新时，除了`textInterpolate1`这种比较简单的场景下的模板更新，子组件通过`refreshComponent`来处理：

``` ts
function refreshComponent(hostLView: LView, componentHostIdx: number): void {
  ngDevMode && assertEqual(isCreationMode(hostLView), false, 'Should be run in update mode');
  const componentView = getComponentLViewByIndex(componentHostIdx, hostLView);
  // 仅应刷新 CheckAlways 或 OnPush 且 Dirty 的附加组件
  if (viewAttachedToChangeDetector(componentView)) {
    const tView = componentView[TVIEW];
    if (componentView[FLAGS] & (LViewFlags.CheckAlways | LViewFlags.Dirty)) {
      // 此处检测组件是否被标记为 CheckAlways 或者 Dirty，此时才进行该组件的视图更新
      refreshView(tView, componentView, tView.template, componentView[CONTEXT]);
    } else if (componentView[TRANSPLANTED_VIEWS_TO_REFRESH] > 0) {
      // 仅应刷新 CheckAlways 或 OnPush 且脏的附加组件
      refreshContainsDirtyView(componentView);
    }
  }
}
```

同样的，在处理子组件的时候，需要检查子组件是否被标记为 CheckAlways 或者 Dirty，才进入组件视图并处理其绑定、查询等来刷新组件。

## 结束语

以上，便是 Angular Ivy 中的变更检测了。

可以看到，在 Angular 中将被标记为 CheckAlways 或者 Dirty 的组件进行视图刷新，在每个变更周期中，会执行`template()`模板函数中的更新模式下逻辑。而在`template()`模板函数中的具体指令逻辑中，还会根据原来的值和新的值进行比较，有差异的时候才会进行更新。

### 参考
- [Angular Ivy change detection execution: are you prepared?](https://indepth.dev/posts/1271/angular-ivy-change-detection-execution-are-you-prepared)
- [Ivy engine in Angular: first in-depth look at compilation, runtime and change detection](https://indepth.dev/posts/1062/ivy-engine-in-angular-first-in-depth-look-at-compilation-runtime-and-change-detection)
- [Everything you need to know about change detection in Angular](https://indepth.dev/posts/1053/everything-you-need-to-know-about-change-detection-in-angular)