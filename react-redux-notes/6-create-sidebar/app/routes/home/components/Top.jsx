import React, { Component, PropTypes } from 'react'
import { toggleSidebar, setUserName } from '../../../actions/commonActions.js'


export class Top extends Component {
    render() {
        const { dispatch, isSidebarShown } = this.props
        return (
            <div className="top_nav">
                <div className="nav_menu">
                    <nav>
                        <div className="nav toggle">
                            <a id="menu_toggle" onClick={() => { dispatch(toggleSidebar(isSidebarShown() ? false : true)); $('body').toggleClass('nav-md nav-sm') } }><i className="fa fa-bars"></i></a>
                        </div>

                        <ul className="nav navbar-nav navbar-right">
                            <li className="">
                                <a href="javascript:;" className="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                    用户
                                        <span className=" fa fa-angle-down"></span>
                                </a>
                                <ul className="dropdown-menu dropdown-usermenu pull-right">
                                    <li><a href="javascript:;">设置</a></li>
                                    <li><a onClick={() =>{this.logout()}}><i className="fa fa-sign-out pull-right"></i>退出</a></li>
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        )
    }
    logout(){
        sessionStorage.removeItem('username')
		this.context.router.push('/login')
    }
}

Top.contextTypes = {
	router: React.PropTypes.object
}

export default Top