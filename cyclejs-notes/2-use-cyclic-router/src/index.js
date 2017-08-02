import {run} from '@cycle/run'
import xs from 'xstream';
import {makeDOMDriver} from '@cycle/dom';
import {makeRouterDriver} from 'cyclic-router';
// 这里我们使用hash锚做路由，故使用createHashHistory替代createBrowserHistory
import {createHashHistory} from 'history';
import switchPath from 'switch-path';  // Required in v3, not required in v2 or below 
import {AppComponent} from './app'
import {LoginComponent} from './login'

function main(sources) {
  // 设置路由匹配规则
  // 这里需要注意的是，必须有跟路由'/'，否则将会报错：
  const match$ = sources.router.define({
    '/login': LoginComponent,
    '/app': AppComponent,
    '*': LoginComponent
  });
  
  const page$ = match$.map(({path, value}) => {
    return value(Object.assign({}, sources, {
      router: sources.router.path(path)
    }));
  });
  
  return {
    // 匹配路由后获取DOM作为流
    DOM: page$.map(c => c.DOM).flatten(), 
    // 匹配路由后获取对应的router作为流，为空则设置''
    // 然后flatten()将多个流抚平
    router: xs.merge(page$.map(c => c.router).filter(x => x || '').flatten()),
  };
}

run(main, {
  DOM: makeDOMDriver('#app'),
  router: makeRouterDriver(createHashHistory(), switchPath)  // v3
  // router: makeRouterDriver(createHistory()) // <= v2
});