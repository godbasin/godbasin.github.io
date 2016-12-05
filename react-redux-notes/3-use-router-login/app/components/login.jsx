import React from 'react'; //导入react组件

const Login = React.createClass({
	render() {
		return (
			<div>
				<a className="hiddenanchor" id="signup"></a>
				<a className="hiddenanchor" id="signin"></a>

				<div className="login_wrapper">
					<div className="animate form login_form">
						<section className="login_content">
							<form>
								<h1>管理系统</h1>
								<div>
									<input type="text" className="form-control" placeholder="用户名" ref="username" required />
								</div>
								<div>
									<input type="password" className="form-control" placeholder="密码" ref="password" required />
								</div>
								<div>
									<a className="btn btn-default submit" href="javascript:;" onClick={this.loginSubmit}>登录</a>
								</div>

								<div className="clearfix"></div>

							</form>
						</section>
					</div>

				</div>
			</div>
		);
	},
	getInitialState() {
		return {//设置默认属性
			username: '',
			password: ''
		};
	},
	contextTypes: {
		router: React.PropTypes.object
	},
	loginSubmit() {
		this.context.router.push('/index'); //使用this.content进行跳转
	},
	componentDidMount() {
		sessionStorage.removeItem('username')
		$('body').attr('class', 'login')
	}
});

module.exports = Login;