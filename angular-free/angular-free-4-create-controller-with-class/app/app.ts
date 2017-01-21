'use strict';

export default (ngModule, angular) => {
    ngModule.config(['$stateProvider', '$compileProvider', '$httpProvider', function ($stateProvider, $compileProvider, $httpProvider) {
        $compileProvider.debugInfoEnabled(true);

        // 未登录则跳转至登录页
        if (!sessionStorage.getItem('username') && location.href.indexOf('login') === -1) {
            location.href = 'index.html#/login';
        }

        // ui-router路由的参数
        const routerStates = [{
            name: 'login',
            url: '/login',
            templateUrl: './modules/login/login.template.html',
            controller: 'LoginCtrl'
        }];

        // ui-router路由设置
        routerStates.forEach(stateParams => {
            $stateProvider.state({...stateParams});
        });
    }]);
};