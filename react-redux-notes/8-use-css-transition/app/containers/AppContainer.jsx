import React, { Component, PropTypes } from 'react' //react
import { Router, Route, Link, hashHistory, IndexRedirect, useRouterHistory } from 'react-router'
import { createHistory, createHashHistory } from 'history'
import { createStore } from 'redux'
import Login from '../routes/login'
import HomeContainer from '../routes/home/containers/HomeContainer.jsx'
import BasicSystem from '../routes/home/modules/basic/BasicSystem.jsx'
import BasicService from '../routes/home/modules/basic/BasicService.jsx'
import AdvancedSystem from '../routes/home/modules/advanced/AdvancedSystem.jsx'
import AdvancedService from '../routes/home/modules/advanced/AdvancedService.jsx'
import Task from '../routes/home/modules/Task.jsx'

let history = useRouterHistory(createHashHistory)()

export class AppContainer extends Component {
  render() {
    // 正常的react-router使用方式
    return (
      <Router history={history} >
        <Route path="/">
          <IndexRedirect to={"login"} />
          <Route path="login" component={Login} />
          <Route path="home" component={HomeContainer}>
            <IndexRedirect to={"basic"} />
            <Route path="basic" >
              <IndexRedirect to={"system"} />
              <Route path="system" component={BasicSystem} />
              <Route path="service" component={BasicService} />
            </Route>
            <Route path="advanced" >
              <IndexRedirect to={"system"} />
              <Route path="system" component={AdvancedSystem} />
              <Route path="service" component={AdvancedService} />
            </Route>
            <Route path="task" component={Task} />
          </Route>
        </Route>
      </Router>
    )
  }
}

export default AppContainer
