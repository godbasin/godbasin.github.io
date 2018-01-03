import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import accessCompute from './accessCompute'

export const operationMap = {
  maintainer: false, // 维护者
  owner: true, // 拥有者
  visitor: false // 访客
}

Vue.use(Router)

const pageRouter = new Router({
  routes
})

pageRouter.beforeEach((to, from, next) => {
  // 若进入登录页面，则默认不做鉴权
  if(to.name == 'Login'){
    next();
  }
  routerNext(to, from, next)
})

function routerNext(to, from, next) {
  // 对于命中路由，每个都分别鉴权，有不通过则跳转到No Auth页面
  let matchLen = to.matched.length
  // 从路由最里层开始鉴权
  for (let index = (matchLen - 1); index >= 0; index--) {
    let m = to.matched[index]
    let meta = m.meta
    // 若有配置禁止名单，则检测是否在禁止名单内，在则进入No Auth页面
    // 若无禁止名单，或者不匹配名单，则校验是否在允许进入名单内
    if (meta.forbidRole && accessCompute(operationMap, meta.forbidRole) || !accessCompute(operationMap, meta.accessRole)) {
      next({
        name: 'NoAuth'
      })
      // 若鉴权已不通过，则不进行后续match的鉴权
      return
    }
    // 若设置了title，则切换为设置的title
    if (meta && typeof meta.title != "undefined") {
      document.title = meta.title;
    }
  }

  // 其他则继续通过
  next();
}

export default pageRouter
