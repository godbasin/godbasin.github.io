---
title: Cycle.js学习笔记4--使用Class和装饰器
date: 2017-09-08 20:12:23
categories: cyclejs哈根达斯
tags: 笔记
---
因为对Rxjs的好感玩上了Cycle.js，《Cycle.js学习笔记》系列用于记录使用该框架的一些笔记。
本文记录使用Class创建input控件的过程，以及其中使用装饰器和调整配置的笔记。
<!--more-->

## 使用装饰器
---
这里我们先进行装饰器的配置调整。

### 使用最新babel特性
为了使用装饰器，之前安装的`babel-preset-es2015`不知道够不够用啦，不管三七二十一我们直接上最新的特性啦：

``` bash
npm install -D babel-preset-latest
```

这里我们还需要调整babel配置：

``` json
// .babelrc
{
  "presets": [
    "latest" // 改成latest
  ],
  "plugins": [
    "syntax-jsx",
    ["transform-react-jsx", {"pragma": "html"}]
  ]
}
```

其实这里并不需要安装最新特性的`babel`的，因为我们入口文件都是先经过`ts-loader`的，而我们前面配置它的输出是`es6`。
所以这里是多此一举[捂脸]，不过介绍一下也没多大关系啦。

### 调整ts配置
这里我们需要在`tsconfig.json`里面添加上关于装饰器的配置：

``` json
{
    "compilerOptions": {
        // 启动装饰器和元数据
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        // ...
    },
    // ...
}
```

## 使用Class创建Input
---

### 添加bindMethods装饰器
前面在玩angular1和typescript的时候也发现和讲过，es6里的Class类，我们在使用的时候总是会有`this`的指向的问题，所以这里做个`bindMethods`装饰器，来进行`this`的绑定。

我们创建`utils`文件夹，用来管理这类工具，然后创建`bindMethods.ts`：

``` js
// 将实例的原型上面所有函数都绑定this
export function bindMethods(oldConstructor) {
    const newConstructor: any = function(...args) {
        const instance = new oldConstructor(...args);
        const prototype = oldConstructor.prototype;

        Object.keys(prototype).forEach(key => {
            if (typeof prototype[key] === 'function') {
                instance[key] = prototype[key].bind(instance);
            }
        });

        return instance;
    };

    // 复制构造函数的$inject属性
    Object.assign(newConstructor, oldConstructor);

    newConstructor.prototype = oldConstructor.prototype;
    return newConstructor;
}
```

### 添加文件夹别名
有个良好的习惯还是不错的，例如本骚年喜欢在架(luan)构(xie)项目的时候，就把共用文件夹的别名给添加上。
创建`import`或`require`的别名，来确保模块引入变得更简单。

首先我们要配置Webpack中的`esolve.alias`：

``` js
// webpack.config.js
var config = {
    // ...
    resolve: {
        alias: {
            utils: path.resolve(__dirname, 'src', 'utils'),
            components: path.resolve(__dirname, 'src', 'components'),
        }
    }
};
```

因为我们使用Typescript，所以我们还需要调整ts的配置：

``` json
// tsconfig.json
{
    "compilerOptions": {
        // ...
         "baseUrl": "src",
         "paths": {
             "utils": ["utils"],
             "components": ["components"]
         }
    }
}
```

### 创建一个Input
这里我们在`components`文件夹中添加`input.tsx`文件：

``` js
import xs from 'xstream';
import { run } from '@cycle/run';
import { makeDOMDriver } from '@cycle/dom';
import { bindMethods } from 'utils/bindMethods';

// 为了匹配不一样的input，只能先凑合加个随机id来匹配啦
let id: number = 0;

@bindMethods
export class InputComponent {
  DOM: any;
  value: any;
  constructor(domSources, type) {
    // 获取值的流呀
    this.value = domSources.select('#input' + id).events('change')
      .map(ev => ev.target.value).startWith('');
    // DOM值
    this.DOM = this.value.map(val => {
      return <input type={type} id={'input' + id++} className="form-control" value={val} />;
    });
  }
}
```

[捂脸]感觉今天智商有点不够用，尝试了下没有想象中的结果出来。
或许后面对于流还需要再仔细研究，就能出来啦。

## 结束语
-----
这节主要讲了为了使用装饰器进行配置调整，使用Class创建input控件的过程，不过智商不够用，还没能顺利跑起来。
项目代码也是个参考的过程，所以也作为一节来记录。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/cyclejs-notes/4-use-class-build-input)