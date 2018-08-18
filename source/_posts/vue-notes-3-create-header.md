---
title:  Vue使用笔记3--创建头部组件
date: 2016-09-10 04:31:34
categories: vue八宝粥
tags: 笔记
---
最近在学习使用Vue作为前端的框架，《Vue使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录Vue组件相关，以及创建头部组件的过程。
<!--more-->

实话说，在使用过angular以及react之后，vue给本骚年的感觉就是两者的优点结合在一起了呢。

## Vue组件
-----
### Vue实例
- 一个Vue实例其实正是一个MVVM模式中所描述的ViewModel
- 在实例化Vue时，需要传入一个选项对象，它可以包含数据、模板、挂载元素、方法、生命周期钩子等选项，[参考](http://cn.vuejs.org/api/)
- 可以扩展Vue构造器，从而用预定义选项创建可复用的组件构造器

### 实例生命周期
这里简单放个图吧，左侧的红色框框代表具体的生命周期钩子。
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/lifecycle.png)
[官方文档](http://cn.vuejs.org/api/#选项-生命周期钩子)里面有详细的生命周期钩子哦，大家有需要的话可以具体去研究一下。

### Vue组件
组件可以扩展HTML元素，封装可重用的代码。在较高层面上，组件是自定义元素，Vue.js的编译器为它添加特殊功能。
- 所有的Vue.js组件其实都是被扩展的Vue实例
- Vue 的模板是DOM模板，使用浏览器原生的解析器（React则是自己实现一个）
- Props属性
  - 组件实例的作用域是孤立的。可以使用props把数据传给子组件，也可以用v-bind绑定动态Props到父组件的数据
  - prop默认是单向绑定，使用.sync或.once绑定修饰符显式地强制双向或单次绑定
  - 组件可以为 props 指定验证要求（类似React的proptype吧）
- 动态组件
  - 多个组件可以使用同一个挂载点，动态地绑定到它的is特性，在它们之间切换
  - keep-alive可以把切换出去的组件保留在内存中，保留它的状态或避免重新渲染
  - 在切换组件时，切入组件在切入前可能需要进行一些异步操作。使用activate钩子控制组件切换时长
  - transition-mode特性用于指定两个动态组件之间如何过渡
  - 组件当它有name选项时，可以在它的模板内可以递归地调用自己

### 父子组件通信
- 使用父链（会使得父组件与子组件紧密地耦合）
  - 子组件可以用this.$parent访问它的父组件
  - 根实例的后代可以用this.$root访问它
  - 父组件有一个数组this.$children，包含它所有的子元素

- 自定义事件（Vue事件在冒泡过程中第一次触发回调之后自动停止冒泡，调用true取消）
  - 使用$on()监听事件
  - 使用$emit()在它上面触发事件
  - 使用$dispatch()派发事件，事件沿着父链冒泡
  - 使用$broadcast()广播事件，事件向下传导给所有的后代

- 子组件索引
  - 使用v-ref为子组件指定一个索引ID（类似于React的ref属性）

- 使用 Slot 分发内容
  - 使用特殊的<slot>元素作为原始内容的插槽（类似Angular的transclusion）
  - 父组件的内容将被抛弃，除非子组件模板包含 <slot>
  - 如果子组件模板只有一个没有特性的slot，父组件的整个内容将插到slot所在的地方并替换它
  - <slot>元素可以用一个特殊特性name配置如何分发内容

### 参考
[《Vue组件》](http://cn.vuejs.org/guide/components.html#使用-Slot-分发内容)

## 创建头部菜单
-----
该头部菜单与前面的使用笔记中一致。如图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/C902.tmp.png)
由于Vue中木有找到类似React-Bootstrap一样的库，故这里先直接用bootstrap的样式css文件。

### 添加头部组件
- 在components文件夹中添加Header.vue文件
- 添加模板

``` vue
<template>
<nav class="navbar navbar-default header">
  <div class="container-fluid">
    <div class="navbar-header">
      <a class="navbar-brand">Godbasin</a>
    </div>
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav">     	
        <li v-for="menu in menus" v-bind:class="current === menu.title ? 'active' : ''">
        	<a href="{{ menu.href }}">{{ menu.text }}<span v-show="menu.current" class="sr-only">(current)</span></a>
        </li>
      </ul>
      <ul class="nav navbar-nav navbar-right">
      	<li><a>{{ clock }}</a></li>
        <li class="dropdown">
          <a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">菜单 <span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li v-for="usermenu in usermenus"><a href="{{ usermenu.href }}">{{ usermenu.text }}</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>
</template>
```

- 添加逻辑

``` vue
<script>
export default {
  data () {
    return {
      menus: [{
        title: 'index', // title用于储存路由对应的路径
        href: 'index.html#/index', // href用于设定该菜单跳转路由
        text: '首页' // text用于储存该菜单显示名称
      }, {
        title: 'other',
        href: 'index.html#/other',
        text: '其他'
      }],
      usermenus: [{
        text: '退出', // text用于储存该菜单显示名称
        href: 'index.html#/login' // href用于设定该菜单跳转路由
      }],
      clock: '' // clock用于储存时间
    }
  },
  props: ['current'], // current用于获取当前的位置
  // 在created生命周期钩子上添加setInterval进行时钟的刷新，当然其他的生命周期钩子也可能适用
  created: function () {
    var that = this
    setInterval(function () {
      that.clockRender()
    }, 500)
  },
  // 在 `methods` 对象中定义方法
  methods: {
    clockRender: function () { // 刷新时钟
      var numberStandard = function (num) { // 格式化时间（小于10补上0）
        var _val = Number(num)
        var _num
        _num = (_val < 10) ? ('0' + _val) : ('' + _val)
        return _num
      }
      var _date = new Date() // 获取当前时间
      this.clock = _date.getFullYear() + '年' + (_date.getMonth() + 1) + '月' +
        _date.getDate() + '日' + ' ' + numberStandard(_date.getHours()) + ':' + numberStandard(_date.getMinutes()) +
        ':' + numberStandard(_date.getSeconds())
    }
  }
}
</script>
```
- 添加样式（此处省略）
  - 使用`<style>`添加全局样式
  - 可使用`<style scoped>`添加局部样式


### 添加属性Props
由于菜单的内容不变，我们可以将其写成Props属性。
``` jsx
propTypes: { //属性校验器
		menus: React.PropTypes.array, //表示menus属性必须是array，否则报错
		usermenus: React.PropTypes.array, //表示usermenus属性必须是array，否则报错
},
getDefaultProps: function() {
	return { //设置默认属性
		menus: [{
			title: 'index', //title用于储存路由对应的路径
			href: '/index', //href用于设定该菜单跳转路由
			text: '首页', //text用于储存该菜单显示名称
		}, {
			title: 'others',
			href: '/other',
			text: '其他',
		}],
		//usermenus用于储存侧边下拉菜单
		usermenus: [{
			click: function(){}, //click用于设置该菜单点击事件
			text: '退出', //text用于储存该菜单显示名称
		}],
	};
},
```

### 添加state状态
像时间这种每500毫秒刷新一次的，我们将其放在state中。
``` jsx
getInitialState: function() {
	return {clock: ''}; //设置初始state值
},
//定义clockRender事件，用于改变this.state.clock值
clockRender: function(){
	let numberStandard = function(num) {
		let _val = Number(num), _num;
		_num = (_val < 10) ? ('0' + _val) : ('' + _val);
		return _num;
	}, _date = new Date(),
		clock = _date.getFullYear() + '年' + (_date.getMonth() + 1) + '月' +
			_date.getDate() + '日' + ' ' + numberStandard(_date.getHours()) + ':' + numberStandard(_date.getMinutes()) +
			':' + numberStandard(_date.getSeconds());
	this.setState({clock: clock});
},
```
注意：state不应存储计算后的值，计算应该在render中进行，但由于比较长，本骚年也就这样将就用了。小伙伴们有更好的方法也可以提出来哦。

### setInterval时钟
在componentDidMount中进行setInterval时钟。componentDidMount属于react生命周期，在初始化渲染执行之后立刻调用一次，仅客户端有效。
render就是一个模板的作用，他只处理和展示相关的逻辑，如果有业务逻辑，应放在componentWillMount和componentDidMount中执行。
``` jsx
//进行setInterval时钟
componentDidMount: function(){
	let that = this;			
	this.interval = setInterval(function() {
		that.clockRender();
	}, 500);
},
//组件注销时需销毁定时器
componentWillUnmount: function(){
	clearInterval(this.interval);
},
```

### 设置render模板
在这里大家可以看到react-bootstrap的使用方法啦。当然每个组件都是已经在该文件中引入了的。
还有jsx的遍历方法也会在这里展示。
- 在index.jsx页面引入Header时添加属性active="index"，作为菜单选中样式的判断
``` jsx
render() {
	return (
		let active = this.props.active; //获取父组件传递的props
		<Navbar className="header" fluid>
			<Navbar.Header className="navbar-header">
				<Navbar.Brand>Godbasin</Navbar.Brand>
			</Navbar.Header>
			<Navbar.Collapse id="bs-example-navbar-collapse-1">
				<Nav navbar>     	
				{ //遍历头部菜单menus
					this.props.menus.map(function(menu, i) {
						//判断，若title等于active，则加载选中样式
						return (<li key={i} className={ menu.title == active ? "active" : ""}><a href={menu.href}>{ menu.text }<span className="sr-only">(current)</span></a></li>);
					})
				}
				</Nav>
				<Nav navbar pullRight>
					<li><a>{ this.state.clock }</a></li>
					<NavDropdown title="菜单" id="top-aside-menu">
						{ //遍历右侧下拉菜单usermenus
							this.props.usermenus.map(function(usermenu,i) {
								return (<MenuItem key={i}>{ usermenu.text }</MenuItem>);
							})
						}
					</NavDropdown>
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	)
}
```

### Index组件中添加Header
在components文件夹中打开Index.vue文件

``` vue
<template>
  <!--使用is绑定组件，current传入prop数据-->
  <div is="my-header" current="index"></div>
  <div class="container">Hello Vue!</div>
</template>
<script>
//导入Header组件
import MyHeader from './Header.vue'
export default {
  components: {
    MyHeader
  }
}
</script>
```

## 结束语
-----
Vue还是挺好用的呢，文档也写得很全很详细，虽然相应的插件、库等还是比较少，但不得不说从Angular重构还是挺多可以复用的代码呢。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/vue-notes/3-create-header)
[此处查看页面效果](http://o9zkatzym.bkt.clouddn.com/3-create-header/index.html?#!/index)
