---
title: 小程序的奇技淫巧之 computed 计算属性
date: 2018-12-23 17:11:39
categories: 小程序双皮奶
tags: 教程
---
小程序的出身，基于安全和管控的考虑，使用了双线程的设计，同时对于 DOM 操作、动态创建 DOM 这些都隔离了。在写代码的时候，模版语法不支持函数计算等，computed 的方法就显得十分重要了。
<!--more-->

## 自定义组件
---
小程序的自定义组件涉及功能很多，这篇只针对`computed`展开来讲。

`computed`比较适合较复杂逻辑的计算，同时在小程序无法在模板里使用`methods`这样的场景下，计算属性的需求就更强烈了。

### behaviors
自定义组件中，提供了[`behaviors`的使用和定义](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/behaviors.html)。

从官方文档我们能看到：
> `behaviors`是用于组件间代码共享的特性，类似于一些编程语言中的“mixins”或“traits”。
> 每个`behavior`可以包含一组属性、数据、生命周期函数和方法，组件引用它时，它的属性、数据和方法会被合并到组件中，生命周期函数也会在对应时机被调用。每个组件可以引用多个`behavior`。

简单来说，我们能通过`behaviors`来重构`Component`的能力。

如果说，我们能“混入”`Component`，其实基本很多能力都能实现啦。其实我们自己封装一层的`MyComponent`也能达到一定的效果，但是这样的拓展性会变得很糟。

通过`behaviors`的方式，每个组件可以按需引入自己需要的`behavior`啦。

### computed 实现
我们来梳理下这里的逻辑，我们需要一个`computed`能力，需要处理的主要是：`setData`的时候，根据`computed`来计算哪些数据需要处理。

所以我们要做的是：
1. 记下来需要`computed`的变量。
2. 在每次`setData`之前，看看是否包含到需要`computed`的变量，匹配到了就进行`computed`处理。
3. 使用处理后的数据，进行`setData`。

官方已经提供了[计算属性实现的behavior](https://github.com/wechat-miniprogram/computed)，大家也可以尽情翻看实现的[源码](https://github.com/wechat-miniprogram/computed/blob/master/src/index.js)，和使用这种拓展能力。

## Page 的超集
---

### hack 实现 Page computed 能力
想必大家都会有疑惑，`Component`里支持`behaviors`，但是`Page`依然写起来很不方便呀。虽然所有的`Page`最终也能通过`Component`来实现，但是这样是否需要多包装一层呢？

答案是不用。

### 使用 Component 构造器构造页面
`Component`是`Page`的超集，因此可以使用`Component`构造器构造页面。

同样的，我们来看看[官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html)：
> 事实上，小程序的页面也可以视为自定义组件。因而，页面也可以使用`Component`构造器构造，拥有与普通组件一样的定义段与实例方法。但此时要求对应`json`文件中包含`usingComponents`定义段。

也就是说，我们这样的页面：

``` js
Page({
  data: {
    logs: []
  },
  onLoad(query) {
    // 如访问页面`/pages/index/index?paramA=123&paramB=xyz`，如果声明有属性(`properties`)`paramA`或`paramB`，则它们会被赋值为`123`或`xyz`
    query.paramA // 页面参数 paramA 的值
    query.paramA // 页面参数 paramB 的值
    this.setData({
      logs: (wx.getStorageSync("logs") || []).map((log: number) => {
        return formatTime(new Date(log));
      })
    });
  }
});
```

可以这么写：

``` json
{
  "usingComponents": {}
}
```

``` js
Component({
  // 组件的属性可以用于接收页面的参数
  properties: {
    paramA: Number,
    paramB: String,
  },
  data: {
    logs: []
  },
  methods: {
    onLoad() {
      // 如访问页面`/pages/index/index?paramA=123&paramB=xyz`，如果声明有属性(`properties`)`paramA`或`paramB`，则它们会被赋值为`123`或`xyz`
      this.data.paramA // 页面参数 paramA 的值
      this.data.paramB // 页面参数 paramB 的值
      this.setData({
        logs: (wx.getStorageSync("logs") || []).map((log: number) => {
          return formatTime(new Date(log));
        })
      });
    }
  }
});
```

这样，我们就能愉快地使用`behaviors`啦。

``` js
const computedBehavior = require("miniprogram-computed");
Component({
  behaviors: [computedBehavior],
  data: {
    logs: []
  },
  computed: {
    logsAfterComputed() {
      // 计算属性同样挂在 data 上，每当进行 setData 的时候会重新计算
      // 比如此字段可以通过 this.data.b 获取到
      return this.data.logs.map(x => {
        return {
          log: x,
          logAfterCompute: x + "logAfterCompute"
        };
      });
    }
  },
  methods: {
    onLoad() {
      this.setData({
        logs: (wx.getStorageSync("logs") || []).map((log: number) => {
          return formatTime(new Date(log));
        })
      });
    }
  }
});
```

使用`Component`构造器构造页面，需要注意：
1. 组件的属性可以用于接收页面的参数，如访问页面`/pages/index/index?paramA=123&paramB=xyz`，如果声明有属性(`properties`)`paramA`或`paramB`，则它们会被赋值为`123`或`xyz`。（可参考[官方代码示例](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html)）
2. 页面的生命周期方法（即`on`开头的方法，如上面的`onLoad`），应写在`methods`定义段中。

这样，你就能愉快地在代码里面使用`computed`计算属性啦~

更多的，也可以参考本人的[wxapp-typescript-demo](https://github.com/godbasin/wxapp-typescript-demo)中的[log page](https://github.com/godbasin/wxapp-typescript-demo/tree/master/src/pages/logs)，后续也会持续更新方便好用的能力 demo。

### 参考
- [Component构造器](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html)
- [behaviors](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/behaviors.html)


## 结束语
---
小程序提供的能力其实挺多的，但是很多时候由于文档很多、查找不方便，会导致我们有些很好用的功能没有发现，然后苦逼地一边吐槽一边悲壮地撸代码。
官方提供的目前只有`computed`，大家可以看看，是不是还可以做`watch`之类的能力呢？