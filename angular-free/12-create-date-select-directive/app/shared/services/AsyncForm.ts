// 异步提交带图片表单
/* 参数:
 * {
 * 	files: 传入file input的dom对象,
 * 	url: 服务器地址,
 * 	params: 其他需要发送的参数{键：值}
 *  不应该使用 contentType: 默认为`multipart/form-data`，可用'application/x-www-form-urlencoded'
 * }
 * 返回Promise，可使用.then调用
 */
class AsyncForm {
    url: string;
    qHttp: TODO;
    contentType: TODO;
    formData: TODO;

    constructor(qHttp, { url, params, files = [], contentType }) {
        // 初始化参数
        this.qHttp = qHttp;
        this.url = url;
        this.contentType = contentType;

        const formData = new FormData();
        this.formData = formData;
        // 若有传入文件，则添加
        if (files) {
            Array.prototype.forEach.call(files, file => {
                formData.append('file', file);
            });
        }
        // 若有其他参数，则添加
        Object.keys(params).forEach(key => {
            if (params[key] != null) {
                formData.append(key, params[key]);
            }
        });
    }

    submit() {
        // 提交，返回promise
        return this.qHttp.post(this.url, this.formData, {
            withCredentials: true,
            headers: {
                'Content-Type': undefined
            },
            transformRequest: x => x
        });
    }
}

export default (ngModule) => {
    // 注入qHttp服务
    ngModule.factory('AsyncForm', ['qHttp', function (qHttp) {
        return config => new AsyncForm(qHttp, config).submit();
    }]);

};