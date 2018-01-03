<template>
  <input type="text" class="form-control form-input" :placeholder="placeholder" :value="date" style="position: relative;">
</template>

<script>

export default {
  name: "Datetimepicker",
  data() {
    return {
      date: ""
    };
  },
  props: {
    placeholder: { // 占位提示
      type: String,
      default: ""
    },
    format: { // 格式化日期时间
      type: String,
      default: "yyyy-mm-dd hh:ii:ss"
    },
    minView: { // 最小视图
      type: Number,
      default: 0
    },
    startView: { // 起始视图
      type: Number,
      default: 2
    },
    maxView: { // 最大视图
      type: Number,
      default: 4
    },
    startDate: { // 最早可选时间
      type: Date,
      default: null
    },
    endDate: { // 最晚可选时间
      type: Date,
      default: null
    },
    defaultDate: { // 默认时间
      type: String,
      default: ''
    }
  },
  mounted() {
    // 设置默认时间
    this.date = this.defaultDate
    // 初始化表单事件
    $(this.$el)
      .datetimepicker({
        language: "zh-CN",
        format: this.format,
        autoclose: true,
        startView: this.startView,
        minView: this.minView,
        maxView: this.maxView,
        startDate: this.startDate,
        endDate: this.endDate
      })
      .on("hide", ev => {
        this.date = $(ev.target).val();
        this.$emit("change", this.date);
      });
  },
  beforeDestroy() {
    // 销毁
    $(this.$el)
      .datetimepicker("remove");
  }
};
</script>