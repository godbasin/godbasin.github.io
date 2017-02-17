---
title: 玩转Angular1(3)--在Angular中使用Typescript
date: 2017-02-12 8:44:19
categories: angular混搭
tags: 笔记
---
AngularJS(v1.5.8)已经成为项目们的基本框架，《玩转Angular1》系列用于记录项目中的一些好玩或者比较特别的思路。
本文记录在angular中使用Typescript的过程。
<!--more-->
## Typescript
-----
### 简单介绍
项目中的小朋友一直喊着要上Typescript，于是乎顺理成章地实现他的愿望，当然是由小朋友来主导这个事情啦。

TypeScript是由微软开发的一个能够在Node.js上运行的开源语言和编译器。这个语言是在ECMAScript6基础上演化并吸收了生成Javascript类别和接口的一些特性。

Typescript的编译器使用TypeScript语言编写，并且能够在任何兼容Javascript的程序内运行，同时它也是作为node.js的一个工具包发布的。所以该语言最终生成的仍然是Javascript脚本。

### 使用Typescript的好处
- 验证
Typescript能够在编译的同时让我们验证一些代码在不同模块中的重复使用。在声明变量类型和定义语句方法的时候，我们能够很有效的对所有call/get/set的使用在所有模块中进行交叉验证。

- 报错
Typescript编译器能够提供非常细节的报错，如果提供额外的类和接口信息，那报错的内容会更加的详细。

其实说白了，就是我们在团队合作的时候，在项目大需要管理的时候，Typescript无论是接口的调整、参数的修改，亦或是快速上手其他成员的代码上，都能有效协助我们。
例如类型检测、数据检测、参数/对象属性提示等等，好好使用的话，对编码效率还是能提高不少的呢。

### 参考
- [《我用 TypeScript 语言的七个月》](http://blog.jobbole.com/43675/?utm_source=rss)

## angular中使用Typescript
---
### webpack配置
其实依赖的安装我们在第一节[《玩转Angular1(1)--webpack/babel环境配置》](/2017/02/05/angular-free-1-webpack-and-babel-config/)中已经进行安装了，这里我们简单说明一下在webpack中的配置调整。

``` javascript
// webpack.config.js
resolve: {
    // Add '.ts' as resolvable extensions.
    extensions: ['', '.ts', '.js']
},
module: {
    loaders: [{
            test: /\.ts$/,
            loader: 'ts-loader',
            exclude: /node_modules/
        }, {...}
    ]
},
```

这里我们添加了个ts-loader，后面我们会说明一下typescript的配置。
要注意的是ts-loader必须在其它处理.js文件的加载器之前运行。

### tsconfig.json
如果一个目录下存在一个tsconfig.json文件，那么它意味着这个目录是TypeScript项目的根目录。 
tsconfig.json文件中指定了用来编译这个项目的根文件和编译选项。

``` json
{
    "compilerOptions": {
        "target": "es5",
        "module": "commonjs",
        "sourceMap": true,
        "noImplicitAny": false,
        "noFallthroughCasesInSwitch": true,
        "noImplicitReturns": true,
        "importHelpers": true,
        "noEmitHelpers": true,
        "pretty": true,
        "strictNullChecks": false,
        "lib": [
            "dom",
            "es7",
            "es6"
        ]
    },
    "exclude": [
        "node_modules",
        "typings/main",
        "typings/main.d.ts",
        "app/entry",
        "app/gentelella",
        "build"
    ]
}
```

相关的配置可参考[tsconfig.json](https://tslang.cn/docs/handbook/tsconfig-json.html)。

## 项目改造
---
### .js后缀更改为.ts后缀
首先我们将文件名从.js后缀更改为.ts后缀：
- app/app.ts
- app/bootstrap.ts

### 添加TypeScript声明文件
我们在app文件夹里添加`declarations.d.ts`文件，里面进行些声明：

``` typescript
type TODO = any;

declare var require: {
    (path: string): any;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (paths: string[], callback: (require: <T>(path: string) => any) => void) => void;
};

interface MyWindow extends Window{
    isPluginLoaded: boolean;
    pluginLoaded: () => void;
    pendingFunctions: (() => void)[];
    makeToast: (text :string, type ?: string, duration ?: number) => void;
    addVideoPlugin: (videoType: number) => void;
    SERVICE_CONFIG: any;
    offlineBMap: boolean;
    BMap_loadScriptTime: number;
}

declare var app: any;

declare var PNotify: any;
declare var Switchery: any;
declare var JQuery: any;

declare var MozWebSocket: any;
declare var SockJS: any;

interface ArrayConstructor{
    from<T>(arrayLike: {length: number}, mapFun ?: (i, j) => T, thisArg ?: any): Array<T>;
}

interface Ojbect{
    assign<T>(target: T, ...source): T;
}
```

可以看到，我们对一些基本的变量进行了些声明，这样在编译的时候就会少了些错误警告，并且对我们的类型检测、参数/对象属性提示都很有帮助。
这里我们定义了一个`TODO`的类型，其实这也就是个`any`的类型，但能作为提示的一种，提醒我们后面需要补上的一些接口和类型定义。

而关于Typescript的一些基础，大家可以参考[Typescript手册](https://tslang.cn/docs/handbook/basic-types.html)。

## 结束语
-----
这节主要简单介绍了在angular中使用typescript，以及项目的一些配置和调整。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular-free/3-typescript-in-angular)
[此处查看页面效果](http://ok2o5vt7c.bkt.clouddn.com/angular-free-3-typescript-in-angular/index.html)
