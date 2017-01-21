import { Notify } from '../../shared/services/BasicTools';
const angular = require('angular');

class LoginCtrl {
    // 获取依赖
    public static $inject = [
        '$scope',
        '$timeout'
    ];
    // 注入依赖
    constructor(
        private $scope,
        private $timeout
    ) {
        // VM用于绑定模板相关内容
        $scope.VM = this;
    }

    // 登录事件
    submitForm() {
        // 登录中提示
        const loading = Notify({
            title: `登录中`,
            type: 'info',
            hide: false
        });
        // 一秒后，提示登陆成功
        this.$timeout(() => {
            if (loading.remove) { loading.remove(); }
            Notify({
                title: `登录成功`,
                type: 'success'
            });
            location.href = 'index.html#/app';
        }, 1000);
    }
}


const ngModule = angular.module('LoginCtrl', []);
ngModule.controller('LoginCtrl', LoginCtrl)

export default 'LoginCtrl';