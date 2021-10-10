---
title: Angular框架解读--模块化组织
date: 2021-06-13 15:33:33
categories: Angular源码
tags: 功能设计
---

作为“为大型前端项目”而设计的前端框架，Angular 其实有许多值得参考和学习的设计，本系列主要用于研究这些设计和功能的实现原理。本文主要围绕 Angular 中的模块设计、模块化组织等内容进行介绍。

<!--more-->

## Angular 中的模块
在 AngularJS 升级到 Angular（2+ 版本）之后，引入了模块的设计。在我们进行 Angular 应用开发时，总是离不开模块，包括 Angular 自带的通用模块，以及应用启动的根模块等等。

说到模块化，前端开发首先会想到 [ES6 的模块](https://hacks.mozilla.org/2015/08/es6-in-depth-modules/)，这两者其实并没有什么关联：

- ES6 模块以文件为单位；Angular 模块则是以 NgModule 为单位。
- ES6 模块用于跨文件的功能调用；Angular 模块用于组织有特定意义的功能块。
- ES6 模块在编译阶段确认各个模块的依赖关系，模块间关系扁平；Angular 模块则可以带有深度的层次结构。

### NgModules 定义
在 Angular 中，会使用 NgModules 来进行模块组织和管理。

NgModule 是一个带有`@NgModule`装饰器的类，`@NgModule`的参数是一个元数据对象，用于描述如何编译组件的模板，以及如何在运行时创建注入器。 它会标出该模块自己的组件、指令和管道，通过`exports`属性公开其中的一部分，以便外部组件使用它们。 关于元数据和装饰器，可参考[Angular框架解读--元数据和装饰器](https://godbasin.github.io/2021/03/27/angular-design-metadata/)一节。

NgModule 把组件、指令和管道打包成内聚的功能块，每个模块聚焦于一个特性区域、业务领域、工作流或通用工具。运行时，模块相关的信息存储在`NgModuleDef`中：

``` ts
// NgModuleDef 是运行时用于组装组件、指令、管道和注入器的内部数据结构
export interface NgModuleDef<T> {
  // 表示模块的令牌，由DI使用
  type: T;
  // 要引导的组件列表
  bootstrap: Type<any>[]|(() => Type<any>[]);
  // 此模块声明的组件、指令和管道的列表
  declarations: Type<any>[]|(() => Type<any>[]);
  // 此模块导入的模块列表或 ModuleWithProviders 
  imports: Type<any>[]|(() => Type<any>[]);
  // 该模块导出的模块、ModuleWithProviders、组件、指令或管道的列表
  exports: Type<any>[]|(() => Type<any>[]);
  // 为该模块计算的 transitiveCompileScopes 的缓存值
  transitiveCompileScopes: NgModuleTransitiveScopes|null;
  // 声明 NgModule 中允许的元素的一组模式
  schemas: SchemaMetadata[]|null;
  // 应为其注册模块的唯一ID
  id: string|null;
}
```

宏观来讲，NgModule 是组织 Angular 应用的一种方式，它们通过`@NgModule`装饰器中的元数据来实现这一点，这些元数据可以分成三类：

- 静态的：编译器配置，通过`declarations`数组来配置。用于告诉编译器指令的选择器，并通过选择器匹配的方式，决定要把该指令应用到模板中的什么位置
- 运行时：通过`providers`数组提供给注入器的配置
- 组合/分组：通过`imports`和`exports`数组来把多个 NgModule 放在一起，并让它们可用

可以看到，一个 NgModules 模块通过`declarations`声明该模块的组件、指令和管道，同时通过`import`导入其他模块和服务，以此来构成内聚的功能块。NgModule 还能把一些服务提供者添加到应用的依赖注入器中，具体可参考后续依赖注入部分内容。

### 模块化组织
每个 Angular 应用有至少一个模块，该模块称为根模块（AppModule）。Angular 应用的启动，便是由根模块开始的，可以参考后续的依赖注入的引导过程内容。

对于一个简单的 Angular 应用来说，一个根模块就足以管理整个应用的功能。对于复杂的应用来说，则可以根据功能来划分成不同的模块，每个模块可专注于某项功能或业务领域、工作流程或导航流程、通用工具集，或者成为一个或多个服务提供者。

在 Angular 中，推荐的模块可以根据类型划分为：

- 领域模块：领域模块围绕特性、业务领域或用户体验进行组织
- 带路由的模块：模块的顶层组件充当路由器访问这部分路由时的目的地
- 路由配置模块：路由配置模块为另一个模块提供路由配置
- 服务模块：服务模块提供实用服务，比如数据访问和消息传递
- 小部件：小部件模块可以为其它模块提供某些组件、指令或管道
- 共享模块：共享模块可以为其它的模块提供组件，指令和管道的集合

可见，模块可以以不同的方式进行组织，可以包括组件、指令和管道和服务，也可以仅提供其中一种，比如`HttpClientModule`便是仅由提供者组织的模块：

``` ts
@NgModule({
  // XSRF 保护的可选配置
  imports: [
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN',
    }),
  ],
  // 配置 DI，并在其中将其与 HTTP 通信的支持服务一起导入
  providers: [
    HttpClient,
    {provide: HttpHandler, useClass: HttpInterceptingHandler},
    HttpXhrBackend,
    {provide: HttpBackend, useExisting: HttpXhrBackend},
    BrowserXhr,
    {provide: XhrFactory, useExisting: BrowserXhr},
  ],
})
export class HttpClientModule {
}
```

## 模块能力
现在我们已经知道，NgModule 是把组件、指令和管道打包成内聚的功能块，那么在 NgModule 里面是怎么管理这些内容的呢？

### 模块与组件
在 Angular 中，每个组件都应该（且只能）声明（declare）在一个 NgModule 类中。属于相同 NgModule 的组件会共享同一个编译上下文环境，该环境信息由`LocalModuleScopeRegistry`维护：

``` ts
export class LocalModuleScopeRegistry implements MetadataRegistry, ComponentScopeReader {
  ...
  // 从当前编译单元到声明它们的 NgModule 的组件映射
  private declarationToModule = new Map<ClassDeclaration, DeclarationData>();
  // 这从指令/管道类映射到声明该指令/管道的每个 NgModule 的数据映射
  private duplicateDeclarations =
      new Map<ClassDeclaration, Map<ClassDeclaration, DeclarationData>>();
  private moduleToRef = new Map<ClassDeclaration, Reference<ClassDeclaration>>();
  // 为当前程序中声明的每个 NgModule 计算的 LocalModuleScope 的缓存
  private cache = new Map<ClassDeclaration, LocalModuleScope|null>();
  
  // 将 NgModule 的数据添加到注册表中
  registerNgModuleMetadata(data: NgModuleMeta): void {}
  // 为组件获取作用域
  getScopeForComponent(clazz: ClassDeclaration): LocalModuleScope|null {
    const scope = !this.declarationToModule.has(clazz) ?
        null :
        // 返回 NgModule 的作用域
        this.getScopeOfModule(this.declarationToModule.get(clazz)!.ngModule);
    return scope;
  }
  // 收集模块及其指令/管道的注册数据，并将其转换为完整的 LocalModuleScope
  getScopeOfModule(clazz: ClassDeclaration): LocalModuleScope|null {
    return this.moduleToRef.has(clazz) ?
        this.getScopeOfModuleReference(this.moduleToRef.get(clazz)!) :
        null;
  }
}
```

`LocalModuleScopeRegistry`类实现 NgModule 声明、导入和导出的逻辑，并且可以为给定组件生成在该组件的模板中“可见”的一组指令和管道。它收集有关本地的 NgModules，指令、组件和管道的信息，并且可以生成`LocalModuleScope`，概括了组件的编译范围。

每个 NgModule 在编译`@NgModule`装饰器的元数据时，会向`LocalModuleScopeRegistry`注册该模块的信息：

``` ts
export class NgModuleDecoratorHandler implements
    DecoratorHandler<Decorator, NgModuleAnalysis, NgModuleResolution> {
  register(node: ClassDeclaration, analysis: NgModuleAnalysis): void {
    // 这样可以确保在 compile() 阶段，模块的元数据可用于选择器作用域计算
    this.metaRegistry.registerNgModuleMetadata({
      ref: new Reference(node),
      schemas: analysis.schemas,
      declarations: analysis.declarations,
      imports: analysis.imports,
      exports: analysis.exports,
      rawDeclarations: analysis.rawDeclarations,
    });
    ...
  }
```

当组件在编译`@Component`装饰器的元数据时，会检查该组件是否已在 NgModule 中注册。如果已在某个模块中注册，则向`LocalModuleScopeRegistry`获取模块的编译范围，在该模块的编译范围内对其进行编译：

``` ts
export class ComponentDecoratorHandler implements
    DecoratorHandler<Decorator, ComponentAnalysisData, ComponentResolutionData> {
  resolve(node: ClassDeclaration, analysis: Readonly<ComponentAnalysisData>):
      ResolveResult<ComponentResolutionData> {
    ...
    // 获取模块的作用域
    const scope = this.scopeReader.getScopeForComponent(node);
    ...
    if (scope !== null && (!scope.compilation.isPoisoned || this.usePoisonedData)) {
      // 对模块的作用域中的信息进行处理
      for (const dir of scope.compilation.directives) {
        if (dir.selector !== null) {
          matcher.addSelectables(CssSelector.parse(dir.selector), dir as MatchedDirective);
        }
      }
      const pipes = new Map<string, Reference<ClassDeclaration>>();
      for (const pipe of scope.compilation.pipes) {
        pipes.set(pipe.name, pipe.ref);
      }
      ...
  }
}
```

在获取到作用域之后，接下来组件会使用`R3TargetBinder`绑定组件模板 AST，这些内容会在 Ivy 编译器部分进行更多的介绍。

默认情况下，NgModule 都是急性加载的，也就是说它会在应用加载时尽快加载，所有模块都是如此，无论是否立即要用。对于带有很多路由的大型应用，考虑使用惰性加载：一种按需加载 NgModule 的模式。惰性加载可以减小初始包的尺寸，从而减少加载时间。

要惰性加载 Angular 模块，则需要用到`AppRoutingModule`，同时惰性加载还支持预加载的能力。

## 总结
在 Angular 中，使用模块是最佳的组织方式。模块提供了聚焦于特定应用需求的一组功能，可以把应用划分成一些聚焦的功能区，比如用户工作流、路由或表单。 

对于 NgModule 模块，可以通过模块提供的服务以及共享出的组件、指令和管道来与根模块和其它 NgModule 模块进行合作。通过设置模块的导入和导出，Angular 可以解析出各个模块间的依赖关系。Angular 模块之间不允许出现循环依赖，因此一个 Angular 应用中的模块最终是呈现为以根模块为根节点的树状结构的。

### 参考
- [Angular-NgModules](https://angular.cn/guide/ngmodules)