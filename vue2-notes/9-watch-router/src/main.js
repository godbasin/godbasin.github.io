import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App'
import Services from './components/Services'
import ServiceAdd from './components/ServiceAdd'
import Products from './components/Products'
import Logs from './components/Logs'
import Login from './Login'
Vue.use(VueRouter)

const routes = [
    { path: '/login', component: Login, name: 'Login' },
    {
        path: '/app',
        component: App,
        name: 'App',
        // 设置子路由
        children: [{
            // 服务列表
            path: 'services',
            component: Services,
            name: 'Services'
        }, {
            // 添加服务
            path: 'add/service',
            component: ServiceAdd,
            name: 'ServiceAdd'
        }, {
            // 修改服务
            path: 'edit/service/:id',
            component: ServiceAdd,
            name: 'ServiceEdit'
        }, {
            // 产品列表
            path: 'products',
            component: Products,
            name: 'Products'
        }, {
            // 日志列表
            path: 'logs',
            component: Logs,
            name: 'Logs'
        }, {
            // 其余路由重定向至服务列表
            path: '*',
            redirect: { name: 'Services' }
        }]
    },
    { path: '*', redirect: { name: 'Login' } }
]

const router = new VueRouter({
    routes // （缩写）相当于 routes: routes
})

Vue.filter('maxlength', (str, len, tail) => {
    if (str === undefined) { return; }
    var _str = str + '';
    if (_str.length > len) {
        _str = _str.substr(0, len) + (tail ? tail : '');
    }
    return _str;
})

new Vue({
    router
}).$mount('#app')