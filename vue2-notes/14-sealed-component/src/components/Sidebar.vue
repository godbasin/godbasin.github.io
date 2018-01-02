<template>
	<div class="col-md-3 left_col menu_fixed">
		<div class="left_col scroll-view">
			<div class="navbar nav_title" style="border: 0;">
				<a href="index.html" class="site_title"><i class="fa fa-paw"></i> <span>管理系统</span></a>
			</div>

			<div class="clearfix"></div>

			<!-- menu profile quick info -->
			<div class="profile">
				<div class="profile_pic"></div>
				<div class="profile_info">
					<h2><span>欢迎回来, </span> {{username}}</h2>
				</div>
			</div>
			<div class="clearfix"></div>

			<!-- sidebar menu -->
			<div id="sidebar-menu" class="main_menu_side hidden-print main_menu">
				<div class="menu_section">
					<br />
					<h2>通用设置</h2>
					<br />
					<ul class="nav side-menu">
                        <!--通过v-for来进行菜单列表的显示，并绑定v-on:click事件进行点击控制-->
                       
						<li v-for="(menu, i) in menus" @click="toggleMenu(menu)" :class="menu.class" :key="i">
                            <!--class的绑定需要使用v-bind:class来实现-->
							<a><i class="fa" :class="menu.meta.icon"></i> {{menu.meta.title}} <span class="fa" v-show="menu.children" :class="menu.class ? 'fa-chevron-down' : 'fa-chevron-right'"></span></a>
							<!--通过判断class是否active来进行显示和隐藏的控制-->
                            <!--通过transition来给元素赋予过渡效果-->
                            <transition name="slide">
								<ul class="nav child_menu slide" v-show="menu.class" v-on:click.stop>
									<router-link v-for="(childMenu, j) in menu.children" :key="j" class="slide-item" :to="{name: childMenu.name}" tag="li" active-class="current-page">
										<a>{{ childMenu.meta.title }}</a>
									</router-link>
								</ul>
							</transition>
						</li>
					</ul>
				</div>
			</div>
			<!-- /sidebar menu -->
		</div>
	</div>
</template>


<script>
import userStore from "stores/userStore";
import routes from "../router/routes";
import accessCompute from "../router/accessCompute";
import { operationMap } from "../router";
export default {
  data() {
    return {
      menus: [],
      menuShowAll: true,
      post: null,
      error: null
    };
  },
  computed: {
    username() {
      return userStore.state.username;
    }
  },
  // 在 `methods` 对象中定义方法
  methods: {
    toggleMenu(menu) {
      // 当菜单没有子菜单时，代表其将进行路由跳转而不是展开收起子菜单
      // 此时将其余菜单收起
      if (!menu.children) {
        this.$router.push({ name: menu.name });
        this.menus.forEach(item => {
          item.class = "";
        });
        // 设置active时需判断当前状态，进行展开和收起的状态区分
        menu.class = this.menuShowAll ? "active" : "active-sm";
        return;
      }
      // 其他时候默认进行子菜单的切换
      switch (menu.class) {
        case "active":
          menu.class = "";
          break;
        case "":
          menu.class = this.menuShowAll ? "active" : "active-sm";
      }
    },
    toggleMenuShowAll() {
      // 菜单大小切换
      var $body = $("body");
      this.menus.forEach(menu => {
        let c = menu.class;
        menu.class =
          c === "active" ? "active-sm" : c === "active-sm" ? "active" : c;
      });
      this.menuShowAll = !this.menuShowAll;
      $body.toggleClass("nav-md nav-sm");
    },
    checkMenuActived(name) {
      // 遍历所有的一级菜单
      const matched = this.$route.matched;
      this.menus.forEach(item => {
        // 检查是否匹配
        let isMatch = false;
        matched.forEach(x => {
          if (item.name && item.name == x.name) {
            isMatch = true;
          }
        });
        // 若非当前路由，则取消激活状态
        if (!isMatch) {
          item.class = "";
        }
      });
    }
  },
  watch: {
    $route() {
      // 检查是否一级菜单链接
      this.checkMenuActived(this.$route.name);
    }
  },
  mounted() {
    const menuList = [];
    const menuRoutes = routes[1].children;
    menuRoutes.forEach((item, index) => {
      if (item.hideNav) {
        // 以下父路由不添加进菜单
        // 1. 菜单隐藏
        // 2. 没有设置子路由
        return;
      } else {
        // 若有配置禁止名单，则检测是否在禁止名单内，在则不添加进菜单
        // 若无禁止名单，或者不匹配名单，则校验是否在允许进入名单内
        if (
          !(
            item.meta.forbitRole &&
            accessCompute(operationMap, item.meta.forbitRole)
          ) &&
          accessCompute(operationMap, item.meta.accessRole)
        ) {
          if (item.children) {
            const children = [];
            item.children.forEach(x => {
              if (
                !(
                  x.meta.forbitRole &&
                  accessCompute(operationMap, x.meta.forbitRole)
                ) &&
                accessCompute(operationMap, x.meta.accessRole) &&
                !x.hideNav
              ) {
                children.push(x);
              }
            });
            item.children = children;
          }
          menuList.push({ ...item, class: "" });
        }
      }
    });
    this.menus = menuList;
  }
};
</script>

<style>
.fa-home {
  font-size: 20px !important;
}

.nav-sm .fa-home {
  font-size: 32px !important;
}

.slide {
  transition: all 0.5s ease-in-out;
  overflow: hidden;
  max-height: 100px;
}

.slide-enter,
.slide-leave-active {
  max-height: 0;
}
</style>