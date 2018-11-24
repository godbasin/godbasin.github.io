---
title: 小程序多页面接口数据缓存
date: 2018-11-24 19:22:34
categories: 小程序双皮奶
tags: 教程
---
小程序里面多个页面，有时候会需要用到同一个接口的数据。而这些数据全局来说只需要拉取一遍，如果要存到缓存，要怎么保证其他页面取缓存的时候，数据已经拉取回来了呢？
<!--more-->

## 多页面接口数据缓存实现
---
### 思路设计
其实这种场景和实现方式，与小程序关系并不大，很多常见的应用开发都会遇到。这次刚好在小程序里用到了，就顺便做下记录。

在这里，我们假设需要全局拉取一个用户信息。在涉及异步请求中，我们常用的方式是封装成一个`Promise`：
1. 方法统一对外返回一个`Promise`。
2. 加锁，在请求中不再请求，返回缓存的`Promise`。
3. 若已有缓存，则返回一个马上`resolve`的`Promise`。

``` js
let isLoading = false;
let info = null;
let promise = null;
export function getInfo(data = {}) {
  if (info) {
    return new Promise((resolve, reject) => {
      resolve(info);
    });
  }
  if (isLoading) {
    return promise;
  }
  isLoading = true;
  return (promise = new Promise((resolve, reject) => {
    //登录权限接口
    wx.request({
      url: "your_url",
      method: "GET",
      data,
      success: function (res) {
        resolve(res)
      },
      fail: function (err) {
        reject(err)
      }
    })
  }));
}
```

### 稍作优化
这种情况下，我们在一个生命周期中都会只请求一次，其他都只会在缓存中获取。我们还可以做些调整：
1. 将数据写入本地缓存，小程序启用的时候获取。
2. 提供强制拉取新数据的配置控制，这里用`needRefresh`参数控制。
3. 使用上节[《小程序的登录与静默续期》](https://godbasin.github.io/2018/11/17/wxapp-login/)封装的`request`方法来发起请求。

我们来更新下代码：

``` js
let isLoading = false;
let info = null;
try {
  info = wx.getStorageSync('info')
} catch (e) {}
let promise = null;
export function getInfo(data = {}, needRefresh = false) {
  if (info && !needRefresh) {
    return new Promise((resolve, reject) => {
      resolve(info);
    });
  }
  if (isLoading) {
    return promise;
  }
  isLoading = true;
  return (promise = request({
    url: "your_url",
    method: "GET",
    data
  }));
}
```

**Tips:**前面也提到过，小程序的设计很大程度上考虑了管控力。在这里，为了保证小程序不乱用任意域名的服务，`wx.request`请求的域名需要在小程序管理平台进行配置，如果小程序正式版使用`wx.request`请求未配置的域名，在控制台会有相应的报错。


### 参考
- [小程序网络API](https://developers.weixin.qq.com/miniprogram/dev/api/network-request.html#wxrequestobject)
- [《小程序开发指南》](https://developers.weixin.qq.com/ebook?action=get_post_info&token=935589521&volumn=1&lang=zh_CN&book=miniprogram&docid=000ee27c9c8d98ab0086788fa5b00a)


## 结束语
---
前面我们也提到，小程序里面发起请求，都会经过 Native 发起。在应用开发实践中，对一些原理的掌握，很多时候能更多地提升我们解决问题的效率，也能对项目整体有更好的认知。