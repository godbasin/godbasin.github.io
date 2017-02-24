// 打开图片对话框，只接受一张图片上传
export function OpenImageDialog() {
    // 新建input，作为文件获取
    const input = document.createElement('input');
    input.type = 'file';
    input.name = 'file';
    input.accept = 'image/*';
    let resolve;

    // 新建Promise，并获取resolve函数
    const promise = new Promise((res, rej) => {
        resolve = res;
    });

    // 设置input中图片改变时触发事件
    input.onchange = () => {
        // 创建fileReader读取文件内容
        const fileReader = new FileReader();
        const file = input.files[0];

        // 读取完毕后，传入文件、图片信息以及名字
        fileReader.onload = () => {
            resolve({ file, url: fileReader.result, name: input.value.substring(input.value.lastIndexOf('\\') + 1) });
        };
        fileReader.readAsDataURL(file);
    };

    // 触发表单点击事件
    input.click();

    // 返回promise
    return promise;
}