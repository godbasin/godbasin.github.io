import Vue from 'vue'
import router from './router'
import AppDialog from 'components/AppDialog'

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
    components:{AppDialog},
    router
}).$mount('#app')