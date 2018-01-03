import dialogStore from 'components/AppDialog/dialogStore';
/*
 * 提示框
 * 
 * 返回Promise，参数index为点击的按钮的索引
 * 
*/
export function setDialog({title, contents = [], buttons = [{text: '确定', class: 'btn-primary'}]}) {
    // 默认只有一个确定按钮
    return new Promise((resolve, reject) => {
        dialogStore.commit('setDialog', {title, contents, buttons, resolve, reject});
    });
}

// 确认弹窗，点击确定则resolve，其他则reject
export function confirmDialog(content){
    return new Promise((resolve, reject) => {
        setDialog({
        contents: [content],
        buttons: [
          {text: '确定', class: 'btn-primary'},
          {text: '取消', class: 'btn-default'}
        ]
        }).then(index => {
            if(index == 0){
                resolve();
            }else{
                reject();
            }
        })
    });
}

export default setDialog;
