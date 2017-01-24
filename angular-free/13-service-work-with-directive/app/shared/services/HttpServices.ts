export default (ngModule) => {
    ngModule
        /**
         * $http返回promise成功时，提取其中的data属性再resolve，也就是不要status, headers, config, statusText
         */

        .factory('qHttp', ['$http', ($http) => (function () {
            function qHttp(config) {
                return $http(config).then(res => errCodeHandler(res)).then(res => res.data).catch(res => { errCodeHandler(res); throw (new Error('error response')); });
            }
            ['post', 'get', 'delete', 'put'].forEach(method => {
                qHttp[method] = (...obj) => $http[method](...obj).then(res => errCodeHandler(res)).then(res => res.data).catch(res => { errCodeHandler(res); throw (new Error('error response')); });
            });

            return qHttp;
        })()])

        /**
         * 原生$http.post
         */
        .factory('postJSON', ['qHttp', qHttp => (url, data, params) => qHttp({
            url,
            data,
            params,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            withCredentials: true,
            transformRequest: [x => JSON.stringify(x)]
        })])

        .factory('putJSON', ['qHttp', qHttp => (url, data, params) => qHttp({
            url,
            data,
            params,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            withCredentials: true,
            transformRequest: [x => JSON.stringify(x)]
        })])

};

export function errCodeHandler(res) {
    if (res.status >= 400) {
        const err = errCodeTranslate(res.data.errorCode);
        const errText = err ? `错误：${err}` : '';
        makeToast(errText, 'error');
    } else if (res.status >= 200) {
        const body = res.data;
        if (body.code !== '0') {
            const err = errCodeTranslate(body.code);
            const errText = err ? `错误：${err}` : '';
            makeToast(errText, 'error');
        }
    }
    return res;
}

const errCodes = {
    '0101010101': '名称重复',
};

function errCodeTranslate(code) {
    return errCodes[code] || (code ? `错误码${code}` : '');
}