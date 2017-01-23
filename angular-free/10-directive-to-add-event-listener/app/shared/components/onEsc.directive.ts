import { EscKeyUp } from '../../shared/services/KeyUp';
/*
 * [on-esc]
 * 
 * params: callback; // function
 * 
 * 监听Esc按键事件，触发callback回调
 * 
 */
export default (ngModule) => {
    ngModule.directive('onEsc',  () => ({
        restrict: 'A',
        link(scope, ele, attrs) {
            EscKeyUp(scope, attrs['onEsc']);
        }
    }));
};

// 以下代码会连续触发，每一层都会触发
// export default (ngModule) => {
//     ngModule.directive('onEsc',  () => ({
//         restrict: 'A',
//         link(scope, ele, attrs) {
//             document.addEventListener('keyup', onEsc, true);
//             ele.on('$destroy', () => document.removeEventListener('keyup', onEsc, true));

//             function onEsc(ev) {
//                 if (ev.keyCode === 27) {
//                     scope.$apply(attrs['onEsc']);
//                 }
//             }
//         }
//     }));
// };