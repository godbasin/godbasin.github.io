---
title: 前端阶段性总结之「理解HTTP协议」
date: 2017-05-20 08:09:21
categories: 前端满汉全席
tags: 分享
---
该篇主要整理初认识http时的一些概念和内容分享，以及HTTP缓存、同源和跨域。
<!--more-->

## HTTP协议
---
### 基本概念
协议是指计算机通信网络中两台计算机之间进行通信所必须共同遵守的规定或规则，超文本传输协议(HTTP)是一种通信协议，它允许将超文本标记语言(HTML)文档从Web服务器传送到客户端的浏览器。

**一个完整的HTTP请求过程**：
- 域名解析（此处涉及DNS的寻址过程）
- 发起TCP的3次握手
- 建立TCP连接后发起http请求
- 服务器响应http请求，浏览器得到html代码
- 浏览器解析html代码，并请求html代码中的资源（如js、css、图片等，此处可能涉及HTTP缓存）
- 浏览器对页面进行渲染呈现给用户（此处涉及浏览器的渲染原理）

### URL详解
 URL(Uniform Resource Locator) 地址用于描述一个网络上的资源,  基本格式如下：

``` js
schema://host[:port#]/path/.../[?query-string][#anchor]
```

包括：
- scheme: 指定低层使用的协议(例如：http, https, ftp)
- host: HTTP服务器的IP地址或者域名
- port#: HTTP服务器的默认端口是80，这种情况下端口号可以省略。如果使用了别的端口，必须指明，例如 http://www.cnblogs.com:8080/
- path: 访问资源的路径
- query-string: 发送给http服务器的数据
- anchor: 锚

### HTTP消息的结构
- **Request请求**
  - Request line
    - 包括：请求方法、请求的资源、HTTP协议的版本号
  - Request header
    - 包括：Cache头域、Client头域、Cookie/Login头域、Entity头域、Miscellaneous头域、Transport头域等
  - 空行
  - Request body

- **Response响应**
  - Response line
    - 包括：HTTP协议的版本号、状态码、消息
  - Response header
    - 包括：Cache头域、Cookie/Login头域、Entity头域、Miscellaneous头域、Transport头域、Location头域等
  - 空行
  - Response body

对于无论是Request还是Response的header头部，每个字段都需要去理解的，大家平时可多留意一下浏览器的请求。

### 状态码
HTTP/1.1中定义了5类状态码， 状态码由三位数字组成，第一个数字定义了响应的类别
- 1XX--提示信息：表示请求已被成功接收，继续处理
- 2XX--成功：表示请求已被成功接收，理解，接受
- 3XX--重定向：要完成请求必须进行更进一步的处理
- 4XX--客户端错误：请求有语法错误或请求无法实现
- 5XX--服务器端错误：服务器未能实现合法的请求

常见状态码：
200 OK
302 Found重定向/304 Not Modified缓存
400 Bad Request客户端请求与语法错误/403 Forbidden服务器拒绝提供服务/404 Not Found请求资源不存在
500 Internal Server Error服务器发生了不可预期的错误/503 Server Unavailable 服务器当前不能处理客户端的请求，一段时间后可能恢复正常

### 请求方法
常用方法：
- GET/POST/PUT/DELETE/OPTION
- 理解GET和POST的区别：包括是否有body、长度限制、是否可缓存等等

### 参考
- [《HTTP协议详解》](https://www.cnblogs.com/TankXiao/archive/2012/02/13/2342672.html)
- [《一次完整的HTTP事务是怎样一个过程？》](http://blog.csdn.net/yipiankongbai/article/details/25029183)

## HTTP的特性
---
HTTP是一个属于应用层的面向对象的协议，HTTP协议一共有五大特点：
1. 支持客户/服务器模式；
2. 简单快速；
3. 灵活；
4. 无连接；
5. 无状态。

### 无连接的HTTP
- **无连接**

无连接的含义是限制每次连接只处理一个请求。服务器处理完客户的请求，并收到客户的应答后，即断开连接。
采用这种方式可以节省传输时间。

- **Keep-Alive**

随着时间的推移，网页变得越来越复杂，里面可能嵌入了很多图片，这时候每次访问图片都需要建立一次TCP连接就显得很低效。后来，Keep-Alive被提出用来解决这效率低的问题。

Keep-Alive功能使客户端到服务器端的连接持续有效，当出现对服务器的后继请求时，Keep-Alive功能避免了建立或者重新建立连接。

- **长连接**

实现长连接有几个方式：ajax轮询、long pull、websocket等。
Websocket为持久化协议，基于HTTP协议（借用HTTP协议完成一部分握手）。

### 无状态的HTTP
- **无状态**

无状态是指协议对于事务处理没有记忆能力，服务器不知道客户端是什么状态。即我们给服务器发送HTTP请求之后，服务器根据请求，会给我们发送数据过来，但是，发送完，不会记录任何信息。

HTTP协议这种特性有优点也有缺点，优点在于解放了服务器，每一次请求“点到为止”不会造成不必要连接占用，缺点在于每次请求会传输大量重复的内容信息。

客户端与服务器进行动态交互的Web应用程序出现之后，HTTP无状态的特性严重阻碍了这些应用程序的实现，毕竟交互是需要承前启后的，简单的购物车程序也要知道用户到底在之前选择了什么商品。
于是，两种用于保持HTTP连接状态的技术就应运而生了，一个是Cookie，而另一个则是Session。

- **Cookie**

Cookie可以保持登录信息到用户下次与服务器的会话，换句话说，下次访问同一网站时，用户会发现不必输入用户名和密码就已经登录了（当然，不排除用户手工删除Cookie）。
而还有一些Cookie在用户退出会话的时候就被删除了，这样可以有效保护个人隐私。

- **Session**

与Cookie相对的一个解决方案是Session，它是通过服务器来保持状态的。

当客户端访问服务器时，服务器根据需求设置Session，将会话信息保存在服务器上，同时将标示Session的SessionId传递给客户端浏览器，浏览器将这个SessionId保存在内存中，我们称之为无过期时间的Cookie。浏览器关闭后，这个Cookie就会被清掉，它不会存在于用户的Cookie临时文件。
以后浏览器每次请求都会额外加上这个参数值，服务器会根据这个SessionId，就能取得客户端的数据信息。

- **Token**

其实Token更多是在用户授权中使用，例如移动App通常采用Token进行验证。
Token和Session有第一定的类似，但是服务器不保存状态，而是生成一个Token保存在客户端，这个Token是加密并确保完整性和不变性的，也就是修改后无效的，所以是安全的，可以保存在客户端。
同时Token支持跨域访问、无状态等，也能解决Cookie劫持(CSRF)的安全问题。

这里的一些只是也是本骚年搜集来的，不能保证准确性的，仅供参考哈。


## HTTP与浏览器缓存
---
### Web缓存
Web缓存存在于服务器和客户端之间。
Web缓存密切注视着服务器-客户端之间的通信，监控请求，并且把请求输出的内容（例如html页面、 图片和文件）另存一份；然后，如果下一个请求是相同的URL，则直接使用保存的副本，而不是再次请求源服务器。

在Web应用领域，Web缓存大致可以分为以下几种类型：
- 数据库数据缓存
- 服务器端缓存
  - 代理服务器缓存
  - CDN缓存
- 浏览器端缓存
- Web应用层缓存


### 浏览器缓存
当一个客户端请求web服务器, 请求的内容可以从以下几个地方获取：服务器、浏览器缓存中或缓存服务器中。这取决于服务器端输出的页面信息。

**页面文件有三种缓存状态**：
- 最新的：选择不缓存页面，每次请求时都从服务器获取最新的内容
- 未过期的：在给定的时间内缓存，如果用户刷新或页面过期则去服务器请求，否则将读取本地的缓存，这样可以提高浏览速度
- 过期的：也就是陈旧的页面，当请求这个页面时，必须进行重新获取

浏览器会在第一次请求完服务器后得到响应，我们可以在服务器中设置这些响应，从而达到在以后的请求中尽量减少甚至不从服务器获取资源的目的。
浏览器是依靠请求和响应中的的头信息来控制缓存的。

- **无法被浏览器缓存的请求**：
  - HTTP信息头中包含Cache-Control:no-cache，pragma:no-cache（HTTP1.0），或Cache-Control:max-age=0等告诉浏览器不用缓存的请求
  - 需要根据Cookie，认证信息等决定输入内容的动态请求是不能被缓存的
  - 经过HTTPS安全加密的请求（有人也经过测试发现，ie其实在头部加入Cache-Control：max-age信息，firefox在头部加入Cache-Control:Public之后，能够对HTTPS的资源进行缓存，参考《HTTPS的七个误解》）
  - POST请求无法被缓存
  - HTTP响应头中不包含Last-Modified/Etag，也不包含Cache-Control/Expires的请求无法被缓存

### HTTP头信息
- **Expires与Cache-Control**

Expires和Cache-Control就是服务端用来约定和客户端的有效时间的。规定如果max-age和Expires同时存在，前者优先级高于后者。
若符合，浏览器相应HTTP200(from cache)。

- **Last-Modified/If-Modified-Since**
- **ETag/If-None-Match**

而Last-Modified/If-Modified-Since就是上面说的当有效期过后，check服务端文件是否更新的第一种方式，要配合Cache-Control使用。
ETag值，该值在服务端和服务端代表该文件唯一的字符串对比（如果服务端该文件改变了，该值就会变）。
如果相同，则响应HTTP304，从缓存读数据；如果不相同文件更新了，HTTP200，返回数据，同时通过响应头更新last-Modified的值（以备下次对比）。

- **浏览器请求流程**

这里直接使用网上找来的描述很棒的图片。

第一次请求：

![image](http://o905ne85q.bkt.clouddn.com/015343_psx2_568818.png)

再次请求：

![image](http://o905ne85q.bkt.clouddn.com/015353_P04w_568818.png)

### 参考
- [《浅谈浏览器http的缓存机制》](http://www.cnblogs.com/vajoy/p/5341664.html)
- [《浏览器缓存机制浅析》](http://web.jobbole.com/82997/)
- [《浏览器 HTTP 协议缓存机制详解》](http://www.cnblogs.com/520yang/articles/4807408.html)

## HTTP与跨域
---
### 浏览器同源政策
同源政策的目的，是为了保证用户信息的安全，防止恶意的网站窃取数据。

所谓"同源"指的是"三个相同": 协议相同、域名相同、端口相同。

随着互联网的发展，"同源政策"越来越严格。目前，如果非同源，共有三种行为受到限制。
1. Cookie、LocalStorage 和 IndexDB 无法读取。
2.  DOM 无法获得。
3. AJAX 请求不能发送。

### 前端解决跨域问题
- document.domain + iframe(只有在主域相同的时候才能使用该方法)
- 动态创建script(JSONP)
  > JSONP包含两部分：回调函数和数据。
  > 回调函数是当响应到来时要放在当前页面被调用的函数。
  > 数据就是传入回调函数中的json数据，也就是回调函数的参数了。
- location.hash + iframe
  > 原理是利用location.hash来进行传值。
- window.name + iframe
  > window.name的美妙之处：name值在不同的页面（甚至不同域名）加载后依旧存在，并且可以支持非常长的name值（2MB）。
- postMessage（HTML5中的XMLHttpRequest Level 2中的API）
- CORS
- websockets
  > websockets是一种浏览器的API，它的目标是在一个单独的持久连接上提供全双工、双向通信。(同源策略对web sockets不适用)
  > websockets原理：在JS创建了web socket之后，会有一个HTTP请求发送到浏览器以发起连接。取得服务器响应后，建立的连接会使用HTTP升级从HTTP协议交换为websockt协议。

上面是从网上参考和整理的，当然还有服务端代理这样的方法了，毕竟服务端不受同源策略的约束。
大家可以参考[《前端解决跨域问题的8种方案（最新最全）》](http://www.cnblogs.com/JChen666/p/3399951.html)。

### CORS
CORS是一个W3C标准，全称是"跨域资源共享"（Cross-origin resource sharing）。
它允许浏览器向跨源服务器，发出XMLHttpRequest请求，从而克服了AJAX只能同源使用的限制。

实现CORS通信的关键是服务器。只要服务器实现了CORS接口，就可以跨源通信。

只要同时满足以下两大条件，就属于简单请求，不满足则属于非简单请求。
1. 请求方法是以下三种方法之一：HEAD/GET/POST。
2. HTTP的头信息不超出以下几种字段：Accept/Accept-Language/Content-Language/Last-Event-ID/Content-Type（只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain）。

- 简单请求

对于简单请求，浏览器直接发出CORS请求。具体来说，就是在头信息之中，增加一个Origin字段。
如果Origin指定的域名在许可范围内，服务器返回的响应，会多出几个头信息字段(Access-Control-**等等)。

- 非简单请求

非简单请求的CORS请求，会在正式通信之前，增加一次HTTP查询请求，称为"预检"请求（preflight）（请求方法是OPTIONS）。
浏览器先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些HTTP动词和头信息字段。只有得到肯定答复，浏览器才会发出正式的XMLHttpRequest请求，否则就报错。

### 参考
- [《前端解决跨域问题的8种方案（最新最全）》](http://www.cnblogs.com/JChen666/p/3399951.html)
- [《浏览器同源政策及其规避方法》](http://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html)
- [《跨域资源共享 CORS 详解》](http://www.ruanyifeng.com/blog/2016/04/cors.html)

### HTTPS
HTTPS其实是有两部分组成：HTTP + SSL / TLS，也就是在HTTP上又加了一层处理加密信息的模块。服务端和客户端的信息传输都会通过TLS进行加密，所以传输的数据都是加密后的数据。

HTTPS和HTTP协议相比提供了：
- 数据完整性：内容传输经过完整性校验
- 数据隐私性：内容经过对称加密，每个连接生成一个唯一的加密密钥
- 身份认证：第三方无法伪造服务端（客户端）身份

其中，数据完整性和隐私性由TLS Record Protocol保证，身份认证由TLS Handshaking Protocols实现。

HTTPS在传输数据之前需要客户端（浏览器）与服务端（网站）之间进行一次握手，在握手过程中将确立双方加密传输数据的密码信息。
TLS/SSL协议不仅仅是一套加密传输的协议，更是一件经过艺术家精心设计的艺术品，TLS/SSL中使用了非对称加密，对称加密以及HASH算法。

### HTTP2
要注意，以上的Keep-Alive主要是指TCP的连接，而HTTP依然是一个请求对应一个回应，当然在这个在HTTP2里面不再适用了。

HTTPS的出现，带来安全以及可靠之外，同时也大量的编码等增加了服务器的压力。HTTP2则针对资源的优化做了一些新的改变。

HTTP2特点：
- 二进制：http2是一个二进制协议
- 二进制格式：http2发送二进制帧
- 多路复用的流：每个单独的http2连接都可以包含多个并发的流，这些流中交错的包含着来自两端的帧
  > 流既可以被客户端/服务器端单方面的建立和使用，也可以被双方共享，或者被任意一边关闭。
  > 在流里面，每一帧发送的顺序非常关键。接收方会按照收到帧的顺序来进行处理。
- 优先级和依赖性：每个流都包含一个优先级，优先级被用来告诉对端哪个流更重要
- 头压缩：一致的请求可被压缩
- 重置：只终止当前传输的消息并重新发送一个新的，从而避免浪费带宽和中断已有的连接
- 服务器推送：“缓存推送”
  > 主要的思想是：当一个客户端请求资源X，而服务器知道它很可能也需要资源Z的情况下，服务器可以在客户端发送请求前，主动将资源Z推送给客户端。这个功能帮助客户端将Z放进缓存以备将来之需。

### 参考
- [《如何理解HTTP协议的 “无连接，无状态” 特点？》](http://blog.csdn.net/tennysonsky/article/details/44562435)
- [《HTTPS工作原理》](http://www.cnblogs.com/svan/p/5090201.html)
- [《https原理：证书传递、验证和数据加密、解密过程解析》](http://blog.csdn.net/clh604/article/details/22179907)
- [《http2 协议》](http://wiki.jikexueyuan.com/project/http-2-explained/protocol.html)

## 结束语
-----
这里面主要讲述HTTP协议相关的一些基本原理和概念，然后是浏览器缓存和同源机制。其实上面提到的每一个点，都是仍然需要深入理解的。HTTP相关的内容实在很多，最好的方式是结合实践，平时多关注和思考，来加深相关的理解吧。