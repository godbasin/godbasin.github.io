import React from 'react'; //导入react组件
import HeaderStore from '../stores/HeaderStore.js';  //获取HeaderStore
import HeaderActions from '../actions/HeaderActions.js'; //获取HeaderActions
import Header from './Header.jsx'; //获取子组件Header

const HeaderController = React.createClass({
	getDefaultProps : function () { //设置props数据
	  return {
			menus: HeaderStore.getMenus(), //从HeaderStore获取menus数据
			usermenus:  HeaderStore.getUsermenus(), //从HeaderStore获取usermenus数据
		};
	},
	getInitialState: function() { //设置state数据
		return {clock: HeaderStore.getClock()}; //从HeaderStore获取clock数据
	},
	setClock: function(time) { //从HeaderStore获取clock并更新状态
		this.setState({clock: HeaderStore.getClock()});
	},
	componentDidMount: function(){
		var that = this;
		this.interval = setInterval(function() { //设置定时器500ms刷新一次clock
			HeaderActions.clockRender(that.setClock); //传入回调触发刷新
		}, 500);
	},
	componentWillUnmount: function(){
		clearInterval(this.interval); //移除定时器
	},
	render() {
		//将数据以props传入子组件
		return <Header clock={this.state.clock} menus={this.props.menus} usermenus={this.props.usermenus} active={this.props.active}  />;
	}
});

module.exports = HeaderController;