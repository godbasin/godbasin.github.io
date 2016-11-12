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
									<th>产品名称</th>
									<th>厂商名称</th>
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
									<td data-toggle="tooltip" data-placement="bottom" v-bind:title="product.productName">{{ product.productName | maxlength(5, '...') }}</td>
									<td data-toggle="tooltip" data-placement="bottom" v-bind:title="product.terminalName">{{ product.terminalName | maxlength(5, '...') }}</td>
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
                productsTable: {}
            }
        },
        methods: {
            showJson(json) {
                return FormatJson(json);
            },
            getProducts({
                terminalId,
                p,
                s
            }) {
                var that = this;
                var url = `./static/products.json` + UrlEncode({
                    terminalId,
                    p,
                    s
                });
                that.productsTable.ajax.url(url).load();
            }
        },
        mounted() {
            //this.getProducts();
            var that = this;
            var table = $('#products-datatable').dataTable({
                processing: true,
                serverSide: true,
                destroy: true,
                ajax: {
                    url: `./static/products.json`
                },
                columns: [{
                    data: "productName" //产品名字
                }, {
                    data: "terminalName" //服务名字
                }, {
                    data(val) { // 返回是否激活
                        return val === 1 ? '是' : '否';
                    }
                }, {
                    data: "uuid" //uuid
                }, {
                    data(val) { //返回是否启用
                        return val === 1 ? '启用' : '未启用';
                    }
                }, {
                    data: "activeDate" //启用时间
                }, {
                    data: "expiresDate" //到期时间
                }, {
                    data: "registerDate" //注册时间
                }, {
                    data: "activateDate" //激活时间
                }, {
                    data(val) {
                        return val;
                    },
                    createdCell(td, cellData, rowData, row, col) { //设置tooltip，以及将json进行html模板输出
                        $(td).attr('title', FormatJson(cellData)).attr('data-toggle', 'tooltip').attr('data-placement', 'left').attr('data-html', 'true').html('...');
                    },
                    orderable: false //取消排序功能
                }, {
                    createdCell(td, cellData, rowData, row, col) { //添加按钮
                        $(td).html(`${rowData.state === 1 ?'' :'<a href="#" class="btn btn-primary btn-xs"><i class="fa fa-bolt"></i> 激活 </a>'}`);
                        //此处可添加相关事件
                    },
                    orderable: false //取消排序功能
                }],
                drawCallback: function(settings) {
                    //表格每次重绘回调函数，此处可进行相关插件初始化
                    SetTooltip();
                },
                language: {
                    "url": "./static/datatable_zh_CN.json"
                }
            }).api();
            //保存datatables对象，可进行相关的api调用
            that.$set(that, 'productsTable', table);
        },
        destroyed() {
            try {
                //移除datatables
                this.productsTable.destroy();
            } catch (e) {}
        }
    }
</script>

<style>
    .tooltip-inner {
        max-width: none !important;
    }
</style>