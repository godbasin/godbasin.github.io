---
title: Angular框架解读--依赖注入的引导过程
date: 2021-07-25 13:55:21
categories: Angular源码
tags: 功能设计
---

作为“为大型前端项目”而设计的前端框架，Angular 其实有许多值得参考和学习的设计，本系列主要用于研究这些设计和功能的实现原理。本文主要围绕 Angular 中的最大特点——依赖注入，介绍 Angular 依赖注入在体系在应用引导过程中的的设计和实现。

<!--more-->

[多级依赖注入](https://godbasin.github.io/2021/07/11/angular-design-di-2-hierarchical-di/)中，介绍了模块注入器和元素注入器两种层次结构的注入器。那么，Angular 在引导过程中，又是如何初始化根模块和入口组件的呢？

# Angular 的引导过程

前面我们说到，Angular 应用在浏览器中引导时，会创建浏览器平台，并引导根模块：

``` ts
platformBrowserDynamic().bootstrapModule(AppModule);
```

## 引导根模块

### 根模块 AppModule

在 Angular 中，每个应用有至少一个 Angular 模块，根模块就是你用来引导此应用的模块，它通常命名为 AppModule。

当你使用 Angular CLI 命令 ng new 生成一个应用时，其默认的 AppModule 是这样的：

``` ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### 引导根模块的过程

我们来看看平台层引导根模块的过程中都做了些什么：

``` ts
@Injectable()
export class PlatformRef {
  ...

  bootstrapModuleFactory<M>(moduleFactory: NgModuleFactory<M>, options?: BootstrapOptions):
      Promise<NgModuleRef<M>> {
    // 由于实例化模块时，会需要创建一些提供者，所以这里需要在实例化模块之前创建 NgZone
    // 因此，这里创建了一个仅包含新 NgZone 的微型父注入器，并将其作为父传递给 NgModuleFactory
    const ngZoneOption = options ? options.ngZone : undefined;
    const ngZoneEventCoalescing = (options && options.ngZoneEventCoalescing) || false;
    const ngZoneRunCoalescing = (options && options.ngZoneRunCoalescing) || false;
    const ngZone = getNgZone(ngZoneOption, {ngZoneEventCoalescing, ngZoneRunCoalescing});
    const providers: StaticProvider[] = [{provide: NgZone, useValue: ngZone}];
    // ApplicationRef 将在 Angular zone 之外创建
    return ngZone.run(() => {
      // 在 ngZone.run 中创建 ngZoneInjector，以便在 Angular zone 中创建所有实例化的服务
      const ngZoneInjector = Injector.create(
          {providers: providers, parent: this.injector, name: moduleFactory.moduleType.name});
      const moduleRef = <InternalNgModuleRef<M>>moduleFactory.create(ngZoneInjector);
      const exceptionHandler: ErrorHandler|null = moduleRef.injector.get(ErrorHandler, null);
      if (!exceptionHandler) {
        throw new Error('No ErrorHandler. Is platform module (BrowserModule) included?');
      }
      ...
      return _callAndReportToErrorHandler(exceptionHandler, ngZone!, () => {
        const initStatus: ApplicationInitStatus = moduleRef.injector.get(ApplicationInitStatus);
        initStatus.runInitializers();
        return initStatus.donePromise.then(() => {
          ...
          // 引导模块
          this._moduleDoBootstrap(moduleRef);
          return moduleRef;
        });
      });
    });
  }

  bootstrapModule<M>(
      moduleType: Type<M>,
      compilerOptions: (CompilerOptions&BootstrapOptions)|
      Array<CompilerOptions&BootstrapOptions> = []): Promise<NgModuleRef<M>> {
    const options = optionsReducer({}, compilerOptions);
    // 编译并创建 @NgModule 的实例
    return compileNgModuleFactory(this.injector, options, moduleType)
        .then(moduleFactory => this.bootstrapModuleFactory(moduleFactory, options));
  }

  private _moduleDoBootstrap(moduleRef: InternalNgModuleRef<any>): void {
    const appRef = moduleRef.injector.get(ApplicationRef) as ApplicationRef;
    // 引导应用程序
    if (moduleRef._bootstrapComponents.length > 0) {
      // 在应用程序的根级别引导新组件
      moduleRef._bootstrapComponents.forEach(f => appRef.bootstrap(f));
    } else if (moduleRef.instance.ngDoBootstrap) {
      moduleRef.instance.ngDoBootstrap(appRef);
    } else {
      ...
    }
    this._modules.push(moduleRef);
  }
}
```

根模块引导时，除了编译并创建 AppModule 的实例，还会创建 NgZone，关于 NgZone 的请参考[]()。在编译和创建 AppModule 的过程中，便会创建`ApplicationRef`，即 Angular 应用程序。

## 引导 Angular 应用程序

前面在引导根模块过程中，创建了 Angular 应用程序之后，便会在应用程序的根级别引导新组件：

``` ts
// 在应用程序的根级别引导新组件
moduleRef._bootstrapComponents.forEach(f => appRef.bootstrap(f));
```

我们来看看这个过程会发生什么。

### 应用程序 ApplicationRef
一个 Angular 应用程序，提供了以下的能力：

``` ts
@Injectable()
export class ApplicationRef {
  // 获取已注册到该应用程序的组件类型的列表
  public readonly componentTypes: Type<any>[] = [];
  // 获取已注册到该应用程序的组件的列表
  public readonly components: ComponentRef<any>[] = [];
  // 返回一个 Observable，指示应用程序何时稳定或不稳定
  // 如果在应用程序引导时，引导任何种类的周期性异步任务，则该应用程序将永远不会稳定（例如轮询过程）
  public readonly isStable!: Observable<boolean>;

  constructor(
      private _zone: NgZone, private _injector: Injector, private _exceptionHandler: ErrorHandler,
      private _componentFactoryResolver: ComponentFactoryResolver,
      private _initStatus: ApplicationInitStatus) {
        // 创建时，主要进行两件事：
        // 1. 宏任务结束后，检测视图是否需要更新。
        // 2. 在 Angular Zone 之外创建对 onStable 的预订，以便在 Angular Zone 之外运行回调。
  }
  // 在应用程序的根级别引导新组件
  bootstrap<C>(componentOrFactory: ComponentFactory<C>|Type<C>, rootSelectorOrNode?: string|any):
      ComponentRef<C> {}
  // 调用此方法以显式处理更改检测及其副作用
  tick(): void {}
  // 关联视图，以便对其进行脏检查，视图销毁后将自动分离
  attachView(viewRef: ViewRef): void {}
  // 再次从脏检查中分离视图
  detachView(viewRef: ViewRef): void {}
}
```

那么，我们来看看`bootstrap()`过程中，Angular 都做了些什么。

### 在应用程序的根级别引导根组件

将新的根组件引导到应用程序中时，Angular 将指定的应用程序组件安装到由`componentType`的选择器标识的 DOM 元素上，并引导自动更改检测以完成组件的初始化。

``` ts
@Injectable()
export class ApplicationRef {
  bootstrap<C>(componentOrFactory: ComponentFactory<C>|Type<C>, rootSelectorOrNode?: string|any):
      ComponentRef<C> {
    ...
    // 如果未与其他模块绑定，则创建与当前模块关联的工厂
    const ngModule =
        isBoundToModule(componentFactory) ? undefined : this._injector.get(NgModuleRef);
    const selectorOrNode = rootSelectorOrNode || componentFactory.selector;
    // 创建组件
    const compRef = componentFactory.create(Injector.NULL, [], selectorOrNode, ngModule);
    const nativeElement = compRef.location.nativeElement;
    // 创建可测试服务挂钩
    const testability = compRef.injector.get(Testability, null);
    const testabilityRegistry = testability && compRef.injector.get(TestabilityRegistry);
    if (testability && testabilityRegistry) {
      testabilityRegistry.registerApplication(nativeElement, testability);
    }
    // 组件销毁时，销毁关联视图以及相关的服务
    compRef.onDestroy(() => {
      this.detachView(compRef.hostView);
      remove(this.components, compRef);
      if (testabilityRegistry) {
        testabilityRegistry.unregisterApplication(nativeElement);
      }
    });
    // 加载组件，包括关联视图、监听变更等
    this._loadComponent(compRef);
    ...
    return compRef;
  }
}
```

在创建根组件的过程中，会关联 DOM 元素视图、添加对状态变更的检测机制。

根组件是一个入口组件，Angular CLI 创建的默认应用只有一个组件`AppComponent`，Angular 会在引导过程中把它加载到 DOM 中。

在根组件的创建过程中，通常会根据根组件中引用到的其他组件，触发一系列组件的创建并形成组件树。大多数应用只有一个组件树，并且只从一个根组件开始引导。

### 创建组件过程
Angular 中创建组件的过程如下（参考[服务与依赖注入简介](https://angular.cn/guide/architecture-services)）：

1. 当 Angular 创建组件类的新实例时，它会通过查看该组件类的构造函数，来决定该组件依赖哪些服务或其它依赖项。
2. 当 Angular 发现某个组件依赖某个服务时，它会首先检查是否该注入器中已经有了那个服务的任何现有实例。如果所请求的服务尚不存在，注入器就会使用以前注册的服务提供者来制作一个，并把它加入注入器中，然后把该服务返回给 Angular。
3. 当所有请求的服务已解析并返回时，Angular 可以用这些服务实例为参数，调用该组件的构造函数。

Angular 会在执行应用时创建注入器，第一个注入器是根注入器，创建于引导过程中。借助注入器继承机制，可以把全应用级的服务注入到这些组件中。

到这里，Angular 分别完成了根模块、根组件和组件树的引导过程，通过编译器则可以将组件和视图渲染到页面上。

## 总结

在应用程序的引导过程中，Angular 采取了以下步骤来加载我们的第一个视图：
1. 加载`index.html`。
2. 加载 Angular、第三方库和应用程序。
3. 加载应用程序入口点`Main.ts`。
4. 加载根模块。
5. 加载根组件。
6. 加载模板。

本文我们重点从根模块的引导过程开始，介绍了引导 Angular 应用程序、引导根组件、组件的创建等过程。至于组件树的创建和渲染，则可以参考[编译器]()相关的内容。

### 参考
- [通过根模块启动应用](https://angular.cn/guide/bootstrapping)
- [Angular-入口组件](https://angular.cn/guide/entry-components)
- [Bootstrapping in Angular: How It Works Internally](https://www.tektutorialshub.com/angular/angular-bootstrapping-application/)