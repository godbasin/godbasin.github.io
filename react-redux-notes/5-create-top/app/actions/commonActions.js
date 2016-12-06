/*
 * action 类型
 */
export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR'

/*
 * action 创建函数
 */

export function toggleSidebar(state) {
    return { type: TOGGLE_SIDEBAR, state }
}