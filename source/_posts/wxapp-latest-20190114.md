---
title: 小程序开发月刊第一期（20190114）
date: 2019-01-14 22:55:52
categories: 小程序双皮奶
tags: 教程
---
小程序的一些能力更新、踩坑历史、以及一些开源工具库和框架的推荐记录第一弹。
<!--more-->

# 小程序 latest
## 开发者工具
- [新增黑色主题](https://developers.weixin.qq.com/miniprogram/dev/devtools/settings.html)
- [支持 Typescript](https://developers.weixin.qq.com/miniprogram/dev/devtools/edit.html#typescript-%E6%94%AF%E6%8C%81)

# 小程序教程
## 使用 Tips
- [超实用小程序官方能力](https://godbasin.github.io/2019/01/10/wxapp-official-functions/)

> 目前来说，大多数是我自己的文章，也非常欢迎大家推荐文章来~

## 最新踩坑 Tips
1. 调试小程序时，有些请求例如上传文件请求，无法再控制台里查看到完整的请求信息。
解决办法：小程序开发工具可以设置网络代理，转发到抓包工具例如Charles中即可。

2. 在原生页跳转进入小程序场景下（仿原生，没有关闭和后退按钮），有没有内部能力从小程序返回到原生页？
可使用[navigateBackMiniProgram](https://developers.weixin.qq.com/miniprogram/dev/api/wx.navigateBackMiniProgram.html?search-key=navigateBackMiniProgram)返回到上一个小程序。只有在当前小程序是被其他小程序打开时可以调用成功
> 虽然写的是返回小程序，但是他就是可以用。算是实现的有bug，目前测试没遇到过不行的情况。
> iOS仿原生点了是切后台，安卓仿原生是关闭，这个无解。
> 想安心一点就用`<navigator target="miniProgram" open-type="exit">`，版本比较高

3. 小程序右上角的关闭按钮，只是将小程序切换到后台并不会关闭小程序。若需要重新加载，需要在微信首页下拉删掉使用过的小程序；另从后台唤醒时，会触发`onShow`而不是`onLoad`。

4. 如果用户通过微信首页下拉删掉使用过的小程序，那么小程序代码里面通过 localStorage 保存的缓存信息以及通过文件管理器保存的文件都会被清掉。

5. 小程序工具上传代码，勾选 ES6 转 ES5，只会针对 ES6 进行编译，对 ES7/ES8 代码并不会编译，可能导致兼容性问题（如`Object.values`）。
节后工具会上线一个 ES6+ 转 ES5 的能力，一站式全部处理掉。

> 后续踩坑相关的，可能会整理到一个地方一起沉淀吧~~~

# tools
## 框架
> Tips 仅供参考: 小程序开发本身就比较方便，个人感觉最好的方式建议直接使用原生开发噢

### wepy
- Github: [https://github.com/Tencent/wepy](https://github.com/Tencent/wepy)

### mpvue
- Github: [https://github.com/mpvue](https://github.com/mpvue)

## 工具
### weRequest
解决繁琐的小程序会话管理，一款自带登录态管理的网络请求组件：
- session 登录态管理（静默续期）
- cache 请求缓存能力
- 封装请求测速能力

- Github: [https://github.com/IvinWu/weRequest](https://github.com/IvinWu/weRequest)

### we-cropper
微信小程序图片裁剪工具。
- Github: [https://github.com/we-plugin/we-cropper](https://github.com/we-plugin/we-cropper)

### westore
微信小程序状态管理解决方案
- Github: [https://github.com/Tencent/westore](https://github.com/Tencent/westore)

> Tips: store 为全局状态，不同组件或页面需要注意数据隔离

## 图表
### echarts-for-weixin
ECharts 的微信小程序版本
- Github: [https://github.com/ecomfe/echarts-for-weixin](https://github.com/ecomfe/echarts-for-weixin)

> 注意：移动端中使用 ECharts，折线图的点击事件体验会很差

### wx-f2
F2 的微信小程序图表示例
- Github: [https://github.com/antvis/wx-f2](https://github.com/antvis/wx-f2)

### wx-charts
微信小程序图表charts组件
- Github: [https://github.com/xiaolin3303/wx-charts](https://github.com/xiaolin3303/wx-charts)

> 该图表组件已没有维护，但是源码比较简单清晰，可自定义修改

## UI 库
### weui-小程序
- Github: [https://github.com/Tencent/weui-wxss](https://github.com/Tencent/weui-wxss)

### wux-weapp
- Github: [https://github.com/wux-weapp/wux-weapp](https://github.com/wux-weapp/wux-weapp)

> Tips: 表单相关的 input/textarea 稍微有毒，其他暂可正常使用

## 结束语
本期作为第一期，所以把目前的一些工具库和文章沉淀一并发出，大家如果有很好的文章、工具推荐，可以一起[留言讨论和推荐](https://github.com/godbasin/godbasin.github.io/issues/15)~~