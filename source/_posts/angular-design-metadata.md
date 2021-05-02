---
title: Angular框架解读--元数据和装饰器
date: 2021-03-27 13:25:31
categories: Angular源码
tags: 功能设计
---

作为“为大型前端项目”而设计的前端框架，Angular 其实有许多值得参考和学习的设计，本系列主要用于研究这些设计和功能的实现原理。本文主要围绕 Angular 中随处可见的元数据，来进行介绍。

<!--more-->

装饰器是使用 Angular 进行开发时的核心概念。在 Angular 中，装饰器用于为类或属性附加元数据，来让自己知道那些类或属性的含义，以及该如何处理它们。

## 装饰器与元数据

不管是装饰器还是元数据，都不是由 Angular 提出的概念。因此，我们先来简单了解一下。

### 元数据（Metadata）

在通用的概念中，元数据是描述用户数据的数据。它总结了有关数据的基本信息，可以使查找和使用特定数据实例更加容易。例如，作者，创建日期，修改日期和文件大小是非常基本的文档元数据的示例。

在用于类的场景下，元数据用于装饰类，来描述类的定义和行为，以便可以配置类的预期行为。

### 装饰器（Decorator）

装饰器是 JavaScript 的一种语言特性，是一项位于阶段 2（stage 2）的试验特性。

装饰器是定义期间在类，类元素或其他 JavaScript 语法形式上调用的函数。

装饰器具有三个主要功能：
1. 可以用具有相同语义的匹配值替换正在修饰的值。（例如，装饰器可以将方法替换为另一种方法，将一个字段替换为另一个字段，将一个类替换为另一个类，等等）。
2. 可以将元数据与正在修饰的值相关联；可以从外部读取此元数据，并将其用于元编程和自我检查。
3. 可以通过元数据提供对正在修饰的值的访问。对于公共值，他们可以通过值名称来实现；对于私有值，它们接收访问器函数，然后可以选择共享它们。

本质上，装饰器可用于对值进行元编程和向其添加功能，而无需从根本上改变其外部行为。

更多的内容，可以参考 [tc39/proposal-decorators](https://github.com/tc39/proposal-decorators) 提案。

## Angular 中的装饰器和元数据

我们在开发 Angular 应用时，不管是组件、指令，还是服务、模块等，都需要通过装饰器来进行定义和开发。装饰器会出现在类定义的紧前方，用来声明该类具有指定的类型，并且提供适合该类型的元数据。

比如，我们可以用下列装饰器来声明 Angular 的类：`@Component()`、`@Directive()`、`@Pipe()`、`@Injectable()`、`@NgModule()`。

### 使用装饰器和元数据来改变类的行为

以`@Component()`为例，该装饰器的作用包括：
1. 将类标记为 Angular 组件。
2. 提供可配置的元数据，用来确定应在运行时如何处理、实例化和使用该组件。

关于`@Component()`该如何使用可以参考[]()，这里不多介绍。我们来看看这个装饰器的定义：

``` ts
// 提供 Angular 组件的配置元数据接口定义
// Angular 中，组件是指令的子集，始终与模板相关联
export interface Component extends Directive {
  // changeDetection 用于此组件的变更检测策略
  // 实例化组件时，Angular 将创建一个更改检测器，该更改检测器负责传播组件的绑定。
  changeDetection?: ChangeDetectionStrategy;
  // 定义对其视图 DOM 子对象可见的可注入对象的集合
  viewProviders?: Provider[];
  // 包含组件的模块的模块ID，该组件必须能够解析模板和样式的相对 URL
  moduleId?: string;
  ...
  // 模板和 CSS 样式的封装策略
  encapsulation?: ViewEncapsulation;
  // 覆盖默认的插值起始和终止定界符（`{{`和`}}`）
  interpolation?: [string, string];
}

// 组件装饰器和元数据
export const Component: ComponentDecorator = makeDecorator(
    'Component',
    // 使用默认的 CheckAlways 策略，在该策略中，更改检测是自动进行的，直到明确停用为止。
    (c: Component = {}) => ({changeDetection: ChangeDetectionStrategy.Default, ...c}),
    Directive, undefined,
    (type: Type<any>, meta: Component) => SWITCH_COMPILE_COMPONENT(type, meta));
```

以上便是组件装饰、组件元数据的定义，我们来看看装饰器的创建过程。

### 装饰器的创建过程
我们可以从源码中找到，组件和指令的装饰器都会通过`makeDecorator()`来产生：

``` ts
export function makeDecorator<T>(
    name: string, props?: (...args: any[]) => any, parentClass?: any, // 装饰器名字和属性
    additionalProcessing?: (type: Type<T>) => void,
    typeFn?: (type: Type<T>, ...args: any[]) => void):
    {new (...args: any[]): any; (...args: any[]): any; (...args: any[]): (cls: any) => any;} {
  // noSideEffects 用于确认闭包编译器包装的函数没有副作用
  return noSideEffects(() => { 
    const metaCtor = makeMetadataCtor(props);
    // 装饰器工厂
    function DecoratorFactory(
        this: unknown|typeof DecoratorFactory, ...args: any[]): (cls: Type<T>) => any {
      if (this instanceof DecoratorFactory) {
        // 赋值元数据
        metaCtor.call(this, ...args);
        return this as typeof DecoratorFactory;
      }
      // 创建装饰器工厂
      const annotationInstance = new (DecoratorFactory as any)(...args);
      return function TypeDecorator(cls: Type<T>) {
        // 编译类
        if (typeFn) typeFn(cls, ...args);
        // 使用 Object.defineProperty 很重要，因为它会创建不可枚举的属性，从而防止该属性在子类化过程中被复制。
        const annotations = cls.hasOwnProperty(ANNOTATIONS) ?
            (cls as any)[ANNOTATIONS] :
            Object.defineProperty(cls, ANNOTATIONS, {value: []})[ANNOTATIONS];
        annotations.push(annotationInstance);
        // 特定逻辑的执行
        if (additionalProcessing) additionalProcessing(cls);

        return cls;
      };
    }
    if (parentClass) {
      // 继承父类
      DecoratorFactory.prototype = Object.create(parentClass.prototype);
    }
    DecoratorFactory.prototype.ngMetadataName = name;
    (DecoratorFactory as any).annotationCls = DecoratorFactory;
    return DecoratorFactory as any;
  });
}
```

在上面的例子中，我们通过`makeDecorator()`产生了一个用于定义组件的`Component`装饰器工厂。当使用`@Component()`创建组件时，Angular 会根据元数据来编译组件。

### 根据装饰器元数据编译组件

Angular 会根据该装饰器元数据，来编译 Angular 组件，然后将生成的组件定义（`ɵcmp`）修补到组件类型上：

``` ts
export function compileComponent(type: Type<any>, metadata: Component): void {
  // 初始化 ngDevMode
  (typeof ngDevMode === 'undefined' || ngDevMode) && initNgDevMode();
  let ngComponentDef: any = null;
  // 元数据可能具有需要解析的资源
  maybeQueueResolutionOfComponentResources(type, metadata);
  // 这里使用的功能与指令相同，因为这只是创建 ngFactoryDef 所需的元数据的子集
  addDirectiveFactoryDef(type, metadata);
  Object.defineProperty(type, NG_COMP_DEF, {
    get: () => {
      if (ngComponentDef === null) {
        const compiler = getCompilerFacade();
        // 根据元数据解析组件
        if (componentNeedsResolution(metadata)) {
          ...
          // 异常处理
        }
        ...
        // 创建编译组件需要的完整元数据
        const templateUrl = metadata.templateUrl || `ng:///${type.name}/template.html`;
        const meta: R3ComponentMetadataFacade = {
          ...directiveMetadata(type, metadata),
          typeSourceSpan: compiler.createParseSourceSpan('Component', type.name, templateUrl),
          template: metadata.template || '',
          preserveWhitespaces,
          styles: metadata.styles || EMPTY_ARRAY,
          animations: metadata.animations,
          directives: [],
          changeDetection: metadata.changeDetection,
          pipes: new Map(),
          encapsulation,
          interpolation: metadata.interpolation,
          viewProviders: metadata.viewProviders || null,
        };
        // 编译过程需要计算深度，以便确认编译是否最终完成
        compilationDepth++;
        try {
          if (meta.usesInheritance) {
            addDirectiveDefToUndecoratedParents(type);
          }
          // 根据模板、环境和组件需要的元数据，来编译组件
          ngComponentDef = compiler.compileComponent(angularCoreEnv, templateUrl, meta);
        } finally {
          // 即使编译失败，也请确保减少编译深度
          compilationDepth--;
        }
        if (compilationDepth === 0) {
          // 当执行 NgModule 装饰器时，我们将模块定义加入队列，以便仅在所有声明都已解析的情况下才将队列出队，并将其自身作为模块作用域添加到其所有声明中
          // 此调用运行检查以查看队列中的任何模块是否可以出队，并将范围添加到它们的声明中
          flushModuleScopingQueueAsMuchAsPossible();
        }
        // 如果组件编译是异步的，则声明该组件的 @NgModule 批注可以执行并在组件类型上设置 ngSelectorScope 属性
        // 这允许组件在完成编译后，使用模块中的 directiveDefs 对其自身进行修补
        if (hasSelectorScope(type)) {
          const scopes = transitiveScopesFor(type.ngSelectorScope);
          patchComponentDefWithScope(ngComponentDef, scopes);
        }
      }
      return ngComponentDef;
    },
    ...
  });
}
```

编译组件的过程可能是异步的（比如需要解析组件模板或其他资源的 URL）。如果编译不是立即进行的，`compileComponent`会将资源解析加入到全局队列中，并且将无法返回`ɵcmp`，直到通过调用`resolveComponentResources`解决了全局队列为止。

### 编译过程中的元数据
元数据是有关类的信息，但它不是类的属性。因此，用于配置类的定义和行为的这些数据，不应该存储在该类的实例中，我们还需要在其他地方保存此数据。

在 Angular 中，编译过程产生的元数据，会使用`CompileMetadataResolver`来进行管理和维护，这里我们主要看指令（组件）相关的逻辑：

``` ts
export class CompileMetadataResolver {
  private _nonNormalizedDirectiveCache =
      new Map<Type, {annotation: Directive, metadata: cpl.CompileDirectiveMetadata}>();
  // 使用 Map 的方式来保存
  private _directiveCache = new Map<Type, cpl.CompileDirectiveMetadata>(); 
  private _summaryCache = new Map<Type, cpl.CompileTypeSummary|null>();
  private _pipeCache = new Map<Type, cpl.CompilePipeMetadata>();
  private _ngModuleCache = new Map<Type, cpl.CompileNgModuleMetadata>();
  private _ngModuleOfTypes = new Map<Type, Type>();
  private _shallowModuleCache = new Map<Type, cpl.CompileShallowModuleMetadata>();

  constructor(
      private _config: CompilerConfig, private _htmlParser: HtmlParser,
      private _ngModuleResolver: NgModuleResolver, private _directiveResolver: DirectiveResolver,
      private _pipeResolver: PipeResolver, private _summaryResolver: SummaryResolver<any>,
      private _schemaRegistry: ElementSchemaRegistry,
      private _directiveNormalizer: DirectiveNormalizer, private _console: Console,
      private _staticSymbolCache: StaticSymbolCache, private _reflector: CompileReflector,
      private _errorCollector?: ErrorCollector) {}
  // 清除特定某个指令的元数据
  clearCacheFor(type: Type) {
    const dirMeta = this._directiveCache.get(type);
    this._directiveCache.delete(type);
    ...
  }
  // 清除所有元数据
  clearCache(): void {
    this._directiveCache.clear();
    ...
  }
  /**
   * 加载 NgModule 中，已声明的指令和的管道
   */
  loadNgModuleDirectiveAndPipeMetadata(moduleType: any, isSync: boolean, throwIfNotFound = true):
      Promise<any> {
    const ngModule = this.getNgModuleMetadata(moduleType, throwIfNotFound);
    const loading: Promise<any>[] = [];
    if (ngModule) {
      ngModule.declaredDirectives.forEach((id) => {
        const promise = this.loadDirectiveMetadata(moduleType, id.reference, isSync);
        if (promise) {
          loading.push(promise);
        }
      });
      ngModule.declaredPipes.forEach((id) => this._loadPipeMetadata(id.reference));
    }
    return Promise.all(loading);
  }
  // 加载指令（组件）元数据
  loadDirectiveMetadata(ngModuleType: any, directiveType: any, isSync: boolean): SyncAsync<null> {
    // 若已加载，则直接返回
    if (this._directiveCache.has(directiveType)) {
      return null;
    }
    directiveType = resolveForwardRef(directiveType);
    const {annotation, metadata} = this.getNonNormalizedDirectiveMetadata(directiveType)!;
    // 创建指令（组件）元数据
    const createDirectiveMetadata = (templateMetadata: cpl.CompileTemplateMetadata|null) => {
      const normalizedDirMeta = new cpl.CompileDirectiveMetadata({
        isHost: false,
        type: metadata.type,
        isComponent: metadata.isComponent,
        selector: metadata.selector,
        exportAs: metadata.exportAs,
        changeDetection: metadata.changeDetection,
        inputs: metadata.inputs,
        outputs: metadata.outputs,
        hostListeners: metadata.hostListeners,
        hostProperties: metadata.hostProperties,
        hostAttributes: metadata.hostAttributes,
        providers: metadata.providers,
        viewProviders: metadata.viewProviders,
        queries: metadata.queries,
        guards: metadata.guards,
        viewQueries: metadata.viewQueries,
        entryComponents: metadata.entryComponents,
        componentViewType: metadata.componentViewType,
        rendererType: metadata.rendererType,
        componentFactory: metadata.componentFactory,
        template: templateMetadata
      });
      if (templateMetadata) {
        this.initComponentFactory(metadata.componentFactory!, templateMetadata.ngContentSelectors);
      }
      // 存储完整的元数据信息，以及元数据摘要信息
      this._directiveCache.set(directiveType, normalizedDirMeta);
      this._summaryCache.set(directiveType, normalizedDirMeta.toSummary());
      return null;
    };

    if (metadata.isComponent) {
      // 如果是组件，该过程可能为异步过程，则需要等待异步过程结束后的模板返回
      const template = metadata.template !;
      const templateMeta = this._directiveNormalizer.normalizeTemplate({
        ngModuleType,
        componentType: directiveType,
        moduleUrl: this._reflector.componentModuleUrl(directiveType, annotation),
        encapsulation: template.encapsulation,
        template: template.template,
        templateUrl: template.templateUrl,
        styles: template.styles,
        styleUrls: template.styleUrls,
        animations: template.animations,
        interpolation: template.interpolation,
        preserveWhitespaces: template.preserveWhitespaces
      });
      if (isPromise(templateMeta) && isSync) {
        this._reportError(componentStillLoadingError(directiveType), directiveType);
        return null;
      }
      // 并将元数据进行存储
      return SyncAsync.then(templateMeta, createDirectiveMetadata);
    } else {
      // 指令，直接存储元数据
      createDirectiveMetadata(null);
      return null;
    }
  }
  // 获取给定指令（组件）的元数据信息
  getDirectiveMetadata(directiveType: any): cpl.CompileDirectiveMetadata {
    const dirMeta = this._directiveCache.get(directiveType)!;
    ...
    return dirMeta;
  }
  // 获取给定指令（组件）的元数据摘要信息
  getDirectiveSummary(dirType: any): cpl.CompileDirectiveSummary {
    const dirSummary =
        <cpl.CompileDirectiveSummary>this._loadSummary(dirType, cpl.CompileSummaryKind.Directive);
    ...
    return dirSummary;
  }
}
```

可以看到，在编译过程中，不管是组件、指令、管道，还是模块，这些类在编译过程中的元数据，都使用`Map`来存储。

## 总结
本节我们介绍了 Angular 中的装饰器和元数据，其中元数据用于描述类的定义和行为。

在 Angular 编译过程中，会使用`Map`的数据结构来维护和存储装饰器的元数据，并根据这些元数据信息来编译组件、指令、管道和模块等。

### 参考
- [11. Metadata, Metamodelling, and Metaprogramming](http://st.inf.tu-dresden.de/files/teaching/ss14/cbse/slides/11-cbse-metamodelling.pdf)
- [How does the TypeScript Angular DI magic work?](http://nicholasjohnson.com/blog/how-angular2-di-works-with-typescript/)


