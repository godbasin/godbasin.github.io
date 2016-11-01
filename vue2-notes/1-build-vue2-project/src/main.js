import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App'
import Login from './Login'
Vue.use(VueRouter)

const routes = [
    { path: '/login', component: Login, name: 'Login' },
    { path: '/app', component: App, name: 'App' },
    { path: '*', redirect: { name: 'Login' } }
]

const router = new VueRouter({
    routes // （缩写）相当于 routes: routes
})

new Vue({
    router
}).$mount('#app')