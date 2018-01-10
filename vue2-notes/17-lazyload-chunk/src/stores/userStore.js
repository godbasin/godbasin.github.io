/**
 * 用户信息有关的接口
 */

import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

let store = new Vuex.Store({
  state: {
    username: ""
  },
  mutations: {
    setUserName(state, username) {
      state.username = username;
    }
  },
  actions: {
    // 登入，保存用户名
    login({ commit, dispatch, state }, params = {}) {
      commit("setUserName", params.username);
    },
    // 登出，清除用户名
    logout({ commit, dispatch }) {
      commit("setUserName", "");
    }
  }
});

export default store;
