---
title: 小程序开发月刊第13期（20200214）
date: 2020-02-14 19:58:30
categories: 小程序双皮奶
tags: 教程
---
2020年真的是一个doge年，由于春节的原因，一月份没有更新月刊，本篇为2020年开篇月刊。今年的开篇显然有些不友好，祝各位披荆斩棘，越来越好。
<!--more-->

# 小程序 latest
## 小程序能力
### 小程序模板消息开发能力调整说明
原计划2020年1月10日下线小程序模板消息能力，由于部分开发者反馈尚未完全将模板消息切换为订阅消息，为降低业务影响，现做如下调整：
1. 下调模板消息接口日调用额度，2020年1月10日起（含1月10日），未开通支付能力的帐号调至5万/日，已开通支付能力的帐号调至50万/日。
2. 2020年1月10日24:00以后，新发布的小程序，只能使用订阅消息，在该时间点之前发布的小程序仍然可以使用模板消息。（回退的版本，按当前发布时间算）
3. 2020年4月10日24:00以后，所有版本的小程序都不能使用模板消息，请还未切换使用订阅消息的开发者，在此时间点前完成切换。

- [小程序模板消息能力调整通知](https://developers.weixin.qq.com/community/develop/doc/00008a8a7d8310b6bf4975b635a401?blockType=1)

### 小程序搜索优化指南(SEO)
2019年上半年微信发布了基于小程序页面的搜索，为了让我们更好地发现及理解小程序的页面，结合过去一段时间来我们遇到的各种情况，建议各位开发者阅读[《小程序搜索优化指南》](https://developers.weixin.qq.com/community/develop/doc/000a0a1191c3a817e7a9c6f1e51409)并结合实际情况进行优化。

另外，[微信开放社区成长中心，现正公测](https://developers.weixin.qq.com/community/develop/doc/00084a1eccc7486a18a91f5815b809)。

### 商品数据接入（内测）
商品数据目前应用于微信扫一扫识物、小程序商品搜索和扫条码三个功能。这些功能可以很好的满足微信用户对商品的信息获取诉求，同时也能为商家小程序带来曝光流量和建立用户品牌认知的机会。
- 商品数据接入方式请阅读[《商品数据接入文档（内测）》](https://developers.weixin.qq.com/miniprogram/dev/framework/product)

### 服务平台新增AI、安全、地图等多项能力
服务平台新增AI人脸检测、信息安全检查、地理位置、音乐资源等多项接口能力，帮助小程序开发者降低开发门槛、快速接入服务。
- [可点击前往了解能力详情](https://developers.weixin.qq.com/community/servicemarket?type=1&channel=4&kw=&serviceType=4)

### “小程序助手”性能分析功能升级
为了帮助小程序开发者分析性能数据并优化小程序体验，“小程序助手”升级了性能分析功能，新增启动性能、运行性能和网络性能等方面的数据，支持开发者监控小程序的基本性能指标。

### 微信 Mac 版小程序开发者公测
微信 Mac 版新版本中，支持打开聊天中分享的小程序，开发者可下载安装微信 Mac 版公测版本进行体验和适配。最新版微信开发者工具新增支持在微信 Mac 版中预览小程序和进行真机调试。
- 详情请查看[《Mac小程序开发说明》](https://developers.weixin.qq.com/community/develop/doc/0008ce7eeb870022c4b917e6d5b009)。
- 微信 Mac 版公测版：[点击下载](https://dldir1.qq.com/weixin/mac/WeChatMac_Beta.dmg)

## 小程序·云开发

### 小程序·云开发支持数据库事务
为了方便开发者可以更加灵活地使用数据库能力，满足跨多个记录或跨多集合的原子操作的使用诉求，小程序·云开发新增数据库事务能力。数据库的事务能力保证了在对一个或多个集合进行的一组读写操作中，要么所有的操作都执行成功，要不都不执行，极大地方便了小程序的功能开发。
事务过程采用的是快照隔离，在快照隔离中会保证：
1. 事务期间，读操作返回的是对象的快照，而非实际数据。
2. 事务期间，写操作会改变快照，保证接下来的读的一致性。同时会给对象加上事务锁。
3. 事务锁：如果对象上存在事务锁，那么其它事务的写入会直接失败。同时，普通的更新操作会被阻塞，直到事务锁释放或者超时。
4. 事务提交后，操作完毕的快照会被原子性地写入数据库中。
- 目前数据库事务仅支持云函数端使用，同时 wx-server-sdk 最低版本要求 1.7.0
- 详细功能介绍请参考文档[《数据库事务》](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database/transaction.html)

### 周期性更新/数据预拉取支持从云开发环境中获取数据
周期性更新能够在用户未打开小程序的情况下，也能从服务器提前拉取数据，当用户打开小程序时可以更快地渲染页面，减少用户等待时间，增强在弱网条件下的可用性。
目前，系统已支持从云开发环境中获取数据，并将数据下载到本地。开发者可登录小程序 MP 管理后台，进入设置->开发设置->数据周期性更新中进行配置。同时，小程序·云开发还支持数据预拉取功能。
- 参考文档：[《周期性更新》](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/background-fetch.html)
- 参考文档：[《数据预拉取》](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/pre-fetch.html)。

### 共克时艰，疫情期间，云开发旗舰版免费使用
小程序·云开发自2020年2月1日至2020年5月1日，为企业、政府、媒体及其他组织小程序用户提供10000个旗舰版套餐免费使用名额，全力助力企业、政府、媒体及其他组织在防控疫情之下， 确保远程协作和研发效率，共渡难关。
- [查看帖子详情](https://developers.weixin.qq.com/community/develop/doc/000424e339ca485a74d92bd415c801)

## 开发者工具
### 更多更新说明
参考[微信开发者工具 1.02.1912261 RC 更新说明](https://developers.weixin.qq.com/community/develop/doc/0000240a950c88b392a908d9e51c01)，这期新增能力包括：
1. 编辑器优化。
2. WXML 支持显示自定义组件数据及实时修改。
3. PC 微信调试，支持桌面版微信远程调试。
4. 清除订阅消息授权数据。
5. 云控制台支持自定义告警。
- 云开发新增自定义告警能力。开发者可以通过告警指标、统计周期、比较条件、持续周期和告警频率等参数的自由组合灵活地配置所需的告警规则
6. 云控制台高级操作支持数据聚合。
7. 支持选择安卓设备上的 profile 文件进行分析。
8. `<web-view />`组件的调试入口变更。
9. 修复项目列表丢失问题及新增项目列表恢复指令。
10. 云控制台支持自定义数据库读写权限。

更多的内容可以查看：
- [稳定版 Stable Build 更新日志](https://developers.weixin.qq.com/miniprogram/dev/devtools/stable.html)
- [开发版 Nightly Build 更新日志](https://developers.weixin.qq.com/miniprogram/dev/devtools/nightly.html)

# 小程序教程
## 社区精选文章
- [业务数据怎么查，我用云开发高级日志服务](https://developers.weixin.qq.com/community/develop/article/doc/0006245c108bf0cd56e9da13651813)
- [[kbone-ui]打通 H5/微信小程序 多端UI库](https://developers.weixin.qq.com/community/develop/article/doc/00022217bacab04c8dc9eeaa35c813)
- [商品数据接入（内测）](https://developers.weixin.qq.com/community/develop/article/doc/000224575548480cf5b94254456813)
- [小程序搜索优化指南](https://developers.weixin.qq.com/community/develop/article/doc/000a82b671c2f8eae1a91637d56c13)

往期内容可以查看[文章分享](https://developers.weixin.qq.com/community/develop/article)

## 最新踩坑 && Tips
### 【同步踩坑信息】- 插件开发
插件开发的时候，plugin.json 中一定要指定有效的 main，即使不需要对外提供js接口，也要放一个空的文件，不然开发工具虽然没问题，但是手机会报错。

### 同步踩坑信息】- wx.getLaunchOptionsSync使用
`wx.getLaunchOptionsSync`用来获取小程序启动时的参数，与`App.onLaunch`的回调参数一致。
- 问题：该API只会在小程序初始化的时候记录一次，如果是已经打开小程序，再次打开不能获取最新的启动参数。
- 解决方案：可以使用`wx.onAppShow`绑定监听，来获取最新参数，`wx.onAppShow`监听小程序切前台事件，该事件与`App.onShow`的回调参数一致。

### 【小程序踩坑记录】- page.onUnload
在`page.onUnload`中销毁页面元素，可能导致js错误。
原因：unload 由客户端线程调度，界面事件由 webview 线程调度，unload 可能执行比较早，也就是说可能出现 onLoad -> onUnload -> onClickXX（用户操作）-> onVisibleXXX（元素进入可视区域）的情况，所以如果在onUnload回调清空某个对象，那么就会出现对象为空的错误。

## 结束语
最近没看什么书，自己倒是写了一本[《深入理解 Vue.js 实战》](https://github.com/godbasin/vue-ebook)开源了，欢迎阅读。
