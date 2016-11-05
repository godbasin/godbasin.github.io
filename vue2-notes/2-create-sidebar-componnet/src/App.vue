<template>
	<div id="app">
		<div class="container body">
			<div class="main_container">
                <!--使用Sidebar组件-->
				<Sidebar></Sidebar>
                <!-- page content -->
				<div class="right_col" role="main"></div>
			</div>
		</div>
	</div>
</template>

<script>
    import Sidebar from './components/Sidebar'


    export default {
        name: 'App',
        components: {
            Sidebar
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