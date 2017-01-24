/*
 * [safe-click]
 *
 * params: callback; // function
 * 
 * 可与[be-disable-if]同用
 * 
 * 若有"disable"的class，则click事件不执行callback回调
 * 
 */
export default (ngModule) => {
    ngModule.directive('safeClick',  () => {
        return (scope, element, attrs) => {
            // 添加click事件监听，在有效时触发回调
            element.on('click', ev => {
                ev.stopPropagation();
                // 通过是否有disable这个class来判断是否有效
                if (!element.hasClass('disable')) {
                    scope.$apply(attrs['safeClick']);
                }
            });
        };
    });
};