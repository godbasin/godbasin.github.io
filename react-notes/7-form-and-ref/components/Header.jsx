import React from 'react'; //导入react组件
import { NavDropdown, MenuItem, Navbar, Nav } from 'react-bootstrap';

const Header = React.createClass({
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
						<li><a>{ this.props.clock }</a></li>
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