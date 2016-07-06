import React from 'react'; //导入react组件

const Login = React.createClass({
	render() {
		return (
			<div className="container" id="login">
				<form id="login-form">
					<h3 className="text-center">login</h3>
					<div className="form-group">
						<label>account</label>
						<input type="text" className="form-control" placeholder="Account" ref="loginName" required />
					</div>
					<div className="form-group">
						<label>Password</label>
						<input type="password" className="form-control" placeholder="Password" ref="loginPwd" required />
					</div>
					<button type="submit"  className="btn btn-default" onClick={this.props.submit}>登录</button>
				</form>
			</div>
		);
	}
});

module.exports = Login;