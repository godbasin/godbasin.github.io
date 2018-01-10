import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

const dialogStore = new Vuex.Store({
  state: {
    data: { // 展示数据
      title: '',
      contents: [''],
      buttons: [{
        text: '确定',
        class: 'btn-primary'
      }]
    },
    promise: null // 保存promise
  },
  mutations: {
    // 点击时，promise resolve，并返回点击的button的序号
    click(state, index) {
      $('#confirmModal').modal('hide')
      state.promise.resolve(index);
    },
    // 关闭弹窗，promise reject
    close(state) {
      $('#confirmModal').modal('hide')
      state.promise.reject();
    },
    // 设置弹窗内容，同时显示弹窗
    setDialog(state, {title, contents, buttons, resolve, reject}) {
      // 设置弹窗内容
      state.data = {
        title,
        contents,
        buttons
      };
      // 保存promise
      state.promise = {
        resolve,
        reject
      };
      $('#confirmModal').modal('show')
    }
  }
});

export default dialogStore;
