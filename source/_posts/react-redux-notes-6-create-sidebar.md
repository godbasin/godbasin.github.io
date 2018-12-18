---
title: React-Redux使用笔记6--创建Sidebar组件
date: 2017-01-15 10:47:34
categories: react沙拉
tags: 笔记
---
最近又重新拾起了React框架，并配合开源模板gentelella以及Redux建立了个简单的项目。《React-Redux使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录创建Sidebar组件的过程。
<!--more-->

## Sidebar组件
---
上一节创建了Top组件，那是个功能和视图相对比较简单的组件。Sidebar组件下相比之下，会稍微复杂一些。

### Sidebar组件功能
- 展示菜单(SidebarList组件)
  - 最多两层菜单结
  - 外层菜单若有子菜单，则可以下拉展示；若没有，则会根据href进行跳转
- 下拉状态管理
- 侧边菜单状态响应(isSidebarShown)

### 添加action
这里我们先添加activeMenus状态相关的action和action创建函数：
``` js
// actions/commonActions.js
export const TOGGLE_MENU_DOWN = 'TOGGLE_MENU_DOWN'
export const TOGGLE_MENU_UP = 'TOGGLE_MENU_UP'

export function toggleMenuDown(index) {
    return { type: TOGGLE_MENU_DOWN, index }
}

export function toggleMenuUp(index) {
    return { type: TOGGLE_MENU_UP, index }
}
```

### 添加reducer
然后我们添加activeMenus状态相关的reducer：
``` js
// store/reducers.js
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
// 默认值为空数组
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
```

### 创建SidebarList组件
在routes/home/components/Sidebar文件夹下面新建SidebarList.jsx组件：
``` jsx
// SidebarList.jsx
import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

const menus = [{
    icon: 'fa-wrench',
    text: '基础配置',
    childMenus: [{
        href: '/home/setting/system',
        text: '系统配置'
    }, {
        href: '/home/setting/service',
        text: '服务配置'
    }]
}, {
    icon: 'fa-wrench',
    text: '高级配置',
    childMenus: [{
        href: '',
        text: '高级配置1'
    }, {
        href: '',
        text: '高级配置2'
    }]
}, {
    icon: 'fa-sun-o',
    text: '任务管理',
    href: '/home/task'
}]

let locationLast = ''

export class SidebarList extends Component {
    render() {
        const that = this
        // 父组件传入onMenuToggle, isActivedMenu, isSidebarShown
        const { onMenuToggle, isActivedMenu, isSidebarShown } = that.props
        return (
            <ul className="nav side-menu">
                {
                    menus.map(function (menu, i) {
                        // 判断当前菜单路由是否激活状态
                        let isRouteActive = menu.href ? that.context.router.isActive(menu.href, true) : false
                        return (
                            // 若一级菜单有href，则进行跳转，并注销所有菜单的下拉状态
                            // 若没有，则进行子菜单的下拉或者收起
                            <li 
                                onClick={() => { if (menu.href) { onMenuToggle(i, isRouteActive); that.context.router.push(menu.href) } else { onMenuToggle(i, isActivedMenu(i)) } } } 
                                // 若激活状态，则添加激活样式
                                className={isActivedMenu(i) ? (isSidebarShown() ? 'active' : 'active-sm') : (isRouteActive ? 'active' : '')} 
                                key={i}>
                                <a>
                                    <i className={'fa ' + menu.icon}></i>
                                    {menu.text}
                                    {   // 若菜单有子菜单，则显示右侧箭头
                                        !menu.href ?
                                        <span className={isActivedMenu(i) ? 'fa fa-chevron-down' : 'fa fa-chevron-right'}></span>
                                        : null
                                    }
                                </a>
                                {   // 若菜单有子菜单切处于下拉状态，则展示子菜单列表
                                    (that.props.isActivedMenu(i) && !menu.href) ?
                                        <ul className="nav child_menu">
                                            {
                                                menu.childMenus.map(function (childMenu, j) {
                                                    // 判断当前子菜单路由是否激活状态
                                                    let isActive = that.context.router.isActive(childMenu.href, true)
                                                    return (
                                                        // 若当前子菜单路由激活，则加载激活样式
                                                        <li key={j} className={isActive ? 'slide-item current-page' : 'slide-item'}>
                                                            <Link to={childMenu.href} onClick={(e) => { e.stopPropagation() } }>{childMenu.text}</Link>
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                        : null
                                }
                            </li>
                        )
                    })
                }

            </ul>
        )
    }
}

SidebarList.contextTypes = {
    router: React.PropTypes.object
}

export default SidebarList
```

### 创建Sidebar组件
在routes/home/components/Sidebar文件夹下面新建Sidebar.jsx组件：
``` jsx
// Sidebar.jsx
import React, { Component, PropTypes } from 'react'
// 引入相关的action
import { toggleMenuDown, toggleMenuUp, toggleMenuFocus } from '../../../../actions/commonActions.js'
// 引入SidebarList组件
import SidebarList from './SidebarList.jsx'

export class Sidebar extends Component {
	render() {
		const that = this
		// 从父组件获得dispatch, isActivedMenu, isSidebarShown
		const { dispatch, isActivedMenu, isSidebarShown } = that.props
		const username = sessionStorage.getItem('username')
		return (
			<div className="col-md-3 left_col menu_fixed">
				<div className="left_col scroll-view">
					<div className="navbar nav_title" style={{ border: 0 }}>
						<a href="index.html" className="site_title"><i className="fa fa-paw"></i> <span>管理系统</span></a>
					</div>

					<div className="clearfix"></div>

					<div className="profile">
						<div className="profile_pic"></div>
						<div className="profile_info">
							<h2><span>欢迎回来, </span> { username }</h2>
						</div>
					</div>
					<div className="clearfix"></div>

					<div id="sidebar-menu" className="main_menu_side hidden-print main_menu">
						<div className="menu_section">
							<br />
							<h2>管理菜单</h2>
							<SidebarList
							// 传入onMenuToggle, isActivedMenu, isSidebarShown给SidebarList
								isActivedMenu={index =>isActivedMenu(index)}
								isSidebarShown={isSidebarShown}
								onMenuToggle={(index, state) => {
									dispatch(state ? toggleMenuUp(index) : toggleMenuDown(index))
								}
								}>
							</SidebarList>
						</div>

					</div>
				</div>
			</div>
		)
	}
}

export default Sidebar
```

### HomeContainer传入状态
这里相关状态我们统一从HomeContainer组件中传入：
``` jsx
// HomeContainer.jsx
...
import Sidebar from '../components/Sidebar'

// 使用Sidebar组件
<Sidebar dispatch={dispatch} isActivedMenu={isActivedMenu} isSidebarShown={isSidebarShown}></Sidebar>

function connectState(state) {
	return {
		isActivedMenu(index) {
			if (state.activeMenus.includes(index)) return true
			return false
		},
		...
	}
}
```

## 路由状态检测
---
由于Sidebar组件是在整个HomeContainer组件下的，所以当匹配`/home`下的路由都会在里面。
这样就可能有个问题，当前页面刷新的时候，左侧的菜单并不会自动匹配到相应的选项，以及展示选中状态。

### 增加路由匹配检测
``` jsx
// SidebarList.jsx
export class SidebarList extends Component {
	...
	// 检测路由激活状态，并更新
    checkActiveMenu() {
        const that = this
        menus.forEach((item, i) => {
            if (item.href) {
                let state = that.context.router.isActive(item.href, true)
                if (state) that.props.onMenuToggle(i, !state)
            } else if (item.childMenus) {
                item.childMenus.forEach(childMenu => {
                    let state = that.context.router.isActive(childMenu.href, true)
                    if (state) {
                        that.props.onMenuToggle(i, !state)
                    }
                })
            }
        })
    }
}
```
这里，我们遍历一级菜单和它们的子菜单，若匹配当前路由，则进行相应的状态设置（主要通过onMenuToggle方法）。

### 初始化完成时调用
- componentDidMount生命周期
  - 在初始化渲染执行之后立刻调用一次，仅客户端有效（服务器端不会调用）
  - 在生命周期中的这个时间点，组件拥有一个DOM展现，你可以通过`this.getDOMNode()`来获取相应DOM节点

``` jsx
// SidebarList.jsx
export class SidebarList extends Component {
	...
    componentDidMount() {
        this.checkActiveMenu()
    }
}
```

### 监视路由变化
- componentDidUpdate生命周期
  - componentDidUpdate(object prevProps, object prevState)
  - 在组件的更新已经同步到DOM中之后立刻被调用。该方法不会在初始化渲染的时候调用。使用该方法可以在组件更新之后操作DOM元素

``` jsx
// SidebarList.jsx
export class SidebarList extends Component {
	...
    componentDidUpdate(prevProps, prevStates, other) {
        // 路由更新后，触发路由检测
        if (other.router.location.pathname !== locationLast) {
            this.checkActiveMenu()
            locationLast = other.router.location.pathname
        }
    }
}
```

现在我们的页面大概效果如图：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/7BED.tmp.png)
切换后：
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/91E3.tmp.png)


## 结束语
-----
本节我们通过新增一个Top组件，感受了一下在Redux状态管理下，新加状态的一些具体步骤，这样或许比上一节整体调整结构要稍微清晰一点点吧。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/react-redux-notes/6-create-sidebar)
[此处查看页面效果](http://react-redux-notes.godbasin.com/6-create-sidebar/index.html)