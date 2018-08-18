---
title: 前端入门8--Ajax和http
date: 2018-05-19 11:41:23
categories: js什锦
tags: 分享
---

《前端入门》系列主要为个人对前端一些经验和认识总结。本节主要涉及 HTTP 协议和 Ajax 请求，日常开发的联调等内容。

<!--more-->

# Ajax 请求

Ajax 不是 JavaScript 的规范，它只是 Jesse James Garrett 提出的新术语：`Asynchronous JavaScript and XML`，意思是用 JavaScript 执行异步网络请求。

## 网络请求的发展

网络请求，是用来从服务端获取需要的信息，然后解析协议和内容，来进行页面渲染或者是信息获取的过程。前面[《前端入门 6-- 认识浏览器》]()一节已经大致说过关于浏览器渲染，以及完整的 HTTP 请求流程。

在很久以前，我们的网络请求除了静态资源（`html/css/js`等）文件的获取，主要用于表单的提交。我们在完成表单内容的填写之后，点击`Submit`按钮，表单开始提交，浏览器就会刷新页面，然后在新页面里告诉你操作是成功了还是失败了。

然后随着时间发展，大家觉得这样每次都刷新页面的体验太糟了，然后开始使用`XMLHttpRequest`来获取请求内容，再更新到页面中。页面开始支持局部更新、动态加载，后面还有懒加载、首屏加载等等，其实都可以算是基于这个基础吧。

同步请求会阻塞进程，页面呈现假死状态，导致体验效果也较差。接下来，Ajax 的应用越来越广，慢慢大家都开始使用异步请求 + 回调的方式，来进行请求处理。那是一个浏览器兼容困难时期，jQuery 封装的`$.ajax()`，由于兼容性处理较好，也开始被大家广泛使用
。

现在，我们用上了路由管理，编写单页应用，Ajax 已经是一个不可或缺的功能了。

我们先来认识下 Ajax 的核心：`XMLHttpRequest` API 。

## XMLHttpRequest

`XMLHttpRequest`让发送一个 HTTP 请求变得非常容易。你只需要简单的创建一个请求对象实例，打开一个 URL，然后发送这个请求。当传输完毕后，结果的 HTTP 状态以及返回的响应内容也可以从请求对象中获取。

来看个简单的例子（我们常用的 Ajax 处理）：

```js
var request = new XMLHttpRequest(); // 新建XMLHttpRequest对象

request.onreadystatechange = function() {
  // 状态发生变化时，函数被回调
  if (request.readyState == 4) {
    // 成功完成
    // 判断响应结果:
    if (request.status == 200) {
      // 成功，通过responseText拿到响应的文本
      console.log(request.responseText);
    } else {
      // 失败，根据响应码判断失败原因:
      console.log(request.status);
    }
  }
};

// 发送请求
// open的参数：
// 一：请求方法，包括get/post等
// 二：请求地址
// 三：表示是否异步请求，若为false则是同步请求，会阻塞进程
request.open("GET", "/api/categories", true);
request.send();
```

大概就是上面这样，来处理一个 HTTP 请求。我们通常会将它封装成一个通用的方法，方便调用。上面例子中使用`200`来判断是否成功，但有些时候`200-400`（不包括`400`）的范围，都可以算是成功的。

如果说我们将其封装起来，同时使用 ES6 的 Promise 的方式来操作的话，大概会是这样：

```js
function ajax({ method, url, params, contentType }) {
  const xhr = new XMLHttpRequest();
  const formData = new FormData();
  Object.keys(params).forEach(key => {
    formData.append(key, params[key]);
  });
  return new Promise((resolve, reject) => {
    try {
      xhr.open(method, url, false);
      xhr.setRequestHeader("Content-Type", contentType);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 400) {
            // 这里我们使用200-400来判断
            resolve(xhr.responseText);
          } else {
            // 返回请求信息
            reject(xhr);
          }
        }
      };
      xhr.send(formData);
    } catch (err) {
      reject(err);
    }
  });
}
```

这里使用了`FormData`来处理。通过`FormData`对象可以组装一组用`XMLHttpRequest`发送请求的键/值对。
它可以更灵活方便的发送表单数据，因为可以独立于表单使用。如果你把表单的编码类型设置为`multipart/form-data`，则通过`FormData`传输的数据格式和表单通过`submit()`方法传输的数据格式相同。也支持文件的上传和添加。

上面的代码也只是一个简单的例子，如果要封装成完善的库，我们通常还需要处理一些问题：
- 浏览器兼容性
- babel polyfill处理ES6
- get方法通过将params转换拼接URL处理

如果想知道不使用`FormData`对象的情况下，通过AJAX序列化和提交表单，以及更多的`XMLHttpRequest`内容，可以参考[Using XMLHttpRequest | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest)。

# HTTP协议
关于HTTP协议的内容，实在是太多太多，这里只大致讲一下接触比较多的。

更多与HTTP协议相关的详细说明，可参考[《前端阶段性总结之「理解HTTP协议」》](https://godbasin.github.io/2017/05/20/front-end-notes-7-init-http/)。

还有TCP/IP协议的就直接略过，可参考下[《前端阶段性总结之「网络协议基础」》](https://godbasin.github.io/2017/05/19/front-end-notes-6-network-protocol/)

## 理解HTTP协议

### HTTP结构
**HTTP消息的结构**
1. Request

``` cmd
------------------
Request line
（包括：请求方法、请求的资源、HTTP协议的版本号）
------------------
Request header
（包括：Cache头域、Client头域、Cookie/Login头域、Entity头域、Miscellaneous头域、Transport头域等）
------------------
空行
------------------
Request body
------------------
```

2. Response

``` cmd
------------------
Response line
（包括：HTTP协议的版本号、状态码、消息）
------------------
Response header
（包括：Cache头域、Cookie/Login头域、Entity头域、Miscellaneous头域、Transport头域、Location头域等）
------------------
空行
------------------
Response body
------------------
```

**状态码**
状态码由三位数字组成，第一个数字定义了响应的类别（括号中为常见的状态码）：
- 1XX--提示信息：表示请求已被成功接收，继续处理
- 2XX--成功：表示请求已被成功接收，理解，接受（200 OK）
- 3XX--重定向：要完成请求必须进行更进一步的处理（302 Found重定向/304 Not Modified缓存）
- 4XX--客户端错误：请求有语法错误或请求无法实现（400 Bad Request客户端请求与语法错误/403 Forbidden服务器拒绝提供服务/404 Not Found请求资源不存在）
- 5XX--服务器端错误：服务器未能实现合法的请求（500 Internal Server Error服务器发生了不可预期的错误）

### 无连接的HTTP
**无连接**
无连接的含义是限制每次连接只处理一个请求。服务器处理完客户的请求，并收到客户的应答后，即断开连接。

**Keep-Alive**
Keep-Alive功能使客户端到服务器端的连接持续有效，当出现对服务器的后继请求时，Keep-Alive功能避免了建立或者重新建立连接。

### 无状态的HTTP
无状态是指协议对于事务处理没有记忆能力，服务器不知道客户端是什么状态。

通常我们会根据场景，使用`Cookie`、`Token`、`Session`等方法来记录用户状态，完善上下请求的承接性。

## HTTP与浏览器缓存
浏览器会在第一次请求完服务器后得到响应，我们可以在服务器中设置这些响应，从而达到在以后的请求中尽量减少甚至不从服务器获取资源的目的。

静态资源的缓存能减轻很多流量，如今我们的文件很多都加上了md5，则缓存的使用越来越广泛。

浏览器是依靠请求和响应中的的头信息来控制缓存的，主要涉及`Expires`与`Cache-Control`、`Last-Modified/If-Modified-Since`、`ETag/If-None-Match`这几个。

第一次请求：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/015343_psx2_568818.png)

再次请求：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/015353_P04w_568818.png)

## HTTP与跨域
### 浏览器同源政策
同源政策的目的，是为了保证用户信息的安全，防止恶意的网站窃取数据。所谓"同源"指的是"三个相同": 协议相同、域名相同、端口相同。

随着互联网的发展，"同源政策"越来越严格。目前，如果非同源，共有三种行为受到限制。
1. `Cookie`、`LocalStorage`和`IndexDB`无法读取。
2. `DOM`无法获得。
3. `AJAX`请求不能发送。

### 前端解决跨域
跨域方法大概以下几种：
- `document.domain + iframe`(只有在主域相同的时候才能使用该方法)
- 动态创建`script`(JSONP)
- `location.hash + iframe`
- `window.name + iframe`
- `postMessage`
- CORS
- `websockets`

现在的话，应该是CORS的使用会更广泛吧。实现CORS通信的关键是服务器。只要服务器实现了CORS接口，就可以跨源通信。

# 请求联调
一般来说，我们的日常联调通常有两种：浏览器查看请求，或是工具抓包查看（Fiddler）。

## 浏览器查看请求
我们又来看浏览器的控制台了：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1513065617%281%29.png)

### Network面板
Network面板可以记录页面上的网络请求的详情信息，从发起网页页面请求Request后分析HTTP请求后得到的各个请求资源信息（包括状态、资源类型、大小、所用时间、Request和Response等），可以根据这个进行网络性能优化。

该面板主要包括5大块窗格，如图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/7f5c083982ec4c8378100687072118b9.png)
- **Controls**：控制Network的外观和功能。
- **Filters**：控制Requests Table具体显示哪些内容。
- **Overview**：显示获取到资源的时间轴信息。
- **Requests Table**：按资源获取的前后顺序显示所有获取到的资源信息，点击资源名可以查看该资源的详细信息。
- **Summary**：显示总的请求数、数据传输量、加载时间信息。

### 查看具体资源的详情
通过点击某个资源的Name可以查看该资源的详细信息，根据选择的资源类型显示的信息也不太一样，可能包括如下Tab信息：
- **Headers**：该资源的HTTP头信息。
- **Preview**：根据你所选择的资源类型（JSON、图片、文本）显示相应的预览。
- **Response**：显示HTTP的Response信息。
- **Cookies**：显示资源HTTP的Request和Response过程中的Cookies信息。
- **Timing**：显示资源在整个请求生命周期过程中各部分花费的时间。

一般来说，联调主要关注请求是否正确发送、回包是否是约定的格式，所以我们更多使用资源详情的查看，包括：
- 查看HTTP头信息是否正确
- 查看请求数据是否带上
- 查看请求是否成功，分析HTTP状态码
- 查看回包格式和内容是否正确

而其他功能，或许对于性能优化的时候会使用更多，先不多介绍。
这里面有一篇文章写得挺详细的，可以参考[《Chrome开发者工具详解(2)：Network面板》](http://web.jobbole.com/89106/)

## Fiddler
Fiddler是一个HTTP的调试代理，以代理服务器的方式，监听系统的Http网络数据流动。Fiddler可以也可以让你检查所有的HTTP通讯，设置断点，以及Fiddle所有的“进出”的数据（可用于抓包、修改请求等）。

通常来说，我们会使用它来解决一些问题：
1. 查看请求详情（类似上方的浏览器Network面板）。
2. 请求失败时，抓包给后台查看问题。
3. 模拟请求。
4. 拦截请求，并更改请求内容。
5. 移动端的请求查看和抓包。

具体的使用方式，可以参考[Fiddler教程](http://www.cnblogs.com/FounderBox/p/4653588.html?utm_source=tuicool)。

# 其他深入学习
就目前来说，大致的入门内容大概到这，还有很多内容或许分散在本骚年的各个系列博客中。这里放一些总结和整理相关的吧。

## 前端阶段性总结      
> [《前端阶段性总结之「理解HTTP协议」》](https://godbasin.github.io/2017/05/20/front-end-notes-7-init-http/) 
> [《前端阶段性总结之「网络协议基础」》](https://godbasin.github.io/2017/05/19/front-end-notes-6-network-protocol/)     
> [《前端阶段性总结之「自动化和构建工具」》](https://godbasin.github.io/2017/05/14/front-end-notes-5-build-tool/)     
> [《前端阶段性总结之「框架相关」》](https://godbasin.github.io/2017/05/12/front-end-notes-4-frame/)      
> [《前端阶段性总结之「javascript新特性」》](https://godbasin.github.io/2017/05/07/front-end-notes-3-javascript-keep-moving/)      
> [《前端阶段性总结之「深入javascript」》](https://godbasin.github.io/2017/05/06/front-end-notes-2-deep-into-javascript/)      
> [《前端阶段性总结之「掌握javascript」》](https://godbasin.github.io/2017/05/01/front-end-notes-1-init-javascript/)      
> [《前端阶段性总结之「总览整理」》](https://godbasin.github.io/2017/04/30/front-end-notes-0-about/)      

## 前端杂谈    
> [《前端模板引擎》](https://godbasin.github.io/2017/10/21/template-engine/)   
> [《对话抽象》](https://godbasin.github.io/2017/10/14/dialogue-abstraction/)   
> [《前端思维转变--从事件驱动到数据驱动》](https://godbasin.github.io/2017/09/29/data-driven-or-event-driven/)      
还有《纯前端的进军》系列，更多可以查看github上博客：[godbasin/godbasin.github.io](https://github.com/godbasin/godbasin.github.io)。

# 结束语
---
这一节主要讲了 HTTP 请求相关，包括 Ajax（XMLHttpRequest）、HTTP 协议/跨域/缓存等，以及常用的前后台交互（联调）方式的介绍。这里面都是书面的介绍，我们需要更多的其实是实践，动手去写吧。