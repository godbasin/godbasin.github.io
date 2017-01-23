/*
 * [sidebar]
 * 
 * 侧边栏组件
 *
 * created by deleted
 * 
 */
export default (ngModule) => {
    ngModule.directive('sidebar', ['$state', function ($state) {
        return {
            restrict: 'AE',
            templateUrl: './shared/components/sidebar.template.html',
            transclude: true,
            replace: false,
            link(scope, element, attrs) {
                const menuShowAll = false;
                scope.$state = $state;
                // 初始化菜单数据
                const menus = [{
                    icon: 'fa-home', // icon用于储存菜单对应的图标
                    text: '账户管理', // text用于储存该菜单显示名称
                    show: false,
                    childMenus: [{
                        href: 'home.accounts', // href用于设定该菜单跳转路由
                        text: '账户信息' // text用于储存该菜单显示名称
                    }, {
                        href: 'home.accountsadd',
                        text: '新建'
                    }]
                }, {
                    icon: 'fa-cubes',
                    text: '系统管理',
                    show: false,
                    href: 'home.system'
                }];
                scope.menus = menus;

                // 点击父菜单
                scope.toggleMenu = menu => {
                    // 将其他菜单设置为非激活状态
                    scope.menus.forEach(m => m.show = false);
                    if (menu.childMenus && menu.childMenus.length) {
                        // 若当前菜单有子菜单，则切换激活状态
                        menu.show = !menu.show;
                    } else if (menu.href) {
                        // 若当前菜单没有子菜单，则进行跳转 
                        $state.go(menu.href);
                    }

                };

                checkActive();

                // 初始化的时候检测菜单是否激活
                function checkActive() {
                    menus.forEach((menu: any) => {
                        menu.show = !!(menu.childMenus && menu.childMenus.find(item => item.href === $state.current.name));
                    });
                }
            }
        };
    }]);
};