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
					<h2><span>欢迎回来, </span> 老大</h2>
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
						<li v-for="menu in menus" v-on:click="toggleMenu(menu)" v-bind:class="menu.class">
                            <!--class的绑定需要使用v-bind:class来实现-->
							<a><i class="fa" v-bind:class="menu.icon"></i> {{menu.text}} <span class="fa" v-show="!menu.href" v-bind:class="menu.class ? 'fa-chevron-down' : 'fa-chevron-right'"></span></a>
							<!--通过判断class是否active来进行显示和隐藏的控制-->
                            <!--通过transition来给元素赋予过渡效果-->
                            <transition name="slide">
								<ul class="nav child_menu slide" v-on:click.stop v-show="menu.class">
									<router-link v-for="childMenu in menu.childMenus" v-bind:key="childMenu.text" class="slide-item" :to="childMenu.href" tag="li" active-class="current-page">
										<a>{{ childMenu.text }}</a>
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
    export default {
        data() {
            return {
                menus: [{
                    icon: 'fa-home', // icon用于储存菜单对应的图标
                    text: '服务管理', // text用于储存该菜单显示名称
                    class: '',
                    childMenus: [{
                        href: '/app/services', // href用于设定该菜单跳转路由
                        text: '服务信息' // text用于储存该菜单显示名称
                    }, {
                        href: '/app/add/service', // href用于设定该菜单跳转路由
                        text: '新建' // text用于储存该菜单显示名称
                    }]
                }, {
                    icon: 'fa-cubes',
                    text: '产品管理',
                    class: '',
                    childMenus: [{
                        href: '/app/products',
                        text: '产品信息'
                    }, {
                        href: '/app/add/product',
                        text: '新建'
                    }]
                }, {
                    icon: 'fa-file-o',
                    text: '日志管理',
                    class: '',
                    href: '/app/logs'
                }],
                menuShowAll: true,
                post: null,
                error: null
            }
        },
        // 在 `methods` 对象中定义方法
        methods: {
            toggleMenu(menu) {
                // 当菜单有href属性时，代表其将进行路由跳转而不是展开收起子菜单
                // 此时将其余菜单收起
                if (menu.href) {
                    this.$router.push(menu.href);
                    this.menus.forEach(item => {
                        item.class = '';
                    });
                    // 设置active时需判断当前状态，进行展开和收起的状态区分
                    menu.class = this.menuShowAll ? 'active' : 'active-sm';
                    return;
                }
                // 其他时候默认进行子菜单的切换
                switch (menu.class) {
                    case 'active':
                        menu.class = '';
                        break;
                    case '':
                        menu.class = this.menuShowAll ? 'active' : 'active-sm';
                }
            },
            toggleMenuShowAll() { // 菜单大小切换
                var $body = $('body');
                this.menus.forEach(menu => {
                    let c = menu.class;
                    menu.class = c === 'active' ? 'active-sm' : (c === 'active-sm' ? 'active' : c)
                })
                this.menuShowAll = !this.menuShowAll;
                $body.toggleClass('nav-md nav-sm');
            },
            checkMenuActived(path) {
                // 遍历所有的一级菜单
                this.menus.forEach(item => {
                    // 若非当前路由，则取消激活状态
                    if (item.href && item.href !== path) {
                        item.class = '';
                    }
                });
            }
        },
        watch: {
            $route() {
                // 检查是否一级菜单链接
                this.checkMenuActived(this.$route.path);
            }
        }
    }
</script>

<style>
    .fa-home {
        font-size: 20px !important;
    }
    
    .nav-sm .fa-home {
        font-size: 32px !important;
    }
    
    .slide {
        transition: all .5s ease-in-out;
        overflow: hidden;
        max-height: 100px;
    }
    
    .slide-enter,
    .slide-leave-active {
        max-height: 0;
    }
</style>