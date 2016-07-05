var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var HeaderStore = assign({}, EventEmitter.prototype, {
	menus: [{
		title: 'index', //title用于储存路由对应的路径
		href: '?#/index', //href用于设定该菜单跳转路由
		text: '首页', //text用于储存该菜单显示名称
	}, {
		title: 'others',
		href: '?#/other',
		text: '其他',
	}],
	usermenus: [{
		click: function() {}, //click用于设置该菜单点击事件
		text: '退出', //text用于储存该菜单显示名称
	}],
	clock: '', //clock用于保存时钟
	getMenus: function() {return this.menus;}, //获取menus
	getUsermenus: function() {return this.usermenus;}, //获取usermenus
	getClock: function() {return this.clock;}, //获取clock
	clockRender: function(callback) { //刷新时钟
		let numberStandard = function(num) {
				let _val = Number(num),
					_num;
				_num = (_val < 10) ? ('0' + _val) : ('' + _val);
				return _num;
			},
			_date = new Date();
		this.clock = _date.getFullYear() + '年' + (_date.getMonth() + 1) + '月' +
			_date.getDate() + '日' + ' ' + numberStandard(_date.getHours()) + ':' + numberStandard(_date.getMinutes()) +
			':' + numberStandard(_date.getSeconds());
		callback();
	},
});

module.exports = HeaderStore;