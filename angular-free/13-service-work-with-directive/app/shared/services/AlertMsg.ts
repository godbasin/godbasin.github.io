// 提示确认弹窗
// SetAlertMsg({
//     confirmText: '我是确认键',
//     cancelText: '我是取消键',
//     title: '我是头部',
//     text: '我是说明文字文字文字',
// }).then(() => {
//     console.log('点击了确定');
// }, () => {
//     console.log('关闭');
// });

interface IAlertMsg {
    confirmText?: string;
    cancelText?: string;
    title?: string;
    icon?: string;
    text: string;
}

class AlertMsgService {
    private isSet: boolean = false;
    private params: IAlertMsg = undefined;
    private resolve: any = undefined;
    private reject: any = undefined;

    constructor() {
        // 单独提取方法需要绑定this
        this.getIsSet = this.getIsSet.bind(this);
        this.getParams = this.getParams.bind(this);
        this.setMsg = this.setMsg.bind(this);
        this.msgReject = this.msgReject.bind(this);
        this.msgResolve = this.msgResolve.bind(this);
    }

    // 获取是否设置
    getIsSet() {
        return this.isSet;
    }

    // 获取设置的数据
    getParams() {
        return this.params;
    }

    // 设置参数，并返回promise
    setMsg(params: IAlertMsg) {
        this.isSet = true;
        this.params = params;

        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }

    // reject并清除数据
    msgReject() {
        if (typeof this.reject === 'function') { this.reject(); }
        this.clearMsg();
    }

    // resolve并清除数据
    msgResolve() {
        if (typeof this.resolve === 'function') { this.resolve(); }
        this.clearMsg();
    }

    // 清除数据
    private clearMsg() {
        this.params = undefined;
        this.isSet = false;
    }
}

const AlertMsg = new AlertMsgService();
const {getParams, getIsSet, setMsg, msgReject, msgResolve} = AlertMsg;
export {
    getIsSet as isAlertMsgSet,
    setMsg as SetAlertMsg,
    getParams as GetAlertMsgParams,
    msgReject as AlertMsgReject,
    msgResolve as AlertMsgResolve,
};
export default AlertMsg;