import { combineReducers } from 'redux'
import { TOGGLE_SIDEBAR } from '../actions/commonActions'

function isSidebarShown(state = true, action) {
    switch (action.type) {
        case TOGGLE_SIDEBAR:
            return action.state
        default:
            return state
    }
}

// 合并多个reducers
const AppReducer = combineReducers({
    isSidebarShown
})

export default AppReducer