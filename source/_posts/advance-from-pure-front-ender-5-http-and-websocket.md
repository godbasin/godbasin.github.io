---
title: 纯前端的进军5--HTTP与Websocket
date: 2017-12-02 10:18:37
categories: 非前端钙片
tags: 分享
---
《纯前端的进军》系列主要作为曾经的纯前端，对后台和底层的一些弥补，涉及进程、网络通信，以及对node.js和相关框架的学习。本节紧接着网络通信和TCP/IP，介绍一下HTTP和Websocket。
<!--more-->

## 关于HTTP
---
### HTTP请求
很多时候，尤其面试的时候我们会遇到这样的问题：打开浏览器，从输入地址按回车后发生的一系列过程是怎样的。

通常来说，一个完整的HTTP请求过程是这样的：
- 域名解析（此处涉及DNS的寻址过程）
- 发起TCP的3次握手
- 建立TCP连接后发起http请求
- 服务器响应http请求，浏览器得到html代码
- 浏览器解析html代码，并请求html代码中的资源（如js、css、图片等，此处可能涉及HTTP缓存）
- 浏览器对页面进行渲染呈现给用户（此处涉及浏览器的渲染原理）

### 无连接的HTTP
**无连接**

无连接的含义是限制每次连接只处理一个请求。服务器处理完客户的请求，并收到客户的应答后，即断开连接。
采用这种方式可以节省传输时间。

**Keep-Alive**

随着时间的推移，网页变得越来越复杂，里面可能嵌入了很多图片，这时候每次访问图片都需要建立一次TCP连接就显得很低效。后来，Keep-Alive被提出用来解决这效率低的问题。

Keep-Alive功能使客户端到服务器端的连接持续有效，当出现对服务器的后继请求时，Keep-Alive功能避免了建立或者重新建立连接。

### 长连接的HTTP
实现长连接有几个方式：ajax轮询、长轮询、websocket等。

**1. 轮询**

客户端定时向服务器发送Ajax请求，服务器接到请求后马上返回响应信息并关闭连接。 

优点：后端程序编写比较容易。 
缺点：请求中有大半是无用，浪费带宽和服务器资源。 
实例：适于小型应用。


**2. 长轮询**

客户端向服务器发送Ajax请求，服务器接到请求后hold住连接，直到有新消息才返回响应信息并关闭连接，客户端处理完响应信息后再向服务器发送新的请求。 

优点：在无消息的情况下不会频繁的请求，耗费资源小。 
缺点：服务器hold连接会消耗资源，返回数据顺序无保证，难于管理维护。 
实例：WebQQ、Hi网页版、Facebook IM。


**3. 长连接**

在页面里嵌入一个隐蔵iframe，将这个隐蔵iframe的src属性设为对一个长连接的请求或是采用xhr请求，服务器端就能源源不断地往客户端输入数据。 

优点：消息即时到达，不发无用请求；管理起来也相对方便。 
缺点：服务器维护一个长连接会增加开销。 
实例：Gmail聊天


**4. Flash Socket**

在页面中内嵌入一个使用了Socket类的Flash程序。JavaScript通过调用此Flash程序提供的Socket接口与服务器端的Socket接口进行通信，JavaScript在收到服务器端传送的信息后控制页面的显示。 

优点：实现真正的即时通信，而不是伪即时。 
缺点：客户端必须安装Flash插件；非HTTP协议，无法自动穿越防火墙。 
实例：网络互动游戏。

以上一些是基于HTTP协议的长连接实现方案，而下面讲到的Websocket则是基于HTTP协议上的另外一种通信协议。

### 参考
- [《Web通信之长连接、长轮询（long polling）》](http://www.cnblogs.com/hoojo/p/longPolling_comet_jquery_iframe_ajax.html)
- [《前端阶段性总结之「理解HTTP协议」》](https://godbasin.github.io/2017/05/20/front-end-notes-7-init-http/)

## Websocket
---

### 什么是Websocket
WebSocket是HTML5下一种新的协议。它实现了浏览器与服务器全双工通信，能更好的节省服务器资源和带宽并达到实时通讯的目的。

Websocket为持久化协议，基于HTTP协议（借用HTTP协议完成一部分握手）。

WebSocket是一种双向通信协议。在建立连接后，WebSocket服务器端和客户端都能主动向对方发送或接收数据，就像Socket一样。它与HTTP一样通过已建立的TCP连接来传输数据。

### Websocket与HTTP
相比HTTP长连接，WebSocket有以下特点：

1. 是真正的全双工方式，建立连接后客户端与服务器端是完全平等的，可以互相主动请求。

HTTP长连接基于HTTP，是传统的客户端对服务器发起请求的模式。
HTTP的生命周期通过Request来界定，也就是一个Request一个Response，且response也是被动的，不能主动发起。

2. HTTP长连接中，每次数据交换除了真正的数据部分外，服务器和客户端还要大量交换HTTP header，信息交换效率很低。

Websocket协议通过第一个request建立了TCP连接之后，之后交换的数据都不需要发送HTTP header就能交换数据，这显然和原有的HTTP协议有区别。所以它需要对服务器和客户端都进行升级才能实现（主流浏览器都已支持HTML5）。
还有multiplexing、不同的URL可以复用同一个WebSocket连接等功能。这些都是HTTP长连接不能做到的。

### Websocket特点
Websocket的其他特点包括：
1. 建立在TCP协议之上，服务器端的实现比较容易。
2. 与HTTP协议有着良好的兼容性。默认端口也是80和443，并且握手阶段采用HTTP协议，因此握手时不容易屏蔽，能通过各种HTTP代理服务器。
3. 数据格式比较轻量，性能开销小，通信高效。
4. 可以发送文本，也可以发送二进制数据。
5. 没有同源限制，客户端可以与任意服务器通信。
6. 协议标识符是ws（如果加密，则为wss），服务器网址就是URL。

### 使用Websocket
- WebSocket构造函数
WebSocket对象作为一个构造函数，用于新建WebSocket实例。

``` js
var ws = new WebSocket('ws://localhost:8080');
```
- `ws.readyState`
readyState属性返回实例对象的当前状态，共有四种。
  - CONNECTING：值为0，表示正在连接。
  - OPEN：值为1，表示连接成功，可以通信了。
  - CLOSING：值为2，表示连接正在关闭。
  - CLOSED：值为3，表示连接已经关闭，或者打开连接失败。

- `onopen`属性：用于指定连接成功后的回调函数
- `onclose`属性：用于指定连接关闭后的回调函数
- `onmessage`属性：用于指定收到服务器数据后的回调函数
- `send()`方法：用于向服务器发送数据
- `bufferedAmount`属性：表示还有多少字节的二进制数据没有发送出去，它可以用来判断发送是否结束
- `onerror`属性：用于指定报错时的回调函数

更多的可以参考[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)。

### 参考
- [WebSocket原理说明](https://www.qcloud.com/document/product/214/4150?fromSource=gwzcw.93403.93403.93403)
- [知乎--WebSocket 是什么原理？为什么可以实现持久连接？](https://www.zhihu.com/question/20215561)
- [WebSocket 教程](http://www.ruanyifeng.com/blog/2017/05/websocket.html)

## 结束语
---
本节主要介绍了HTTP通信和Websocket协议相关，关于HTTP协议的内容和知识点还有很多，大家有兴趣可以去补充一下。