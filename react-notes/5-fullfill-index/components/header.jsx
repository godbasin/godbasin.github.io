import React from 'react'; //导入react组件
import { NavDropdown, MenuItem, Navbar, Nav } from 'react-bootstrap';

const Header = React.createClass({
	propTypes: {//属性校验器，表示改属性必须是bool，否则报错
		menus: React.PropTypes.array,
		usermenus: React.PropTypes.array,
	},
	getDefaultProps : function () {
	    return {//设置默认属性
			menus: [
				{
					title: 'index', //title用于储存路由对应的路径
					href: '?#/index', //href用于设定该菜单跳转路由
					text: '首页', //text用于储存该菜单显示名称
				}, {
					title: 'others',
					href: '?#/other',
					text: '其他',
			}],
			//usermenus用于储存侧边下拉菜单
			usermenus:[
				{
					click: function(){}, //click用于设置该菜单点击事件
					text: '退出', //text用于储存该菜单显示名称
			}],
		};
	},
	getInitialState: function() {
		return {clock: ''};
	},
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
	componentDidMount: function(){
		let that = this;			
		this.interval = setInterval(function() {
			that.clockRender();
		}, 500);
	},
	componentWillUnmount: function(){
		clearInterval(this.interval);
	},
	render() {
		let active = this.props.active;
		return (
			<Navbar className="header" fluid>
				<Navbar.Header className="navbar-header">
					<Navbar.Brand>Godbasin</Navbar.Brand>
				</Navbar.Header>
				<Navbar.Collapse id="bs-example-navbar-collapse-1">
					<Nav navbar>     	
					{							
						this.props.menus.map(function(menu, i) {
							return (<li key={i} className={ menu.title == active ? "active" : ""}><a href={menu.href}>{ menu.text }<span className="sr-only">(current)</span></a></li>);
						})
					}
					</Nav>
					<Nav navbar pullRight>
						<li><a>{ this.state.clock }</a></li>
						<NavDropdown title="菜单" id="top-aside-menu">
							{
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
});

module.exports = Header;