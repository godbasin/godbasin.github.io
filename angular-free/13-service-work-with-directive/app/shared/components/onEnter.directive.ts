import { EnterKeyUp } from '../../shared/services/KeyUp';
/*
 * [on-enter]
 *
 * created by cao
 * 
 * @param {function} callback
 * 
 * 监听Enter按键事件，触发callback回调
 * 
 */
// 以下代码不会连续触发
// export default (ngModule) => {
//     ngModule.directive('onEnter', () => ({
//         restrict: 'A',
//         link(scope, element, attrs) {
//             EnterKeyUp(scope, attrs['onEnter']);
//         }
//     }));
// };

// 以下代码会连续触发，每一层都会触发
export default (ngModule) => {
    ngModule.directive('onEnter',  () => ({
        restrict: 'A',
        link(scope, ele, attrs) {
            document.addEventListener('keyup', onEnter, true);
            ele.on('$destroy', () => document.removeEventListener('keyup', onEnter, true));

            function onEnter(ev) {
                if (ev.keyCode === 13 || ev.key === 'Enter') {
                    scope.$apply(attrs['onEnter']);
                    document.removeEventListener('keyup', onEnter, true);
                }
            }
        }
    }));
};