<template>
	<div id="app">
		<div class="container body">
			<div class="main_container">
                <!--使用Sidebar组件，使用ref熟悉进行子组件索引-->
				<Sidebar ref="sidebar"></Sidebar>
                <!--使用Top组件，且绑定监听子组件SidebarToggleClick事件-->
				<Top v-on:SidebarToggleClick="transSidebarToggle"></Top>
                <!-- page content -->
				<div class="right_col" role="main"></div>
			</div>
		</div>
	</div>
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

</style>