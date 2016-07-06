import './less/index.less'; //less样式文件
import React from 'react'; //react
import ReactDOM from 'react-dom'; //react-dom
import { Router, Route, Link, hashHistory, IndexRoute, useRouterHistory } from 'react-router';
import { createHistory, createHashHistory } from 'history';
import LoginController from  './components/LoginController.jsx'; //login自定义组件
import IndexController from  './components/IndexController.jsx'; //index自定义组件

let history = useRouterHistory(createHashHistory)({ queryKey: false });
//将其渲染到页面上id为test的DOM元素内
ReactDOM.render(<Router history={history} >
    <Route path="/">
      <IndexRoute component={LoginController} />
      <Route path="index" component={IndexController} />
    </Route>
  </Router>, document.getElementById("test"));

