import Vue from "vue";
import router from "./router";
import AppDialog from "components/AppDialog";
import Datetimepicker from "components/Datetimepicker";
import Select2 from "v-select2-component";
import "tools/date.js";

Vue.component("Datetimepicker", Datetimepicker);
Vue.component("Select2", Select2);
Vue.filter("maxlength", (str, len, tail) => {
  if (str === undefined) {
    return;
  }
  var _str = str + "";
  if (_str.length > len) {
    _str = _str.substr(0, len) + (tail ? tail : "");
  }
  return _str;
});

// 注册一个全局自定义指令 `v-focus`
Vue.directive("focus", {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function(el) {
    // 聚焦元素
    el.focus();
  }
});

Vue.directive("click-outside", {
  bind: function(el, binding, vnode) {
    el.event = function(event) {
      // 检查点击是否发生在节点之内（包括子节点）
      if (!(el == event.target || el.contains(event.target))) {
        // 如果没有，则触发调用
        // 若绑定值为函数，则执行
        if(typeof vnode.context[binding.expression] == 'function'){
            vnode.context[binding.expression](event);
        }
      }
    };
    // 绑定事件
    // 设置为true，代表在DOM树中，注册了该listener的元素，会先于它下方的任何事件目标，接收到该事件。
    document.body.addEventListener("click", el.event, true);
  },
  unbind: function(el) {
    // 解绑事件
    document.body.removeEventListener("click", el.event, true);
  }
});

$.fn.dataTable.ext.errMode = "none";

new Vue({
  components: { AppDialog },
  router
}).$mount("#app");
