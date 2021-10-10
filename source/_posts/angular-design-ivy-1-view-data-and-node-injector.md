---
title: Angular框架解读--Ivy编译器的视图数据和依赖解析
date: 2021-09-19 19:10:12
categories: Angular源码
tags: 功能设计
---

作为“为大型前端项目”而设计的前端框架，Angular 其实有许多值得参考和学习的设计，本系列主要用于研究这些设计和功能的实现原理。本文主要介绍在 Angular 的 Ivy 编译器中，是如何管理和查找视图数据的。

<!--more-->

## Ivy 模型

在[上一节《Ivy 编译器整体设计》](https://godbasin.github.io/2021/08/15/angular-design-ivy-0-design/)中，我们从整体上介绍了 Ivy 编译器主要做的一些事情，包括模板编译、TypeScript 解析器等。我们可以看到 Ivy 编译器实现了更优的 Tree-shaking 支持、组件的延迟加载、支持增量编译等，而达到这些效果的一个核心设计点便在于视图的解析和数据管理。

### 视图数据 LView/TView

在 Angular Ivy 中，使用了`LView`和`TView.data`来管理和跟踪渲染模板所需要的内部数据。

其中，`LView`存储了从模板调用指令时，处理指令所需的所有信息。每个嵌入式视图和组件视图都有自己的`LView`，我们来看看`LView`的定义：

```ts
export interface LView extends Array<any> {
  // 插入该 LView 的节点
  [HOST]: RElement | null;

  // 此视图的静态数据
  readonly [TVIEW]: TView;

  // 父视图
  [PARENT]: LView | LContainer | null;

  // 下一个同级视图或容器
  [NEXT]: LView | LContainer | null;

  // 对此视图有效的查询-视图中的节点将报告给这些查询
  [QUERIES]: LQueries | null;

  // 存储当前 LView 插入位置的 TNode
  [T_HOST]: TNode | null;

  // 当视图被破坏时，需要释放侦听器，并且必须取消订阅输出
  [CLEANUP]: any[] | null;

  // 上下文信息
  [CONTEXT]: {} | RootContext | null;

  // 在咨询了元素注入器之后，将使用可选的模块注入器作为回退
  readonly [INJECTOR]: Injector | null;

  // 用于创建渲染器的工厂
  [RENDERER_FACTORY]: RendererFactory3;

  // 要用于此视图的渲染器
  [RENDERER]: Renderer3;

  // 引用层次结构中此 LView 下的第一个 LView 或 LContainer
  [CHILD_HEAD]: LView | LContainer | null;

  // 层次结构中此 LView 下的最后一个 LView 或 LContainer
  [CHILD_TAIL]: LView | LContainer | null;

  // 查看声明此视图的模板的位置
  [DECLARATION_VIEW]: LView | null;

  // 指向声明组件视图，用于跟踪已移植的 LView
  [DECLARATION_COMPONENT_VIEW]: LView;

  // 嵌入视图的声明点（基于 <ng-template> 的内容实例化的声明点），其他类型的视图为 null
  [DECLARATION_LCONTAINER]: LContainer | null;
}
```

我们能看到，`LView`中存储了足够多的信息，这样的设计使单个数组可以以紧凑的形式包含模板渲染所需的所有必要数据。

其中，`[TVIEW]`为该视图的静态数据，存储了所有可在模板实例之间共享的信息（比如`template`、`components`、`data`以及各种钩子），以便可以轻松地在 DI 中遍历节点树并获取与节点（存储指令`defs`的节点）关联的`TView.data`数组。这些信息存储在`ComponentDef.tView`中。

显然，`LView`还存储了除此之外的所有渲染模板需要的信息，比如：

- `[PARENT]`用于存储父视图。在处理特定视图时，Ivy 将`viewData`设置为该`LView`；完成该视图的处理后，将`viewData`设置回原始`viewData`之前的状态（父`LView`）
- `[NEXT]`用来链接组件视图和跨容器的视图
- `[T_HOST]`存储当前`LView`插入位置的`TNode`，因为“子级”除了插入到“父级”中，还可以插入到任何地方，因此不能将插入信息存储在`TView`中
- `[DECLARATION_VIEW]`用于存储“声明视图”（声明模板的视图），因为动态创建的视图的模板可以在与插入的视图不同的视图中声明，因此，上下文应继承自声明视图树，而不是插入视图树
- `[CHILD_HEAD]`存储引用层次结构中此`LView`下的第一个`LView`或`LContainer`，以便视图可以遍历其嵌套视图以除去侦听器并调用`onDestroy`回调
- `[CHILD_TAIL]`存储层次结构中此`LView`下的最后一个`LView`或`LContainer`，尾部使 Ivy 可以快速向视图列表的末尾添加新状态，而不必从第一个孩子开始传播

`LView`的设计，可以为每个视图保留单独的状态以方便视图的插入/删除，因此我们不必根据存在的视图来编辑数据数组。

### LView/TView.data 数据视图

在 Ivy 中，`LView`和`TView.data`都是数组，它们的索引指向相同的项目。它们的数据视图布局如下：

| Section   | `LView`                                                      | `TView.data`                                               |
| --------- | ------------------------------------------------------------ | ---------------------------------------------------------- |
| `HEADER`  | 上下文数据                                                   | 大多数为`null`                                             |
| `DECLS`   | DOM、pipe 和本地引用实例                                     |                                                            |
| `VARS`    | 绑定值                                                       | 属性名称                                                   |
| `EXPANDO` | host bindings; directive instances; providers; dynamic nodes | host prop names; directive tokens; provider tokens; `null` |

其中：

- `HEADER`是一个固定的数组大小，其中包含有关模板的上下文信息。主要是诸如父级` LView``Sanitizer `、`TView`之类的信息，以及模板渲染所需的更多信息
- `DECKS`包含 DOM 元素、管道实例和本地引用，`DECKS`节的大小在组件定义的属性`decl`中声明
- `VARS`包含有关如何处理绑定的信息，`VARS`部分的大小在组件定义的属性`var`中声明
- `EXPANDO`包含有关在编译时未知大小的数据的信息。比如`Component/Directives`，因为 Ivy 在编译时不知道会匹配哪些指令

至于具体的例子这里便不展开介绍了，你可以从 [DOCS: View Data Explanation](https://github.com/angular/angular/blob/master/packages/core/src/render3/VIEW_DATA.md) 文档中找到。

## Ivy 中 的 DI

在 Angular DI 中，注入器获取对应的示例依赖于 token 令牌。Ivy 将所有令牌存储在`TView.data`中，将实例存储在`LView`中，因此我们可以检索查看该视图的所有注入器。

而 DI 查找依赖的过程，离不开`NodeInjector`。

### NodeInjector

[上一节中]()，我们介绍了 Ivy 编译器中使用增量编译来优化构建速度，增量编译意味着一个库只会根据变更的部分进行重新编译。要做到增量编译，Ivy 编译器不得依赖未直接传递给它的任何输入（可理解为“纯函数”）。使用`Lview`来存储每个视图的状态和数据，则可以通过 DI 注入依赖的视图数据。

在[《Angular 框架解读--多级依赖注入设计》](https://godbasin.github.io/2021/07/11/angular-design-di-2-hierarchical-di/)一文中，我们介绍了 Angular 中的两种注入器：模块注入器`ModuleInjector`和元素注入器`ElementInjector`。Angular 通过依次遍历元素注入器树和模块注入器树来查找提供令牌的注入器。

实际上，在 Ivy 中使用`NodeInjector`替换了 View Engine 中的元素注入器：

```ts
export class NodeInjector implements Injector {
  constructor(
    private _tNode:
      | TElementNode
      | TContainerNode
      | TElementContainerNode
      | null,
    private _lView: LView
  ) {}

  get(token: any, notFoundValue?: any): any {
    return getOrCreateInjectable(
      this._tNode,
      this._lView,
      token,
      undefined,
      notFoundValue
    );
  }
}
```

其中，`getOrCreateInjectable`方法从`NodeInjectors`到`ModuleInjector`进行遍历，并返回（或创建）与给定令牌关联的值。

### DI 查找依赖的过程

我们知道 Angular 会构建一棵视图树，该视图树总是以只含一个根元素的伪根视图开始（参考[《Angular 框架解读--视图抽象定义》](https://godbasin.github.io/2021/04/05/angular-design-dom-define/)）。

Ivy 使用`LView`和`TView.data`数组来存储视图数据，其中便包括了节点的注入信息。这意味着，**`NodeInjector`需要从`LView`和`TView.data`数组中得到具体的视图数据信息**。

我们可以从`getOrCreateInjectable`中看到该过程：

```ts
export function getOrCreateInjectable<T>(
  tNode: TDirectiveHostNode | null,
  lView: LView,
  token: Type<T> | AbstractType<T> | InjectionToken<T>,
  flags: InjectFlags = InjectFlags.Default,
  notFoundValue?: any
): T | null {
  if (tNode !== null) {
    const bloomHash = bloomHashBitOrFactory(token);
    // 如果此处存储的 ID 是一个函数，则这是一个特殊的对象，例如 ElementRef 或 TemplateRef
    // 因此只需调用 factory 函数即可创建它
    if (typeof bloomHash === "function") {
      if (!enterDI(lView, tNode, flags)) {
        // 无法进入 DI，则尝试使用模块注入器
        // 如果使用 @Host 标志注入令牌，则在 Ivy 中不会在模块注入器中搜索该令牌
        return flags & InjectFlags.Host
          ? notFoundValueOrThrow<T>(notFoundValue, token, flags)
          : lookupTokenUsingModuleInjector<T>(
              lView,
              token,
              flags,
              notFoundValue
            );
      }
      try {
        const value = bloomHash(flags);
        if (value == null && !(flags & InjectFlags.Optional)) {
          throwProviderNotFoundError(token);
        } else {
          return value;
        }
      } finally {
        leaveDI();
      }
    } else if (typeof bloomHash === "number") {
      // 对遍历元素注入器树时找到的上一个注入器 TView 的引用
      // 这用于了解是否可以在当前注射器上访问 viewProviders
      let previousTView: TView | null = null;
      let injectorIndex = getInjectorIndex(tNode, lView);
      let parentLocation: RelativeInjectorLocation = NO_PARENT_INJECTOR;
      let hostTElementNode: TNode | null =
        flags & InjectFlags.Host
          ? lView[DECLARATION_COMPONENT_VIEW][T_HOST]
          : null;

      // 如果我们应该跳过此注入器，或者此节点上没有注入器，需先搜索父注入器
      if (injectorIndex === -1 || flags & InjectFlags.SkipSelf) {
        parentLocation =
          injectorIndex === -1
            ? getParentInjectorLocation(tNode, lView)
            : lView[injectorIndex + NodeInjectorOffset.PARENT];

        if (
          parentLocation === NO_PARENT_INJECTOR ||
          !shouldSearchParent(flags, false)
        ) {
          injectorIndex = -1;
        } else {
          previousTView = lView[TVIEW];
          injectorIndex = getParentInjectorIndex(parentLocation);
          lView = getParentInjectorView(parentLocation, lView);
        }
      }

      // 遍历注入器树，直到找到潜​​在的匹配项，或者直到知道*不是*匹配项为止。
      while (injectorIndex !== -1) {
        ngDevMode && assertNodeInjector(lView, injectorIndex);

        // 检查当前的注入器。如果匹配，请查看它是否包含令牌
        const tView = lView[TVIEW];
        ngDevMode &&
          assertTNodeForLView(
            tView.data[injectorIndex + NodeInjectorOffset.TNODE] as TNode,
            lView
          );
        if (bloomHasToken(bloomHash, injectorIndex, tView.data)) {
          // 在这一点上，我们有一个*可能*包含令牌的注入器
          // 因此我们逐步浏览与注入器的相应节点相关联的提供程序和指令以获取实例
          const instance: T | null = searchTokensOnInjector<T>(
            injectorIndex,
            lView,
            token,
            previousTView,
            flags,
            hostTElementNode
          );
          if (instance !== NOT_FOUND) {
            return instance;
          }
        }
        parentLocation = lView[injectorIndex + NodeInjectorOffset.PARENT];
        if (
          parentLocation !== NO_PARENT_INJECTOR &&
          shouldSearchParent(
            flags,
            lView[TVIEW].data[injectorIndex + NodeInjectorOffset.TNODE] ===
              hostTElementNode
          ) &&
          bloomHasToken(bloomHash, injectorIndex, lView)
        ) {
          // 在此节点上的任何位置都找不到 def，因此它是误报。遍历树并继续搜索
          previousTView = tView;
          injectorIndex = getParentInjectorIndex(parentLocation);
          lView = getParentInjectorView(parentLocation, lView);
        } else {
          // 如果我们不应该搜索父对象，或者如果祖先的 bloom 过滤器值没有对应于该指令的位
          // 我们可以放弃遍历以查找特定的注入器
          injectorIndex = -1;
        }
      }
    }
  }

  return lookupTokenUsingModuleInjector<T>(lView, token, flags, notFoundValue);
}
```

从上述代码中，如果我们调用`injector.get(SomeClass)`方法，会产生以下步骤：

1. Angular 在`SomeClass.__NG_ELEMENT_ID__`静态属性中查找哈希。
2. 如果该哈希是工厂函数，则还有另一种特殊情况，即应通过调用该函数来初始化对象。
3. 如果该哈希等于-1，则是一种特殊情况，我们将获得`NodeInjector`实例。
4. 如果该哈希是一个数字，那么我们会从`TNode`获取`injectorIndex`。
5. 查看模板布隆过滤器（`TView.data [injectorIndex]`），如果为真，那么我们将搜索`SomeClass`令牌（通过`tNode.providerIndexes`可以找到所需的令牌）。
6. 如果模板布隆过滤器返回错误，那么会查看一下累积布隆过滤器。如果它为真，则继续进行遍历，否则将切换到`ModuleInjector`。

该过程可以用以下流程图表示：

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/angular-ivy-2-2.png)

这便是在 Ivy 中，使用`NodeInjector`来解析依赖关系的过程。可以看到，该过程中还使用了两个布隆过滤器：累积布隆过滤器（cumulativeBloom）和模板布隆过滤器（templateBloom）。

### 布隆过滤器

布隆过滤器常用于加快数据检索的过程，属于哈希函数的一种，你可以阅读 [Probabilistic Data structures: Bloom filter](https://hackernoon.com/probabilistic-data-structures-bloom-filter-5374112a7832) 一文来了解它。

在 Ivy 中，一个视图可以具有与为该视图上的节点创建的注入器数量一样多的布隆过滤器。下图为可视化结果：

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/angular-ivy-2-1.png)

可以看到，布隆过滤器存储在前面提到的`LView/TView.data`布局中的`EXPANDO`部分:

- `LView`和`TView.data`数组可以包含许多布隆过滤器，长度为 8 个时隙（[n，n + 7]索引），它们的数量与为其创建喷射器的节点数量成正比
- 每个布隆过滤器在“压缩的”`parentLocation`插槽（n + 8 索引）中都有一个指向父布隆过滤器的指针

我们结合`NodeInjector`中查找依赖的过程，以以下简单的代码为例：

```ts
@Component({
  selector: "my-app",
  template: `
    <div dirA>
      <div dirB>Hello Ivy</div>
    </div>
  `,
})
export class AppComponent {}

@Directive({ selector: "[dirA]" })
export class DirA {}

@Directive({ selector: "[dirB]" })
export class DirB {
  constructor(private rootComp: AppComponent) {}
}
```

在 Ivy 中，上述代码会生成这样的可视化视图：

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/angular-ivy-2-3.png)

Ivy 在`TNode`上创建了`InjectorIndex`属性，以便知道专用于此节点布隆过滤器的位置。除此之外，Ivy 还在`LView`数组中存储了`parentLocation`指针，以便我们可以遍历所有父注入器。

而我们也看到，`NodeInjector`是具有对`TNode`和`LView`对象的引用的对象。因此，每个`NodeInjector`分别保存在`LView`的 9 个连续插槽和`TView.data`的 9 个连续插槽中，如图：

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/angular-ivy-2-4.png)

那么，上面简单的代码示例中，DI 查找依赖的过程如图：

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/angular-ivy-2-5.png)

> 以上例子来自于 [Angular DI: Getting to know the Ivy NodeInjector](https://indepth.dev/posts/1268/angular-di-getting-to-know-the-ivy-nodeinjector)

## 总结
今天给大家介绍了 Ivy 编译器中的数据视图`LView/TView`，而依赖解析过程中需要从中取出对应的数据，该过程使用到`NodeInjector`。`NodeInjector`用于创建注入器，为了加快 DI 搜索依赖的过程，Ivy 还设计了累加布隆过滤器和模板布隆过滤器。

这些内容，是理解 Angular 中依赖注入过程中不可或缺的。而在查阅这部分文章和代码之前，我甚至无法想象在 Angular 中依赖注入过程如此复杂。很多时候，我们都认为前端领域并不存在太多的算法和数据结构相关的内容，实际上可能只是我们并没有接触到而已。

### 参考

- [Angular DI: Getting to know the Ivy NodeInjector](https://indepth.dev/posts/1268/angular-di-getting-to-know-the-ivy-nodeinjector)
- [DOCS: View Data Explanation](https://github.com/angular/angular/blob/master/packages/core/src/render3/VIEW_DATA.md)
- [Probabilistic Data structures: Bloom filter](https://hackernoon.com/probabilistic-data-structures-bloom-filter-5374112a7832)
