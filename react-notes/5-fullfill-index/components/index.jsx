import React from 'react';
import { Panel, PanelGroup, ListGroup, ListGroupItem } from 'react-bootstrap';
import Header from  './header.jsx'; //login自定义组件

const Index = React.createClass({
	getDefaultProps : function () {
		var that = this;
	   return {//设置默认属性
			asidemenus: [{
				title: '基本资料', //title用于储存该菜单显示名称
				click: 'init', //click用于储存该菜单对应点击时loading的状态值
				menus: [{
					text: '名字',
					click: 'name',
				}, {
					text: '邮箱',
					click: 'email',
				}, {
					text: 'github',
					click: 'github',
				}, ]
			}, {
				title: '设置头像',
				click: 'sethead',
			}, {
				title: '修改资料',
				click: 'setinfo',
			}, {
				title: '其他',
				click: 'other',
			}],
		};
	},
	changeState: function(state){
		this.setState({loading: state});
	},
	getInitialState: function() {
		return {loading: 'init'};
	},
  render() {
  	var loading = this.state.loading;
  	var that = this;
  	var changeState = this.changeState;
  	var asidemenus = this.props.asidemenus.map(function(menu, i){
  		var menus, menusgroup; 		
  		if(menu.menus){
  			menus = menu.menus.map(function(item, j){
  				return (<ListGroupItem onClick={this.changeState.bind(null,item.click)} key={j}>{ item.text }</ListGroupItem>);
  			}.bind(this));
  			menusgroup = (
  				<ListGroup>
  					{ menus }
  				</ListGroup>
  			);  			
  		}
  		var menuheader = (
  			<ul class="panel-title ">
					<li onClick={this.changeState.bind(null,menu.click)}>
							{ menu.title }
					</li>
				</ul>
  		);
  		return (
  			<Panel collapsible defaultExpanded className="list-group" key={i} header={menuheader}>
					<div id="collapse{i}" className="panel-collapse collapse in">
						{ menusgroup }										
					</div>
				</Panel>
  		);
  	}.bind(this));
    return (
    	<div className="container-fluid row">
    		<Header active="index"></Header>
				<aside className="col-md-2 col-md-offset-1">
					<PanelGroup id="accordion">
						{	asidemenus }						
					</PanelGroup>
				</aside>
				<article className="col-md-7">
					<section className="index-content">
						<p className={loading == 'init' || loading == 'name' ? '' : 'hidden'}>昵称：被删</p>
						<p className={loading == 'init' || loading == 'email' ? '' : 'hidden'}>邮箱：wangbeishan@163.com</p>
						<p className={loading == 'init' || loading == 'github' ? '' : 'hidden'}>github: <a href="https://github.com/godbasin">github.com/godbasin</a></p>
						<div className={loading == 'sethead' ? '' : 'hidden'}>这里是设置头像页面</div>
						<div className={loading == 'setinfo' ? '' : 'hidden'}>这里是修改资料页面</div>
						<div className={loading == 'other' ? '' : 'hidden'}>这里是其他页面</div>
					</section>
				</article>
			</div>
    );
  }
});

module.exports = Index;