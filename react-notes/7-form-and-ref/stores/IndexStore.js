import ReactDOM from 'react-dom';
import {EventEmitter} from 'events';
import assign from 'object-assign';

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

	loading: 'setinfo',
	
	name: '',

	email: '',

	getAsidemenus: function() {
		return this.asidemenus;
	},

	getLoading: function() {
		return this.loading;
	},
	
	getName: function() {
		return this.name;
	},
	
	getEmail: function() {
		return this.email;
	},

	setLoading: function(state, callback) {
		this.loading = state;
		callback();
	},
	
	focusInput: function(refs, name){
		ReactDOM.findDOMNode(refs[name]).focus(); 
	},
	
	setInput: function(name, event, callback) {
		switch(name){
			case 'name':
				//通过event.target获取当前元素，再获取value
				this.name = event.target.value;
				break;
			case 'email':
				this.email = event.target.value;
				break;
		}	
		callback();
	},
	

});

module.exports = IndexStore;