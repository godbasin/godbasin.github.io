---
title: Angular框架解读--Ivy编译器之增量DOM
date: 2021-12-05 10:25:13
categories: Angular源码
tags: 功能设计
---

作为“为大型前端项目”而设计的前端框架，Angular 其实有许多值得参考和学习的设计，本系列主要用于研究这些设计和功能的实现原理。本文围绕 Angular 的核心功能 Ivy 编译器，介绍其中的增量 DOM 设计。

<!--more-->

在介绍前端框架的时候，我常常会介绍到模板引擎。对于模板引擎的渲染过程，像 Vue/React 这样的框架里，使用了虚拟 DOM 这样的设计。

在 Angular Ivy 编译器中，并没有使用虚拟 DOM，而且使用了增量 DOM。

## 增量 DOM

前面在[《Angular 框架解读--Ivy 编译器整体设计》](https://godbasin.github.io/2021/08/15/angular-design-ivy-0-design/)一文中，我有介绍在 Ivy 编译器里，模板编译后的产物与 View Engine 不一样了，这是为了支持单独编译、增量编译等能力。

比如，`<span>My name is {{name}}</span>`这句模板代码，在 Ivy 编译器中编译后的代码大概长这个样子：

```js
// create mode
if (rf & RenderFlags.Create) {
  elementStart(0, "span");
  text(1);
  elementEnd();
}
// update mode
if (rf & RenderFlags.Update) {
  textBinding(1, interpolation1("My name is", ctx.name));
}
```

可以看到，相比于 View Engine 中的`elementDef(0,null,null,1,'span',...),`，`elementStart()`、`elementEnd()`这些 API 显得更加清爽，它们使用的便是增量 DOM 的设计。

### 增量 DOM vs 虚拟 DOM

虚拟 DOM 想必大家都已经有所了解，它的核心计算过程包括：

1. 用 JavaScript 对象模拟 DOM 树，得到一棵虚拟 DOM 树。
2. 当页面数据变更时，生成新的虚拟 DOM 树，比较新旧两棵虚拟 DOM 树的差异。
3. 把差异应用到真正的 DOM 树上。

虽然虚拟 DOM 解决了页面被频繁更新和渲染带来的性能问题，但传统虚拟 DOM 依然有以下性能瓶颈：

- 在单个组件内部依然需要遍历该组件的整个虚拟 DOM 树
- 在一些组件整个模版内只有少量动态节点的情况下，这些遍历都是性能的浪费
- 递归遍历和更新逻辑容易导致 UI 渲染被阻塞，用户体验下降

针对这些情况，React 和 Vue 等框架也有更多的优化，比如 React 中分别对 tree diff、component diff 以及 element diff 进行了算法优化，同时引入了任务调度来控制状态更新的计算和渲染。在 Vue 3.0 中，则将虚拟 DOM 的更新从以前的整体作用域调整为树状作用域，树状的结构会带来算法的简化以及性能的提升。

而不管怎样，虚拟 DOM 的设计中存在一个无法避免的问题：每个渲染操作分配一个新的虚拟 DOM 树，该树至少大到足以容纳发生变化的节点，并且通常更大一些，这样的设计会导致更多的一些内存占用。当大型虚拟 DOM 树需要大量更新时，尤其是在内存受限的移动设备上，性能可能会受到影响。

增量 DOM 的设计核心思想是：

1. 在创建新的（虚拟）DOM 树时，沿着现有的树走，并在进行时找出更改。
2. 如果没有变化，则不分配内存；
3. 如果有，改变现有树（仅在绝对必要时分配内存）并将差异应用到物理 DOM。

这里将（虚拟）放在括号中是因为，当将预先计算的元信息混合到现有 DOM 节点中时，使用物理 DOM 树而不是依赖虚拟 DOM 树实际上已经足够快了。

与基于虚拟 DOM 的方法相比，增量 DOM 有两个主要优势：

- 增量特性允许在渲染过程中显着减少内存分配，从而实现更可预测的性能
- 它很容易映射到基于模板的方法。控制语句和循环可以与元素和属性声明自由混合

增量 DOM 的设计由 Google 提出，同时他们也提供了一个开源库 [google/incremental-dom](https://github.com/google/incremental-dom)，它是一个用于表达和应用 DOM 树更新的库。JavaScript 可用于提取、迭代数据并将其转换为生成 HTMLElements 和 Text 节点的调用。

但新的 Ivy 引擎没有直接使用它，而是实现了自己的版本。

## Ivy 中的增量 DOM

Ivy 引擎基于增量 DOM 的概念，它与虚拟 DOM 方法的不同之处在于，diff 操作是针对 DOM 增量执行的（即一次一个节点），而不是在虚拟 DOM 树上执行。基于这样的设计，增量 DOM 与 Angular 中的脏检查机制其实能很好地搭配。

### 增量 DOM 元素创建

增量 DOM 的 API 的一个独特功能是它分离了标签的打开（`elementStart`）和关闭（`elementEnd`），因此它适合作为模板语言的编译目标，这些语言允许（暂时）模板中的 HTML 不平衡（比如在单独的模板中，打开和关闭的标签）和任意创建 HTML 属性的逻辑。

在 Ivy 中，使用`elementStart`和`elementEnd`创建一个空的 Element 实现如下（在 Ivy 中，`elementStart`和`elementEnd`的具体实现便是`ɵɵelementStart`和`ɵɵelementEnd`）：

```ts
export function ɵɵelement(
  index: number,
  name: string,
  attrsIndex?: number | null,
  localRefsIndex?: number
): void {
  ɵɵelementStart(index, name, attrsIndex, localRefsIndex);
  ɵɵelementEnd();
}
```

其中，`ɵɵelementStart`用于创建 DOM 元素，该指令后面必须跟有`ɵɵelementEnd()`调用。

```ts
export function ɵɵelementStart(
  index: number,
  name: string,
  attrsIndex?: number | null,
  localRefsIndex?: number
): void {
  const lView = getLView();
  const tView = getTView();
  const adjustedIndex = HEADER_OFFSET + index;

  const renderer = lView[RENDERER];
  // 此处创建 DOM 元素
  const native = (lView[adjustedIndex] = createElementNode(
    renderer,
    name,
    getNamespace()
  ));
  // 获取 TNode
  // 在第一次模板传递中需要收集匹配
  const tNode = tView.firstCreatePass ?
      elementStartFirstCreatePass(
          adjustedIndex, tView, lView, native, name, attrsIndex, localRefsIndex) :
      tView.data[adjustedIndex] as TElementNode;
  setCurrentTNode(tNode, true);

  const mergedAttrs = tNode.mergedAttrs;
  // 通过推断的渲染器，将所有属性值分配给提供的元素
  if (mergedAttrs !== null) {
    setUpAttributes(renderer, native, mergedAttrs);
  }
  // 将 className 写入 RElement
  const classes = tNode.classes;
  if (classes !== null) {
    writeDirectClass(renderer, native, classes);
  }
  // 将 cssText 写入 RElement
  const styles = tNode.styles;
  if (styles !== null) {
    writeDirectStyle(renderer, native, styles);
  }

  if ((tNode.flags & TNodeFlags.isDetached) !== TNodeFlags.isDetached) {
    // 添加子元素
    appendChild(tView, lView, native, tNode);
  }

  // 组件或模板容器的任何直接子级，必须预先使用组件视图数据进行猴子修补
  // 以便稍后可以使用任何元素发现实用程序方法检查元素
  if (getElementDepthCount() === 0) {
    attachPatchData(native, lView);
  }
  increaseElementDepthCount();

  // 对指令 Host 的处理
  if (isDirectiveHost(tNode)) {
    createDirectivesInstances(tView, lView, tNode);
    executeContentQueries(tView, tNode, lView);
  }
  // 获取本地名称和索引的列表，并将解析的本地变量值按加载到模板中的相同顺序推送到 LView
  if (localRefsIndex !== null) {
    saveResolvedLocalsInData(lView, tNode);
  }
}
```

可以看到，在`ɵɵelementStart`创建 DOM 元素的过程中，主要依赖于`LView`、`TView`和`TNode`。

在 Angular Ivy 中，使用了`LView`和`TView.data`来管理和跟踪渲染模板所需要的内部数据。对于`TNode`，在 Angular 中则是用于在特定类型的所有模板之间共享的特定节点的绑定数据（享元）。关于视图数据相关内容，之前在[《Angular 框架解读--Ivy 编译器的视图数据和依赖解析》](https://godbasin.github.io/2021/09/19/angular-design-ivy-1-view-data-and-node-injector/)一节便介绍过了，因此这里不再做详细的介绍。

`ɵɵelementEnd()`则用于标记元素的结尾：

```ts
export function ɵɵelementEnd(): void {}
```

对于`ɵɵelementEnd()`的详细实现不过多介绍，基本上主要包括一些对 Class 和样式中`@input`等指令的处理，循环遍历提供的`tNode`上的指令、并将要运行的钩子排入队列，元素层次的处理等等。

### 组件创建与增量 DOM 指令

在增量 DOM 中，每个组件都被编译成一系列指令。这些指令创建 DOM 树并在数据更改时就地更新它们。

Ivy 在运行时编译一个组件的过程中，会创建模板解析相关指令：

```ts
export function compileComponentFromMetadata(
  meta: R3ComponentMetadata,
  constantPool: ConstantPool,
  bindingParser: BindingParser
): R3ComponentDef {
  // 其他暂时省略

  // 创建一个 TemplateDefinitionBuilder，用于创建模板相关的处理
  const templateBuilder = new TemplateDefinitionBuilder(
      constantPool, BindingScope.createRootScope(), 0, templateTypeName, null, null, templateName,
      directiveMatcher, directivesUsed, meta.pipes, pipesUsed, R3.namespaceHTML,
      meta.relativeContextFilePath, meta.i18nUseExternalIds);

  // 创建模板解析相关指令，包括：
  // 第一轮：创建模式，包括所有创建模式指令（例如解析侦听器中的绑定）
  // 第二轮：绑定和刷新模式，包括所有更新模式指令（例如解析属性或文本绑定）
  const templateFunctionExpression = templateBuilder.buildTemplateFunction(template.nodes, []);

  // 提供这个以便动态生成的组件在实例化时，知道哪些投影内容块要传递给组件
  const ngContentSelectors = templateBuilder.getNgContentSelectors();
  if (ngContentSelectors) {
    definitionMap.set("ngContentSelectors", ngContentSelectors);
  }

  // 生成 ComponentDef 的 consts 部分
  const { constExpressions, prepareStatements } = templateBuilder.getConsts();
  if (constExpressions.length > 0) {
    let constsExpr: o.LiteralArrayExpr|o.FunctionExpr = o.literalArr(constExpressions);
    // 将 consts 转换为函数
    if (prepareStatements.length > 0) {
      constsExpr = o.fn([], [...prepareStatements, new o.ReturnStatement(constsExpr)]);
    }
    definitionMap.set("consts", constsExpr);
  }

  // 生成 ComponentDef 的 template 部分
  definitionMap.set("template", templateFunctionExpression);
}
```

可见，在组件编译时，会被编译成一系列的指令，包括`const`、`vars`、`directives`、`pipes`、`styles`、`changeDetection`等等，当然也包括`template`模板里的相关指令。最终生成的这些指令，会体现在编译后的组件中，比如前面[《Angular 框架解读--Ivy 编译器之心智模型》]()中提到的这样一个`Component`文件：

```ts
import { Component, Input } from "@angular/core";

@Component({
  selector: "greet",
  template: "<div> Hello, {{name}}! </div>",
})
export class GreetComponent {
  @Input() name: string;
}
```

经`ngtsc`编译后，产物包括该组件的`.js`文件：

```js
const i0 = require("@angular/core");
class GreetComponent {}
GreetComponent.ɵcmp = i0.ɵɵdefineComponent({
  type: GreetComponent,
  tag: "greet",
  factory: () => new GreetComponent(),
  template: function (rf, ctx) {
    if (rf & RenderFlags.Create) {
      i0.ɵɵelementStart(0, "div");
      i0.ɵɵtext(1);
      i0.ɵɵelementEnd();
    }
    if (rf & RenderFlags.Update) {
      i0.ɵɵadvance(1);
      i0.ɵɵtextInterpolate1("Hello ", ctx.name, "!");
    }
  },
});
```

其中，`elementStart()`、`text()`、`elementEnd()`、`advance()`、`textInterpolate1()`这些都是增量 DOM 相关的指令。在实际创建组件的时候，其`template`模板函数也会被执行，相关的指令也会被执行。

正因为在 Ivy 中，是由组件来引用着相关的模板指令。如果组件不引用某个指令，则我们的 Angular 中永远不会使用到它。因为组件编译的过程发生在编译过程中，因此我们可以根据引用到指令，来排除未引用的指令，从而可以在 Tree-shaking 过程中，将未使用的指令从包中移除，这便是增量 DOM 可树摇的原因。

## 结束语

现在，我们已经知道在 Ivy 中，是通过编译器将模板编译为`template`渲染函数，其中会将对模板的解析编译成增量 DOM 相关的指令。其中，在`elementStart()`执行时，我们可以看到会通过`createElementNode()`方法来创建 DOM。实际上，增量 DOM 的设计远不止只是创建 DOM，还包括变化检测等各种能力，关于具体的渲染过程，我们会在下一讲中进行介绍。

### 参考

- [Introducing Incremental DOM](https://medium.com/google-developers/introducing-incremental-dom-e98f79ce2c5f)
- [Ivy engine in Angular: first in-depth look at compilation, runtime and change detection](https://indepth.dev/posts/1062/ivy-engine-in-angular-first-in-depth-look-at-compilation-runtime-and-change-detection)
- [Understanding Angular Ivy: Incremental DOM and Virtual DOM](https://blog.nrwl.io/understanding-angular-ivy-incremental-dom-and-virtual-dom-243be844bf36)
