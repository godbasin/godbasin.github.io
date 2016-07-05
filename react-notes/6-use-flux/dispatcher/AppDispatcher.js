import { Dispatcher } from 'flux'; //导入react组件
import HeaderStore from '../stores/HeaderStore.js';
import IndexStore from '../stores/IndexStore.js';
import LoginStore from '../stores/LoginStore.js';

var AppDispatcher = new Dispatcher();
AppDispatcher.register(function(action) {
	switch (action.actionType) {
		case 'LOGIN':
			LoginStore.loginSubmit(action.context);
			break;
		case 'CLOCK_RENDER':
			HeaderStore.clockRender(action.callback);
			break;
		case 'INDEX_SET_LOADING':
			IndexStore.setLoading(action.state, action.callback);
			break;
		default:
			// no op
	}
})

module.exports = AppDispatcher;