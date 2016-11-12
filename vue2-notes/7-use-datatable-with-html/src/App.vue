<template>
	<transition name="fade" tag="div">
		<div class="container body">
			<div class="main_container">
				<!--使用Sidebar组件，使用ref熟悉进行子组件索引-->
				<Sidebar ref="sidebar"></Sidebar>
				<!--使用Top组件，且绑定监听子组件SidebarToggleClick事件-->
				<Top v-on:SidebarToggleClick="transSidebarToggle"></Top>
				<!-- page content -->
                <!--右侧内容展示-->
				<div class="right_col" role="main">
					<transition name="fade">
					    <router-view></router-view>
                    </transition>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
    import Sidebar from './components/Sidebar'
    import Top from './components/Top'


    export default {
        name: 'App',
        components: {
            Sidebar,
            Top
        },
        methods: {
            // 添加方法绑定SidebarToggleClick事件
            // 这里我们直接通过ref索引获取调用Sidebar子组件的toggleMenuShowAll方法
            transSidebarToggle() {
                this.$refs.sidebar.toggleMenuShowAll();
            }
        },
        created() {
            $('body').attr('class', 'nav-md');
        },
        mounted() {
            $('.right_col').css('min-height', $(window).height());
        }
    }
</script>

<style>
    .slide-form {
        transition: all .2s ease-in-out;
        max-height: 80px;
        overflow: hidden;
    }
    
    .slide-form-enter,
    .slide-form-leave-active {
        max-height: 0;
    }
</style>