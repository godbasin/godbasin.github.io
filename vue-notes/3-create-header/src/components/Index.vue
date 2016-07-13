<template>
  <div is="my-header" current="index"></div><!--使用is绑定组件，current传入prop数据-->
  <div class="container">Hello Vue!</div>
</template>
<script>
// 导入Header组件
import MyHeader from './Header.vue'
export default {
  components: {
    MyHeader
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
