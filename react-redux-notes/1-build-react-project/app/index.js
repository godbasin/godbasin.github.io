import React from 'react'; //react
import ReactDOM from 'react-dom'; //react-dom
import { Router, Route, Link, hashHistory, IndexRoute, useRouterHistory } from 'react-router';
import { createHistory, createHashHistory } from 'history';
import Index from  './components/index.jsx'; //index自定义组件

let history = useRouterHistory(createHashHistory)();
//将其渲染到页面上id为app的DOM元素内
ReactDOM.render(<Router history={history} >
    <Route path="/">
      <IndexRoute component={Index} />
      <Route path="index" component={Index} />
    </Route>
  </Router>, document.getElementById("app"));