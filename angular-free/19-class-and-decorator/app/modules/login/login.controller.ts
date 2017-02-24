import { Notify, bindMethods } from '../../shared/services/BasicTools';
import { EscKeyUp, SpaceKeyUp } from '../../shared/services/KeyUp';
const angular = require('angular');

@bindMethods
class LoginCtrl {
    // 获取依赖
    public static $inject = [
        '$scope',
        '$timeout',
        'AlertMsg'
    ];
    username: any;
    password: any;
    check: any;
    Notify: any;

    // 注入依赖
    constructor(
        private $scope,
        private $timeout,
        private AlertMsg
    ) {
        // VM用于绑定模板相关内容
        this.Notify = Notify;
        $scope.VM = this;
        Notify({ title: '可focus在表单中，然后按下Esc键或者Enter键试试' })
    }

    // 登录事件
    submitForm() {
        if (!this.username || !this.password) {
            Notify({
                title: `账户和密码不能为空`,
                type: 'error'
            });
            return;
        }
        this.AlertMsg(this.$scope,{ text: '确认？', needConfirm: true }).then(() => {
            // 登录中提示
            const loading = Notify({
                title: `登录中`,
                text: `账号：${this.username}，密码：${this.password}`,
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
                sessionStorage.setItem('username', this.username);
                location.href = 'index.html#/home';
            }, 1000);
        });
    }
}

export default (ngModule) => {
    ngModule.controller('LoginCtrl', LoginCtrl);
};