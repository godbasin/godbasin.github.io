---
title: 小程序的奇技淫巧之 watch 观察属性
date: 2018-12-26 23:45:10
categories: 小程序双皮奶
tags: 教程
---
上一节我们介绍了小程序的 computed 计算属性，这次我们来讲讲 watch 观察属性叭~
<!--more-->

## watch 观察属性使用
---
这里我们直接先讲解下怎么用哇。

### 安装依赖
整个实现的依赖包，放在 Github 上，大家可以去翻看和点星星：[watch-behavior](https://github.com/godbasin/watch-behavior)。

- 安装`watch`：

```
npm install --save miniprogram-watch
```

> 使用 behavior 需要依赖小程序基础库 2.2.3 以上版本，同时依赖开发者工具的 npm 构建。具体详情可查阅[官方 npm 文档](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)。

### 在 Component 中使用

```js
// 需要开发者工具 npm 依赖
const watchBehavior = require("miniprogram-watch");

Component({
  behaviors: [watchBehavior],
  properties: {
    propA: {
      type: Number,
      value: 0
    }
  },
  data: {
    a: 0,
    b: {
      c: {
        d: 33
      },
      e: [1, 2, [3, 4]]
    }
  },
  // 可以将需要监听的数据放入 watch 里面，当数据改变时推送相应的订阅事件
  // 支持 data 以及 properties 的监听
  watch: {
    propA(val, oldVal) {
      console.log("propA new: %s, old: %s", val, oldVal);
    },
    a(val, oldVal) {
      console.log("a new: %s, old: %s", val, oldVal);
    },
    "b.c.d": function(val, oldVal) {
      console.log("b.c.d new: %s, old: %s", val, oldVal);
    },
    "b.e[2][0]": function(val, oldVal) {
      console.log("b.e[2][0] new: %s, old: %s", val, oldVal);
    },
    "b.e[3][4]": function(val, oldVal) {
      console.log("b.e[3][4] new: %s, old: %s", val, oldVal);
    }
  },
  methods: {
    onTap() {
      this.setData({
        a: 2,
        "b.c.d": 3,
        "b.e[2][0]": 444,
        c: 123
      });
      // 不在 data 里面的数据项不会放入观察者列表，比如这里的'b.e[3][4]'
    }
  }
});
```

### 在 Page 中使用
**`Component`是`Page`的超集，因此可以使用`Component`构造器构造页面。**

[官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html)：
> 事实上，小程序的页面也可以视为自定义组件。因而，页面也可以使用`Component`构造器构造，拥有与普通组件一样的定义段与实例方法。但此时要求对应`json`文件中包含`usingComponents`定义段。

- `page.json`

``` json
{
  "usingComponents": {}
}
```

- `page.js`

``` js
// 这里我们就可以使用 Component 代替 Page
Component({
  data: {
    a: 0,
    b: {
      c: {
        d: 33
      },
      e: [1, 2, [3, 4]]
    }
  },
  // 可以将需要监听的数据放入 watch 里面，当数据改变时推送相应的订阅事件
  watch: {
    a(val, oldVal) {
      console.log("a new: %s, old: %s", val, oldVal);
    },
    "b.c.d": function(val, oldVal) {
      console.log("b.c.d new: %s, old: %s", val, oldVal);
    },
    "b.e[2][0]": function(val, oldVal) {
      console.log("b.e[2][0] new: %s, old: %s", val, oldVal);
    },
    "b.e[3][4]": function(val, oldVal) {
      console.log("b.e[3][4] new: %s, old: %s", val, oldVal);
    }
  },
  methods: {
    // 页面的生命周期方法（即`on`开头的方法，如上面的`onLoad`），应写在`methods`定义段中。
    onLoad() {
      // 如访问页面`/pages/index/index?paramA=123&paramB=xyz`，如果声明有属性(`properties`)`paramA`或`paramB`，则它们会被赋值为`123`或`xyz`
      this.data.paramA // 页面参数 paramA 的值
      this.data.paramB // 页面参数 paramB 的值
    }
    onTap() {
      this.setData({
        a: 2,
        "b.c.d": 3,
        "b.e[2][0]": 444,
        c: 123
      });
      // 不在 data 里面的数据项不会放入观察者列表，比如这里的'b.e[3][4]'
    }
  }
});
```

更多的，也可以参考本人的[wxapp-typescript-demo](https://github.com/godbasin/wxapp-typescript-demo)中的[watch page](https://github.com/godbasin/wxapp-typescript-demo/tree/master/src/pages/watch)，后续也会持续更新方便好用的能力 demo。

## watch 观察属性实现
---
自定义组件中`computed`计算属性的实现，由[官方](https://github.com/wechat-miniprogram/computed)提供的。上一篇[《小程序的奇技淫巧之 computed 计算属性》](https://godbasin.github.io/2018/12/23/wxapp-computed/)中，也有讲解大致思路和使用方法。

现在，轮到我们自己来实现一个`watch`观察属性了。

这里的实现主要也是针对自定义组件中的[`behaviors`](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/behaviors.html)。上一篇已经讲过，这里就不再复述啦。

### watch 触发机制
其实`watch`的触发机制，基本都在`setData`的时候触发。而在自定义组件里，会有两种情况需要需要触发对应的`watch`监听：
- `properties`属性变化时
- `data`属性变化时（调用`setData`）

### watch 监听更新机制
既然`properties`和`data`都需要监听，我们来整理下逻辑。大致流程如下：

1. 在组件初始化的时候，将对应的`watch`路径加进观察队列`observers`。
2. 在`properties`和`data`属性变更时，触发更新。
  - `properties`可根据`observer`触发更新
  - `data`可根据`setData`触发更新
3. 更新时，先对比变更路径，然后根据路径是否匹配（即`observers`是否存在对应观察者），来确定是否需要通知相应的观察者。
4. 确定存在变更路径，则对比新数据与旧数据是否一致，一致则拦截不做通知。
5. 因为`watch`可能存在循环触发更新，对一次更新的最大通知次数做限制（这里限制5次）。

具体的实现可以在[watch](https://github.com/godbasin/watch-behavior)中找到。

### 参考
- [Component构造器](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html)
- [behaviors](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/behaviors.html)


## 结束语
---
Npm 包的发布，是一件简单也挺复杂的事情。简单的话，你可以发布一个单文件，不带任何构建等。复杂的时候，你需要写好demo、test、构建环境等等。
有些时候，自己亲自参与做一下，会让你更容易理解，这也是为什么我们偶尔需要造点轮子的原因。