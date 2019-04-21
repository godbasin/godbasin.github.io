---
title: 小程序开发月刊第四期（20190415）
date: 2019-04-15 23:54:30
categories: 小程序双皮奶
tags: 教程
---
每月都有小程序期刊，这个月新功能特别多~~
<!--more-->

# 小程序 latest
## 小程序能力
### 「小程序评测」功能上线
小程序评测能力已上线beta版本，登录管理后台-【功能】-【小程序评测】可以查看。
评测达标的小程序，可获得「2小时极速审核」和「内测功能体验」奖励。
- 常见问题查看：http://kf.qq.com/faq/190108BJnmUN190108RrEnqE.html

### 小程序管理后台新增页面收录设置的开关
小程序管理后台新增页面收录设置的开关，开发者可根据业务需要进行设置：
1. 小程序管理后台-【设置】-【基本设置】-【页面收录设置】，可对你的小程序帐号进行收录的开启和关闭的设置。
2. 更新 微信开发者工具 ，可对 sitemap 进行特定页面的配置，可参考[小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/sitemap.html)。
3. 此设置默认开启。若小程序中存在不适合展示的内容，或开发者不希望使用微信展示其小程序，建议开发者自行关闭该设置，[详情查看](https://mp.weixin.qq.com/wxopen/readtemplate?t=config/collection_agreement_tmpl )。
 
PS: sitemap 功能仿原生目前是不会被收录的。开关的逻辑他们会特殊处理下，默认关闭（目前是默认开启）。同时：
1. 如果设置了不允许被搜索，但开启了允许被收录：不会进入搜索。
2. 如果关闭了允许被收录，sitemap 设置会无效。

### 小程序关联公众号策略调整
为了降低公众号与小程序间的合作门槛，我们将调整小程序关联公众号策略如下：
1. 公众号关联小程序将无需小程序管理员确认。
2. 取消“小程序最多关联500个公众号”的限制。
3. 若希望小程序在被关联时保留管理员确认环节，可前往“小程序管理后台-设置-基本设置-关联公众号设置”修改设置项。
4. 公众号文章中可直接使用小程序素材，无需关联小程序。
开发者可在小程序管理后台-【设置】-【关联设置】中管理已关联的公众号。

### 小程序用户访问数据上报优化
为了提供更准确的用户访问数据，小程序数据上报做了系统优化，由微信客户端上报切换为基础库上报。当用户离开小程序页面，触发`onHide`或`onUnload`函数时，公共库会上报此次用户访问行为。
优化详情如下：
- 优化了部分小程序存在页面脏数据的问题
- 优化了部分小程序存在错误小程序跳转数据的问题
- 当用户点击进入小程序，但小程序框架未加载完成，用户退出小程序，则不做上报，确保每次上报数据均为有效访问行为

### 更新日志
- [周社区问题反馈以及功能优化更新（04.01-04.05）](https://developers.weixin.qq.com/community/develop/doc/000c8033998118cb3168228965b401)
- [周社区问题反馈以及功能优化更新（03.25-03.29）](https://developers.weixin.qq.com/community/develop/doc/0006882b218580bcaf58036f556c01)
- [周社区问题反馈以及功能优化更新（03.11-03.16）](https://developers.weixin.qq.com/community/develop/doc/000c249a62c968e59648fdcd051001)
- [周社区问题反馈以及功能优化更新（03.04-03.08）](https://developers.weixin.qq.com/community/develop/doc/000e8a372e0608040c481445956001)

## 开发者工具
### 「微信开发者工具」新增企业微信小程序插件
企业微信小程序模拟器插件是为了方便用户在微信开发者工具中进行企业微信小程序开发、调试和代码上传。
- 参考文档：https://developers.weixin.qq.com/miniprogram/dev/devtools/qywx-dev.html

### 「小程序·云开发」云函数本地调试功能上线
小程序·云开发提供了云函数本地调试功能，方便开发者在本地进行云函数调试，提高开发效率。开发者可通过右键点击云函数名唤起本地调试界面。目前云函数本地调试的支持手动触发和模拟器触发两种请求方式。
- 参考文档：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/functions/local-debug.html

### 「小程序·云开发」新增云调用
云调用是云开发提供的基于云函数使用小程序开放接口的能力。目前覆盖服务端调用的场景，后续将会陆续开放开放数据调用、消息推送、支付等其他多种使用场景。
云调用需要在云函数中通过`wx-server-sdk`使用。在云函数中使用云调用调用服务端接口无需换取`access_token`，只要是在从小程序端触发的云函数中发起的云调用都经过微信自动鉴权，可以在登记权限后直接调用如发送模板消息等开放接口。
- 云调用文档：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/functions/openapi.html

### 「小程序·云开发」全新云控制台上线
云开发控制台经过全新设计和改版，优化交互和视觉体验，功能分类更加清晰、各项功能更加易用

### 其他
**开发工具新增版本区分：**
- [开发版 Nightly Build](https://developers.weixin.qq.com/miniprogram/dev/devtools/nightly.html): 日常构建版本，用于尽快修复缺陷和敏捷上线小的特性；开发自测验证，稳定性欠佳
- [预发布版 RC Build](https://developers.weixin.qq.com/miniprogram/dev/devtools/rc.html): 预发布版本，包含大的特性；通过内部测试，稳定性尚可
- [稳定版 Stable Build](https://developers.weixin.qq.com/miniprogram/dev/devtools/stable.html)

大家可以根据需要，下载对应的版本开发~

# 小程序教程

## 社区精选文章
- [小程序自定义组件知多少](https://developers.weixin.qq.com/community/develop/article/doc/0004e0543b8878a53b589986451413)
- [小程序多端框架全面测评](https://developers.weixin.qq.com/community/develop/article/doc/000eaadb944de06374485c3ed51813)
- [一种小成本的线下定位方案 ---2019腾讯数字文创节小程序开发有感](https://developers.weixin.qq.com/community/develop/article/doc/000caad3c4cbc03a5648e01e951013)
- [Comi - 小程序 markdown 渲染和代码高亮解决方案](https://developers.weixin.qq.com/community/develop/article/doc/000aa4e19a0d50bf0f6893b9f56c13)

更多可以查看[文章分享](https://developers.weixin.qq.com/community/develop/article)。

## 最新踩坑 && Tips
1. 如果小程序里已经授权过，例如地理位置信息，取消授权的方法：右上角...  -> 关于xxx -> 设置。

2. 【小程序体验评分】遇到性能体验的问题，可以在小程序开发工具里找到协助定位性能的能力。
体验评分是一项给小程序的体验好坏打分的功能，它会在小程序运行过程中实时检查，分析出一些可能导致体验不好的地方，并且定位出哪里有问题，以及给出一些优化建议。

3. 小程序里嵌套 web-view，小程序往 web-view 里传数据方法：
  1. 把参数拼装在 url 中传进去，可通过 hash。
  2. 通过 postMessage 传递，只会在特定时机（小程序后退、组件销毁、分享）触发并收到消息， 参考：https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html。
  3. 通过后台拉取。

4. setData单次设置的数据超过1024kB，工具上测试正常，手机上会报错。Taro 在 setData 的时候会带上一些不需要的数据。

5. 小程序的 setStorage 缓存，会在客户端保存尽量久的时间，以下两种情况（会从最不常用的小程序删起）：
  1. 客户端空间不够。
  2. 小程序总体容量超过客户端容量5%。

## 结束语
这种没人关注依然狗狗祟祟坚持做的事情，大概是我最喜欢和最擅长的了。^_^