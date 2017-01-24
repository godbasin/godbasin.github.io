import { isAlertMsgSet, GetAlertMsgParams, AlertMsgReject, AlertMsgResolve } from '../services/AlertMsg';
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
    ngModule.directive('alertMsg', ['$parse', function ($parse) {
        return {
            restrict: 'AE',
            templateUrl: './shared/components/alertMsg.template.html',
            transclude: true,
            replace: true,
            link(scope, element, attrs) {
                // watch是否设置，来控制是否显示
                scope.$watch(isAlertMsgSet, function (newValue, oldValue) {
                    if (newValue === true) {
                        // 获取相应的现实数据
                        scope.params = GetAlertMsgParams();
                        // 设置按下Esc键时默认取消
                        EscKeyUp(scope, () => {
                            scope.close();
                        });
                    }
                });
                // 关闭或者取消时，调用reject
                scope.close = () => {
                    AlertMsgReject();
                    scope.params = undefined;
                };
                // 确认时，调用resolve
                scope.submit = () => {
                    AlertMsgResolve();
                    scope.params = undefined;
                };
            }
        };
    }])
};
