<template>
  <div is="my-header" current="index"></div><!--使用is绑定组件，current传入prop数据-->
  <div class="container-fluid row">
	<aside class="col-md-2  col-md-offset-1" id="according">
		<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
			<div class="panel panel-default list-group" v-for="menu in asidemenus">
				<div class="panel-heading" role="tab">
					<ul class="panel-title ">
						<li data-toggle="collapse" v-on:click="toggleContent($index)">
							{{ menu.title }}
						</li>
					</ul>
				</div>
				<div class="panel-collapse collapse in">
					<ul class="list-group">
						<li v-for="item in menu.menus" v-show="menu.show" transition="staggered" class="list-group-item" role="button" v-on:click.stop="changeLoading(item.click)">{{ item.text }}</li>
					</ul>
				</div>
			</div>
		</div>
	</aside>
	<article class="col-md-7">
		<section class="index-content">
			<p v-show="loading === 'init' || loading === 'name'">昵称：被删</p>
			<p v-show="loading === 'init' || loading === 'email'">邮箱：wangbeishan@163.com</p>
			<p v-show="loading === 'init' || loading === 'github'">github: <a href="https://github.com/godbasin">github.com/godbasin</a></p>
			<div v-show="loading === 'sethead'">这里是修改头像页面</div>
			<div v-show="loading === 'setinfo'">这里是修改资料页面</div>
			<div v-show="loading === 'other'">这里是其他页面</div>
		</section>
	</article>
</div>
</template>
<script>
// 导入Header组件
import MyHeader from './Header.vue'
export default {
  components: { // 导入Header组件
    MyHeader
  },
  data () {
    return {
      loading: 'init',
      asidemenus: [{
        title: '基本资料', // title用于储存该菜单显示名称
        click: 'init', // click用于储存该菜单对应点击时loading的状态值
        show: true, // show用于保存菜单是否隐藏的状态
        menus: [{
          text: '名字', // title用于储存该菜单显示名称
          click: 'name' // click用于储存该菜单对应点击时loading的状态值
        }, {
          text: '邮箱',
          click: 'email'
        }, {
          text: 'github',
          click: 'github'
        }]
      }, {
        title: '设置头像',
        click: 'sethead',
        show: true
      }, {
        title: '修改资料',
        click: 'setinfo',
        show: true
      }, {
        title: '其他',
        click: 'other',
        show: true
      }]
    }
  },
  // 在 `methods` 对象中定义方法
  methods: {
    changeLoading: function (view) { // 更新loading
      this.loading = view
    },
    toggleContent: function (index) { // 过渡菜单效果并更新loading
      this.asidemenus[index].show = !this.asidemenus[index].show
      this.changeLoading(this.asidemenus[index].click)
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.index-content {
  width: 90%;
  margin: 0 auto;
  min-height: 200px;
  border: solid 1px #999;
  border-radius: 5px;
  padding: 20px;
  box-sizing: border-box;
}
#according{
    text-align: center;
    text-decoration: none;
    line-height: 30px;
    overflow: hidden;
}
.hidden { display:none; }
#according ul,
#according li{
    list-style: none;
    padding-left: 0;
    text-decoration: none;
}
#according .list-group-item{
    background: #FFF;
    outline: none;
}
#according a,
#according a:focus,
#according a:active,
#according a:hover{
    text-decoration: none !important;
    outline: none !important;
}
#according .panel-body{
    padding: 0;
    border: none;
}
#according .list-group-item{
    text-align: center;
}
#according .list-group{
    margin-bottom: 0;
}
#according .panel{
    margin: 0;
    cursor: pointer;
    border-radius: 0;
}
.staggered-transition {
    transition: all .2s ease-in-out;
    overflow: hidden;
    margin: 0;
    height: 50px;
}
.staggered-enter, .staggered-leave {
    height: 0px;
    opacity: 0;
    padding: 0;
}
</style>
