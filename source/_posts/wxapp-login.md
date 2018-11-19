---
title: 小程序的登录与静默续期
date: 2018-11-17 10:22:58
categories: 小程序双皮奶
tags: 教程
---
每一个有数据交互的小程序，都会涉及到登录、token 等问题，openid 又是什么呢？怎么使用静默续期，来提升用户体验呢？
<!--more-->

## 小程序登录
---
### 登录时序
一切的一切，都要从这么一张小程序登录时序图说起：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/%E6%8E%88%E6%9D%83%E6%97%B6%E5%BA%8F%E5%9B%BE.jpg)

通常情况下，我们的小程序都会有业务身份，如何将微信帐号和业务身份关联起来呢？这个时候我们需要上图的步骤：
1. 小程序调用`wx.login()`获取临时登录凭证`code`。
2. 小程序将`code`传到开发者服务器。
3. 开发者服务器以`code`换取用户唯一标识`openid`和会话密钥`session_key`。
4. 开发者服务器可绑定微信用户身份`id`和业务用户身份。
5. 开发者服务器可以根据用户标识来生成自定义登录态，用于后续业务逻辑中前后端交互时识别用户身份。

### 相关数据或参数
上面的登录时序中，我们会涉及到一些数据和参数，先来了解下它们都是用来做啥的。

**临时登录凭证 code**
在小程序中调用`wx.login()`，能拿到一个`code`作为用户登录凭证（有效期五分钟）。在开发者服务器后台，开发者可使用`code`换取`openid`和`session_key`等信息（`code`只能使用一次）。

`code`的设计，主要用于防止黑客使用穷举等方式把业务侧个人信息数据全拉走。

**AppId 与 AppSecret**
为了确保拿`code`过来换取身份信息的人就是对应的小程序开发者，到微信服务器的请求要同时带上`AppId`和`AppSecret`。

**session_key**
会话密钥`session_key`是对用户数据进行加密签名的密钥。**为了应用自身的数据安全，开发者服务器不应该把会话密钥下发到小程序，也不应该对外提供这个密钥。**

设计`session_key`主要是为了节省流程消耗，如果每次都通过小程序前端`wx.login()`生成微信登录凭证`code`去微信服务器请求信息，步骤太多会造成整体耗时比较严重。

使用接口`wx.checkSession()`可以校验`session_key`是否有效。用户越频繁使用小程序，`session_key`有效期越长。`session_key`失效时，可以通过重新执行登录流程获取有效的`session_key`。

**openid**
`openid`是微信用户`id`，可以用这个`id`来区分不同的微信用户。
微信针对不同的用户在不同的应用下都有唯一的一个`openid`, 但是要想确定用户是不是同一个用户，就需要靠`unionid`来区分。

**unionid**
如果开发者拥有多个移动应用、网站应用、和公众帐号（包括小程序），可通过`unionid`来区分用户的唯一性。同一用户，对同一个微信开放平台下的不同应用，`unionid`是相同的。

### 加锁的登录
在某些情况下，我们或许多个地方会同时触发登录逻辑（如多个接口同时拉取，发现登录态过期的情况）。一般来说，我们会简单地给请求加个锁来解决：
1. 使用`isLogining`来标志是否请求中。
2. 添加回调`callback`，方便后续其他接口请求，返回登录态过期时静默续期后重新发起。
3. 使用`sessionId`来记录业务侧的登录态。

``` js
let isLogining = false;
let sessionId = wx.getStorageSync("sessionId") || "";
let tryLoginCount = 0;
function doLogin(callback = () => {}) {
  if (sessionId) {
    // 缓存中有 sessionId
    callback();
  } else if (isLogining) {
    // 正在登录中，请求轮询稍后，避免重复调用登录接口
    setTimeout(function() {
      doLogin(callback);
    }, 500);
  } else {
    isLogining = true;
    wx.login({
      success: function(res) {
        if (res.code) {
          wx.request({
            // 发起请求，给服务器 code 换取新的业务登录态
          })
            .then(res => {
              isLogining = false;
              // 保存登录态
              sessionId = res.sessionId;
              wx.setStorage({ key: "sessionId", data: sessionId });
              // 登录/登录态续期成功，执行回调
              callback();
            })
            .catch(err => {
              // 登录失败，解除锁，防止死锁
              isLogining = false;
            });
        } else {
          // 登录失败，解除锁，防止死锁
          isLogining = false;
        }
      },
      fail: function(res) {
        // 登录失败，解除锁，防止死锁
        isLogining = false;
      }
    });
  }
}
```

## 登录态静默续期的实现
---
### checkSession
前面也提到，微信不会把`session_key`的有效期告知开发者，因此需要使用接口`wx.checkSession()`来校验`session_key`是否有效。

这里我们：
1. 使用`isCheckingSession`来标志是否查询中。
2. 添加回调`callback`。
3. 使用`isSessionFresh`来标志`session_key`是否有效。

``` js
let isCheckingSession = false;
let isSessionFresh = false;
function checkSession(callback = () => {}) {
  if (isCheckingSession) {
    setTimeout(function() {
      checkSession(callback);
    }, 500);
  } else if (!isSessionFresh && sessionId) {
    isCheckingSession = true;
    wx.checkSession({
      success: function(res) {
        //session_key 未过期，并且在本生命周期一直有效
        isSessionFresh = true;
            doLogin(callback);
      },
      fail: function(res) {
        // session_key 已经失效，需要重新执行登录流程
        sessionId = "";
        wx.removeStorage({
          key: "sessionId",
          complete: function() {
            doLogin(callback);
          }
        });
      },
      complete: function() {
        isCheckingSession = false;
      }
    });
  } else {
    doLogin(callback); //重新登录
  }
}
```

### 静默续期的接口请求
至此，我们可以封装一个简单的接口，来在每次登录态过期的时候自动续期：
1. 在请求前，使用`checkSession()`检车本次周期内`session_key`是否有效，无效则`doLogin()`拉起登录获取`sessionId`。
2. 请求接口，若返回特定登录态失效错误码（此处假设为`LOGIN_FAIL_CODE`），则`doLogin()`拉起登录获取`sessionId`。
3. 使用`tryLoginCount`来标志重试次数，`TRY_LOGIN_LIMIT`来标志重试次数上限，避免进入死循环。

``` js
const TRY_LOGIN_LIMIT = 3;
function request(obj = {}) {
  checkSession(() => {
    const { data, method, header, dataType, fail, success } = obj;
    const tryLoginCount = obj.tryLoginCount || 0;
    // 如果需要通过 data 把登录态 sessionId 带上
    const dataWithSession = { ...data, sessionId };
    wx.request({
      url,
      data: dataWithSession,
      method,
      header,
      dataType,
      success: function(res) {
        if (res.statusCode == 200) {
          // 登陆态失效特定错误码判断，且重试次数未达到上限
          if (LOGIN_FAIL_CODE && tryLoginCount < TRY_LOGIN_LIMIT) {
            doLogin(() => {
              obj.tryLoginCount = ++tryLoginCount;
              request(obj);
            });
          } else {
            success(res);
          }
        } else {
          fail(res);
        }
      },
      fail: function(res) {
        fail(res);
      }
    });
  });
}
```

至此，我们大概包装了一个能自动登录或是进行静默续期的一个请求接口。

### 参考
- [小程序登录API](https://developers.weixin.qq.com/miniprogram/dev/api/api-login.html)
- [《小程序开发指南》](https://developers.weixin.qq.com/ebook?action=get_post_info&token=935589521&volumn=1&lang=zh_CN&book=miniprogram&docid=000cc48f96c5989b0086ddc7e56c0a)


## 结束语
---
小程序的登录和登录态管理，大概是大部分小程序都需要的能力。`code`和`session_key`的设计，做了哪些事情来保护用户的数据。
如何在全局范围地保证登录态的有效性，微信侧的登录态也好，业务侧的登录态也好，静默续期的能力能给用户带来不少的体验提升。