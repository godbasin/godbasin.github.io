---
title: 小程序开发月刊第十期（20191015）
date: 2019-10-15 23:05:07
categories: 小程序双皮奶
tags: 教程
---
国庆期间新功能比较少，但月刊也不能少~~
<!--more-->

# 小程序 latest
## 小程序能力
### 「微信官方文档」支持在线交互式预览
微信官方文档部分组件“示例代码”已从“静态代码+静态贴图预览”模式升级为“代码编辑器+交互式预览”，实现阅读示例代码时可在浏览器端同步体验示例效果。目前该功能已覆盖大部分小程序[表单组件](https://developers.weixin.qq.com/miniprogram/dev/component/button.html)。

### 小程序模板消息能力调整通知
为提升小程序模板消息能力的使用体验，平台对模板消息的下发条件进行了调整，由用户自主订阅所需消息，包括：一次性订阅消息、长期性订阅消息。
小程序订阅消息接口上线后，原先的模板消息接口将停止使用，详情如下：
1. 开发者可登录小程序管理后台开启订阅消息功能，接口开发可参考文档：[小程序订阅消息](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/subscribe-message.html)
2. 开发者使用订阅消息能力时，需遵循运营规范，不可用奖励或其它形式强制用户订阅，不可下发与用户预期不符或违反国家法律法规的内容。具体可参考文档：[小程序订阅消息接口运营规范](https://developers.weixin.qq.com/miniprogram/product/#_5-21-%E6%BB%A5%E7%94%A8%E8%AE%A2%E9%98%85%E6%B6%88%E6%81%AF)
3. 原有的小程序模板消息接口将于 2020 年 1 月 10 日下线，届时将无法使用此接口发送模板消息，请各位开发者注意及时调整接口。 
- [参考链接](https://developers.weixin.qq.com/community/develop/doc/00008a8a7d8310b6bf4975b635a401)
- [帖子详情查看](https://developers.weixin.qq.com/community/develop/doc/00008a8a7d8310b6bf4975b635a401)

> 微信7.0.7版本起，当用户打开的小程序最底层页面是非首页时，默认展示“返回首页”按钮，开发者可在页面 onShow 中调用 hideHomeButton 进行隐藏。

### 更新日志
- [关于微信小程序内容安全要求规范](https://developers.weixin.qq.com/community/develop/doc/00004843288058ed4039d223951401)  
- [社区问题反馈以及功能优化更新（09.23-09.27）](https://developers.weixin.qq.com/community/develop/doc/000a4881f7c5f0ee9049654bf5b001)  
- [社区问题反馈以及功能优化更新（09.16-09.20）](https://developers.weixin.qq.com/community/develop/doc/000a023c8a05888f68395602e51c01)  
- [社区问题反馈以及功能优化更新（09.02-09.13）](https://developers.weixin.qq.com/community/develop/doc/00026861b98900d2ef29d0d2956c01)  

## 小程序·云开发
没啥新能力上线。

## 开发者工具
没啥新能力推出。

### 更多更新说明
参考[微信开发者工具 1.02.1910121 RC 更新说明](https://developers.weixin.qq.com/community/develop/doc/000aa65c3d4cb852b349826b751401)，这期新增能力包括：
1. 优化再次打开项目时的首次编译速度。  
2. 真机调试支持直接触发更新周期性缓存数据。  
3. 默认打开 GPU 加速。  
4. 修复文件保存后编译不生效的问题。  
5. 修复全新安装时无法打开的问题。
6. 修复未使用体验评分导致内存泄漏。
7. 只有未授权时直接调用 getUserInfo 才会出现升级提示。  

# 小程序教程
## 社区精选文章
没有新的好文章，往期内容可以查看[文章分享](https://developers.weixin.qq.com/community/develop/article)。

## 最新踩坑 && Tips
### 【开发Tips】-input兼容性
背景：`<input>`number类型 需要显示344（如123 4567 8910）这样的手机格式。
ios可以通过在js中加入空格来显示，但是在安卓下。空格不显示，被过滤了。

### 【踩坑信息】- chooseImage完showLoading失效
IOS 微信 7.0.7 版本 chooseImage 完 showLoading 失效，客户端下个大版本修复。
- [参考地址](https://developers.weixin.qq.com/community/develop/doc/000a6c36870868acd329d975e51800?highLine=chooseImage%2520showLoading)

### 【收集信息】- 云函数
云函数会以日志形式保存请求，响应内容，其中请求日志是内部日志，响应日志是外部日志，就是在控制台中看到的云函数日志。
在数据流请求中，为了有效的帮助客户解答一些问题，所以目前会记记录请求的入参和精简后的出参：
1. 日志有权限控制，日志没加白名单是不能访问的。
2. 日志存放时间7天。
响应回包在日志中会做个精简的记录, 会记录外层的key和value。value会记录几十个字符。

## 结束语
国庆期间没啥新能力上线，大家来看看我家猫好了。
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/kitty/kitty-1.jpg)
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/kitty/kitty-2.jpg)
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/kitty/kitty-3.jpg)
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/kitty/kitty-4.jpg)
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/kitty/kitty-5.jpg)
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/kitty/kitty-6.jpg)
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/kitty/kitty-7.jpg)
