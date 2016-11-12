import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App'
import Services from './components/Services'
import ServiceAdd from './components/ServiceAdd'
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
            // 编辑服务，:id可匹配任意值，且可在组件中获取该值
            path: 'edit/service/:id',
            component: ServiceAdd,
            name: 'ServiceEdit'
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

new Vue({
    router
}).$mount('#app')