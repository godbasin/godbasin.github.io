---
title: 小程序开发月刊第六期（20190617）
date: 2019-06-17 23:17:13
categories: 小程序双皮奶
tags: 教程
---
太可惜了这个月啥都没有~~
<!--more-->

# 小程序 latest
## 小程序能力
### 「2.7.1版本基础库」新增功能
- 新增云开发 Network 面板，[详情](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/debug.html)  
- 更新组件 cover-view 开发者工具支持  
- 其他社区反馈问题修复  

更多2.7.1版本基础库的新能力及详情，可查看[《基础库更新日志》](https://developers.weixin.qq.com/miniprogram/dev/framework/release/)。
  
###  「微信开放社区」上线帖子相关问题能力
![帖子相关](http://km.oa.com/files/photos/pictures//20190617//1560737512_91.png)

### 更新日志
- [社区问题反馈以及功能优化更新（06.03-06.06）](https://developers.weixin.qq.com/community/develop/doc/00048cfe698378e701b86d72c56c01)  
- [社区问题反馈以及功能优化更新（05.27-05.31）](https://developers.weixin.qq.com/community/develop/doc/000e00bc1d81e051aca8b759f56401)  
- [社区问题反馈以及功能优化更新（05.20-05.24）](https://developers.weixin.qq.com/community/develop/doc/0002e212b94b58861ba81bbda56801)  
- [社区问题反馈以及功能优化更新（05.13-05.17）](https://developers.weixin.qq.com/community/develop/doc/00000ec37743f0906a98518df51801)  

# 小程序教程

## 社区精选文章
- [小程序开发另类小技巧 --用户授权篇](https://developers.weixin.qq.com/community/develop/article/doc/0000c42fea0668ff36b80d20451813)
- [浅谈小程序运行机制](https://developers.weixin.qq.com/community/develop/article/doc/0008a4c4f28f30fe3eb863b2750813)

更多可以查看[文章分享](https://developers.weixin.qq.com/community/develop/article)。

## 最新踩坑 && Tips
1. Promise.then 有些情况下不被调用。查了一下基础库的 bug 历史，以前确实有发现过部分 iOS 系统版本上原生 Promise then 不触发的情况，具体触发条件不明。建议考虑自己打个 polyfill 试试。

> 可以写段检测Promise是否生效的逻辑，然后考虑兜底兼容例如降级到H5之类的...

## 结束语
看起来这个月踩坑不多，为啥还是那么忙呢？