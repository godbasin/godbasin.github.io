import { EscKeyUp } from '../services/KeyUp';

/*
 * [alert-msg]
 * 
 * 确认弹出框组件
 * 
 * 通过SetAlertMsg服务调用，参考'../services/AlertMsg'
 * 
 */
export default (ngModule) => {
    ngModule.directive('alertMsg', ['AlertMsg', function (AlertMsg) {
        return {
            restrict: 'AE',
            templateUrl: './shared/components/alertMsg.template.html',
            transclude: true,
            replace: true,
            scope: {
                params: '=',
                reject: '=?',
                resolve: '=?'
            },
            link(scope, element, attrs) {
                // 关闭或者取消时，调用reject
                scope.close = () => {
                    scope.reject();
                    element[0].remove();
                };
                // 确认时，调用resolve
                scope.submit = () => {
                    // 若设置了再次确认，再次确认
                    if (scope.params && scope.params.needConfirm) {
                        AlertMsg(scope, { text: '再次确认？' }).then(() => {
                            scope.resolve();
                            element[0].remove();
                        });
                    } else {
                        scope.resolve();
                        element[0].remove();
                    }
                };
                // 设置按下Esc键时默认取消
                EscKeyUp(scope, () => {
                    scope.close();
                });
            }
        };
    }])
};
