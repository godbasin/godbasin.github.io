---
title: Angular框架解读--Ivy编译器之AOT/JIT
date: 2021-11-21 15:18:34
categories: Angular源码
tags: 功能设计
---

作为“为大型前端项目”而设计的前端框架，Angular 其实有许多值得参考和学习的设计，本系列主要用于研究这些设计和功能的实现原理。本文主要介绍 Angular 中的 AOT 和 JIT 相关设计。

<!--more-->

Angular 应用主要由组件及其 HTML 模板组成。由于浏览器无法直接理解 Angular 所提供的组件和模板，因此 Angular 应用程序需要先进行编译才能在浏览器中运行。

在 Angular 中，提供了两种方式编译 Angular 应用：

- 即时编译 (JIT，Just in time)：它会在运行期间在浏览器中编译你的应用
- 预先编译（AOT，Ahead of Time）：它会在构建时编译你的应用和库

## JIT

在 Angular 8 及更早版本中，默认情况下，在应用程序执行期间，将对模板进行编译，这便是 JIT 编译。

### 工作原理

JIT 编译相对 AOT 而言比较简单，核心逻辑在`JitCompiler`中。`JitCompiler`是 Angular 编译器的一个内部模块，它从组件类型开始，提取模板，并最终生成准备链接到应用程序的组件的编译版本。

```ts
export class JitCompiler {
  // 编译过程中的一些解析内容缓存
  private _compiledTemplateCache = new Map<Type, CompiledTemplate>();
  private _compiledHostTemplateCache = new Map<Type, CompiledTemplate>();
  private _compiledDirectiveWrapperCache = new Map<Type, Type>();
  private _compiledNgModuleCache = new Map<Type, object>();
  private _sharedStylesheetCount = 0;
  private _addedAotSummaries = new Set<() => any[]>();

  // 模块编译相关方法
  compileModuleSync(moduleType: Type): object {}
  compileModuleAsync(moduleType: Type): Promise<object> {}
  compileModuleAndAllComponentsSync(
    moduleType: Type
  ): ModuleWithComponentFactories {}
  compileModuleAndAllComponentsAsync(
    moduleType: Type
  ): Promise<ModuleWithComponentFactories> {}
  getComponentFactory(component: Type): object {}
  loadAotSummaries(summaries: () => any[]) {}
}
```

对于运行时编译，Angular 会传递并编译所有模块，因此在编译模块过程中，还需要为所有嵌套模块加载声明的指令/管道。

实际上，在 JIT 中编译这些模块的过程中，需要依赖模块、组件、指令等装饰器的元数据，该过程在 AOT 中是构建时便完成了编译，在 JIT 中由于组件是动态加载和编译的，因此也需要在模板编译过程进行解析和维护。对装饰器中元数据的编译和管理，可参考[《Angular 框架解读--元数据和装饰器》](https://godbasin.github.io/2021/03/27/angular-design-metadata/)一文。

### JIT 优势

在运行时编译代码，这意味着它不会在构建时进行编译，而是在调用该组件时编译。JIT 在本地调试的情况下，会更有优势：

1. 在 JIT 模式下，并非所有代码都会在初始时间编译。只有在应用程序启动时需要的必要组件才会被编译，如果项目中需要某功能并且它不在已编译的代码中，才会编译该功能或组件。
2. JIT 有助于减轻 CPU 的负担，并使应用程序渲染速度更快。
3. 使用 JIT 模式和映射文件编译代码，可以在检查模式下查看并链接到源代码。

在执行时，Angular 编译器会将这些模板转换为 JavaScript 函数。在一个简单的应用程序中，JIT 编译将生成两个包：

- main.bundle.js : 63k (21k 缩小)
- vendor.bundle.js : 3321k (960k 缩小)

对`vendor.bundle.js`文件（使用`source-map-explorer`）的分析表明，Angular 编译器占总包大小的 35%。这种机制有两个缺点：

1. JavaScript 包太重（显然是因为应用程序源需要在文件`vendor.bundle.js`中包含编译器）。
2. 应用程序将在运行时编译模板，这会影响渲染时间。

因此，Angular 提供了 AOT 编译，并在 Angular 9 及后续版本中将其设置为默认值。

## AOT

在浏览器下载和运行代码之前的编译阶段，Angular 预先（AOT）编译器会先把 Angular HTML 和 TypeScript 代码转换成高效的 JavaScript 代码。

### 工作原理

实际上，前面我们介绍的 Ivy 编译器中心智模型（参考[《Angular 框架解读--Ivy 编译器之心智模型》](https://godbasin.github.io/2021/11/06/angular-design-ivy-3-mental-model/)），便是 AOT 的主要工作原理。主要包括：

- Angular AOT 编译器会提取元数据，来解释应由 Angular 管理的应用程序部分
- 通过在装饰器（例如`@Component()`）中显式指定元数据，也可以在被装饰的类的构造函数声明中隐式指定元数据
- 元数据告诉 Angular 要如何构造应用程序类的实例并在运行时与它们进行交互

至于对装饰器中元数据的处理和编译过程，主要是通过将 Angular 编译集成到 TypeScript 编译器的编译流程中来实现。前面的[Angular 框架解读--Ivy 编译器](https://godbasin.github.io/2021/08/15/angular-design-ivy-0-design/)系列文章有介绍，因此这里也不过多展开。

同样，我们可以找到`AotCompiler`：

```ts
export class AotCompiler {
  private _templateAstCache =
      new Map<StaticSymbol, {template: TemplateAst[], pipes: CompilePipeSummary[]}>();
  private _analyzedFiles = new Map<string, NgAnalyzedFile>();
  private _analyzedFilesForInjectables = new Map<string, NgAnalyzedFileWithInjectables>();

  analyzeModulesSync(rootFiles: string[]): NgAnalyzedModules {}
  analyzeModulesAsync(rootFiles: string[]): Promise<NgAnalyzedModules> {}
  findGeneratedFileNames(fileName: string): string[] {}

  emitBasicStub(genFileName: string, originalFileName?: string): GeneratedFile {}
  emitTypeCheckStub(genFileName: string, originalFileName: string): GeneratedFile|null {}
  loadFilesAsync(fileNames: string[], tsFiles: string[]): Promise<
      {analyzedModules: NgAnalyzedModules, analyzedInjectables: NgAnalyzedFileWithInjectables[]}> {}
  loadFilesSync(fileNames: string[], tsFiles: string[]):
      {analyzedModules: NgAnalyzedModules, analyzedInjectables: NgAnalyzedFileWithInjectables[]} {}

  emitMessageBundle(analyzeResult: NgAnalyzedModules, locale: string|null): MessageBundle {}
  emitAllPartialModules2(files: NgAnalyzedFileWithInjectables[]): PartialModule[] {}
  emitAllImpls(analyzeResult: NgAnalyzedModules): GeneratedFile[] {}

  listLazyRoutes(entryRoute?: string, analyzedModules?: NgAnalyzedModules): LazyRoute[] {}
}
```

从对外提供的方法来看，相比于`JitCompiler`，显然`AotCompiler`并没有什么编译的过程，更多是解析文件并创建组件。两个`Compiler`相差很远，但我们可以找到同样包含的一个`_compileModule`来比较：

``` ts
export class AotCompiler {
  private _compileModule(outputCtx: OutputContext, ngModule: CompileNgModuleMetadata): void {
    const providers: CompileProviderMetadata[] = [];

    if (this._options.locale) {
      const normalizedLocale = this._options.locale.replace(/_/g, '-');
      providers.push({
        token: createTokenForExternalReference(this.reflector, Identifiers.LOCALE_ID),
        useValue: normalizedLocale,
      });
    }

    if (this._options.i18nFormat) {
      providers.push({
        token: createTokenForExternalReference(this.reflector, Identifiers.TRANSLATIONS_FORMAT),
        useValue: this._options.i18nFormat
      });
    }

    this._ngModuleCompiler.compile(outputCtx, ngModule, providers);
  }
}

export class JitCompiler {
  private _compileModule(moduleType: Type): object {
    let ngModuleFactory = this._compiledNgModuleCache.get(moduleType)!;
    if (!ngModuleFactory) {
      const moduleMeta = this._metadataResolver.getNgModuleMetadata(moduleType)!;
      const extraProviders = this.getExtraNgModuleProviders(moduleMeta.type.reference);
      const outputCtx = createOutputContext();
      const compileResult = this._ngModuleCompiler.compile(outputCtx, moduleMeta, extraProviders);
      ngModuleFactory = this._interpretOrJit(
          ngModuleJitUrl(moduleMeta), outputCtx.statements)[compileResult.ngModuleFactoryVar];
      this._compiledNgModuleCache.set(moduleMeta.type.reference, ngModuleFactory);
    }
    return ngModuleFactory;
  }
|
```

可以看到：
- `AotCompiler`中更多是直接将作用域/上下文、元数据信息直接用于模块的创建，少了编译过程
- `JitCompiler`中会在运行时创建作用域、上下文，并通过编译过程获取需要的元数据，然后再进行模块的创建

我们来分别看看 AOT 编译的三个阶段。

### AOT 编译阶段

AOT 编译分为三个阶段：

**一、代码分析。**在此阶段，TypeScript 编译器和 AOT 收集器会创建源码的表现层。

TypeScript 编译器会做一些初步的分析工作，它会生成类型定义文件`.d.ts`，其中带有类型信息，Angular 编译器需要借助它们来生成代码：

```ts
export interface StaticSymbolResolverHost {
  // 返回给定模块的 ModuleMetadata
  // Angular CLI 会在生成 .d.ts 文件并且模块导出变量或带有装饰器的类时为模块生成元数据
  // 模块元数据也可以通过在 tools/metadata 中使用 MetadataCollector 直接从 TypeScript 源生成
  getMetadataFor(modulePath: string): { [key: string]: any }[] | undefined;
}
```

同时，AOT 收集器（`collector`）会记录 Angular 装饰器中的元数据，并把它们输出到`.metadata.json`文件（可以把`.metadata.json`文件看做一个包括全部装饰器的元数据的全景图）中，和每个`.d.ts`文件相对应：

```ts
// 从 TypeScript 模块收集装饰器元数据
export class MetadataCollector {
  // 返回一个 JSON.stringify 友好形式
  // 描述源文件中导出的类的装饰器，该类预期与模块相对应
  public getMetadata(
    sourceFile: ts.SourceFile,
    strict: boolean = false,
    substituteExpression?: (
      value: MetadataValue,
      node: ts.Node
    ) => MetadataValue
  ): ModuleMetadata | undefined {}
}
```

收集器不会试图理解它收集并输出到`.metadata.json`中的元数据，它所能做的只是尽可能准确的表述这些元数据，并在检测到元数据中的语法违规时记录这些错误。解释这些`.metadata.json`是编译器在代码生成阶段要承担的工作。

**二、代码生成。**在此阶段，编译器的`StaticReflector`会解释在 1 中收集的元数据，对元数据执行附加验证，如果检测到元数据违反了限制，则抛出错误。

`StaticReflector`静态反射器实现了足够多的反射器 API，这是静态编译模板所必需的：

```ts
export class StaticReflector implements CompileReflector {
  // 元数据相关的静态符号缓存
  private annotationCache = new Map<StaticSymbol, any[]>();
  private shallowAnnotationCache = new Map<StaticSymbol, any[]>();
  private propertyCache = new Map<StaticSymbol, { [key: string]: any[] }>();
  private parameterCache = new Map<StaticSymbol, any[]>();
  private methodCache = new Map<StaticSymbol, { [key: string]: boolean }>();
  private staticCache = new Map<StaticSymbol, string[]>();

  // 解释元数据
  componentModuleUrl(typeOrFunc: StaticSymbol): string {}
  resolveExternalReference(
    ref: o.ExternalReference,
    containingFile?: string
  ): StaticSymbol {}
  findDeclaration(
    moduleUrl: string,
    name: string,
    containingFile?: string
  ): StaticSymbol {}
  tryFindDeclaration(
    moduleUrl: string,
    name: string,
    containingFile?: string
  ): StaticSymbol {}
  findSymbolDeclaration(symbol: StaticSymbol): StaticSymbol {}

  // 验证元数据
  public tryAnnotations(type: StaticSymbol): any[] {}
  public annotations(type: StaticSymbol): any[] {}
  public shallowAnnotations(type: StaticSymbol): any[] {}
  public propMetadata(type: StaticSymbol): { [key: string]: any[] } {}
  public parameters(type: StaticSymbol): any[] {}
}
```

编译器理解收集器支持的所有语法形式，但是它也可能拒绝那些虽然语法正确但语义违反了编译器规则的元数据。

**三、模板类型检查。**在此可选阶段，Angular 模板编译器使用 TypeScript 编译器来验证模板中的绑定表达式。

Angular 编译器最有用的功能之一就是能够对模板中的表达式进行类型检查，在由于出错而导致运行时崩溃之前就捕获任何错误。在模板类型检查阶段，Angular 模板编译器会使用 TypeScript 编译器来验证模板中的绑定表达式。

当模板绑定表达式中检测到类型错误时，进行模板验证时就会生成错误。这和 TypeScript 编译器在处理`.ts`文件中的代码时报告错误很相似。

### AOT 的优势

显然，使用 AOT 编译有这些好处：

1. 更快的渲染：借助 AOT，浏览器可以下载应用的预编译版本。浏览器加载的是可执行代码，因此它可以立即渲染应用，而无需等待先编译好应用。
2. 更少的异步请求：编译器会在应用 JavaScript 中内联外部 HTML 模板和 CSS 样式表，从而消除了对那些源文件的单独 ajax 请求。
3. 较小的 Angular 框架下载大小：如果已编译应用程序，则无需下载 Angular 编译器。编译器大约是 Angular 本身的一半，因此省略编译器会大大减少应用程序的有效载荷。
4. 尽早检测模板错误：AOT 编译器会在构建步骤中检测并报告模板绑定错误，然后用户才能看到它们。
5. 更高的安全性：AOT 在将 HTML 模板和组件提供给客户端之前就将其编译为 JavaScript 文件。没有要读取的模板，没有潜藏风险的客户端 HTML 或 JavaScript eval，受到注入攻击的机会就更少了。

在 AOT 模式下，生成的包不再包含 HTML 模板，而是直接包含已编译的模板。如果检查由构建生成的文件`main.bundle.js`，会发现包含已编译模板的代码部分。

在同一个应用程序中，AOT 编译生成以下包：

- main.bundle.js : 59k (27k 缩小)
- vendor.bundle.js：2281k（610k 缩小）

可以看到，`vendor.bundle.js`的大小大大减少，因为它不再包含编译器。这种编译的优点很明显：减少应用程序负载、更少的请求、快速渲染。

## 结束语

本文介绍了 Angular 中的 JIT/AOT 编译过程和工作原理，看起来似乎这些都和 Ivy 编译器关系不大。实际上，要实现 JIT、AOT 编译，核心便是 Ivy 编译器。在 View Engine 中虽然也有 JIT/AOT 的两种模式，但不管是装饰器元数据的解析，还是模板编译过程中的类型错误检查，在 Ivy 编译器的设计里都有非常大的区别。

### 参考

- [预先（AOT）编译器](https://angular.cn/guide/aot-compiler)
- [Angular JiT vs AoT](https://medium.com/@kadrimoujib/angular-jit-vs-aot-15e211d94966)
