---
title: VSCode 源码解读：IPC通信机制
date: 2020-08-15 16:51:30
categories: 前端解决方案
tags: 逻辑实现
---

最近在研究前端大型项目中要怎么管理模块间通信，本文记录研究 VSCode 中通信机制的过程，主要包括 IPC 部分吧。

<!--more-->

# Electron 的 通信机制
我们知道 Electron 是基于 Chromium + Node.js 的架构。同样基于 Chromium + Node.js 的，还有 NW.js，我们先来看看它们之间有什么不一样吧。


# Electron 与 NW.js
说到 Node.js 的桌面应用，基本上大家都会知道 Electron 和 NW.js。例如 VsCode 就是基于 Electron 写的，而小程序开发工具则是基于 NW.js 来开发的。

我们知道，Node.js 和 Chromium 的运行环境不一样，它们的 JavaScript 上下文都有一些特有的全局对象和函数。在 Node.js 中包括 module、process、require等，在 Chromium 中会有 window、 documnet等。

那么，Electron 和 NW.js 都分别是怎样管理 Node.js 和 Chromium 的呢？

### NW.js 内部架构
NW.js 是最早的 Node.js 桌面应用框架，架构如图1。

![图1](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/electron_ipc_1.jpg)

在 NW.js 中，将 Node.js 和 Chromium 整合在一起使用，其中做了几件事情，我们来分别看下。

1. Node.js 和 Chromium 都使用 V8 来处理执行的 JavaScript，因此在 NW.js 中它们使用相同的 V8 实例。

2. Node.js 和 Chromium 都使用事件循环编程模式，但它们用不同的软件库（Node.js 使用 libuv，Chromium 使用 MessageLoop/Message-Pump）。NW.js 通过使 Chromium 使用构建在 libuv 之上的定制版本的 MessagePump 来集成 Node.js 和 Chromium 的事件循环（如图2）。

![图2](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/electron_ipc_3.jpg)

3. 整合 Node.js 的上下文到 Chromium 中，使 Node.js 可用（如图3）。

![图3](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/electron_ipc_2.jpg)

因此，虽然 NW.js 整合了 Node.js 和 Chromium，但它更接近一个前端的应用开发方式（如图4），它的入口是 index.html。

![图4](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/electron_ipc_0.jpg)

### Electron 内部架构
Electron 强调 Chromium 源代码和应用程序进行分离，因此并没有将 Node.js 和 Chromium 整合在一起。

在 Electron 中，分为主进程(main process)和渲染器进程(renderer processes)：
- 主进程：一个 Electron 应用中，有且只有一个主进程（package.json 的 main 脚本）
- 渲染进程：Electron 里的每个页面都有它自己的进程，叫作渲染进程。由于 Electron 使用了 Chromium 来展示 web 页面，所以 Chromium 的多进程架构也被使用到

那么，不在一个进程当然涉及跨进程通信。于是，在 Electron 中，可以通过以下方式来进行主进程和渲染器进程的通信：
1. 利用`ipcMain`和`ipcRenderer`模块进行 IPC 方式通信，它们是处理应用程序后端（`ipcMain`）和前端应用窗口（`ipcRenderer`）之间的进程间通信的事件触发。
2. 利用`remote`模块进行 RPC 方式通信。

> `remote`模块返回的每个对象（包括函数），表示主进程中的一个对象（称为远程对象或远程函数）。当调用远程对象的方法时，调用远程函数、或者使用远程构造函数 (函数) 创建新对象时，实际上是在发送同步进程消息。

如图5，Electron 中从应用程序的后端部分到前端部分的任何状态共享（反之亦然），均通过`ipcMain`和`ipcRenderer`模块进行。这样，主进程和渲染器进程的 JavaScript 上下文将保持独立，但是可以在进程之间以显式方式传输数据。

![图5](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/electron_ipc_4.jpg)


# VSCode 的通信机制
VSCode 基于 Electron 进行开发的，那么我们来看看 VSCode 里的相关设计吧。

## VSCode 多进程架构
VSCode 采用多进程架构，VSCode 启动后主要有下面的几个进程：
- 主进程
- 渲染进程，多个，包括 Activitybar、Sidebar、Panel、Editor 等等
- 插件宿主进程
- Debug 进程
- Search 进程

这些进程间的关系如图6：

![图6](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/electron_ipc_5.png)

而在 VSCode 中，这些进程的通信方式同样包括 IPC 和 RPC 两种，如图7：

![图7](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/electron_ipc_6.jpg)

## IPC 通信
我们能看到，主进程和渲染进程的通信基础还是 Electron 的`webContents.send`、`ipcRender.send`、`ipcMain.on`。

我们来看看 VSCode 中具体的 IPC 通信机制设计，包括：协议、频道、连接等。

### 协议
IPC 通信中，协议是最基础的。就像我们人和人之间的交流，需要使用约定的方式（语言、手语），在 IPC 中协议可看做是约定。

作为通信能力，最基本的协议范围包括发送和接受消息：

``` js
export interface IMessagePassingProtocol {
	send(buffer: VSBuffer): void;
	onMessage: Event<VSBuffer>;
}
```

至于具体协议内容，可能包括连接、断开、事件等等：

``` js
export class Protocol implements IMessagePassingProtocol {
	constructor(private sender: Sender, readonly onMessage: Event<VSBuffer>) { }
	// 发送消息
	send(message: VSBuffer): void {
		try {
			this.sender.send('vscode:message', message.buffer);
		} catch (e) {
			// systems are going down
		}
	}
	// 断开连接
	dispose(): void {
		this.sender.send('vscode:disconnect', null);
	}
}
```

我们能看到，IPC 的通信也使用了 VSCode 中的`Event`/`Emitter`事件机制，关于事件的更多可以参考[《VSCode源码解读：事件系统设计》](https://godbasin.github.io/front-end-playground/front-end-basic/deep-learning/vscode-event.html)。

IPC 实际上就是发送和接收信息的能力，而要能准确地进行通信，客户端和服务端需要在同一个频道上。

### 频道
作为一个频道而言，它会有两个功能，一个是点播`call`，一个是收听，即`listen`。

``` js
/**
 * IChannel是对命令集合的抽象
 * call 总是返回一个至多带有单个返回值的 Promise
 */
export interface IChannel {
	call<T>(command: string, arg?: any, cancellationToken?: CancellationToken): Promise<T>;
	listen<T>(event: string, arg?: any): Event<T>;
}
```

### 客户端与服务端
一般来说，客户端和服务端的区分主要是：发起连接的一端为客户端，被连接的一端为服务端。在 VSCode 中，主进程是服务端，提供各种频道和服务供订阅；渲染进程是客户端，收听服务端提供的各种频道/服务，也可以给服务端发送一些消息（接入、订阅/收听、离开等）。

不管是客户端和服务端，它们都会需要发送和接收消息的能力，才能进行正常的通信。

在 VSCode 中，客户端包括`ChannelClient`和`IPCClient`，`ChannelClient`只处理最基础的频道相关的功能，包括：
1. 获得频道`getChannel`。
2. 发送频道请求`sendRequest`。
3. 接收请求结果，并处理`onResponse/onBuffer`。

``` js
// 客户端
export class ChannelClient implements IChannelClient, IDisposable {
	getChannel<T extends IChannel>(channelName: string): T {
		const that = this;
		return {
			call(command: string, arg?: any, cancellationToken?: CancellationToken) {
				return that.requestPromise(channelName, command, arg, cancellationToken);
			},
			listen(event: string, arg: any) {
				return that.requestEvent(channelName, event, arg);
			}
		} as T;
	}
	private requestPromise(channelName: string, name: string, arg?: any, cancellationToken = CancellationToken.None): Promise<any> {}
	private requestEvent(channelName: string, name: string, arg?: any): Event<any> {}
	private sendRequest(request: IRawRequest): void {}
	private send(header: any, body: any = undefined): void {}
	private sendBuffer(message: VSBuffer): void {}
	private onBuffer(message: VSBuffer): void {}
	private onResponse(response: IRawResponse): void {}
	private whenInitialized(): Promise<void> {}
	dispose(): void {}
}
```

同样的，服务端包括`ChannelServer`和`IPCServer`，`ChannelServer`也只处理与频道直接相关的功能，包括：
1. 注册频道`registerChannel`。
2. 监听客户端消息`onRawMessage/onPromise/onEventListen`。
3. 处理客户端消息并返回请求结果`sendResponse`。

``` js
// 服务端
export class ChannelServer<TContext = string> implements IChannelServer<TContext>, IDisposable {
	registerChannel(channelName: string, channel: IServerChannel<TContext>): void {
		this.channels.set(channelName, channel);
	}
	private sendResponse(response: IRawResponse): void {}
	private send(header: any, body: any = undefined): void {}
	private sendBuffer(message: VSBuffer): void {}
	private onRawMessage(message: VSBuffer): void {}
	private onPromise(request: IRawPromiseRequest): void {}
	private onEventListen(request: IRawEventListenRequest): void {}
	private disposeActiveRequest(request: IRawRequest): void {}
	private collectPendingRequest(request: IRawPromiseRequest | IRawEventListenRequest): void {}
	public dispose(): void {}
}
```

我们能看到，作为频道的直接连接对象，`ChannelClient`和`ChannelServer`的发送和接收基本上是一一对应的，像`sendRequest`和`sendResponse`等等。但`ChannelClient`只能发送请求，而`ChannelServer`只能响应请求，在阅读完整篇文章后，可以思考一下：如果我们想要实现双向通信的话，可以怎么做呢？

我们还发现，对消息的发送和接受，`ChannelClient`和`ChannelServer`会进行序列化(`serialize`)和反序列化(`deserialize`)：

``` js
// 此处篇幅关系，以 deserialize 举例：
function deserialize(reader: IReader): any {
	const type = reader.read(1).readUInt8(0);
	switch (type) {
		case DataType.Undefined: return undefined;
		case DataType.String: return reader.read(readSizeBuffer(reader)).toString();
		case DataType.Buffer: return reader.read(readSizeBuffer(reader)).buffer;
		case DataType.VSBuffer: return reader.read(readSizeBuffer(reader));
		case DataType.Array: {
			const length = readSizeBuffer(reader);
			const result: any[] = [];

			for (let i = 0; i < length; i++) {
				result.push(deserialize(reader));
			}

			return result;
		}
		case DataType.Object: return JSON.parse(reader.read(readSizeBuffer(reader)).toString());
	}
}
```

那么，`IPCClient`和`IPCServer`又起到什么作用呢？

### 连接
现在有了频道直接相关的客户端部分`ChannelClient`和服务端部分`ChannelServer`，但是它们之间需要连接起来才能进行通信。一个连接(`Connection`)由`ChannelClient`和`ChannelServer`组成。

``` js
interface Connection<TContext> extends Client<TContext> {
	readonly channelServer: ChannelServer<TContext>; // 服务端
	readonly channelClient: ChannelClient; // 客户端
}
```

而连接的建立，则由`IPCServer`和`IPCClient`负责。其中：
- `IPCClient`基于`ChannelClient`，负责简单的客户端到服务端一对一连接
- `IPCServer`基于`channelServer`，负责服务端到客户端的连接，由于一个服务端可提供多个服务，因此会有多个连接

``` js
// 客户端
export class IPCClient<TContext = string> implements IChannelClient, IChannelServer<TContext>, IDisposable {
	private channelClient: ChannelClient;
	private channelServer: ChannelServer<TContext>;
	getChannel<T extends IChannel>(channelName: string): T {
		return this.channelClient.getChannel(channelName) as T;
	}
	registerChannel(channelName: string, channel: IServerChannel<TContext>): void {
		this.channelServer.registerChannel(channelName, channel);
	}
}

// 由于服务端有多个服务，因此可能存在多个连接
export class IPCServer<TContext = string> implements IChannelServer<TContext>, IRoutingChannelClient<TContext>, IConnectionHub<TContext>, IDisposable {
	private channels = new Map<string, IServerChannel<TContext>>();
	private _connections = new Set<Connection<TContext>>();
	// 获取连接信息
	get connections(): Connection<TContext>[] {}
	/**
	 * 从远程客户端获取频道。
	 * 通过路由器后，可以指定它要呼叫和监听/从哪个客户端。
	 * 否则，当在没有路由器的情况下进行呼叫时，将选择一个随机客户端，而在没有路由器的情况下进行侦听时，将监听每个客户端。
	 */
	getChannel<T extends IChannel>(channelName: string, router: IClientRouter<TContext>): T;
	getChannel<T extends IChannel>(channelName: string, clientFilter: (client: Client<TContext>) => boolean): T;
	getChannel<T extends IChannel>(channelName: string, routerOrClientFilter: IClientRouter<TContext> | ((client: Client<TContext>) => boolean)): T {}
	// 注册频道
	registerChannel(channelName: string, channel: IServerChannel<TContext>): void {
		this.channels.set(channelName, channel);
		// 添加到连接中
		this._connections.forEach(connection => {
			connection.channelServer.registerChannel(channelName, channel);
		});
	}
}
```

前面也说过，客户端可理解为渲染进程，服务端可理解为主进程。

而连接的详细建立过程，可以参考[《vscode-通信机制设计解读(Electron)》](https://juejin.im/post/6844904050052300814)一文。这里借用里面的一张图：

![图8](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/electron_ipc_7.jpg)

# 参考
- [vscode 定制开发 —— Workbench 源码解读及实战前言](https://zhaomenghuan.js.org/blog/vscode-workbench-source-code-interpretation.html)
- [vscode 定制开发 —— 基础准备](https://zhaomenghuan.js.org/blog/vscode-custom-development-basic-preparation.html)
- [【译】探索NW.js和Electron的内部](https://livebook.manning.com/book/cross-platform-desktop-applications/chapter-6/59)
- [vscode-通信机制设计解读(Electron)](https://juejin.im/post/6844904050052300814)
- [你不知道的 Electron (一)：神奇的 remote 模块](https://imweb.io/topic/5b3b72ab4d378e703a4f4435)


# 结束语
IPC 和 RPC 通信是由于 Electron 的跨进程通信出现的。那么，我们还可以思考下，在一般的前端开发场景下，除了跨进程以外是否还有其他场景可以参考呢？

至于 RPC 的部分，由于目前也没有强业务相关，有空我们下次再约。
