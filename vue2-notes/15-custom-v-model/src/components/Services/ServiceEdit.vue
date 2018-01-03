<template>
	<div class="">
		<div class="page-title">
			<div class="title_left">
				<h3>服务管理 <small>> {{ isNew ? '新建' : '编辑' }}</small></h3>
				<p>
					<router-link to="/app/add/service" class="btn btn-primary">新建</router-link>
					<router-link to="/app/edit/service/1" class="btn btn-success">编辑service1</router-link>
				</p>
			</div>
		</div>

		<div class="clearfix"></div>
		<!-- normal form -->
		<div class="x_panel">
			<div class="x_title">
				<h2>{{ isNew ? '新建' : '编辑' }}服务 <small v-show="!isNew">> {{ name }}</small></h2>
				<div class="clearfix"></div>
			</div>
			<div class="x_content">
				<br />
				<form class="form-horizontal form-label-left">

					<div class="form-group">
						<label class="control-label col-md-3 col-sm-3 col-xs-12">名称</label>
						<div class="col-md-6 col-sm-8 col-xs-12">
							<input type="text" class="form-control" placeholder="" v-model="name" required>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-md-3 col-sm-3 col-xs-12">编码</label>
						<div class="col-md-6 col-sm-8 col-xs-12">
							<input type="text" class="form-control" v-model="code" placeholder="编码/别名，方便查询使用">
						</div>
					</div>
                    <div class="form-group">
						<label class="control-label col-md-3 col-sm-3 col-xs-12">类型</label>
						<div class="col-md-6 col-sm-8 col-xs-12 table-radio">
							<label><input type="radio" class="flat" name="type" value="type1" v-model="type"> type1</label>
							<label><input type="radio" class="flat" name="type" value="type2" v-model="type"> type2</label>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-md-3 col-sm-3 col-xs-12">状态</label>
						<div class="col-md-6 col-sm-8 col-xs-12 table-radio">
							<div class="">
								<label><input type="checkbox" class="js-switch" name="state" true="1" false="0" checked /> {{state === 1 ? '激活' : '未激活'}}</label>
							</div>
						</div>
					</div>
					<div class="form-group">
						<label class="control-label col-md-3 col-sm-3 col-xs-12">过期日期</label>
						<fieldset class="col-md-6 col-sm-8 col-xs-12">
							<div class="xdisplay_inputx form-group has-feedback">
								<input type="text" class="form-control has-feedback-left" id="single_cal3" v-model="expiresDate" placeholder="点击选择日期" aria-describedby="inputSuccess2Status3">
								<span class="fa fa-calendar-o form-control-feedback left" aria-hidden="true"></span>
								<span id="inputSuccess2Status3" class="sr-only">(success)</span>
							</div>
						</fieldset>
					</div>
					<div class="form-group">
						<label class="control-label col-md-3 col-sm-3 col-xs-12">是否接受通知</label>
						<div class="col-md-6 col-sm-8 col-xs-12 table-radio">
							<label><input type="checkbox" class="js-switch" name="directIssue" true="1" false="0" checked /> {{directIssue === 1 ? '是' : '否'}}</label>
						</div>
					</div>
					<transition name="slide-form">
						<div class="form-group slide-form" v-show="directIssue === 0">
							<label class="control-label col-md-3 col-sm-3 col-xs-12">通知邮件</label>
							<div class="col-md-6 col-sm-8 col-xs-12">
								<input type="email" class="form-control" name="email" v-model="email">
							</div>
						</div>
					</transition>
					<div class="form-group">
						<label class="control-label col-md-3 col-sm-3 col-xs-12">备注</label>
						<div class="col-md-6 col-sm-8 col-xs-12">
							<textarea class="form-control" name="remark" v-model="remark"></textarea>
						</div>
					</div>


					<div class="ln_solid"></div>
					<div class="form-group">
                        <!--错误信息显示-->
                        <div class="col-md-6 col-sm-8 col-xs-12 col-md-offset-3">
                            <div class="alert alert-danger alert-dismissible fade in" role="alert" v-show="error.shown">
								<strong>错误：</strong> {{error.text}}
							</div>
						</div>
						<div class="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">
							<a class="btn btn-success" v-on:click="submit">提交</a>
							<router-link to="/app/terminals" class="btn btn-default">取消</router-link>
						</div>
					</div>

				</form>
			</div>
		</div>
	</div>
	<!-- /normal form -->
</template>


<script>
    var initData = () => {
        return {
            isNew: true,
            name: '',
            code: '',
            email: '',
            type: 'type1',
            directIssue: 1,
            state: 1,
            terminalId: '',
            appKey: '',
            appSecret: '',
            activeDate: '',
            expiresDate: '',
            remark: '',
            error: {
                text: '',
                shown: false
            }
        };
    };
    export default {
        name: 'ServiceEdit',
        data() {
            return initData();
        },
        methods: {
            // 初始化事件
            init() {
                var that = this;
                // isEdit?
                if (that.$route.params.id) {
                    that.edit(that.$route.params.id);
                } else {
                    var data = initData();
                    // 初始化默认值
                    that.setChange(data);
                    $.each(data, (key, item) => {
                        that.$set(that, key, item);
                    });
                }
            },
            // 编辑事件
            edit(id) {
                var that = this;
                that.$set(that, 'isNew', false);
                // 获取服务数据，这里使用模拟数据
                $.get(`./static/service1.json`, repo => {
                    // 设置组件data的值
                    that.setChange(repo);
                    $.each(repo, (key, item) => {
                        that.$set(that, key, item);
                    });
                });
            },
            // 对插件进行赋值设置
            setChange(item) {
                var that = this;
                // 设置iCheck赋值
                $(`input.flat[name="type"][value="${item.type}"]`).iCheck('check');
                // 设置switchery赋值
                if (item.state !== that.state) {
                    $('.js-switch[name="state"]').trigger('click');
                }
                if (item.directIssue !== that.directIssue) {
                    $('.js-switch[name="directIssue"]').trigger('click');
                }
            },
            submit() {
                var that = this,
                    text;
                // 先做一些简单的校验，不通过则显示错误信息
                if (!that.name) {
                    text = '请填写名称';
                }
                if (text) {
                    that.error.text = text;
                    that.error.shown = true;
                    return;
                }
                that.error.shown = false;
                var that = this;

                that.$router.push('/app/terminals');
            }
        },
        mounted() {
            var that = this;

            // 初始化检测
            that.init();
            // 设置iCheck插件初始化
            SetICheck(that);
            // 设置switchery插件初始化
            SetSwitchery(that);
            // 设置daterangepicker插件初始化
            SetDaterangepicker(that, '#single_cal3');
        },
        // 监视路由
        watch: {
            $route() {
                // 当路由改变，进行初始化检测
                this.init();
            }
        }
    }
</script>

<style>
    .table-radio {
        margin-top: 8px;
    }
</style>