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
                $.get(`./static/products.json`, repo => {
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