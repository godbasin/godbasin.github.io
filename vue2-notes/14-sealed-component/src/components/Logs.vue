<template>
	<div>
        <div>Logs组件</div>
        <div class="row" style="margin-left: 20px;">
            <label class="mr5" style="font-size: 14px;">统计日期</label>
            <Datetimepicker style="display: inline-block; width: 60%;" :defaultDate="new Date().format('yyyy-MM-dd')" :endDate="new Date()" :format="'yyyy-mm-dd'" :minView="4" @change="getValue($event)"  />
        </div>
    </div>
</template>


<script>
export default {
  name: "Logs",
  methods: {
    getValue(val) {
      alert(val)
    }
  }
};
</script>