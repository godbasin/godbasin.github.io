---
title: 小程序奇技淫巧之日志能力
date: 2019-12-07 13:42:28
categories: 小程序双皮奶
tags: 教程
---
小程序定位问题也是一大难题，而官方提供了 LogManager 和实时日志，这两个能力是如何结合使用、是否还有更便捷的方式来使用呢？
<!--more-->

## 日志与反馈
---

前端开发在进行某个问题定位的时候，日志是很重要的。因为机器兼容性问题、环境问题等，我们常常无法复现用户的一些bug。而微信官方也提供了较完整的日志能力，我们一起来看一下。

### 用户反馈
小程序官方提供了用户反馈携带日志的能力，大概流程是：  
1. 开发中日志打印，使用日志管理器实例 LogManager。  
2. 用户在使用过程中，可以在小程序的 profile 页面（【右上角胶囊】-【关于xxxx】），点击【投诉与反馈】-【功能异常】（旧版本还需要勾选上传日志），则可以上传日志。
3. 在小程序管理后台，【管理】-【反馈管理】，就可以查看上传的日志（还包括了很详细的用户和机型版本等信息）。 

这个入口可能对于用户来说过于深入（是的，官方也发现这个问题了，所以后面有了实时日志），我们小程序也可以通过`button`组件，设置`openType`为`feedback`，然后用户点击按钮就可以直接拉起意见反馈页面了。利用这个能力，我们可以监听用户截屏的操作，然后弹出浮层引导用户主动进行反馈。

``` js
<view class="dialog" wx:if="{{isFeedbackShow}}">
  <view>是否遇到问题？</view>
  <button open-type="feedback">点击反馈</button>
</view>

wx.onUserCaptureScreen(() => {
  // 设置弹窗出现
  this.setData({isFeedbackShow: true})
});
```

### LogManager
关于小程序的 LogManager，大概是非常实用又特别低调的一个能力了。它的使用方式其实和 console 很相似，提供了 log、info、debug、warn 等日志方式。

``` js
const logger = wx.getLogManager()
logger.log({str: 'hello world'}, 'basic log', 100, [1, 2, 3])
logger.info({str: 'hello world'}, 'info log', 100, [1, 2, 3])
logger.debug({str: 'hello world'}, 'debug log', 100, [1, 2, 3])
logger.warn({str: 'hello world'}, 'warn log', 100, [1, 2, 3])
```

打印的日志，从管理后台下载下来之后，也是很好懂：

``` log
2019-6-25 22:11:6 [log] wx.setStorageSync api invoke
2019-6-25 22:11:6 [log] wx.setStorageSync return
2019-6-25 22:11:6 [log] wx.setStorageSync api invoke
2019-6-25 22:11:6 [log] wx.setStorageSync return
2019-6-25 22:11:6 [log] [v1.1.0] request begin
2019-6-25 22:11:6 [log] wx.request api invoke with seq 0
2019-6-25 22:11:6 [log] wx.request success callback with msg request:ok with seq 0
2019-6-25 22:11:6 [log] [v1.1.0] request done
2019-6-25 22:11:7 [log] wx.navigateTo api invoke
2019-6-25 22:11:7 [log] page packquery/pages/index/index onHide have been invoked
2019-6-25 22:11:7 [log] page packquery/pages/logs/logs onLoad have been invoked
2019-6-25 22:11:7 [log] [v1.1.0] logs  |  onShow  |    |  []
2019-6-25 22:11:7 [log] wx.setStorageSync api invoke
2019-6-25 22:11:7 [log] wx.setStorageSync return
2019-6-25 22:11:7 [log] wx.reportMonitor api invoke
2019-6-25 22:11:7 [log] page packquery/pages/logs/logs onShow have been invoked
2019-6-25 22:11:7 [log] wx.navigateTo success callback with msg navigateTo:ok
```

LogManager 最多保存 5M 的日志内容，超过5M后，旧的日志内容会被删除。基础库默认会把 App、Page 的生命周期函数和 wx 命名空间下的函数调用写入日志，基础库的日志帮助我们定位具体哪些地方出了问题。

### 实时日志
小程序的 LogManager 有一个很大的痛点，就是必须依赖用户上报，入口又是右上角胶囊-【关于xxxx】-【投诉与反馈】-【功能异常】这么长的路径，甚至用户的反馈过程也会经常丢失日志，导致无法查问题。

为帮助小程序开发者快捷地排查小程序漏洞、定位问题，微信推出了实时日志功能。从基础库 2.7.1 开始，开发者可通过提供的接口打印日志，日志汇聚并实时上报到小程序后台。

使用方式如下：  
1. 使用 wx.getRealtimeLogManager 在代码⾥⾯打⽇志。  
2. 可从小程序管理后台【开发】-【运维中心】-【实时日志】进入日志查询页面，查看开发者打印的日志信息。  

开发者可通过设置时间、微信号/OpenID、页面链接、FilterMsg内容（基础库2.7.3及以上支持setFilterMsg）等筛选条件查询指定用户的日志信息:

![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-logs-1.png)

由于后台资源限制，实时日志使用规则如下：  
1. 为了定位问题方便，日志是按页面划分的，某一个页面，在onShow到onHide（切换到其它页面、右上角圆点退到后台）之间打的日志，会聚合成一条日志上报，并且在小程序管理后台上可以根据页面路径搜索出该条日志。
2. 每个小程序账号每天限制500万条日志，日志会保留7天，建议遇到问题及时定位。
一条日志的上限是5KB，最多包含200次打印日志函数调用（info、warn、error调用都算），所以要谨慎打日志，避免在循环里面调用打日志接口，避免直接重写console.log的方式打日志。
3. 意见反馈里面的日志，可根据OpenID搜索日志。
4. setFilterMsg 可以设置过滤的 Msg。这个接口的目的是提供某个场景的过滤能力，例如`setFilterMsg('scene1')`，则在 MP 上可输入 scene1 查询得到该条日志。比如上线过程中，某个监控有问题，可以根据 FilterMsg 过滤这个场景下的具体的用户日志。FilterMsg 仅支持大小写字母。如果需要添加多个关键字，建议使用 addFilterMsg 替代 setFilterMsg。

## 日志开发技巧
---

既然官方提供了 LogManager 和实时日志，我们当然是两个都要用啦。

### log.js
我们将所有日志的能力都封装在一起，暴露一个通用的接口给调用方使用：

``` js
// log.js
const VERSION = "0.0.1"; // 业务代码版本号，用户灰度过程中观察问题

const canIUseLogManage = wx.canIUse("getLogManager");
const logger = canIUseLogManage ? wx.getLogManager({level: 0}) : null;
var realtimeLogger = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null;

/**
 * @param {string} file 所在文件名
 * @param  {...any} arg 参数
 */

export function DEBUG(file, ...args) {
  console.debug(file, " | ", ...args);
  if (canIUseLogManage) {
    logger!.debug(`[${VERSION}]`, file, " | ", ...args);
  }
  realtimeLogger && realtimeLogger.info(`[${VERSION}]`, file, " | ", ...args);
}

/**
 *
 * @param {string} file 所在文件名
 * @param  {...any} arg 参数
 */
export function RUN(file, ...args) {
  console.log(file, " | ", ...args);
  if (canIUseLogManage) {
    logger!.log(`[${VERSION}]`, file, " | ", ...args);
  }
  realtimeLogger && realtimeLogger.info(`[${VERSION}]`, file, " | ", ...args);
}

/**
 *
 * @param {string} file 所在文件名
 * @param  {...any} arg 参数
 */
export function ERROR(file, ...args) {
  console.error(file, " | ", ...args);
  if (canIUseLogManage) {
    logger!.warn(`[${VERSION}]`, file, " | ", ...args);
  }
  if (realtimeLogger) {
    realtimeLogger.error(`[${VERSION}]`, file, " | ", ...args);
    // 判断是否支持设置模糊搜索
    // 错误的信息可记录到 FilterMsg，方便搜索定位
    if (realtimeLogger.addFilterMsg) {
      try {
        realtimeLogger.addFilterMsg(
          `[${VERSION}] ${file} ${JSON.stringify(args)}`
        );
      } catch (e) {
        realtimeLogger.addFilterMsg(`[${VERSION}] ${file}`);
      }
    }
  }
}

// 方便将页面名字自动打印
export function getLogger(fileName: string) {
  return {
    DEBUG: function(...args) {
      DEBUG(fileName, ...args);
    },
    RUN: function(...args) {
      RUN(fileName, ...args);
    },
    ERROR: function(...args) {
      ERROR(fileName, ...args);
    }
  };
}
```

通过这样的方式，我们在一个页面中使用日志的时候，可以这么使用：

``` js
import { getLogger } from "./log";
const PAGE_MANE = "page_name";
const logger = getLogger(PAGE_MANE);
```

### autolog-behavior
现在有了日志组件，我们需要在足够多的地方记录日志，才能在问题出现的时候及时进行定位。一般来说，我们需要在每个方法在被调用的时候都打印一个日志，所以这里封装了一个 autolog-behavior 的方式，每个页面（需要是 Component 方式）中只需要引入这个 behavior，就可以在每个方法调用的时候，打印日志：

``` js
// autolog-behavior.js
import * as Log from "../utils/log";
/**
 * 本 Behavior 会在小程序 methods 中每个方法调用前添加一个 Log 说明
 * 需要在 Component 的 data 属性中添加 PAGE_NAME，用于描述当前页面
 */

export default Behavior({
  definitionFilter(defFields) {
    // 获取定义的方法
    Object.keys(defFields.methods || {}).forEach(methodName => {
      const originMethod = defFields.methods![methodName];
      // 遍历更新每个方法
      defFields.methods![methodName] = function(ev, ...args) {
        if (ev && ev.target && ev.currentTarget && ev.currentTarget.dataset) {
          // 如果是事件类型，则只需要记录 dataset 数据
          Log.RUN(defFields.data.PAGE_NAME, `${methodName} invoke, event dataset = `, ev.currentTarget.dataset, "params = ", ...args);
        } else {
          // 其他情况下，则都记录日志
          Log.RUN( defFields.data.PAGE_NAME, `${methodName} invoke, params = `, ev, ...args);
        }
        // 触发原有的方法
        originMethod.call(this, ev, ...args);
      };
    });
  }
});
```

我们能看到，日志打印依赖了页面中定义了一个`PAGE_NAME`的 data 数据，所以我们在使用的时候可以这么处理：

``` js
import { getLogger } from "../../utils/log";
import autologBehavior from "../../behaviors/autolog-behavior";

const PAGE_NAME = "page_name";
const logger = getLogger(PAGE_NAME);

Component({
  behaviors: [autologBehavior],
  data: {
    PAGE_NAME,
    // 其他数据
  },
  methods: {
    // 定义的方法会在调用的时候自动打印日志
  }
});
```

> 页面如何使用 Behavior
> 看看[官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html)：事实上，小程序的页面也可以视为自定义组件。因而，页面也可以使用`Component`构造器构造，拥有与普通组件一样的定义段与实例方法。但此时要求对应`json`文件中包含`usingComponents`定义段。

完整的项目可以参考[wxapp-typescript-demo](https://github.com/godbasin/wxapp-typescript-demo)。

### 参考
- [LogManager](https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/LogManager.html)
- [实时日志](https://developers.weixin.qq.com/miniprogram/dev/framework/realtimelog/)
- [Component构造器](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html)
- [behaviors](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/behaviors.html)


## 结束语
---
使用自定义组件的方式来写页面，有特别多好用的技巧，behavior 就是其中一个比较重要的能力，大家可以发挥自己的想象力来实现很多奇妙的功能。