---
title: 小程序开发月刊第15期（20200415）
date: 2020-04-15 20:46:50
categories: 小程序双皮奶
tags: 教程
---
又一个月过去了，大家也快习惯了带着口罩上班，饭堂也在慢慢恢复菜单供打包，捡树枝活动异常火热，我们来看看小程序又更新了哪些能力吧~
<!--more-->

# 小程序 latest
## 小程序能力
### 关于收回小程序"用户实名信息授权"接口的相关说明
小程序将回收小程序“用户实名信息授权”接口，计划于2020年05月31日下线。对于以往已经接入了本接口的小程序，但依然有业务场景有相关需求，平台侧建设了替代接口方案——实名信息校验接口，提供给满足一定条件的业务方，相关接口：
1. 实名信息校验接口。
- 本接口可实现：在用户同意情况下，校验用户（或业务方）输入的实名信息是否正确（仅支持身份证信息）。对于接入微信城市服务的业务，或满足以下地址中的文档说明的范围，可以申请城市服务实名信息校验接口。
- [申请方式地址](https://developers.weixin.qq.com/community/business/doc/000e06614ac74068f3d9237eb5440d)
- [接口文档地址](https://developers.weixin.qq.com/miniprogram/dev/framework/cityservice/cityservice-checkrealnameinfo.html)
2. 地址组件接口。
- 本接口可实现：拉起微信原生的地址选择及编辑界面，可以编辑已有地址，也可以在编辑完成后，返回用户选择的地址。
- [接口文档地址](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/address/wx.chooseAddress.html)
3. 快速填写组件接口。
- 本接口可实现： 小程序开发者可以获取用户首次填写过的表单的信息，并快速快速填充本次需要填写的表单。减少用户输入的压力。
- [接口介绍、开放范围及申请指引](https://developers.weixin.qq.com/community/business/doc/0004c23556c43074dde973aeb5bc0d)
- [接口文档地址](https://developers.weixin.qq.com/miniprogram/dev/framework/cityservice/cityservice-auto-fill.html)

### 小程序测速功能上线
“小程序测速”功能可以简单方便地统计小程序内某一事件的实时耗时情况，并可根据地域、运营商、操作系统、网络类型、机型等关键维度进行交叉分析。对于更复杂的用户场景，还可以使用自定义维度进行分析。从基础库2.9.2开始，开发者通过“测速上报”接口上报某一指标的耗时情况后，可在小程序管理后台"开发 -运维中心 -小程序测速" 查看各指标耗时趋势，并支持分钟级数据实时查看。
- [《小程序测速》使用指南](https://developers.weixin.qq.com/miniprogram/dev/framework/performanceReport/)

## 小程序·云开发
> 暂无更新

## 开发者工具
### 代码编译和上传 CI 模块
> 该部分内容上期更新补充过，但官方更新时间属于本期，因此再发一次。

为助力开发者进行小程序开发的自动化，实现功能的持续集成，小程序团队抽离了开发者工具中的代码编译以及上传能力，新增 [miniprogram-ci](https://www.npmjs.com/package/miniprogram-ci) 模块。该模块可以极大地方便开发者将小程序代码上传和预览操作同已有系统相结合。
miniprogram-ci 是从微信开发者工具中抽离的关于小程序/小游戏项目代码的编译模块，目前提供以下能力：
1. 上传代码，对应小程序开发者工具的上传
2. 预览代码，对应小程序开发者工具的预览
3. 构建 npm，对应小程序开发者工具的: 菜单-工具-构建npm
4. 代理，配置 miniprogram-ci 的网络请求代理方式
5. 支持 node 脚本调用方式和 命令行 调用方式
使用 miniprogram-ci 模块前需要在微信公众平台-开发-开发设置中下载对应的代码上传密钥和配置 IP 白名单。
- [参考文档地址](https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html)

更多的内容可以查看：
- [稳定版 Stable Build 更新日志](https://developers.weixin.qq.com/miniprogram/dev/devtools/stable.html)
- [开发版 Nightly Build 更新日志](https://developers.weixin.qq.com/miniprogram/dev/devtools/nightly.html)

# 小程序教程

## 社区精选文章
- [网页端管理系统在小程序上的实现](https://developers.weixin.qq.com/community/develop/article/doc/000224ac24882059eb2a0775f51013)

往期内容可以查看[文章分享](https://developers.weixin.qq.com/community/develop/article)
> 最近社区的精选文章都木有怎么更新来着。

## 最新踩坑 && Tips
### iOS 下`Promise.finally()`异常
`Promise.finally()`在iOS下会出现故障，安卓下表现良好，若使用需要注意。
- [参考](https://developers.weixin.qq.com/community/develop/doc/000caaefe54f70567a4933aaa56000)

### `wx.chooseContact()`拉起通信录接口异常
小程序中调用过`wx.chooseContact()` api后，再调用其他 api 都会失败。
- 出现异常版本：iOS 13.3.1 + 微信 7.0.12

## 结束语
本期木有结束语，祝各位的大头菜都涨涨涨。