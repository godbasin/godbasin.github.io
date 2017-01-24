import { Notify } from '../../../shared/services/BasicTools';
import { OpenImageDialog } from '../../../shared/services/OpenImageDialog';
const angular = require('angular');

class AccountAddCtrl {
    // 获取依赖
    public static $inject = [
        '$scope',
        'AsyncForm'
    ];
    images: any[] = [];

    // 注入依赖
    constructor(
        private $scope,
        private AsyncForm
    ) {
        // VM用于绑定模板相关内容
        $scope.VM = this;
    }

    // 点击打开选择文件对话框
    openImageDialog() {
        // 调用openImageDialog，返回Promise，传入file、name、url参数
        OpenImageDialog().then(({file, url, name}) => {
            // 添加进数组
            this.images.push({ url, name });
            // 需手动刷新数据
            this.$scope.$digest();
            this.AsyncForm({
                files: [file],
                url: 'http://modifyDetail',
                params: {
                    gender: 'male'
                }
            }).then(()=>{console.log('success')}, () =>{console.log('error')})
        });
    }
}

export default (ngModule) => {
    ngModule.controller('AccountAddCtrl', AccountAddCtrl);
};