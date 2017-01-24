export default (ngModule) => {
    /*
    * @ 日期（时间）间断筛选组件 
    * @param: {
    *     data: {
    *       beginDate: string?, // 开始日期
    *       endDate: string?,  // 结束日期
    *       chosenBeginDate: string?, // 选中开始日期
    *       chosenEndDate: string?, // 选中结束日期
    *       beginTime: string? // 开始时间
    *       endTime: string? // 结束时间
    *     },
    *     beginText: string?, // 未选择开始日期时显示
    *     endText: string?, // 未选择结束日期时显示
    *     withTime: string? // 是否有时间控件,传入任何值均为是
    *     chosen: function, // 选中日期后回调（传入选中数据：[data, dataType], dataType有四种：'beginData', 'endData', 'beginTime', 'endTime'）
    * }
    *
    */
    ngModule.directive('selectDateInterval', function () {
        return {
            restrict: 'AE',
            scope: {
                data: '=?',
                chosen: '=?',
                beginText: '@?',
                endText: '@?',
                withTime: '@?',
            },
            template: `
            <div>
                <div select-date data="beginData" class="inline-block" text="{{ data && data.chosenBeginDate || beginText || '开始日期' }}" chosen="chooseBeginDate"></div>
                <div ng-if="withTime" select-time class="inline-block" type="begin" chosen="chooseTime" selected="beginTime"></div>
                <span class="bold-vertical-line inline-block"></span>
                <div select-date data="endData" class="inline-block" text="{{ data && data.chosenEndDate || endText || '结束日期' }}" chosen="chooseEndDate"></div>
                <div ng-if="withTime" select-time class="inline-block" type="end" chosen="chooseTime" selected="endTime"></div>
            </div>
            `,
            transclude: true,
            replace: true,
            link(scope, element, attrs) {
                const dateNow = new Date();
                const todate = `${dateNow.getFullYear()}-${dateNow.getMonth() + 1}-${dateNow.getDate()}`;
                scope.data = {};
                scope.beginData = {};
                scope.endData = {};
                scope.init = init;
                scope.chooseBeginDate = chooseBeginDate;
                scope.chooseEndDate = chooseEndDate;
                scope.chooseTime = chooseTime;

                // 初始化事件
                function init() {
                    scope.withTime = !!scope.withTime;
                    scope.beginData = {
                        beginDate: scope.data && scope.data.beginDate,
                        endDate: scope.data && scope.data.endDate,
                        chosenDate: scope.data && scope.data.chosenBeginDate
                    };
                    scope.endData = {
                        beginDate: scope.data && scope.data.beginDate,
                        endDate: scope.data && scope.data.endDate,
                        chosenDate: scope.data && scope.data.chosenEndDate
                    }
                    if(scope.withTime){
                        scope.beginTime = scope.data && scope.data.beginTime || '00:00:00';
                        scope.endTime = scope.data && scope.data.endTime || '23:59:59';
                    }
                }

                // 选择开始日期事件
                function chooseBeginDate(date) {
                    scope.data.chosenBeginDate = date;
                    scope.endData = {...scope.endData, beginDate: date};
                    if (typeof scope.chosen === 'function') {
                        scope.chosen(date, 'beginDate');
                    }
                }

                // 选择结束日期事件
                function chooseEndDate(date) {
                    scope.data.chosenEndDate = date;
                    scope.beginData = {...scope.beginData, endDate: date};
                    if (typeof scope.chosen === 'function') {
                        scope.chosen(date, 'endDate');
                    }
                }

                // 选择时间事件
                function chooseTime(time, type) {
                    if(type === 'begin'){
                        scope.data.beginTime = scope.beginTime = time;
                    }else if(type === 'end'){
                        scope.data.endTime = scope.endTime = time;
                    }
                    if (typeof scope.chosen === 'function') {
                        scope.chosen(time, `${type}Time`);
                    }
                }

                // 监听data进行初始化
                scope.$watch('data', (n,o)=>{
                    if(n !== undefined){
                        scope.data = n;
                        init();
                    }
                })
            },
        };
    });
};