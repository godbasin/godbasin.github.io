---
title: 小程序奇技淫巧之页面跳转管理
date: 2019-12-08 19:12:08
categories: 小程序双皮奶
tags: 教程
---
小程序页面跳转也是一个很容易踩到坑的开发流程，本文介绍页面跳转相关的一些好用的实践和封装的组件库。
<!--more-->

## 小程序页面跳转
---
一个小程序可以有很多页面，每个页面承载不同的功能，页面之间可以互相跳转。我们知道，小程序分为渲染层和逻辑层，渲染层中包含了多个 WebView，每个 WebView 对应到我们的小程序里就是一个页面 Page，每一个页面都独立运行在一个页面层级上，如图：

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-navigate-1.png)

### 页面栈管理
一个小程序拥有多个页面，我们知道`wx.navigateTo`可以推入一个新的页面。我们看看小程序示例小程序里，在首页使用2次`wx.navigateTo`后，页面层级会有三层：

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-17.jpg)  

我们把这样的一个页面层级称为页面栈。在小程序中所有页面的路由全部由框架进行管理，框架以栈的形式维护了当前的所有页面。小程序中页面栈最多十层，也就是十个 WebView，如果超过了十个之后，就没法再打开新的页面了。

对于每一个新的页面层级，渲染层都需要进行一些额外的准备工作。在小程序启动前，客户端会提前准备好一个页面层级用于展示小程序的首页。除此以外，每当一个页面层级被用于渲染页面，客户端都会提前开始准备一个新的页面层级，使得每次调用`wx.navigateTo`都能够尽快展示一个新的页面。

### 页面间跳转
小程序启动时仅有一个页面层级，而在小程序运行中，页面之间的跳转表现包括这些：  

| API | 页面表现 | 页面栈表现 |
| - | - | - |
| `wx.navigateTo` | 保留当前页面，跳转到应用内的某个页面 | 创建一个新的页面层级 |
| `wx.navigateBack` | 关闭当前页面，返回上一页面或多级页面 | 销毁一个页面层级 |
| `wx.redirectTo` | 关闭当前页面，跳转到应用内的某个页面 | 将当前页面层级重新初始化。重新传入页面的初始数据、路径等，视图层清空当前页面层级的渲染结果然后重新渲染页面 |
| `wx.reLaunch` | 关闭所有页面，打开到应用内的某个页面 | 销毁所有页面层级，再创建一个新的页面层级 |
| `wx.switchTab` | 关闭其他所有非 tabBar 页面，跳转到 tabBar 页面 | 销毁所有非 tabBa 页面层级，打开tabBar页面层级 |

上面提到了 tabBar。除了普通的页面跳转，小程序里还支持配置 tabBar。tabBar 就是类似客户端 APP 底部的 tab 切换，为了获得更好的体验，小程序提供了这样的全局组件，在 app.json 文件中设置 tabBar，因此我们小程序会区分 tabBar 页面和非 tabBar 页面。tabBar 页面之间的切换都只会有一个层级，而跳转到非 tabBar 页面之后，就有了页面层级和页面栈的管理。

## 页面跳转技巧
---

小程序的 JS 脚本是运行在 JsCore 的线程里，小程序的每个页面各自有一个 WebView 线程进行渲染，所以小程序切换页面时，小程序逻辑层的 JS 脚本运行上下文依旧在同一个 JsCore 线程中。

因为在同一个 JsCore 线程中，我们就会有一些问题会遇到，也可以有一些小技巧来处理。

### 判断跳转来源
由于切换页面后，业务逻辑依然在同一个 JsCore 线程中。因此，即使是小程序页面被关闭 unload 之后，如果有原本在执行的逻辑，会继续执行完毕。

在这样的情况下，如果有重定向、跳转等逻辑，在跳转之后后续的逻辑依然会继续执行，这时候如果还有其他的跳转逻辑，可能会导致页面连续跳转，严重的话跳转参数丢书会导致白屏。

为了防止用户自行返回等操作，可以添加当前页面的条件判断是否要执行，页面栈可以通过`getCurrentPages`拿到，例如我们可以添加这样的方法处理：

``` js
// 处理是否有当前路由
function matchOriginPath(originPageUrl) {
  let currentPages = getCurrentPages();
  const currentPage = currentPages[currentPages.length - 1].route;
  // 判断是否设置了特定页面才进行跳转
  // 如果设置了，判断当前页面是否特定页面，是才跳转
  // 用于判断当前页面是否已经被跳转走（用户手动关闭等）
  const isMatch = !originPageUrl || (originPageUrl && currentPage.indexOf(originPageUrl) > -1);
  // 如果设置了，当页面路径不匹配，则进行报错提示
  if (!isMatch) {
    console.error(
      "matchOriginPath do not match",
      `currentPage: ${currentPage}, originPageUrl: ${originPageUrl}`
    );
  }
  return isMatch;
}
```

通过这样的检查方式，我们可以通过传参来判断下是否要检查：

``` js
/**
 * 跳转到页面
 * @param {object} url 要跳转的页面地址
 * @param {object} originPageUrl 原始页面地址，用于判断来源是否符合
 */
export function navigateTo(url: string, originPageUrl?: string) {
  // 不符合源页面条件则不跳转
  if (!matchOriginPath(originPageUrl!)) {
    logger.RUN("navigateTo", "originPageUrl != currentPage, return");
    return Promise.resolve();
  }
  console.log(url);
  wx.navigateTo({ url });
}
```

这样，我们跳转的时候可以添加参数，预防页面非预期的跳转：

``` js
navigateTo({url: '/pages/pageB'}, '/pages/pageA');
// 后面的逻辑在页面跳转之后，不会再生效
navigateTo({url: '/pages/pageC'}, '/pages/pageA');
```

### 跳转传参
小程序提供的跳转相关 API，需要在 url 后面添加参数的方式来传参，但有些时候我们不仅仅需要携带简单的字符串或者数字，我们还可能需要携带一个较大的对象数据。那么这种情况下，由于小程序页面切换依然在同一个 JsCore 上下文，我们可以通过共享对象的方式来传递。

共享对象需要在公共库中存储一个当前跳转的传参内容，同时为了避免页面同时跳转导致传参内容不匹配，我们可以通过一个随机 ID 的方式来标记：

``` js
export function getRandomId() {
  // 时间戳（9位） + 随机串（10位）
  return (Date.now()).toString(32) + Math.random().toString(32).substring(2);
}
```

跳转的时候，我们可以根据 url 传参的方式，还是共享对象传参的方式，来进行不同的判断处理：

``` js
let globalPageParams = undefined; // 全局页面跳转参数
let globalPageParamsId: any = undefined; // 全局页面跳转参数Id，用于标识某一次跳转的数据

// 跳转时参数处理
function mangeUrl(url, options) {
  const { urlParams, pageParams } = options;

  // url参数处理
  if (urlParams) {
    url = addUrlParams(url, urlParams);
  }

  // 页面参数处理
  if (pageParams) {
    globalPageParams = objectCopy(pageParams);
    // 获取随机 ID
    globalPageParamsId = getRandomId();
    // 将随机 ID 带入 url 参数中，可用来获取全局参数
    url = addUrlParams(url, { randomid: globalPageParamsId });
  } else {
    globalPageParams = undefined;
    globalPageParamsId = undefined;
  }
  return url;
}
```

这样，我们的跳转方法可以这么处理：

``` js
/**
 * 跳转到页面
 * @param {object} url 要跳转的页面地址
 * @param {object} options 要携带的参数信息
 * @param {object} originPageUrl 原始页面地址，用于判断来源是否符合
 */
export function navigateTo(url, options = {}, originPageUrl) {
  url = mangeUrl(url, options);

  // 不符合源页面条件则不跳转
  if (!matchOriginPath(originPageUrl!)) {
    logger.RUN("navigateTo", "originPageUrl != currentPage, return");
    return Promise.resolve();
  }
  wx.navigateTo({ url });
}
```

### 结合 Component 自动取参
我们有介绍过如何使用 Component 来开发页面，使用 Component 有几个好处：
1. 可以通过 Behavior 来拓展组件的通用能力。
2. 可以直接通过定义 properties 来获取页面参数。

> 页面如何使用 Behavior
> 看看[官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html)：事实上，小程序的页面也可以视为自定义组件。因而，页面也可以使用`Component`构造器构造，拥有与普通组件一样的定义段与实例方法。但此时要求对应`json`文件中包含`usingComponents`定义段。

这里配合跳转传参，我们可以省略很多的逻辑。例如我们有一个结果页面，页面展示直接从 url 中取值（如果使用 Page 的 query 方式获取参数，需要自己进行  decodeURIComponent 才能使用，而使用组件的 properties 则不需要）：

``` js
Component({
  // 其他配置省略
  properties: {
    type: String,  // 结果类型，成功-success，失败-warn
    title: String, // 主要文案
    info: String // 辅助文案
  }
});
```

我们这样进行跳转：

``` js
navigateTo("/pages/result/result", {
  // 直接带入参数，result组件可通过properties直接拿到
  urlParams: {
    type: "success",
    title: "操作成功",
    info: "成功就是这么简单"
  }
});
```

则可以直接在模板中显示：

``` html
<!-- 使用的 weui 组件库 -->
<view class="page">
    <weui-msg type="{{type}}" title="{{title}}">
        <view slot="desc">{{info}}</view>
    </weui-msg>
</view>
```

如果是通过页面传参的方式，则需要通过随机 ID 来获取对应的参数：

``` js
// 通过随机 ID 获取对应参数
export function getPageParams(randomId) {
  if (globalPageParamsId === randomId) {
    return globalPageParams || {};
  }
  return {};
}
```

组件中可以通过 properties 来获取随机 ID，然后获取对应参数：

``` js
Component({
  // 其他配置省略
  properties: {
    randomid: String,  // 随机 ID
  },
  methods: {
    onLoad() {
      // 获取参数
      const params = getPageParams(this.data.randomid);
      // 处理参数
    }
  }
});
```

具体的代码实现，可参考项目代码：[wxapp-typescript-demo](https://github.com/godbasin/wxapp-typescript-demo)。

### 参考
- [7.2 页面层级准备](https://developers.weixin.qq.com/ebook?action=get_post_info&docid=000a64a29c48b0eb0086f161b5940a)
- [Component构造器](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html)
- [behaviors](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/behaviors.html)


## 结束语
---
使用自定义组件的方式来开发页面，简直不能太赞啦。通过 Behavior 来各种拓展组件的能力，同时还能简化一些取参的逻辑，还是特别方便的。