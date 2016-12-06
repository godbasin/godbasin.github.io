/*
 * action 类型
 */
export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR'
export const TOGGLE_MENU_DOWN = 'TOGGLE_MENU_DOWN'
export const TOGGLE_MENU_UP = 'TOGGLE_MENU_UP'

/*
 * action 创建函数
 */

export function toggleSidebar(state) {
    return { type: TOGGLE_SIDEBAR, state }
}

export function toggleMenuDown(index) {
    return { type: TOGGLE_MENU_DOWN, index }
}

export function toggleMenuUp(index) {
    return { type: TOGGLE_MENU_UP, index }
}