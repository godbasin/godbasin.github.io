---
title: 小程序开发月刊第八期（20190815）
date: 2019-08-15 23:56:33
categories: 小程序双皮奶
tags: 教程
---
热闹的八月份来了~~
<!--more-->

# 小程序 latest
## 小程序能力
### 微信 PC 版小程序开发者公测
微信 PC 版新版本中，支持打开聊天中分享的小程序，开发者可下载安装微信 PC 版内测版本进行体验和适配。最新版微信开发者工具新增支持在微信 PC 版中预览小程序。
- [查看详情](https://developers.weixin.qq.com/miniprogram/dev/devtools/pc-dev.html)
- [微信 PC 版内测版](https://dldir1.qq.com/weixin/Windows/WeChat2.7.0_beta.exe)
- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/nightly.html)

> 噢？公测第一天我就踩出一个坑了，可以看看文章底部的最新踩坑 && Tips。

### 小程序 vue 多端支持
小程序团队推出了小程序 Vue 多端（目前支持微信小程序 + web）方案，已经在我们“微信开放社区”的小程序和 web 落地。
- [kbone 文档](https://github.com/wechat-miniprogram/kbone)

### 小程序扩展能力提供
官方提供了一些扩展能力（包括扩展UI组件、多端方案kbone、工具库、官方插件等等），希望可以帮大家一起快速搭建小程序。
- [查看详情](https://developers.weixin.qq.com/miniprogram/dev/extended/)

### 微信卡券“网页链接跳转”能力即将下线
为了确保微信生态良性发展，微信卡券将于2019年8月13日下线网页链接跳转能力。下线后，卡券创建流程中，“自定义入口”与“卡券详情>立即使用跳转”不再支持跳转至网页配置，你可尝试使用跳转小程序作为替代。本次调整仅针对券，会员卡原有能力暂时不变。
- [帖子详情查看](https://developers.weixin.qq.com/community/develop/doc/0006cef80b05f8b09fe87e70c5fc01)

### 「微信开放社区」小程序更新、搜索能力优化、支持扫码分享
- 小程序更新：社区小程序部分版块已支持完整的阅读、评论与回复功能，欢迎扫码体验。
- 搜索能力优化：大幅度优化搜索结果匹配度，并支持对搜索结果的内容类型、排序方式、时间范围进行二次筛选。
- 支持扫码分享：社区公告、文章、问答等内容支持在页面底部“复制链接”或在扫码打开小程序进行分享。

> 这个微信开放社区小程序，是用 kbone 多端支持做的噢~

### 更新日志
- [社区问题反馈以及功能优化更新（07.22-07.26）](https://developers.weixin.qq.com/community/develop/doc/000402b383c3303803f8e16145bc01)  
- [社区问题反馈以及功能优化更新（07.08-07.19）](https://developers.weixin.qq.com/community/develop/doc/0008464a59c0f8b468e834c7451c01)  

## 小程序·云开发
### 小程序·云开发支持第三方平台代开发
小程序·云开发目前已支持第三方平台代开发。第三方平台可在小程序权限集中勾选云开发管理权限，并通知小程序进行云开发权限集授权。授权完成后即可进行代开发，具体开发过程可参考[第三方平台代开发](https://developers.weixin.qq.com/miniprogram/dev/devtools/ext.html)。

同时，为方便第三方平台进行代开发，云开发还提供了多种 API 接口，包括开通云开发、创建云环境以及创建云函数等。详见[云开发接入指南](https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&id=21565259008XrkFz&token=&lang=zh_CN)。

## 开发者工具
### 小程序支持自动化测试
[小程序自动化 SDK](http://npmjs.org/package/miniprogram-automator) 为开发者提供了一套通过外部脚本操控小程序的方案，从而实现小程序自动化测试的目的。

如果你之前使用过 [Selenium WebDriver](https://www.seleniumhq.org/projects/webdriver/) 或者 [Puppeteer](https://pptr.dev/)，那你可以很容易快速上手。小程序自动化 SDK 与它们的工作原理是类似的，主要区别在于控制对象由浏览器换成了小程序。

- 更多详情，点击查看[小程序自动化快速开始](https://developers.weixin.qq.com/miniprogram/dev/devtools/auto/quick-start.html)

该能力于[开发者工具预发布版 1.02.1907301](https://developers.weixin.qq.com/community/develop/doc/000c085a7244b092e4e8237b451c01) 支持。

> 期待测试用例录制功能，特别想要！

# 小程序教程
## 社区精选文章
- [让小程序页面和自定义组件支持 computed 和 watch 数据监听器](https://developers.weixin.qq.com/community/develop/article/doc/0000a8d54acaf0c962e820a1a5e413)

更多可以查看[文章分享](https://developers.weixin.qq.com/community/develop/article)。

> 最近社区的好文有点不够哇

## 最新踩坑 && Tips
### 【踩坑信息】- 小程序跳小程序闪退
接口：wx.navigateToMiniProgram
问题描述：小程序 A 开发版 -> 小程序 B 正式版 -> 小程序 A 正式版（闪退）
小程序跳转间需要注意版本：
1. 开发 - 跳正式 - 跳正式，是行不通的 
2. 要么正式 - 跳正式 - 跳正式，要么是开发/体验 - 跳开发/体验 - 跳开发/体验
- 文档说明：envVersion 如果当前小程序是正式版，则打开的小程序必定是正式版。
- 参考：https://developers.weixin.qq.com/miniprogram/dev/api/open-api/miniprogram-navigate/wx.navigateToMiniProgram.html

### 【开发Tips】- 开发者工具增强编译
开发者工具ES6转ES5，支持Object.keys，Object.entries和Object.values 是ES2017的内容，需要单独引入polyfill。可以使用开发者工具的增强编译
- [参考](https://developers.weixin.qq.com/miniprogram/dev/devtools/codecompile.html)

### 【官方建设】- weui-wxss v2.0 版本
微信客户端 7.0 开始，UI 界面进行了大改版。小程序也进行了基础组件的样式升级。app.json 中配置 "style": "v2"可表明启用新版的组件样式。
- [参考](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#style)
- 兼容性：对于2.8.0以下版本基础库，会自动降级为旧版本UI，包括button icon radio checkbox switch slider 等

### 【踩坑信息】- 小程序下拉的背景颜色
- 背景：小程序下拉的背景颜色，在iOS下分成backgroundColor、backgroundColorTop、backgroundColorBottom三个部分，而在安卓下需要设置backgroundColor。旧版的小程序开发工具中，为了兼容安卓，会把 backgroundColorTop 的值设到 backgroundColor 的配置上。
但这种做法和文档不一致（[相关反馈查看](https://developers.weixin.qq.com/community/develop/doc/0002847bf0c368d623d8f90ba51c00)），所以新版的工具去掉了这个逻辑，可能导致部分背景样式与之前不一致的问题，开发者若依赖了工具的兼容，后续需要自行进行兼容。
- 兼容方法：如果需要设置安卓的背景色只能使用 backgroundColor 来设置整个背景色为某个颜色。

### 【踩坑信息】 - PC 版小程序 cookie
PC 版小程序中，接口请求多个set-cookie会被合并，只有最后一个会生效。可能会导致登录态丢失的问题，小程序团队已修复。

### 【开发Tips】- 小程序参数长度
关于小程序参数长度限制的说明如下：
1. scene 相关。
  - scene 值作为小程序的场景值参数，在小程序生命周期中属于全局变量，一般为 4 位数整型，如：scene=1001。[文档参考](https://developers.weixin.qq.com/miniprogram/dev/reference/scene-list.html)。
  - scene 值会作为 query 参数传递给小程序/小游戏。用户扫描该码进入小程序/小游戏后，开发者可以获取到二维码中的 scene 值并做处理逻辑，一般为32位长度限制； 如：`pages/sign/subject/subject?scene=1665290702232`。[文档参考](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/qr-code/wxacode.getUnlimited.html)。
2. url后面的query参数目前没有长度限制.
- 如：pages/index/index/index?key=28383989394949494....
- [文档参考](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.reLaunch.html#%E5%8F%82%E6%95%B0)

### 【踩坑信息】- input
[input 组件](https://developers.weixin.qq.com/miniprogram/dev/component/input.html)的 bindkeyboardheightchange 方法，在`Android && type !==text`的情况下，返回的 height 是错误的。可以用 bindfocus 方法，bindfocus 在 1.9.90 版本后加上了 height 字段，返回了键盘的高度。

## 结束语
如果你想富有，请把自己变成一个小孩。因为小孩子的框框最少，他们诚实、快乐、乐于学习。 --《小狗钱钱》