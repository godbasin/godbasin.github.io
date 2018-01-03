<template>
	<!-- top navigation -->
	<div class="top_nav">
		<div class="nav_menu">
			<nav>
				<div class="nav toggle">
					<!--这里添加点击事件，用来触发Sidebar的展开和收起-->
					<a id="menu_toggle" v-on:click="sidebarToggleClick"><i class="fa fa-bars"></i></a>
				</div>
				<ul class="nav navbar-nav navbar-right">
					<li class="">
						<a href="javascript:;" class="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
							用户
							<span class=" fa fa-angle-down"></span>
						</a>
						<ul class="dropdown-menu dropdown-usermenu pull-right">
							<li><a href="javascript:;">设置</a></li>
							<li><a @click="logout"><i class="fa fa-sign-out pull-right"></i>退出</a></li>
						</ul>
					</li>
				</ul>
			</nav>
		</div>
	</div>
	<!-- /top navigation -->
</template>


<script>
import userStore from "stores/userStore";
export default {
  // 在 `methods` 对象中定义方法
  methods: {
    // 点击事件
    sidebarToggleClick() {
      // 使用$emit触发自定义事件SidebarToggleClick
      this.$emit("SidebarToggleClick");
    },
    logout() {
      userStore.dispatch("logout");
      this.$router.push({ name: "Login" });
    }
  }
};
</script>