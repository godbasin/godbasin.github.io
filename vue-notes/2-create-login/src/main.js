// 引入vue以及vue-router
import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入组件
import Login from './components/Login.vue'
import Index from './components/Index.vue'

// 创建一个路由器实例
// 创建实例时可以传入配置参数进行定制，为保持简单，这里使用默认配置
Vue.use(VueRouter)
var router = new VueRouter()
// 路由器需要一个根组件。
var App = Vue.extend({})
// 定义路由规则
// 每条路由规则应该映射到一个组件。这里的“组件”可以是一个使用 Vue.extend
// 创建的组件构造函数，也可以是一个组件选项对象。
router.redirect({
  // 重定向任意未匹配路径到 /login
  '*': '/login'
})
router.map({
  '/login': {
    name: 'login', // 定义路由的名字。方便使用。
    component: Login // 引用的组件名称，对应上面使用`import`导入的组件
  },
  '/index': {
    name: 'index',
    component: Index
  }
})
// 现在我们可以启动应用了！
// 路由器会创建一个 App 实例，并且挂载到选择符 #app 匹配的元素上。
router.start(App, '#app')
