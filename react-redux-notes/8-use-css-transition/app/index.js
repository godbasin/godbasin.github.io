import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import AppContainer from './containers/AppContainer.jsx'
import AppReducer from './store/reducers'

// ========================================================
// Store Instantiation
// ========================================================

const store = createStore(AppReducer)

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root')

ReactDOM.render( <
    Provider store = { store } >
    <
    AppContainer / >
    <
    /Provider>,
    MOUNT_NODE
)