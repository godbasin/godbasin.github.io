---
title: 小程序开发月刊第14期（20200314）
date: 2020-03-14 20:46:50
categories: 小程序双皮奶
tags: 教程
---
这个月大家都开始陆陆续续回去上班了，远程办公的环境也有了一大突破，线上会议的各种延迟和回音有时候依然让人尴尬。不过情况已经慢慢好转，希望各位的日子也会越来越好。
<!--more-->

# 小程序 latest
## 小程序能力
### 安卓微信7.0.12
本次小程序更新概要如下:
- 小程序启动耗时优化，请关注小程序启动是否受影响；
- 菜单增加“重新进入小程序”入口，请关注重启后是否正常；
- 解决 connectWifi android 10下失败的问题；
- 文件接口 readFile 改动，请关注功能是否正常。

## 小程序·云开发
### 小程序·云开发支持数据库回档
从开发者工具1.02.202002282版本开始，云开发提供了数据库回档功能。系统会自动开启数据库备份，并于每日凌晨自动进行一次数据备份，最长保存 7 天的备份数据。如有需要，开发者可在云控制台上通过新建回档任务将集合回档（还原）至指定时间点。
回档期间，数据库的数据访问不受影响。回档完成后，开发者可在集合列表中看到原有数据库集合和回档后的集合。
- 详细功能介绍请参考文档[《数据库回档》](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database/backup.html)

### 小程序·云开发支持按量付费
为助力开发者以更低的资源成本实现小程序的功能迭代，从开发者工具1.02.2003022版本开始，小程序·云开发新增按量付费功能。在按量付费模式下，系统每月会提供一定的免费额度供开发者使用，超过免费额度的资源消耗将按照对应的刊例价扣除费用。
- 具体按量付费计费策略请参考文档[《小程序·云开发按量付费》](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/billing/postpayment.html)  

按量付费功能适用于：
- 对于无法准确预估资源使用量的小程序，按量付费功能在保证了正常资源使用的同时，也避免了当用户访问量突增时，由于资源储备不足所导致的超限停服等问题；  
- 对于仅使用部分云开发资源类型的小程序，按量付费功能按消耗收费的模式将极大地降低资源成本。  

开发者可通过登录微信开发者工具的云开发控制台，在环境设置中直接开通按量付费功能。

## 开发者工具

### 代码编译和上传 CI 模块
[miniprogram-ci](https://www.npmjs.com/package/miniprogram-ci) 是从微信开发者工具中抽离的关于小程序/小游戏项目代码的编译模块。该npm 模块，封装了以下逻辑：
- 对源代码进行校验
- 对源代码进行预编译
- 使用证书生成签名
- 上传

使用前需要使用小程序管理员身份访问"微信公众平台-开发-开发设置"后下载代码上传密钥，并配置 IP 白名单（可选，需要注意风险），才能进行上传、预览操作。
- [参考文档地址](https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html)

### 微信开发者工具提供 API Mock 能力
为了方便开发者进行功能开发和调试，从 1.02.202003062 版本开始，微信开发者工具提供 API Mock 功能，可模拟如wx.request 、wx.downloadFile 以及 wx.getBackgroundFetchData 等API 的调用结果，极大地降低了小程序的开发成本。
- 详细功能介绍请参考文档[《API Mock》](https://developers.weixin.qq.com/miniprogram/dev/devtools/api-mock.html)

API Mock 功能可覆盖的应用场景包括但不限于：
- 模拟特定用户场景数据，如通过配置 wx.getLocation 的返回数据，从而模拟位置信息；
- 模拟各类异常情况，如通过配置wx.request的回调为 fail，从而模拟网络异常；
- 模拟部分微信开发者工具中暂不支持调试的 API，如发票相关的 wx.chooseInvoic等接口。
- 开发者可通过登录微信开发者工具，在调试器的 Mock 面板中使用该功能。

### 更多更新说明
参考[微信开发者工具 1.02.2003121 RC 更新说明](https://developers.weixin.qq.com/community/develop/doc/0004064f12424003b90a1758f56c01)，这期新增能力包括：
1. 支持 API Mock。
2. 编辑器支持重命名多个文件。
3. 支持显示灰度中的基础库、下发测试基础库（该功能只能推送到登录到开发者工具的微信号的手机上，会影响到手机上所有的小程序）。  
  - 新增显示灰度中的基础库以及基础库支持的客户端版本。  
  - 同时新增推送按钮，将选定版本的基础库下发到客户端上，推送结果可以在开发版小程序的调试面板中查看。  
  - 微信客户端对开发版的小程序打开调试，可以看到测试版基础库的生效时间。  
4. 模拟器支持终止。
  - 模拟器是工具的主要功能之一，如果小程序/小游戏的业务代码中出现死循环、复杂运算、频繁调用某些 API 的情况下都会导致工具出现卡顿或者 CPU 占用比较高的情况。模拟器新增终止按钮，点击后可以暂时终止模拟器运行，节省系统资源占用。
5. 打开项目时展示 Loading 状态。
工具增加开启加载 loading 弹窗，显示加载状态情况。 
6. CLI/HTTP V2 更新。
  - CLI & HTTP 接口升级 v2 版本，在 v2 版本中，旧版命令仍然可以使用，但已废弃并会在未来移除，请使用 v2 命令。v2 版本增加了云开发管理操作支持、优化命令形式、增加细致状态提示、支持长时间命令执行、支持国际化（中英文选择）等。详细文档。
7. 优化云控制台用户访问统计和监控图表的数据展示。
支持按照近 7 天、近 30 天以及自定义时间段来筛选 DAU。
8. 数据库备份回档。

更多的内容可以查看：
- [稳定版 Stable Build 更新日志](https://developers.weixin.qq.com/miniprogram/dev/devtools/stable.html)
- [开发版 Nightly Build 更新日志](https://developers.weixin.qq.com/miniprogram/dev/devtools/nightly.html)

# 小程序教程

## 社区精选文章
- [[填坑手册]小程序新版订阅消息+云开发实战与跳坑](https://developers.weixin.qq.com/community/develop/article/doc/000240bb188098d767f9b299956013)
- [业务数据怎么查，我用云开发高级日志服务](https://developers.weixin.qq.com/community/develop/article/doc/0006245c108bf0cd56e9da13651813)
- [只有三行代码的神奇云函数的功能之一：获取openid](https://developers.weixin.qq.com/community/develop/article/doc/00080c6e3746d8a940f9b43e55fc13)
- [借助云开发实现小程序订阅消息和模板消息的推送功能](https://developers.weixin.qq.com/community/develop/article/doc/000c6c23708fe0ad46e9dcd215b013)

往期内容可以查看[文章分享](https://developers.weixin.qq.com/community/develop/article)

## 最新踩坑 && Tips
### 【同步踩坑信息】- 云函数
1、小程序冷启动可能导致无状态云函数变成有状态
2、避免使用`setTimeout`等异步调用，而应使用明确状态管理的`await`或`Promise`
3、避免使用`cloud.getWXContext()`，而使用`cloud.getWXContext(context)`代替
4、用到`Date`对象的函数应当设置时区环境变量，TZ=Asia/Shanghai

## 结束语
如果你也使用Typescript的话，不妨看看我用各种踩坑经验整理的这个[小程序 typescript 最佳实践 demo](https://github.com/godbasin/wxapp-typescript-demo)。