var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var IndexStore = assign({}, EventEmitter.prototype, {

	asidemenus: [{
		title: '基本资料', //title用于储存该菜单显示名称
		click: 'init', //click用于储存该菜单对应点击时loading的状态值
		menus: [{
			text: '名字',
			click: 'name',
		}, {
			text: '邮箱',
			click: 'email',
		}, {
			text: 'github',
			click: 'github',
		}, ]
	}, {
		title: '设置头像',
		click: 'sethead',
	}, {
		title: '修改资料',
		click: 'setinfo',
	}, {
		title: '其他',
		click: 'other',
	}],

	loading: 'init',

	getAsidemenus: function() {
		return this.asidemenus;
	},

	getLoading: function() {
		return this.loading;
	},

	setLoading: function(state, callback) {
		this.loading = state;
		callback();
	},

});

module.exports = IndexStore;