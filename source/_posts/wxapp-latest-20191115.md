---
title: 小程序开发月刊第11期（20191115）
date: 2019-11-15 23:00:15
categories: 小程序双皮奶
tags: 教程
---
这个月的新内容还不错噢~~~你值得拥有~~
<!--more-->

# 小程序 latest
## 小程序能力
### 小程序·服务商订阅消息设置接口上线
为便于服务商代小程序更快设置订阅消息，提高开发效率，降低沟通成本。 现在向服务商提供订阅消息设置接口，具体详见：[《订阅消息设置》](https://developers.weixin.qq.com/community/develop/doc/000c8a142ac080094779976b550801)

### 同层渲染进度同步
为了解决小程序原生组件存在的一些[使用限制](https://developers.weixin.qq.com/miniprogram/dev/component/native-component.html)，我们对原生组件引入了同层渲染。支持同层渲染的原生组件层级与非原生组件一致，可直接使用非原生组件（如 view、image）结合 z-index 对原生组件进行覆盖，而无需使用 cover-view 或 cover-image。此外，同层渲染的原生组件也可被放置在 scroll-view、swiper 或 movable-view 容器中。目前，以下组件已支持同层渲染：

| 支持同层渲染的原生组件 | 最低版本 |
| - | - |
| video | v2.4.0 |
| map | v2.7.0 |
| canvas 2d（新接口） | v2.9.0 |
| live-player | v2.9.1 |
| live-pusher | v2.9.1 |

其他原生组件（textarea、camera、webgl 及 input）也会在近期逐步支持同层渲染。

### 小程序实时日志功能更新
1. 为满足第三方服务商和开发者分析日志的需求，小程序新增实时日志查询接口，开发者可通过实时日志查询接口查询小程序打印的实时日志。详情可查看[《实时日志查询接口》](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/operation/operation.realtimelogSearch.html)和[《实时日志开发文档》](https://developers.weixin.qq.com/miniprogram/dev/extended/log/)。
2. 每个小程序账号每天可打印的日志条数提升至500万条，日志保存天数提升至7天。

### OCR 能力更新
OCR 能力方面，有两处更新点。其一，是身份证 OCR 新增性别和民族字段的支持。其二，是身份证和银行卡 OCR去除了 type（拍照、扫描模式）字段，简化统一调用。新调用这两个接口不再需要 type 字段，而之前使用 type 字段的调用仍然继续兼容。详细介绍请参考[OCR接口文档](https://developers.weixin.qq.com/doc/offiaccount/Intelligent_Interface/OCR.html)。

### 更新日志
- [社区问题反馈以及功能优化更新（11.04-11.08）](https://developers.weixin.qq.com/community/develop/doc/000c8a142ac080094779976b550801)  
- [社区问题反馈以及功能优化更新（10.21-10.25）](https://developers.weixin.qq.com/community/develop/doc/000c4e5f4fc080923569a391356c01)  
- [社区问题反馈以及功能优化更新（10.14-10.18）](https://developers.weixin.qq.com/community/develop/doc/0004c4e9dc408058b659da9bf56801)  
- [社区问题反馈以及功能优化更新（10.07-10.11）](https://developers.weixin.qq.com/community/develop/doc/000608bc8d46d0d7125941cb157801)  

## 小程序·云开发
> 云开发峰会: 本次小程序云开发峰会的干货 PPT 已经发布在 [KM](http://km.oa.com/articles/show/429844?ts=1571884911) 中，大家可以去查看。

### 小程序·云开发新增高级日志服务
为方便开发者通过日志快速的发现和定位问题，小程序·云开发提供了高级日志服务。通过高级日志服务，开发者可以更加灵活地采集和检索日志，每条日志可最长存储30天。
- 详细介绍请参考: [高级日志](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/functions/logservice.html)

### 云开发代金券
为了惠及到更多的小程序开发者，云开发增加了代金券申请功能。达到一定 uv 的小程序可以申请专业版（104 元/月）或旗舰版（860 元/月）的代金券，申请成功后每月发放一张，持续12个月。获取的代金券可用于抵扣相应套餐的购买金额。
- 功能介绍：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/billing/voucher.html
- 最新开发者工具：https://developers.weixin.qq.com/miniprogram/dev/devtools/nightly.html

### 云函数优化
10月11日 - 12日上线了1个优化点：对执行时间小于200ms的云函数请求进行同步化，链路耗时下降了75ms左右

## 开发者工具
### 微信开发者工具新增文档搜索功能
微信开发者工具新增文档搜索功能，方便开发者在开发过程中查询相关开发文档。开发者可通过下载最新 Nightly 版本工具体验功能。
- 详细介绍请参考: [文档搜索](https://developers.weixin.qq.com/miniprogram/dev/devtools/search.html)

### 更多更新说明
参考[微信开发者工具稳定版 1.02.1910120 更新说明](https://developers.weixin.qq.com/community/develop/doc/000aaef24f4ee0b36e59755895b801)，这期新增能力包括：
1. 本地编译时进行合并编译。  
- 本地编译时使用合并编译可以加快小程序加载的速度，通过【项目详情 - 本地设置 - 本地编译时进行合并编译】可以打开此功能
2. 真机调试支持直接触发更新周期性缓存数据。  
- 开发者工具【设置 - 通用设置 - 启用 PC 端自动预览】，可以将开发版小程序通过自动预览推送到同登录态的 PC 微信上
3. 自动真机调试。  
- 增加自动真机调试功能，减少真机调试扫码的交互
4. 使用测试号进行多帐号调试。
- 在【菜单 - 工具 - 多帐号调试】，可以打开多帐号调试帐号管理面板
- 本次为所有 appid 添加了 4 个测试帐号，可以使用测试号进行多帐号调试
5. 支持多线程 worker 的单步调试。
- 本次更新优化了多线程 worker 的编译和代码加载的方式，从而支持了单步调试
6. 公众号网页调试增加 url 收藏功能。
7. 云开发套餐支持代金券支付。  
等等。

# 小程序教程
## 社区精选文章
- [小程序多平台同构方案分析-kbone 与 remax](https://developers.weixin.qq.com/community/develop/article/doc/000200eb844228d72f79291a651c13)
- [做了一个颜色选择器](https://developers.weixin.qq.com/community/develop/article/doc/000c2279bf8f60f31d79854c85bc13)
- [基于Kbone使用React同构小程序开发实践总结](https://developers.weixin.qq.com/community/develop/article/doc/0004a20a114a28608669881bc5c013)
- [使用 MobX 来管理小程序的跨页面数据](https://developers.weixin.qq.com/community/develop/article/doc/0004686e3c8980b53469f176e51413)
- [kbone，十分钟让 Vue 项目同时支持小程序](https://developers.weixin.qq.com/community/develop/article/doc/000e48820100100f2269be0975b813)
- [小程序顶部自定义导航组件实现原理及坑分享](https://developers.weixin.qq.com/community/develop/article/doc/00048e5ed784b037b959757385b413)
往期内容可以查看[文章分享](https://developers.weixin.qq.com/community/develop/article)。

## 最新踩坑 && Tips
### 【同步踩坑信息】- 安卓7.0.8内测版本白屏问题
该版本下做了内存优化，在页面不可见时回收渲染资源（也就是会白屏）。如果使用navigateBack了多层页面，这个路径下没有正确恢复第一个页面的渲染，会导致白屏。
目前小程序团队已修复该问题，后续遇到相似的问题可以往该方向考虑定位下。

### 【同步踩坑信息】- 安卓wx.getStorage
7.0.6开始，部分安卓手机，wx.getStorage会有意料外的回调发生。在获取缓存失败的情况下，可能不会回调fail，而是回调了success，且 res.data 是 undefined。

### 【同步踩坑信息】- 小程序换行会导致多余空格
一般使用编辑器开发，格式化会导致一些换行，在小程序里会导致多余空格，如图：
![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-latest-20191015.png)

### 【同步收集信息】- 首页逻辑
微信7.0.7版本起，当用户打开的小程序最底层页面是非首页时，默认展示“返回首页”按钮。
开发者可在页面 onShow 中调用 hideHomeButton 进行隐藏。
- 参考地址: https://developers.weixin.qq.com/miniprogram/dev/api/ui/navigation-bar/wx.hideHomeButton.html

## 结束语
最近好像没什么好文好句，推荐几本好书吧~
- 《数学之美》
- 《算法图解》
- 《清醒思考的艺术》
