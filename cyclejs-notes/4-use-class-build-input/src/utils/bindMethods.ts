// 将实例的原型上面所有函数都绑定this
export function bindMethods(oldConstructor) {
    const newConstructor: any = function(...args) {
        const instance = new oldConstructor(...args);
        const prototype = oldConstructor.prototype;

        Object.keys(prototype).forEach(key => {
            if (typeof prototype[key] === 'function') {
                instance[key] = prototype[key].bind(instance);
            }
        });

        return instance;
    };

    // 复制构造函数的$inject属性
    Object.assign(newConstructor, oldConstructor);

    newConstructor.prototype = oldConstructor.prototype;
    return newConstructor;
}