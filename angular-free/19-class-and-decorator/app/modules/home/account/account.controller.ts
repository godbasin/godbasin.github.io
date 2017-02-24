import { Notify, bindMethods } from '../../../shared/services/BasicTools';
const angular = require('angular');

@bindMethods
class AccountCtrl {
    // 获取依赖
    public static $inject = [
        '$scope',
    ];

    // 注入依赖
    constructor(
        private $scope
    ) {
        // VM用于绑定模板相关内容
        $scope.VM = this;
    }

    chosen(date){Notify({title: `选中${date}`});}
    chosenInterval(date, dateType){Notify({title: `选中${dateType}，为${date}`});}
}

export default (ngModule) => {
    ngModule.controller('AccountCtrl', AccountCtrl);
};