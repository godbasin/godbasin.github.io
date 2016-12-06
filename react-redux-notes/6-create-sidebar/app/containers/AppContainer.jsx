import React, { Component, PropTypes } from 'react' //react
import { Router, Route, Link, hashHistory, IndexRedirect, useRouterHistory } from 'react-router'
import { createHistory, createHashHistory } from 'history'
import { createStore } from 'redux'
import Login from '../routes/login'
import HomeContainer from '../routes/home/containers/HomeContainer.jsx'

let history = useRouterHistory(createHashHistory)()

export class AppContainer extends Component {
  render() {
    // 正常的react-router使用方式
    return (
      <Router history={history} >
        <Route path="/">
          <IndexRedirect to="/login" />
          <Route path="login" component={Login} />
          <Route path="home" component={HomeContainer} />
        </Route>
      </Router>
    )
  }
}

export default AppContainer
