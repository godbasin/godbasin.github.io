import { combineReducers } from 'redux'
import { TOGGLE_SIDEBAR, TOGGLE_MENU_DOWN, TOGGLE_MENU_UP } from '../actions/commonActions'

// 设置数组函数，增加或者删减成员
function arraySet(how, array, one) {
    let index = array.indexOf(one)
    let arr = array.concat()
    switch (how) {
        case 'add':
            if (index === -1) arr.push(one)
            return arr
        case 'remove':
            if (index > -1) arr.splice(index, 1)
            return arr
        default:
            return arr
    }
}

function isSidebarShown(state = true, action) {
    switch (action.type) {
        case TOGGLE_SIDEBAR:
            return action.state
        default:
            return state
    }
}

function activeMenus(menus = [], action) {
    switch (action.type) {
        case TOGGLE_MENU_UP:
            return arraySet('remove', menus, action.index)
        case TOGGLE_MENU_DOWN:
            return arraySet('add', menus, action.index)
        default:
            return menus
    }
}

// 合并多个reducers
const AppReducer = combineReducers({
    isSidebarShown,
    activeMenus
})

export default AppReducer