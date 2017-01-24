// 按键事件
// EscKeyUp(scope, callback);
// SpaceKeyUp(scope, callback);

class KeyUpService {
    private CallbackObjscts: Object[] = [];
    private EnterCallbacks: string[] = [];
    private EscCallbacks: string[] = [];
    private SpaceCallbacks: string[] = [];
    private isEventInit: boolean = false;

    constructor() {
        // 绑定this
        this.addEnterCallback = this.addEnterCallback.bind(this);
        this.addEscCallback = this.addEscCallback.bind(this);
        this.addSpaceCallback = this.addSpaceCallback.bind(this);
    }

    // 添加Enter按键队列
    addEnterCallback(scope, callback) {
        this.addCallback(this.EnterCallbacks, scope, callback);
    }

    // 添加Esc按键队列
    addEscCallback(scope, callback) {
        this.addCallback(this.EscCallbacks, scope, callback);
    }

    // 添加Space按键队列
    addSpaceCallback(scope, callback) {
        this.addCallback(this.SpaceCallbacks, scope, callback);
    }

    // 添加按键事件队列
    private addCallback(callbacks, scope, callback) {
        // 产生随机数
        const uuid = Math.random().toString(36).substr(2);
        // 需有回调函数
        // if (typeof callback !== 'function') {
        //     console.log('callback is not a function.');
        //     return;
        // }
        // 关联uuid的作用域和回调
        this.CallbackObjscts[uuid] = { scope, callback };
        // 添加到队列的头部
        callbacks.unshift(uuid);
        // 初始化监听事件
        if (!this.isEventInit) {
            this.initEvent();
            this.isEventInit = true;
        }
    }

    // 执行回调队列
    private executeCallback(callbacks) {
        if (!callbacks.length) { return; }
        // 获取队列头部uuid
        const uuid = callbacks.shift();
        // 取出uuid关联的作用域和回调
        const {scope, callback} = this.CallbackObjscts[uuid] as any;
        // 执行回调
        try{
            scope.$apply(callback());
        }catch(e){
            scope.$apply(callback);
        }
        // 移除
        this.CallbackObjscts.splice(this.CallbackObjscts.findIndex(item => item === this.CallbackObjscts[uuid]), 1);
    }

    // 监听按键事件
    private initEvent() {
        const that = this;
        // 添加按键事件监听
        document.addEventListener('keyup', ((e = (window as MyWindow).event as any) => {
            if (e && e.keyCode) {
                switch (e.keyCode) {
                    case 13:
                        // Enter按键事件
                        that.executeCallback(that.EnterCallbacks);
                        break;
                    case 27:
                        // Esc按键事件
                        that.executeCallback(that.EscCallbacks);
                        break;
                    case 32:
                        // Space按键事件
                        that.executeCallback(that.SpaceCallbacks);
                        break;
                }
            }
        }).bind(this), true);
    }
}

// 新建按键服务
const KeyUp = new KeyUpService();
// 取出Esc按键添加和Space按键添加
const { addEnterCallback, addEscCallback, addSpaceCallback} = KeyUp;

export {
    addEnterCallback as EnterKeyUp,
    addEscCallback as EscKeyUp,
    addSpaceCallback as SpaceKeyUp
};

export default KeyUp;