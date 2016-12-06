import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Top from '../components/Top.jsx'

export class HomeContainer extends Component {
	render() {
		const that = this
		const { dispatch, isSidebarShown } = that.props
		return (
			<div className="container body">
				<div className="main_container">
					<Top dispatch={dispatch} isSidebarShown={isSidebarShown}></Top>
					<div className="right_col" role="main">
						Hello World！
					</div>

					<footer>
						<div className="pull-right">
							@godbasin
					</div>
						<div className="clearfix"></div>
					</footer>
				</div>
			</div>
		)
	}
	componentDidMount() {
		// 判断如果未登陆则跳转
		if (!sessionStorage.getItem('username')) {
			Notify({
				title: '请先登录',
				type: 'error'
			})
			this.context.router.push('/login')
		}
		$('body').attr('class', 'nav-md')
		$('.right_col').css('min-height', $(window).height())
	}
}

HomeContainer.contextTypes = {
	router: React.PropTypes.object
}

function connectState(state) {
	return {
		isSidebarShown() {
			return state.isSidebarShown
		}
	}
}

// 使用connect，注入dispatch和userName
export default connect(connectState)(HomeContainer)