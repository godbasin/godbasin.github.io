var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var LoginStore = assign({}, EventEmitter.prototype, {
	
	loginSubmit: function(context) {
		context.router.push('/index'); //使用content进行跳转
	},
	
});

module.exports = LoginStore;