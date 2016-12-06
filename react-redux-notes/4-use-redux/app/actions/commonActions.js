/*
 * action 类型
 */
export const USER_NAME = 'USER_NAME'

/*
 * action 创建函数
 */

export function setUserName(state) {
    return { type: USER_NAME, state }
}