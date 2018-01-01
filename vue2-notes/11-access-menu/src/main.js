import Vue from 'vue'
import router from './router'

Vue.filter('maxlength', (str, len, tail) => {
    if (str === undefined) { return; }
    var _str = str + '';
    if (_str.length > len) {
        _str = _str.substr(0, len) + (tail ? tail : '');
    }
    return _str;
})

$.fn.dataTable.ext.errMode = 'none';

new Vue({
    router
}).$mount('#app')