---
title: 超实用小程序官方能力
date: 2019-01-10 22:53:58
categories: 小程序双皮奶
tags: 教程
---
小程序官方平台和工具里，其实有很多很好用的能力，你都了解吗？
<!--more-->

# 小程序管理后台
微信公众平台里，其实藏着一些好用的能力，一起来看看把。

## 问题定位辅助
---
### 运维中心
在小程序管理后台，【开发】-【运维中心】里，可以有以下能力：
- **错误查询**: 可以查到所有小程序运行错误的记录。
- **性能监控**: 可以监控小程序运行的性能，包括不同时间段的`启动耗时`、`下载耗时`、`初次渲染耗时`等。
- **告警设置**: 错误告警通过微信群来通知，每个小程序对应唯一的告警群，扫码加入后即可接收告警通知。

> 微信7.0以后：
1. 如果使用工具压缩和编译代码，会自动带上 sourcemap ，运维中心的错误会显示原来文件名字和行号
2. 如果使用第三方框架，在代码中内敛 sourcemap 或者有同名  sourcemap 文件存在，工具会自动合并和解析，从而做到错误会显示原来文件名字和行号。

![运维中心界面](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1547096780.jpg)


---
### 日志管理
1. 开发中日志打印，使用日志管理器实例`LogManager`。使用方式查看[API - LogManager](https://developers.weixin.qq.com/miniprogram/dev/api/LogManager.html)。
2. 用户在使用过程中，可以在小程序的 profile 页面，点击【投诉与反馈】-【功能异常】-【勾选上传日志】，则可以上传日志。

![这里需要勾上才会上传](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1547097426.png)

3. 在小程序管理后台，【管理】-【反馈管理】，就可以查看上传的日志。

![这里可以下载日志](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1547097350.jpg)

---
### 运营数据
有两种方式可以方便的看到小程序的[运营数据](https://developers.weixin.qq.com/miniprogram/dev/quickstart/basic/release.html#%E8%BF%90%E8%90%A5%E6%95%B0%E6%8D%AE)：
1. 在小程序管理后台，【统计】，可以看到常规分析（概况、访问分析、来源分析、用户画像）与自定义分析，点击相应的 tab 可以看到相关的数据。
2. 使用小程序数据助手，在微信中方便的查看运营数据。

**常规分析（不需要配置或开发）**
> 参考文档: [常规分析](https://developers.weixin.qq.com/miniprogram/analysis/regular/)

- 概况：提供小程序关键指标趋势以及 top 页面访问数据，快速了解小程序发展概况；
- 访问分析：提供小程序用户访问规模、来源、频次、时长、深度、留存以及页面详情等数据，具体分析用户新增、活跃和留存情况；
- 实时统计：提供小程序实时访问数据，满足实时监控需求；
- 用户画像：提供小程序的用户画像数据，包括用户年龄、性别、地区、终端及机型分布。

似乎晒点图会更加直观：
![昨日概况](https://developers.weixin.qq.com/miniprogram/analysis/image/weanalytics/2_1.png?t=19010912)
![访问分布](https://developers.weixin.qq.com/miniprogram/analysis/image/weanalytics/4_2.png?t=19010912)
![终端及机型分布](https://developers.weixin.qq.com/miniprogram/analysis/image/weanalytics/6_4.png?t=19010912)


**自定义分析（需自行配置和开发）**
> 参考文档: [自定义分析](https://developers.weixin.qq.com/miniprogram/analysis/custom/)

配置自定义上报，精细跟踪用户在小程序内的行为，结合用户属性、系统属性、事件属性进行灵活多维的事件分析和漏斗分析，满足小程序的个性化分析需求。

同样，晒点官方图：
![](https://developers.weixin.qq.com/miniprogram/analysis/image/weanalytics/5_14.png?t=19010912)
![](https://developers.weixin.qq.com/miniprogram/analysis/image/weanalytics/5_21.png?t=19010912)

## 第三方能力
---
### TGit 代码托管
**重要Tips: TGit 能力即将会升级为 git.weixin.qq.com，将全量免费提供给微信的开发者，期待最新消息！~**

更多详情，可以参考[TGit开通及配置流程](https://developers.weixin.qq.com/miniprogram/dev/qcloud/tgit.html)。

# 小程序开发工具
## 调试
---
### 真机调试
> 参考文档：[真机调试](https://developers.weixin.qq.com/miniprogram/dev/devtools/remote-debug.html)

我们经常会遇到小程序开发工具没有问题，但是真机上跑的时候就出翔了，或者某些UI歪掉了，这时候真机调试就显得特别方便啦~
真机远程调试功能可以实现直接利用开发者工具，通过网络连接，对手机上运行的小程序进行调试，帮助开发者更好的定位和查找在手机上出现的问题。

**使用方式**：
点击开发者工具的工具栏上 “远程调试” 按钮。

**实用能力**：
- 调试：断点、单步调试，可在 console 里调试`wx.***`能力
- 查看和 debug 请求
- 查看 UI 布局和样式（定位奇葩的手机兼容的时候，特别好用）

![使用效果](https://developers.weixin.qq.com/miniprogram/dev/devtools/image/devtools2/remote-debug/iphone.jpg?t=19011013)

## 构建
---
### npm 支持
> 参考文档：[npm 支持](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)

小程序基础库版本`2.2.1`开始，就支持 npm 构建啦。
1. 安装 npm 依赖。
2. 点击开发者工具中的菜单栏：【工具】-【构建 npm】，就可以啦。

---
### 自定义预处理
通过自定义预处理，我们可以设置在上传代码之前，做一些什么操作，例如跑测试、编译构建等。可以通过`project.config.json`中的`scripts `来配置：
- `beforeCompile`: 编译前预处理命令
- `beforePreview`: 预览前预处理命令
- `beforeUpload`: 上传前预处理命令

## 测试体验
---
### 小程序开发助手
> 参考文档：[小程序开发助手](https://developers.weixin.qq.com/miniprogram/dev/devtools/mydev.html)

微信公众平台发布的官方小程序，帮助开发和运营人员在手机端更方便快捷地查看和预览小程序。
有权限的项目成员，可以直接点击体验任何一个需要测试或体验的版本，而不需要二维码的口口相传。

**最新消息：小程序开发助手已经升级为小程序助手了，在移动端可以管理版本了~**

---
### 体验评分
> 参考文档：[体验评分](https://developers.weixin.qq.com/miniprogram/dev/devtools/audits.html)

体验评分是一项给小程序的体验好坏打分的功能，它会在小程序运行过程中实时检查，分析出一些可能导致体验不好的地方，并且定位出哪里有问题，以及给出一些优化建议。
![体验评分效果](https://developers.weixin.qq.com/miniprogram/dev/devtools/image/devtools/audits.png?t=19010919)
**手动启动：**
1. 在调试器区域切换到 Audits 面板。
2. 点击左上角”开始“按钮，然后自行操作小程序界面，运行过的页面就会被“体验评分”检测到。
3. 点击 “Stop" 停止分析，就会看到一份分析报告，之后便可根据分析报告进行相关优化。

**自动运行（实时检查）：**
开发者在工具的右上角 “详情” 面板里勾选 “自动运行体验评分” 选项即可开启。

### 参考
- [小程序调试](https://developers.weixin.qq.com/miniprogram/dev/devtools/debug.html)

## 结束语
---
很多时候，我们觉得小程序的开发和调试总是有哪里不满意，但其实官方在很认真地完善各个环节，不过他们比较低调，很多能力我们都没有用上。
很多 web 开发写小程序，都喜欢用像 mpvue、wepy 这些框架。不用去了解小程序的运行机制、底层原理，其实也很方便。不过作为一个细腻的开发，其实了解一下也能发现小程序它棒在哪里了。