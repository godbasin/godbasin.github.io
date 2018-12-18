---
title: Vue2使用笔记6--vue与各种插件和谐相处地创建表单
date: 2016-12-04 08:05:39
categories: vue八宝粥
tags: 笔记
---
最近在使用Vue2作为项目中前端的框架，《Vue2使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录vue中使用各种插件和库，以及创建简单表单的使用过程。
<!--more-->

## 一些插件
---
在开发中，遇到一些小的项目，拓展和维护都不会太多，这时候我们可以使用一些现成的插件和库进行快速搭建。
这里我们使用到以下的一些插件：
- iCheck
- switchery
- daterangepicker

后面还会用到dataTable，也是很棒的一个插件库，后续章节会有相关的介绍。

这里我们将这些插件的调用放到一个统一的文件common.js中进行管理，封装统一的接口，方便调用。

### iCheck
[iCheck](http://icheck.fronteed.com/)是个基于jQuery的表单选项插件，有多种可以选的皮肤，兼容PC端和移动端。
这里我们选用绿色的flat皮肤使用。

- 引入相关文件

``` html
<!-- index.html -->
<!-- iCheck style -->
<link href="./static/gentelella/lib/css/iCheck/green.css" rel="stylesheet">
<!-- iCheck script -->
<script src="./static/gentelella/lib/js/icheck.min.js"></script>
```

当然，我们调用iCheck可以自定义一些属性，作为规范或者约定来使用。
这里本骚年就默认使用name作为组件data的值，而value作为选中值。

- 组件中使用

``` html
<label><input type="radio" class="flat" name="type" value="type1" v-model="type"> type1</label>
<label><input type="radio" class="flat" name="type" value="type2" v-model="type"> type2</label>
```

- common.js中的公用接口

``` js
// common.js
const SetICheck = that => {
    // iCheck
    if ($("input.flat")[0]) {
        $('input.flat').iCheck({
            checkboxClass: 'icheckbox_flat-green',
            radioClass: 'iradio_flat-green'
        });
        $('input').on('ifChecked', function(event) {
			// 传入vue组件对象，对其进行赋值
            that.$set(that, event.currentTarget.name, event.currentTarget.value);
        });
    }
};

```

### switchery
[switchery](https://github.com/abpetkov/switchery)是个简单的JavaScript组件，可以帮助用户把默认的HTML复选框转换成漂亮iOS7样式风格。
具体的api和相关介绍大家可以自行去查文档，这里就不多说啦，直接上码：

- 引入相关文件

``` html
<!-- Switchery style-->
<link href="./static/gentelella/lib/css/switchery.min.css" rel="stylesheet">

<!-- Switchery script-->
<script src="./static/gentelella/lib/js/switchery.min.js"></script>
```

- 组件中使用

``` html
<!-- true为启用值，false为关闭值，name为data值-->
<label><input type="checkbox" class="js-switch" name="state" true="1" false="0" checked /> {{state === 1 ? '激活' : '未激活'}}</label>
```

- common.js

``` js
const SetSwitchery = that => {
    // Switchery
    if ($(".js-switch")[0]) {
        var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
        elems.forEach(function(html) {
            var switchery = new Switchery(html, {
                color: '#26B99A'
            });
            html.onchange = () => {
                var value = html.checked === true ? Number(html.attributes['true'].value) : Number(html.attributes['false'].value);
                that.$set(that, html.name, value);
            };
        });

    }
};
```

### daterangepicker
[daterangepicker](http://www.daterangepicker.com/)是个基于bootstrap的日历插件，有单日历和双日历，很方便使用，样式也是棒棒哒。
不废话，上码：

- 引入相关文件

``` html
<!-- bootstrap-daterangepicker -->
<!-- 样式直接使用bootstrap -->
<script src="./static/gentelella/lib/js/moment.min.js"></script>
<script src="./static/gentelella/lib/js/daterangepicker.js"></script>
```

- 组件中使用

``` html
<div class="xdisplay_inputx form-group has-feedback">
	<input type="text" class="form-control has-feedback-left" id="single_cal3" v-model="expiresDate" placeholder="点击选择日期" aria-describedby="inputSuccess2Status3">
	<span class="fa fa-calendar-o form-control-feedback left" aria-hidden="true"></span>
	<span id="inputSuccess2Status3" class="sr-only">(success)</span>
</div>
```

- common.js

``` js
const SetDaterangepicker = (that, eleToSet) => {
    var today = new Date(),
        todate = {
            year: today.getFullYear(),
            month: today.getMonth() + 1,
            date: today.getDate(),
        };
        // daterangepicker
    $(eleToSet).daterangepicker({
        singleDatePicker: true,
        format: 'YYYY-MM-DD',
        minDate: `${todate.year}-${todate.month}-${todate.date}`,
        calender_style: "picker_3"
    }, function(start, end, label) {
        that.expiresDate = start.toISOString().substring(0, 10);
    });
}
```

### 其他插件
Gentelella模板中还使用了一些其他的插件，像[select2](http://select2.github.io/)等等，具体的本骚年就不在这里讲了，大家可以自行发挥想象力和创造力去把这些东西融合进来，尽情使用。

## 创建表单
---
这里我们在创建服务模块弄个简单的表单呗~

### ServiceAdd组件
直接上代码？（捂脸）
``` vue
<template>
	<div class="">
		<div class="page-title">
			<div class="title_left">
				<h3>服务管理 <small>> 新建</small></h3>
			</div>
		</div>

		<div class="clearfix"></div>
		<!-- normal form -->
		<div class="x_panel">
			<div class="x_title">
				<h2>新建服务</h2>
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
						<div class="form-group slide-form" v-show="directIssue === 1">
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
            expiresDate: '',
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
        name: 'SeviceAdd',
        data() {
            return initData();
        },
        methods: {
            setChange(item) {
                var that = this;
                // 设置插件默认值
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
            var data = initData();
            // 设置初始值
            $.each(data, (key, item) => {
                that.$set(that, key, item);
            });
            // 初始化iCheck
            SetICheck(that);
            // 初始化Switchery
            SetSwitchery(that);
            // 初始化Daterangepicker
            SetDaterangepicker(that, '#single_cal3');
            // 设置插件默认值
            that.setChange(data);
        }
    }
</script>
```
### 页面效果
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/EB7E.tmp.png)

## 结束语
-----
这里只是用到最简单的css过渡，但是vue的过渡效果以及过渡状态还是很牛逼的，大家有兴趣的可以去看看[官方文档](https://vuefe.cn/guide/transitions.html)然后多尝试一下呢，酷酷的。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/vue2-notes/6-form-with-some-plugins)
[此处查看页面效果](http://vue2-notes.godbasin.com/6-form-with-some-plugins/index.html#/app/add/service)