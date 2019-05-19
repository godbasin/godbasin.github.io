---
title: 小程序开发月刊第五期（20190515）
date: 2019-05-15 23:52:31
categories: 小程序双皮奶
tags: 教程
---
听说小程序开发月刊还是挺实用的~~
<!--more-->

# 小程序 latest
## 小程序能力
### 「2.7.0版本基础库」新增功能
1. 相机组件新增逐帧数据接口，该接口可让开发者对相机摄像头捕捉到的图像进行实时地识别和处理，实现如实时美妆、文字识别等功能，详见[《camera组件》](https://developers.weixin.qq.com/miniprogram/dev/component/camera.html)。  
2. 新增富文本编辑器组件，用户可以方便地对图文进行编辑，实现更丰富的图文展示效果，可扫描以下小程序码体验，接入指引详见[《富文本编辑器组件》](https://developers.weixin.qq.com/miniprogram/dev/component/editor.html)。  
3. TabBar新增支持配置网络图片，方便开发者在不同节日、活动等场景下，更灵活地配置底部导航栏内的相应图标，详见[《TabBar》](https://developers.weixin.qq.com/miniprogram/dev/api/wx.setTabBarItem.html)。
4. 为了帮助开发者解决“刘海屏”的适配问题，新增查询手机安全区域功能，在安全区域中的内容可保证不被遮挡，详见[《getSystemInfo》](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getSystemInfo.html)。  
5. 为了提升用户对图片的操作效率以及快速“识别图中的小程序码”，在用户未进入图片预览模式时，也可以通过长按图片唤起图片的操作菜单，详见[《image组件》](https://developers.weixin.qq.com/miniprogram/dev/component/image.html)。
6. canvas画布组件支持WebGL，提升了图形渲染效率，可更流畅地展示3D场景和模型。

更多2.7.0版本基础库的新能力及详情，可查看[《更新日志》](https://developers.weixin.qq.com/miniprogram/dev/framework/release.html)。
  
### 「微信开放社区」新增关注功能
微信开放社区新增「关注用户」功能，社区用户可以对自己关心的用户进行关注，成为这个用户的关注者，更方便看到该用户的动态。
> 例如关注下被删什么的

### wx.getWifiList接口需获取用户位置信息授权
2019年5月17日起新提交发布的版本若未获取用户位置权限，则在android平台上将无法正常调用wx.getWifiList接口。该调整策略在微信android客户端 7.0.4 版本生效。
更多详情请查看[wx.getWifiList接口需获取用户位置信息授权后使用](https://developers.weixin.qq.com/community/develop/doc/0002ec7dc6cd5894957808bd854c01)。

### 「小程序管理后台」新增 Source Map 文件下载功能
小程序管理后台-【运维中心】-【错误查询】新增线上版本 Source Map 文件下载功能，开发者可通过 Source Map 文件定位错误信息对应的源代码位置。

### 更新日志
- [社区问题反馈以及功能优化更新（05.06-05.10）](https://developers.weixin.qq.com/community/develop/doc/0002c407d0c0d023d8889391651001)
- [社区问题反馈以及功能优化更新（04.22-04.26）](https://developers.weixin.qq.com/community/develop/doc/00000a9a2040505a5b887ef7156c01)
- [社区问题反馈以及功能优化更新（04.15-04.19）](https://developers.weixin.qq.com/community/develop/doc/00008813390720866b784e0fd5ac01)

## 开发者工具
### 微信开发者工具支持ES6+转ES5
新版工具增加了增强编译的选项来增强ES6转ES5的能力，启用后会使用新的编译逻辑以及提供额外的选项供开发者使用。
- 使用preset-env,支持最新的ECMAScript语法
- 共享helpers函数，默认放在项目@babel/runtime目录，可通过项目配置文件配置
- 支持`async/await`语法，按需注入regeneratorRuntime，目录位置与helpers函数一致
- 关于polyfill，基础库中已经引入了大量的es6相关的polyfill可参考文档，增强编译下，新增：`Array.prototype.includes`(es7)、`Object.entries`(es8)、`Object.values`(es8)

更多详细能力请参考[微信开发者工具 1.02.1905081 更新说明](https://developers.weixin.qq.com/community/develop/doc/00066877c54eb0ff5488b54885b801)。

这里补充两个容易踩的坑：
1. 旧版开发者工具只支持ES6转ES5，这里的ES6并不包括ES7/ES8，所以`Object.entries`(es8)、`Object.values`(es8)、`async/await`这些不支持，需要自己编译。
2. 微信开发者工具 1.02.1905081 已知bug:
  - 体验评分会卡死
  - 带分包功能的小程序，预览后分包页面出现白屏
3. 项目使用babel编译，在编译async/await时会生成Promise，同时Promise里捕捉到的异常都没有处理。会导致js语法错误不能被MP平台监控，从而没法正常告警（也无法在App.onError里捕捉到）。使用开发者工具编译可能也会存在同样的问题，建议自行hack Promise，加上catch把异常抛出或添加到App.onError里。

### 「小程序·云开发」新增了HTTP API支持
云调用新增了HTTP API支持，目前提供了云函数触发、数据库导入导出、文件下载上传删除、获取腾讯云API调用凭证等能力。欢迎大家体验及反馈。
- [文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/index.html)
- [腾讯云可用API](https://cloud.tencent.com/document/api/876/34809)

### 「小程序·云开发」新增 消息推送 支持
云调用近期将新增 消息推送 支持，现已支持客服消息推送，物流等功能的消息推送后续将陆续推出，现在已经可以在内测版开发者工具中体验客服消息推送了（在云函数中接收客服消息和回复），可新建云开发快速启动模板然后查看里面的云调用客服消息示例，欢迎大家来体验~
文档：
- [消息推送文档](https://developers.weixin.qq.com/miniprogram/dev/framework/server-ability/message-push.html)
- [客服消息事件](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/customer-message/receive.html)
- [云调用](https://developers.weixin.qq.com/miniprogram/dev/api-backend/customerServiceMessage.send.html?t=19051721#method-cloud)

### 「小程序·云开发」新增免 SessionKey 获取开放数据
云调用近期将新增支持免 SessionKey 获取开放数据，现已经可以在内测版开发者工具上体验了（开放数据包括用户信息，分享信息，微信运动等），待基础库 2.7.0 发布完成即可在手机上使用，在内测版工具上可以选择 9.9.9 版本基础库使用，欢迎大家来体验和吐槽~
- [开放数据获取方式文档](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html)
- [示例 getUserInfo 文档](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getUserInfo.html)
- 支持的 API 和组件有：wx.getUserInfo，wx.getShareInfo, wx.getWeRunData 以及 button 组件的 getUserInfo

### 其他
**Typescript能力：**
最新的小程序官方Typing库更新了！新增Component/云函数等支持！
- Git地址: https://github.com/wechat-miniprogram/api-typings

# 小程序教程

## 社区精选文章
- [永远对微信小程序保持尊重——小程序心得体会和开发经验](https://developers.weixin.qq.com/community/develop/article/doc/00022e1ce2cd38f14e88cdee15bc13)
- [腾讯课堂小程序详情页开发总结](https://developers.weixin.qq.com/community/develop/article/doc/00080a33d6c4284bb57886c8e56c13)
- [有赞前端质量保障体系](https://developers.weixin.qq.com/community/develop/article/doc/000e462d9f0348423778380095b413)
- [小打卡|如何组件化拆分一个200+页面的小程序](https://developers.weixin.qq.com/community/develop/article/doc/000aa441bdc990492478911e85c013)

更多可以查看[文章分享](https://developers.weixin.qq.com/community/develop/article)。

## 最新踩坑 && Tips
1. wx.getLocation无响应（既不会success，也不会fail，可能导致小程序不可用），在安卓上会偶现，和机型无关。
目前建议的解决方法是手动加个超时。

2. 小程序授权获取实名信息文档:https://developers.weixin.qq.com/community/business/doc/000804439ac77080c8672c77451c0d。
同时文中 设置-接口能力 路径改为 开发-接口能力。

3. `<picker>`组件，IOS不支持YYYY-MM-DD的日期格式，而picker默认返回的格式是YYYY-MM-DD，有日期转时间戳的场景的话，需要正则替换一下。
PS: H5里也存在同样的问题。

4. 小程序做自适应客户端字体大小，目前需要通过[wx.getSystemInfo](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getSystemInfo.html)接口获取fontSizeSetting字段，来调整样式。
  - fontSizeSetting: 用户字体大小（单位px）。以微信客户端「我-设置-通用-字体大小」中的设置为准 

5. 发布新的小程序后，终端用户手机里面还有老的小程序的缓存，可使用[UpdateManager](https://developers.weixin.qq.com/miniprogram/dev/api/UpdateManager.html)强制用户升级到最新版本。

6. 小程序基础库版本兼容问题，可设置最低基础库版本：登录小程序管理后台，进入“设置->基本设置->基础库最低版本设置”进行配置。
  - 在配置前，开发者可查看近30天内访问小程序的用户的基础库版本占比，以帮助开发者了解当前用户使用的情况。
  - 上述设置需要在iOS 6.5.8或安卓 6.5.7及以上微信客户端版本生效。太低版本不支持最低基础库版本设置。



## 结束语
在这个世界上，没有人能在所有事情上都与你看法一致，所以既然有人在与你在最重要的方面价值观相同，也与你有实践价值观的相同做法，那就要确保与这些人为伍。 --《原则》