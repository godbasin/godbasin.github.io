<template>
	<div>
        <div>Logs组件</div>
        <div class="row" style="margin-left: 20px;">
            <label class="mr5" style="font-size: 14px;">统计日期</label>
            <Datetimepicker style="display: inline-block; width: 60%;" :defaultDate="new Date().format('yyyy-MM-dd')" :endDate="new Date()" :format="'yyyy-mm-dd'" :minView="4" @change="getValue($event)"  />
        </div>
        <div class="row" style="margin-left: 20px;">
            <label class="mr5" style="font-size: 14px;">Select2下拉</label>
            <Select2 :options="options" v-model="slectValue" style="display:inline-block;" />
            <label>选中值：{{slectValue}}</label>
        </div>
    </div>
</template>


<script>
export default {
  name: "Logs",
  data(){
    return {
      slectValue: null,
      options: [
        {id: 1, text: '选项1'},
        {id: 2, text: '选项2'},
        {id: 3, text: '选项3'},
        {id: 4, text: '选项4'},
        {id: 5, text: '选项5'},
        {id: 6, text: '选项6'},
        {id: 7, text: '选项7'}
      ]
    }
  },
  methods: {
    getValue(val) {
      alert(val)
    }
  }
};
</script>