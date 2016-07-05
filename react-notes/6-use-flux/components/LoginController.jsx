import React from 'react'; //导入react组件
import Login from './Login.jsx'; 
import LoginActions from '../actions/LoginActions.js';

const LoginController = React.createClass({
	contextTypes: {
		router: React.PropTypes.object
	},
	loginSubmit: function() {
		console.log(this.context)
		LoginActions.login(this.context); //使用this.content进行跳转
	},
	render() {
		return (
			<Login submit={this.loginSubmit} />
		);
	}
});

module.exports = LoginController;