/*
 * [on-focus-lost]
 * 
 * params: callback; // function
 * 
 * 监听click鼠标事件，元素失去焦点时，触发callback回调
 * 
 */
export default (ngModule) => {
    ngModule.directive('onFocusLost',  () => ({
        restrict: 'A',
        link(scope, ele, attrs) {
            document.addEventListener('click', onClick, true);
            ele.on('$destroy', () => document.removeEventListener('click', onClick, true));

            function onClick(ev) {
                if (!ele[0].contains(ev.target)) {
                    scope.$apply(attrs['onFocusLost']);
                }
            }
        }
    }));
};