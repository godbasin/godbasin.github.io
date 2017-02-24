/*
 * [be-disable-if]
 *
 * params: boolen;
 * 
 * 若传入值为true或者其他有效值, 添加"disable"的class
 * 
 */
export default (ngModule) => {
    ngModule.directive('beDisableIf',  () => ({
        restrict: 'A',
        link(scope, ele, attrs) {
            // watch属性[be-disable-if]，触发更新
            scope.$watch(attrs['beDisableIf'], changeListener);
            changeListener(scope.$eval(attrs['beDisableIf']));

            // 若有效，则添加disable的class，若没有则移除
            function changeListener(shouldBeDisable) {
                if (shouldBeDisable) {
                    if (!ele.hasClass('disable')) {
                        ele.addClass('disable');
                    }
                } else {
                    if (ele.hasClass('disable')) {
                        ele.removeClass('disable');
                    }
                }
            }
        }
    }));
};