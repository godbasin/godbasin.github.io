---
title: 小程序奇技淫巧之globalDataBehavior管理全局状态
date: 2019-11-09 19:53:59
categories: 小程序双皮奶
tags: 教程
---
全局状态管理在小程序里也算是一道难题了，有些小伙伴会选择引入一些类 Store 的库来管理全局状态。今天来给大家分享一个，使用 Behavior 来管理全局状态的小技巧。
<!--more-->

## Behaviors
---
自定义组件中，提供了[`behaviors`的使用和定义](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/behaviors.html)。

从官方文档我们能看到：
> `behaviors`是用于组件间代码共享的特性，类似于一些编程语言中的“mixins”或“traits”。
> 每个`behavior`可以包含一组属性、数据、生命周期函数和方法，组件引用它时，它的属性、数据和方法会被合并到组件中，生命周期函数也会在对应时机被调用。每个组件可以引用多个`behavior`。

简单来说，我们能通过`behaviors`来重构`Component`的能力。Behavior的用处很多，前面也有介绍 [computed 计算属性](https://godbasin.github.io/2018/12/23/wxapp-computed/)、[watch 观察属性](https://godbasin.github.io/2018/12/26/wxapp-watch/)的实现，都是使用的 Behavior。

### 全局状态管理
我们希望全局共享一些数据状态，如果只是通过一个文件的方式进行维护，那么我们无法在状态更新的时候及时地同步到页面。我们需要额外调用 setData 才能更新页面中的 data 数据，才能告诉渲染层这块的数据渲染需要变更，而很多的 Store 状态管理库也是通过这样的方式实现的（事件通知 + setData + 全局状态）。

在小程序 Behavior 能力的支持下，我们可以通过一个全局的 globalData Behavior 注入到每个需要用到的 Component 中，这样就可以在需要的页面中直接引入该 Behavior，就能获取到了。不啰嗦，Behavior的实现如下：

``` js
// globalDataStore 用来全局记录 globalData，为了跨页面同步 globalData 用
export let globalDataStore = {};
// 获取本地的 gloabalData 缓存
try {
  const gloabalData = wx.getStorageSync("gloabalData");
  // 有缓存的时候加上
  if (gloabalData) {
    globalDataStore = { ...gloabalData };
  }
} catch (error) {
  console.error("gloabalData getStorageSync error", "e =", error);
}

// globalCount 用来全局记录 setGlobalData 的调用次数，为了在 B 页面回到 A 页面的时候，
// 检查页面 __setGlobalDataCount 和 globalCount 是否一致来判断在 B 页面是否有 setGlobalData,
// 以此来同步 globalData
let globalCount = 0;

export default Behavior({
  data: {
    globalData: Object.assign({}, globalDataStore)
  },
  lifetimes: {
    attached() {
      // 页面 onLoad 的时候同步一下 globalCount
      this.__setGlobalDataCount = globalCount;
      // 同步 globalDataStore 的内容
      this.setData({
        globalData: Object.assign(
          {},
          this.data.globalData || {},
          globalDataStore
        )
      });
    }
  },
  pageLifetimes: {
    show() {
      // 为了在 B 页面回到 A 页面的时候，检查页面 __setGlobalDataCount 和 globalCount 是否一致来判断在 B 页面是否有 setGlobalData
      if (this.__setGlobalDataCount != globalCount) {
        // 同步 globalData
        this.__setGlobalDataCount = globalCount;
        this.setGlobalData(Object.assign({}, globalDataStore));
      }
    }
  },
  methods: {
    // setGlobalData 实现，主要内容为将 globalDataStore 的内容设置进页面的 data 的 globalData 属性中。
    setGlobalData(obj: any) {
      globalCount = globalCount + 1;
      this.__setGlobalDataCount = this.__setGlobalDataCount + 1;
      obj = obj || {};
      let outObj = Object.keys(obj).reduce((sum, key) => {
        let _key = "globalData." + key;
        sum[_key] = obj[key];
        return sum;
      }, {});
      this.setData(outObj, () => {
        globalDataStore = this.data.globalData;
      });
    },
    // setGlobalDataAndStorage 实现，先调用 setGlobalData，然后存到 storage 里
    setGlobalDataAndStorage(obj: any) {
      this.setGlobalData(obj);
      try {
        let gloabalData = wx.getStorageSync("gloabalData");
        // 有缓存的时候加上
        if (gloabalData) {
          gloabalData = { ...gloabalData, ...obj };
        } else {
          gloabalData = { ...obj };
        }
        wx.setStorageSync("gloabalData", gloabalData);
      } catch (e) {
        console.error("gloabalData setStorageSync error", "e =", e);
      }
    }
  }
});
```

显然，该 Behavior 主要提供了几个能力：  
- 会在小程序 data 添加 globalData 的属性，在 WXML 文件中可以直接通过`{{globalData.xxxx}}`获取到
- 提供`setGlobalData()`方法，用于更新全局状态
- 提供`setGlobalDataAndStorage()`方法，用于更新全局状态，同时写入缓存（会在下次启动应用的时候自动获取缓存数据）

这样，我们在初始化 Component 的时候直接引入就可以使用：

``` js
Component({
  // 在behaviors中引入globalDataBehavior
  behaviors: [globalDataBehavior],
  // 其他选项
  methods: {
    test() {
      // 使用this.setGlobalData可以更新全局的数据状态
      this.setGlobalData({ test: "hello world" });
      // 使用this.setGlobalDataAndStorage可以更新全局的数据状态，并写入缓存
      // 下次globalDataBehavior会默认从缓存中获取
      this.setGlobalDataAndStorage({ test: "hello world" });
    }
  }
});
```

在引入了 globalDataBehavior 之后，我们的 WXML 就可以直接使用了：

``` html
<view>{{ globalData.test }}</view>
```

### 页面如何使用 Behavior
`Component`是`Page`的超集，因此可以使用`Component`构造器构造页面。

看看[官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html)：事实上，小程序的页面也可以视为自定义组件。因而，页面也可以使用`Component`构造器构造，拥有与普通组件一样的定义段与实例方法。但此时要求对应`json`文件中包含`usingComponents`定义段。

更详细的使用方法，在 [computed 计算属性](https://godbasin.github.io/2018/12/23/wxapp-computed/)、[watch 观察属性](https://godbasin.github.io/2018/12/26/wxapp-watch/)两篇文章中也有描述，大家可以自行参考。

或者直接查看最终的项目代码：[wxapp-typescript-demo](https://github.com/godbasin/wxapp-typescript-demo)。

### 参考
- [Component构造器](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html)
- [behaviors](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/behaviors.html)

## 结束语
---
Behavior 其实是很强大的一个能力，我们能用它来对自己的小程序做很多的能力拓展，缺啥补啥，还可以“混入”给每个 Component 每个方法打入日志，就不用每个组件自己手动打印代码拉。