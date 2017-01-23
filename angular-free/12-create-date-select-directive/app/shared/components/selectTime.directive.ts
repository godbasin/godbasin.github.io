export default (ngModule) => {
    ngModule.directive('selectTime',  [function () {
        return {
            restrict: 'AE',
            scope: {
                chosenCb: '=chosen',
                selected: '=selected',
                type: '@type'
            },
            template: `
			<div select="select" class="select-time" select-id="{{ id }}" on-focus-lost="class = '';">
				<p ng-click="toggle()" ng-class="class"><span class="btn-time-icon"></span>{{ selected || \'00:00:00\' }}</p>
				<aside>
					<article class="select-time">
						<input type="text" ng-model="hour" >:
						<input type="text" ng-model="minute" >:
						<input type="text" ng-model="second" >
					</article>
					<footer>
                        <div class="box-1 box-center box-middle">
                            <a class="button-2" ng-click="confirm()">确认</a>
						    <a class="button-2 secondary" ng-click="cancel()">取消</a>
                        </div>
					</footer>
				</aside>
			</div>
			</aside>`,
            transclude: true,
            replace: false,
            link(scope, element, attrs) {
                var checkTime = function (type?: any, time?: any) {
                    if (scope.hour < 0 || !/^[0-9]{1,2}$/.test(scope.hour) || scope.hour > 23) {
                        return false;
                    }
                    if (scope.minute < 0 || !/^[0-9]{1,2}$/.test(scope.minute) || scope.minute > 59) {
                        return false;
                    }
                    if (scope.second < 0 || !/^[0-9]{1,2}$/.test(scope.second) || scope.second > 59) {
                        return false;
                    }

                    return true;
                };
                var formatTime = function (time) {
                    var _time;
                    time = Number(time);
                    _time = (time < 10) ? ('0' + time) : ('' + time);
                    return _time;
                }
                scope.class = '';
                scope.id = Math.random();
                scope.toggle = function () {
                    if (scope.class === '') {
                        scope.hour = scope.selected.split(':')[0];
                        scope.minute = scope.selected.split(':')[1];
                        scope.second = scope.selected.split(':')[2];
                    }
                    scope.class = (scope.class === 'active') ? '' : 'active';

                };
                scope.confirm = function () {
                    if (!checkTime()) {
                        makeToast('时间需为00:00:00-23:59:59间，请填写正确的时间格式', 'error');
                        return;
                    }

                    scope.selected = formatTime(scope.hour) + ':' +
                        formatTime(scope.minute) + ':' +
                        formatTime(scope.second);
                    if (typeof scope.chosenCb === 'function') {
                        scope.chosenCb(scope.selected, scope.type);
                    }
                    scope.toggle();
                };
                scope.cancel = function () {
                    scope.toggle();
                };
            },
        };
    }]);
};