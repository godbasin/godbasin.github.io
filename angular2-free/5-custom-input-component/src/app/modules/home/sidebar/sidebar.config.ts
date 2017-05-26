export const menus = [{
    icon: 'fa-home', // icon用于储存菜单对应的图标
    text: '页面管理', // text用于储存该菜单显示名称
    childMenus: [{
        link: '/home/page-setting', // link用于设定该菜单跳转路由
        text: '页面配置' // text用于储存该菜单显示名称
    }, {
        link: '/home/page-rebuild',
        text: '页面重现'
    }]
}, {
    icon: 'fa-cubes',
    text: '使用说明',
    link: '/home/page-handbook'
}];