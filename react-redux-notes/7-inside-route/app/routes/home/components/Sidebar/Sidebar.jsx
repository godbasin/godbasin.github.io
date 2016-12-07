import React, { Component, PropTypes } from 'react'
// 引入相关的action
import { toggleMenuDown, toggleMenuUp, toggleMenuFocus } from '../../../../actions/commonActions.js'
// 引入SidebarList组件
import SidebarList from './SidebarList.jsx'

export class Sidebar extends Component {
	render() {
		const that = this
		// 从父组件获得dispatch, isActivedMenu, isSidebarShown
		const { dispatch, isActivedMenu, isSidebarShown } = that.props
		const username = sessionStorage.getItem('username')
		return (
			<div className="col-md-3 left_col menu_fixed">
				<div className="left_col scroll-view">
					<div className="navbar nav_title" style={{ border: 0 }}>
						<a href="index.html" className="site_title"><i className="fa fa-paw"></i> <span>管理系统</span></a>
					</div>

					<div className="clearfix"></div>

					<div className="profile">
						<div className="profile_pic"></div>
						<div className="profile_info">
							<h2><span>欢迎回来, </span> { username }</h2>
						</div>
					</div>
					<div className="clearfix"></div>

					<div id="sidebar-menu" className="main_menu_side hidden-print main_menu">
						<div className="menu_section">
							<br />
							<h2>管理菜单</h2>
							<SidebarList
							// 传入onMenuToggle, isActivedMenu, isSidebarShown给SidebarList
								isActivedMenu={index =>isActivedMenu(index)}
								isSidebarShown={isSidebarShown}
								onMenuToggle={(index, state) => {
									dispatch(state ? toggleMenuUp(index) : toggleMenuDown(index))
								}
								}>
							</SidebarList>
						</div>

					</div>
				</div>
			</div>
		)
	}
}

export default Sidebar


