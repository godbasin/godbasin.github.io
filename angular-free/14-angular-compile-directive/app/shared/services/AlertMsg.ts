// 提示确认弹窗
// SetAlertMsg({
//     confirmText: '我是确认键',
//     cancelText: '我是取消键',
//     title: '我是头部',
//     text: '我是说明文字文字文字',
//     needConfirm: true/false
// }).then(() => {
//     console.log('点击了确定');
// }, () => {
//     console.log('关闭');
// });

interface IAlertMsg {
    confirmText?: string;
    cancelText?: string;
    title?: string;
    needConfirm?: boolean;
    text: string;
}

class AlertMsgService {
    $compile: any;
    $rootScope: any;

    constructor($compile, $rootScope) {
        this.$compile = $compile;
        this.$rootScope = $rootScope;
    }

    // 设置参数，并返回promise
    setMsg(scope, params: IAlertMsg) {
        // 创建新的作用域，用于编译指令
        let newScope = this.$rootScope.$new();
        // 创建新的Promise，并将回调传入作用域
        const promise = new Promise((resolve, reject) => {
            newScope.reject = reject;
            newScope.resolve = resolve;
        });
        // 传入数据
        newScope.params = params;
        // 模板
        const tmp = '<aside alert-msg params="params" reject="reject" resolve="resolve"></aside>';
        // 添加到页面中
        $('body').append(this.$compile(tmp)(newScope));
        return promise;
    }
}

export default (ngModule) => {
    // 注入$compile、$rootScope服务
    ngModule.factory('AlertMsg', ['$compile', '$rootScope', function ($compile, $rootScope) {
        return (scope, params) => new AlertMsgService($compile, $rootScope).setMsg(scope, params);
    }]);
};