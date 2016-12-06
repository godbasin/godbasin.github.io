import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { setUserName } from '../../actions/commonActions.js'

export class Login extends Component {
	render() {
		return (
			<div>
				<a className="hiddenanchor" id="signup"></a>
				<a className="hiddenanchor" id="signin"></a>

				<div className="login_wrapper">
					<div className="animate form login_form">
						<section className="login_content">
							<form onKeyPress={(e) => { if (e.key === 'Enter') { this.loginSubmit(e) } } }>
								<h1>管理系统</h1>
								<div>
									<input type="text" className="form-control" placeholder="用户名" ref="username" required />
								</div>
								<div>
									<input type="password" className="form-control" placeholder="密码" ref="password" required />
								</div>
								<div>
									<a className="btn btn-default submit" onClick={(e) => { this.loginSubmit(e) } }>登录</a>
								</div>

								<div className="clearfix"></div>

							</form>
						</section>
					</div>

				</div>
			</div>
		)
	}

	loginSubmit() {
		const username = this.refs.username.value.trim()
		const password = this.refs.password.value.trim()
		// console.log(JSON.stringify({username,password}).toString());
		if (username === undefined || password === undefined) {
			Notify({
				title: '账户或密码不能为空',
				type: 'error'
			})
			return
		}
		// dispatch setUserName的action，触发更新userName状态
		this.props.dispatch(setUserName(username))
		this.context.router.push('/home')
	}

	componentDidMount() {
		$('body').attr('class', 'login')
	}
}

Login.contextTypes = {
	router: React.PropTypes.object
}

// 使用connect，只注入dispatch，不监听store
export default connect()(Login)