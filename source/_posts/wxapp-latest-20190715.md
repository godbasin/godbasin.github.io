---
title: 小程序开发月刊第七期（20190715）
date: 2019-07-15 23:12:34
categories: 小程序双皮奶
tags: 教程
---
太可惜了这个月啥都没有~~
<!--more-->

# 小程序 latest
## 小程序能力
### 「2.7.3版本基础库」新增功能
- 新增页面间通信接口，用于当前页面和被打开页面间，[详情](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateTo.html)
- `wx.pageScrollTo`新增锚点支持，支持选择器和滚动距离两种方式定位，[详情](https://developers.weixin.qq.com/miniprogram/dev/api/ui/scroll/wx.pageScrollTo.html)
- 其他社区反馈问题修复

更多2.7.3版本基础库的新能力及详情，可查看[《基础库更新日志》](https://developers.weixin.qq.com/miniprogram/dev/framework/release/)。

### 微信证件 OCR 识别能力开放
微信证件OCR识别能力是微信团队推出的一套提升移动端快捷信息录入的工具，目前支持身份证、银行卡、行驶证 OCR 识别。经过半年时间的内测和持续迭代优化，现在正式对外开放接入。
目前有两种调用方式：小程序插件方式和云端API的方式。详情查看[微信证件OCR识别能力开放](https://developers.weixin.qq.com/community/develop/doc/000888093f4650c1c5c8208405bc01)。

### 更新日志
- [社区问题反馈以及功能优化更新（07.01-07.05）](https://developers.weixin.qq.com/community/develop/doc/000e68c2cbcc986368d8d44d85b401)  
- [社区问题反馈以及功能优化更新（06.24-06.28）](https://developers.weixin.qq.com/community/develop/doc/0002a49cd1c830acadc84a01e5b001)  
- [社区问题反馈以及功能优化更新（06.17-06.21）](https://developers.weixin.qq.com/community/develop/doc/00002a24780f98c843c886fc05b001)  

## 小程序·云开发
### 「小程序·云开发」新增付费功能
近期「小程序·云开发」将上线付费功能（付费功能针对非基础资源配额，基础资源配额仍可免费使用）。详情查看[「小程序·云开发」功能更新和问题反馈](https://developers.weixin.qq.com/community/develop/doc/000a6068c88d086fceb8d8afd56801)。

### 「小程序·云开发」新增数据库聚合功能
小程序·云开发新增数据库聚合能力。聚合操作可以将数据分组（或者不分组，即只有一组/每个记录都是一组）然后对每组数据执行多种批处理操作，最后返回结果。有了聚合能力，可以方便的解决很多没有聚合能力时无法实现或只能低效实现的场景，如分组查询、流水线式分阶段批处理以及获取唯一值等。具体使用方式见[小程序·云开发数据库聚合](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database/aggregation/aggregation.html)。

###  「小程序·云开发」云调用支持消息推送
「小程序·云开发」支持通过云函数接收小程序消息推送（如接收到客服消息时触发云函数）。开发者可在云控制台设置页面的全局设置中添加相关消息推送的配置，具体接入方式见[消息推送](https://developers.weixin.qq.com/miniprogram/dev/framework/server-ability/message-push.html)。  

## 开发者工具
### 云控制台支持消息推送配置
在云控制台-设置-全局设置，可以设置将消息推送至指定的云函数，而不再推送到微信公众平台-开发设置-消息推送中配置的域名。

### 云控制台支持数据库高级查询
云控制台-数据库-高级操作中可以通过编写指令对数据库进行高级查询。

更多的内容可以查看：
- [微信开发者工具 1.02.1907081 更新说明](https://developers.weixin.qq.com/community/develop/doc/0006e23bb00bd8652cd8324575b001)
- [开发者工具更新日志](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

# 小程序教程

## 社区精选文章
- [如何用小程序实现类原生APP下一条无限刷体验](https://developers.weixin.qq.com/community/develop/article/doc/0000645ae8cf882129c8b471951c13)

更多可以查看[文章分享](https://developers.weixin.qq.com/community/develop/article)。

## 最新踩坑 && Tips
1.Promise.then 有些情况下不被调用。查了一下基础库的 bug 历史，以前确实有发现过部分 iOS 系统版本上原生 Promise then 不触发的情况，具体触发条件不明。
最新进展：是客户端在预加载时的一个 bug 导致 setTimeout 不会回调（Promise 依赖 setTimeout）。这个问题会跟下个客户端版本修复。 

2.小程序要实现 1rpx 边框的圆形的时候，在 iOS 上计算px时会有bug，边框会出现疑似被剪切/遮挡的渐变状。
解决方案：只用1rpx/0.5px是不行的，要先放大，再缩小。据说，4倍可以cover目前绝大部分手机。

3.小程序遇到黑屏，可以从内存和图片方向进行排查，少用大图、少用高清大图。

4.Component 是 Page 的超集，因此可以使用 Component 构造器构造页面，拥有与普通组件一样的定义段与实例方法，同时还能使用各种丰富的 behavior 拓展能力，[参考文档](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html)。
注意事项：
- 对应 json 文件中包含 usingComponents 定义段
- 组件的属性可以用于接收页面的参数
- 页面的生命周期方法（即 on 开头的方法，如 onLoad），应写在 methods 定义段中

5.小程序切到后台，目前超过5分钟会被销毁，再次打开冷启动的时候，会默认回到首页。
- 更多可以参考[小程序的运行机制](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/operating-mechanism.html)

6.小程序页面被关闭 unload 之后，如果有原本在执行的逻辑，是会继续执行完毕的（因为各个 Webview 是共用 JS 线程的）。如果有重定向、跳转等逻辑，为了防止用户自行返回等操作，可以添加当前页面的条件判断是否要执行，页面栈可以通过 getCurrentPages 拿到。

## 结束语
人人都是天才。
但如果用爬树技巧来
评判一条鱼，
那么它一辈子
都会相信
自己是个蠢材。--爱因斯坦