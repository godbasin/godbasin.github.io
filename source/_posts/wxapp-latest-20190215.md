---
title: 小程序开发月刊第二期（20190215）
date: 2019-02-15 23:21:30
categories: 小程序双皮奶
tags: 教程
---
听说年后会有更多的能力进入开发状态噢，尤其是云开发的能力，大家期待不~
<!--more-->

# 小程序 latest
## 小程序能力
### 「微信开发者·代码管理」功能上线
之前在[超实用小程序官方能力](https://godbasin.github.io/2019/01/10/wxapp-official-functions/)中提到过 TGit 代码托管，现在 TGit 能力已升级为[微信开发者·代码管理](https://developers.weixin.qq.com/miniprogram/dev/devtools/wechatvcs.html)。

### video 组件同层渲染
小程序 video 组件的同层渲染目前已经全量了，基础库 2.4.0 以上都支持。

**啥是同层渲染？下面是辅助理解：**
- [小程序系列4--解剖小程序的 setData](https://godbasin.github.io/2018/10/05/wxapp-set-data/)
- [原生组件相关说明](https://developers.weixin.qq.com/miniprogram/dev/component/native-component.html)
- [小程序 video 组件同层渲染公测](https://developers.weixin.qq.com/community/develop/doc/000aa28d030f60a3c4183eecb5d801)

总之，同层渲染是利用黑科技让原生组件的层级和非原生组件一样可控，这样我们开发中最蛋疼的原生组件的样式调试就舒服很多了，拜拜`<cover-view>`，拜拜`<cover-image>`

> 其他的原生组件后续都计划支持同层渲染的，敬请期待。

### 小程序数据需求征集
目前小程序已经开放了小程序访问、分享、添加等基础数据，以及用户画像和交易分析等数据。
如果大家在使用小程序后台统计模块和小程序数据助手时，有一些不满足的数据需求，或者不好的体验？如果大家对数据工具有更好的想法和建议，欢迎大家留言给小程序团队。

> 例如，你可以说我想要更详细的加载性能的数据，想要用户行为上报的能力，等等。

### 更新日志
- [周社区问题反馈以及功能优化更新（02.04-02.08）](https://developers.weixin.qq.com/community/develop/doc/000ae8f2264c6855e718440a95b801)
- [周社区问题反馈以及功能优化更新（01.21-01.25）](https://developers.weixin.qq.com/community/develop/doc/000c8a1f334310a3ab08a7ab950801)
- [周社区问题反馈以及功能优化更新（01.14-01.18）](https://developers.weixin.qq.com/community/develop/doc/0006a6e1b50c20cb18081c56d5bc01)

## 开发者工具
### 更新日志
- 修复界面调试样式信息显示不全的问题
- 修复 app.json usingComponent 没有扩散的问题
- 修复 长路径的项目无法正常打开的问题
- 更多请查看[工具日志](https://developers.weixin.qq.com/miniprogram/dev/devtools/uplog.html)

> 听说云函数的本地调试能力在开发ing了，还有很多能力都会在后面支持到，期待~

# 小程序教程

## 最新踩坑 Tips
1. 小程序有办法类似于通过条件判断然后调用 e.preventDefault 和 stopPropagation 的方法吗？
暂时不支持，只能通过 wxml 里面用 catch-tap 阻断，但是这个是一定阻断的，不能写条件。

> 暂时没有更多了，之前用来记录的临时文件忘记保存，重启了电脑丢掉了233333

# tools
## 框架
> Tips 仅供参考: 小程序开发本身就比较方便，个人感觉最好的方式建议直接使用原生开发噢

### taro
- Github: [https://github.com/NervJS/taro](https://github.com/NervJS/taro)
> 多端统一开发框架，支持用 React 的开发方式编写一次代码，生成能运行在微信/百度/支付宝/字节跳动小程序、H5、React Native 等的应用。

## 工具
### crypto-js
JS 加解码库，小程序适用。
- Github: [https://github.com/brix/crypto-js](https://github.com/brix/crypto-js)

## 结束语
本来计划写双周刊的，最后改成了月刊，因为小程序和开发者工具的更新相对而言会慢一些，不像前端每天都有新框架和新工具库。当然，你也可以手动关注小程序社区来获取最新的bug和修复信息~欢迎对月刊内容进行[留言讨论和推荐](https://github.com/godbasin/godbasin.github.io/issues/15)~