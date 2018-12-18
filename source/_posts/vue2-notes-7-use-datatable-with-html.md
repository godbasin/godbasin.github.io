---
title: Vue2使用笔记7--vue与datatables(一):浏览器渲染
date: 2016-12-10 00:03:12
categories: vue八宝粥
tags: 笔记
---
最近在使用Vue2作为项目中前端的框架，《Vue2使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录vue中调用datatables，使用已经完整的html初始化datatables的过程。
<!--more-->

## datatables
---

### 简单介绍
[datatables](http://datatables.club/)Datatables是一款jquery表格插件。
它是一个高度灵活的工具，可以将任何HTML表格添加高级的交互功能：
- 分页，即时搜索和排序
- 几乎支持任何数据源: DOM，javascript，Ajax和服务器处理
- 支持不同主题DataTables, jQuery UI, Bootstrap, Foundation
- 各式各样的扩展: Editor, TableTools, FixedColumns ……
- 丰富多样的option和强大的API
- 支持国际化
- 超过2900+个单元测试

在Gentelella模板中已经有了一些datatables相关的静态页面，我们可以之间拿来用上。

### 引入相关文件 
首先我们引入相关的一些资源文件（有点多？）。
``` html
<!-- Datatables styles -->
<link href="./static/gentelella/lib/css/dataTables.bootstrap.min.css" rel="stylesheet">
<link href="./static/gentelella/lib/css/buttons.bootstrap.min.css" rel="stylesheet">
<link href="./static/gentelella/lib/css/fixedHeader.bootstrap.min.css" rel="stylesheet">
<link href="./static/gentelella/lib/css/responsive.bootstrap.min.css" rel="stylesheet">
<link href="./static/gentelella/lib/css/scroller.bootstrap.min.css" rel="stylesheet">

<!-- Datatables -->
<script src="./static/gentelella/lib/js/jquery.dataTables.min.js"></script>
<script src="./static/gentelella/lib/js/dataTables.bootstrap.min.js"></script>
<script src="./static/gentelella/lib/js/dataTables.buttons.min.js"></script>
<script src="./static/gentelella/lib/js/buttons.bootstrap.min.js"></script>
<script src="./static/gentelella/lib/js/buttons.flash.min.js"></script>
<script src="./static/gentelella/lib/js/buttons.html5.min.js"></script>
<script src="./static/gentelella/lib/js/buttons.print.min.js"></script>
<script src="./static/gentelella/lib/js/dataTables.fixedHeader.min.js"></script>
<script src="./static/gentelella/lib/js/dataTables.keyTable.min.js"></script>
<script src="./static/gentelella/lib/js/dataTables.responsive.min.js"></script>
<script src="./static/gentelella/lib/js/responsive.bootstrap.js"></script>
<script src="./static/gentelella/lib/js/dataTables.scroller.min.js"></script>
<script src="./static/gentelella/lib/js/jszip.min.js"></script>
<script src="./static/gentelella/lib/js/pdfmake.min.js"></script>
<script src="./static/gentelella/lib/js/vfs_fonts.js"></script>
```

### 一些相关配置
datatables的使用很简单，一般直接调用`$(dom_selector).dataTable()`就可以初始化了。
这里我们简单讲以下会使用到的几个配置；

- destroy
  - 销毁所有符合选择的table，并且用新的options重新创建表格
  - 当我们需要重新获取数据后加载，可以使用这样的一个选项
- language
  - DataTables的语言配置
  - 这里我们将其汉化，保存一个json文件然后通过url调用进行配置

``` json
{
    "sProcessing": "处理中...",
    "sLengthMenu": "显示 _MENU_ 项结果",
    "sZeroRecords": "没有匹配结果",
    "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
    "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
    "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
    "sInfoPostFix": "",
    "sSearch": "搜索:",
    "sUrl": "",
    "sEmptyTable": "表中数据为空",
    "sLoadingRecords": "载入中...",
    "sInfoThousands": ",",
    "oPaginate": {
        "sFirst": "首页",
        "sPrevious": "上页",
        "sNext": "下页",
        "sLast": "末页"
    },
    "oAria": {
        "sSortAscending": ": 以升序排列此列",
        "sSortDescending": ": 以降序排列此列"
    }
}
```

有个需要说明的地方就是，使用`$(dom_selector).DataTable()`则可以返回API，然后就可以使用相关的[API接口](http://datatables.club/reference/api/)啦。

后面章节我们还会涉及服务器渲染的一些相关配置，这里暂时只介绍这么多啦，其他的请大家自行查询[配置选项文档](http://datatables.club/reference/option/)啦。

## 使用datatables初始化列表
---
这里我们添加一个产品列表组件，来进行这次的展示。

### 添加Products组件
我们在components文件夹中添加Products.vue组件：
``` vue
<template>
	<!-- info page -->
	<div class="">
		<div class="page-title">
			<div class="title_left">
				<h3>产品管理 <small>> 产品信息</small></h3>
			</div>
		</div>
		<div class="clearfix"></div>
		<div class="row">
			<div class="col-md-12">
				<div class="x_panel">
					<div class="x_title">
						<h2>产品信息</h2>
						<ul class="nav navbar-right panel_toolbox">
							<li v-on:click="getProducts"><a class="collapse-link"><i class="fa fa-refresh"></i>刷新</a></li>
						</ul>
						<div class="clearfix"></div>
					</div>
					
					<div class="x_content">

						<p>产品信息列表</p>

						<!-- start project list -->
						<table id="products-datatable" class="table table-striped table-bordered">
							<thead>
								<tr>
									<th>产品ID</th>
									<th>服务ID</th>
									<th>是否激活</th>
									<th>显卡UUID</th>
									<th>状态</th>
									<th>启用时间</th>
									<th>到期时间</th>
									<th>注册时间</th>
									<th>激活时间</th>
									<th>选项参数</th>
									<th>#</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="product in products">
									<td data-toggle="tooltip" data-placement="bottom" v-bind:title="product.productId">{{ product.productId | maxlength(5, '...') }}</td>
									<td data-toggle="tooltip" data-placement="bottom" v-bind:title="product.terminalId">{{ product.terminalId | maxlength(5, '...') }}</td>
									<td>{{ product.isActivate === 1 ? '是' : '否' }}</td>
									<td data-toggle="tooltip" data-placement="bottom" v-bind:title="product.uuid">{{ product.uuid | maxlength(8, '...') }}</td>
									<td>{{ product.state === 1 ? '启用' : '未启用' }}</td>
									<td data-toggle="tooltip" data-placement="bottom" v-bind:title="product.activeDate">{{ product.activeDate | maxlength(10) }}</td>
									<td data-toggle="tooltip" data-placement="bottom" v-bind:title="product.expiresDate">{{ product.expiresDate | maxlength(10) }}</td>
									<td data-toggle="tooltip" data-placement="bottom" v-bind:title="product.registerDate">{{ product.registerDate | maxlength(10) }}</td>
									<td data-toggle="tooltip" data-placement="bottom" v-bind:title="product.activateDate">{{ product.activateDate | maxlength(10) }}</td>
									<td data-toggle="tooltip" data-placement="bottom" data-html="true" v-bind:title="showJson(product.options)">...</td>
									<td>
										<a href="#" class="btn btn-info btn-xs" v-show="product.isActivate === 0"><i class="fa fa-pencil"></i> 激活 </a>
									</td>
								</tr>
							</tbody>
						</table>
						<!-- end project list -->
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- /info -->
</template>

<script>
    export default {
        name: 'Products',
        data() {
            return {
                products: [],
            }
        },
        methods: {
            showJson(json) {
                return FormatJson(json);
            },
            getProducts() {
                var that = this;
                $.get(`/static/products.json`, repo => {
                    that.$set(that, 'products', repo.list);
                    setTimeout(() => {
                        // 初始化datatables
                        SetDataTable('#products-datatable');
                        // 设置tooltip
                        SetTooltip();
                    });
                });
            }
        },
        mounted() {
            // 获取产品数据
            this.getProducts();
        }
    }
</script>
```

### tooltip
[提示工具(Tooltip)](http://jqueryui.com/tooltip/)插件根据需求生成内容和标记，默认情况下是把提示工具（tooltip）放在它们的触发元素后面。

您可以有以下两种方式添加提示工具（tooltip）：
- 通过 data 属性：如需添加一个提示工具（tooltip），只需向一个锚标签添加 data-toggle="tooltip" 即可

``` html
<a href="#" data-toggle="tooltip" title="Example tooltip">请悬停在我的上面</a>
```

- 通过JavaScript：通过JavaScript触发提示工具（tooltip）：

``` js
$('#identifier').tooltip(options)
```

### common.js
``` js
// dataTables初始化
const SetDataTable = (eleType, destroy) => {
    $(eleType).dataTable({
        destroy: destroy || true,
        "language": {
            "url": "./static/datatable_zh_CN.json"
        }
    });
};

// Tooltip初始化
const SetTooltip = () => {
    var $tooltip = $('[data-toggle="tooltip"]');
    $tooltip.tooltip({
        container: 'body',
        trigger: 'hover click'
    });
};
```

### json展示
这里我们需要将json数据展示为html，本骚年写过两个方法进行实现，大家可以参考之前的文章。
传送门：
- [《将json输出为html(一)：字符串正则匹配》]()
- [《将json输出为html(二)：js数据类型判断实现》]()


### 页面效果
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/4234.tmp.png)

## 结束语
-----
这里我们使用了先使用vue自动加载相应数据生成html后（mounted），再调用dataTables来生成表格的方法。当然这种方法会有很大的限制，需要一次性加载所有数据，这在很多时候都是不实用的。后面我们会继续介绍dataTables的另外一种使用方法--服务端渲染。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/vue2-notes/7-use-datatable-with-html)
[此处查看页面效果](http://vue2-notes.godbasin.com/7-use-datatable-with-html/index.html#/app/products)