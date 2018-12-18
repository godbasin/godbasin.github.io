---
title: React使用笔记7--关于Refs和React表单
date: 2016-08-27 09:10:49
categories: react沙拉
tags: 笔记
---
最近在学习使用React作为前端的框架，《React使用笔记》系列用于记录过程中的一些使用和解决方法。
本文简单介绍Refs相关，以及记录React表单相关的绑定和focus的过程。
<!--more-->
## React Refs
-----
### Refs
为了获取一个到React组件的引用，你可以使用this来得到当前的React组件，或者你可以使用refs来指向一个你拥有的组件。
- React支持一种非常特殊的属性，你可以用来绑定到render()输出的任何组件上去。
- Ref属性允许你引用render()返回的相应的支撑实例（ backing instance ）。
这样就可以确保在任何时间总是拿到正确的实例。
- 做法很简单：
  - 1.绑定一个ref属性到render返回的东西上面去，例如：

``` jsx
<input ref="myInput" />
```

  - 2、在其它代码中（典型地事件处理代码），通过this.refs获取支撑实例（ backing instance ），就像这样：

``` jsx
this.refs.myInput
```

### findDOMNode()
为了和浏览器交互，你将需要对DOM节点的引用。React提供了React.findDOMNode(component)函数，你可以调用这个函数来获取该组件的DOM结点。
- 注意：React v0.14以上版本中，需使用ReactDOM.findDOMNode(component)，且需引入react-don。

``` javascript
import ReactDOM from 'react-dom'; //react-dom
```

- findDOMNode()仅在挂载的组件上有效（也就是说，组件已经被放进了DOM中）。如果你尝试在一个未被挂载的组件上调用这个函数（例如在创建组件的render()函数中调用findDOMNode()），将会抛出异常。
- 从 render() 中返回的内容并不是实际渲染出来的子组件实例。从 render() 返回的仅仅是子组件层级树实例在特定时间的一个描述。可参考[组件的生命周期](/2016/08/13/react-notes-3-props-state-lifecycle/)。

### Ref优点
Refs是一种给指定的子组件实例发送消息的很好的方式，从某种程度上来看，通过props和state来做这件事倒显得不太方便。
- 可以在组件类里面定义任何公共的方法（比如在输入之前的重置方法），然后通过refs来调用这些公共的方法（比如this.refs.myTypeahead.reset() ）。
- 管理DOM几乎总是需要冲出“本地”组件的限制，比如通过this.refs.myInput.getDOMNode()获取`<input />`元素的底层DOM节点。Refs是做这件事唯一可靠的方式。
- Refs是被自动管理的！如果某个子级实例被销毁了，它的ref也会自动销毁。不用考虑内存问题（除非你自己做一些疯狂的操作，保存了什么引用）。

### 参考
[《关于Refs的更多内容》](http://reactjs.cn/react/docs/more-about-refs.html)

### Flux数据流
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/bg2016011503.png)
- store在dispatcher中注册，并提供相应的回调。回调会接收action并把它当成自己的一个参数。
- 通过调用action来响应用户交互。
- 当action被触发，回调函数会使用switch语句来解析action中的type参数，并在合适的type下提供钩子来执行内部方法。
- action通过dispatcher来响应store中的state更新。
- store更新完成之后，会向应用中广播一个change事件，views可以选择响应事件来重新获取新的数据并更新。

### 参考
[《Flux 架构入门教程》](http://www.ruanyifeng.com/blog/2016/01/flux.html)
[《谈一谈我对 React Flux 架构的理解》](http://www.cocoachina.com/webapp/20150928/13600.html)

## 使用Ref属性对表单进行focus
-----
这里简述使用Ref属性对表单进行focus的过程。

### Index组件中
在index的修改资料部分，添加表单，这里使用了react-bootstrap。
- 给两个input分别加上ref属性

``` jsx
<FormControl type="email" placeholder="Email" ref="email" required />
<FormControl type="text" placeholder="Name" ref="name" required />
```

- 添加两个按钮，绑定点击对input进行focus

``` jsx
<Button onClick={this.props.focusInput.bind(null, 'email')}>focus邮件</Button>
<Button onClick={this.props.focusName}>focus名字</Button>
```

### IndexController组件中
- 添加子组件ref属性
  - 在父组件中获取子组件的refs，可通过给子组件添加ref属性来获取子组件，再获取其refs
  - 该方法可以用在父组件和子组件之间的通信，父组件获取子组件的数据

``` jsx
<Index ref="index" />
```

- 添加事件focusInpu和focusName

``` jsx
focusInput: function(name){
	ReactDOM.findDOMNode(this.refs.index.refs[name]).focus(); 
},
focusName: function(name){
	ReactDOM.findDOMNode(this.refs.index.refs.name).focus(); 		
},
```

这里我们可以看到，refs的获取有两种方法，可以通过refs[name]和refs.name来获取。第一种方法可以帮助我们创建通用的获取方法。
- 通过props传递方法给子组件
  - 该方法可用于父组件和子组件之间的通信，子组件获取父组件的数据

``` jsx
<Index ref="index" focusInput={this.focusInput} focusName={this.focusName} />
```

此时我们完成了使用refs来控制组件元素的过程。下面将简单讲述一下React中表单组件的onChange事件。

## React表单的onChange
-----
诸如`<input>`、`<textarea>`、`<option>`这样的表单组件不同于其他组件，因为他们可以通过用户交互发生变化。这些组件提供的界面使响应用户交互的表单数据处理更加容易。

### 表单事件
React中表单事件分别有：
- onChange: 执行并通过浏览器做出以下响应
  - `<input>`或`<textarea>`的value发生变化时
  - `<input>`的checked状态改变时
  - `<option>`的selected状态改变时
- onInput: 只作用于`<input>`或`<textarea>`的value发生变化时
- onSubmit: 表单提交时执行

### 添加onChange事件并输出
- Index组件中，添加value值，以及绑定onChange事件。（由父组件通过props传递）

``` javascript
<FormControl type="email" ref="email" value={this.props.email} onChange={this.props.changeInput.bind(null, 'email')} required />
<FormControl type="text" ref="name" value={this.props.name} onChange={this.props.changeInput.bind(null, 'name')} required />
```

- IndexController组件中，添加email和name作为状态state，以及事件changeInput

``` javascript
getInitialState: function() {
	return {
		name: '',
		email: '',
	};
},
changeInput: function(name, event) { //通过event获取当前事件，总是最后一个参数传入
	switch(name){
		case 'name':
			//通过event.target获取当前元素，再获取value
			this.setState({name: event.target.value}); 
			break;
		case 'email':
			this.setState({email: event.target.value});
			break;
	}		
},
```

- IndexController组件中，通过props传递事件以及值给Index组件

``` javascript
<Index ref="index" asidemenus={this.props.asidemenus} loading={this.state.loading} changeInput={this.changeInput} focusInput={this.focusInput} focusName={this.focusName} email={this.state.email} name={this.state.name} />
```

- 在flux中通过单向数据流处理
上一节我们[将react通过flux进行了改造](/2016/08/21/react-notes-6-use-flux/)，现在我们需要将以上的方法调整来符合flux的单向数据流。具体方法步骤就不介绍了，大家可以到代码中查看。

## 结束语
-----
不像Angular的双向绑定，React是单向的数据绑定，故在获取表单值的时候需要另外进行处理呢。
React中组件的props和refs属性在父子组件间的通信上有很大的作用哦。
[此处查看项目代码（仅包含app部分）](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/react-notes/7-form-and-ref)
[此处查看页面效果](http://react-notes.godbasin.com/7-form-and-ref/index.html)