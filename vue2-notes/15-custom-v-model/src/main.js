import Vue from 'vue'
import router from './router'
import AppDialog from 'components/AppDialog'
import Datetimepicker from 'components/Datetimepicker'
import Select2 from 'v-select2-component'
import 'tools/date.js'

Vue.component('Datetimepicker', Datetimepicker)
Vue.component('Select2', Select2)
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