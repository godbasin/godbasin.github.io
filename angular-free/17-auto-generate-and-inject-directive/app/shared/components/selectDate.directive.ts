import { FormatDate } from '../services/BasicTools';

export default (ngModule) => {
    /*
    * @ 日期筛选组件 by 被删
    * @param: {
    *     data: {
    *       beginDate: string?, // 开始日期
    *       endDate: string?,  // 结束日期
    *       chosenDate: string?, // 选中日期
    *     },
    *     text: string, // 未选择日期时显示
    *     chosen: function, // 选中日期后回调（传入选中日期：xxxx-xx-xx）
    * }
    *
    */
    ngModule.directive('selectDate', function () {
        return {
            restrict: 'AE',
            scope: {
                data: '=?',
                chosen: '=?',
                text: '@?'
            },
            templateUrl: './shared/components/selectDate.template.html',
            transclude: true,
            replace: false,
            link(scope, element, attrs) {
                const dateNow = new Date();
                const todate = `${dateNow.getFullYear()}-${dateNow.getMonth() + 1}-${dateNow.getDate()}`;
                let beginDate;
                let endDate;
                scope.isShown = false;
                scope.toggle = toggle;
                scope.init = init;
                scope.chooseDay = chooseDay;
                scope.lastMonth = lastMonth;
                scope.nextMonth = nextMonth;
                scope.lastYear = lastYear;
                scope.nextYear = nextYear;
                scope.isDayChosen = isDayChosen;
                scope.isDayActive = isDayActive;

                // 下拉/收起日期组件
                function toggle() {
                    scope.isShown = !scope.isShown;
                }

                // 初始化事件
                function init() {
                    if(!scope.data) {scope.data = {};}
                    scope.chosenDate = scope.data && scope.data.chosenDate || todate;
                    beginDate = scope.data && scope.data.beginDate || '1700-01-01';
                    endDate = scope.data && scope.data.endDate || '2900-12-30';
                    render();
                }

                // 刷新日历事件
                function render(date?) {
                    scope.readingDate = FormatDate(date || scope.data.chosenDate || todate);
                    const year = Number(scope.readingDate.split('-')[0]);
                    const month = Number(scope.readingDate.split('-')[1]);
                    const firstday = getFirstDay(year, month);
                    const monthlength = getMonthLength(year, month);
                    // readingDays保存当前月份的日期数组
                    scope.readingDays = [];
                    // 传入''则为空，用于星期对齐
                    for (let i = 0; i < firstday; i++) {
                        scope.readingDays.push('');
                    }
                    // 传入当前月份日期
                    for (let i = 1; i <= monthlength; i++) {
                        scope.readingDays.push(i);
                    }
                }

                // 选中日期事件
                function chooseDay(day){
                    const {year, month} = getDateDetail(scope.readingDate);
                    scope.chosenDate = scope.data.chosenDate = `${year}-${month}-${day}`;
                    scope.isShown = false;
                    if (typeof scope.chosen === 'function') {
                        scope.chosen(scope.chosenDate);
                    }
                }

                // 选择上一个月份日期
                function lastMonth() {
                    let {year, month, day} = getDateDetail(scope.readingDate);
                    if (--month === 0) {
                        render(`${year - 1}-12-${day}`);
                    } else {
                        render(`${year}-${month}-${day}`);
                    }
                }

                // 选择下一个月份日期
                function nextMonth() {
                    let {year, month, day} = getDateDetail(scope.readingDate);
                    if (++month > 12) {
                        render(`${year + 1}-1-${day}`);
                    } else {
                        render(`${year}-${month}-${day}`);
                    }
                }

                // 选择上一年日期
                function lastYear() {
                    let {year, month, day} = getDateDetail(scope.readingDate);
                    render(`${year - 1}-${month}-${day}`);
                }

                // 选择下一年日期
                function nextYear() {
                    let {year, month, day} = getDateDetail(scope.readingDate);
                    render(`${year + 1}-${month}-${day}`);
                }

                // 判断日期是否当前选中日期
                function isDayChosen(day) {
                    if (!day) { return false; }
                    const {year, month} = getDateDetail(scope.readingDate);
                    return FormatDate(`${year}-${month}-${day}`) === FormatDate(scope.chosenDate);
                }

                // 判断当前日期是否有效日期
                function isDayActive(day) {
                    if (!day) { return false; }
                    const {year, month} = getDateDetail(scope.readingDate);
                    const date = FormatDate(`${year}-${month}-${day}`);
                    return (date >= FormatDate(beginDate) && date <= FormatDate(endDate));
                }

                // 获取当月第一天星期几
                function getFirstDay(year, month) {
                    return new Date(year, month - 1, 1).getDay();
                }

                // 获取当月天数
                function getMonthLength(year, month) {
                    const nextMonth = new Date(year, month, 1);
                    nextMonth.setHours(nextMonth.getHours() - 2);
                    return nextMonth.getDate();
                }

                // 获取当前查看日期的年月日
                function getDateDetail(date) {
                    let year = Number(scope.readingDate.split('-')[0]);
                    let month = Number(scope.readingDate.split('-')[1]);
                    let day = Number(scope.readingDate.split('-')[2]);
                    return { year, month, day };
                }
            },
        };
    });
};