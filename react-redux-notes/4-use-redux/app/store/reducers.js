import { combineReducers } from 'redux'
import { USER_NAME } from '../actions/commonActions'

// userName的reducer用于改变userName的状态
function userName(state = null, action) {
    switch (action.type) {
        case USER_NAME:
            return action.state
        default:
            return state
    }
}

// 合并多个reducers
const AppReducer = combineReducers({
    userName
})

export default AppReducer