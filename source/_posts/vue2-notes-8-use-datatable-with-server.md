---
title: Vue2使用笔记8--vue与datatables(二)：服务端渲染
date: 2016-12-11 16:06:54
categories: vue八宝粥
tags: 笔记
---
最近在使用Vue2作为项目中前端的框架，《Vue2使用笔记》系列用于记录过程中的一些使用和解决方法。
本文记录vue中调用datatables，使用datatables服务器处理的过程。
<!--more-->

## datatables服务器处理
---
上一节我们使用静态html进行初始化dataTables，有一个很局限的问题，就是需要一次性加载完所有的数据。
但是无论从浏览器还是服务端来看，都会发现这并不是一个好选择。因此我们可以开启服务器处理的方式。

### 服务器模式
DataTables提供了服务器模式，把本来客户端所做的事情交给服务器去处理，比如排序（order）、分页（paging）、过滤（filter）。
对于客户端来说这些操作都是比较消耗资源的， 所以打开服务器模式后不用担心这些操作会影响到用户体验。

当你打开服务器模式的时候，每次绘制表格的时候，DataTables会给服务器发送一个请求（包括当前分页，排序，搜索参数等等）。DataTables会向服务器发送一些参数去执行所需要的处理，然后在服务器组装好相应的数据返回给DataTables。

开启服务器模式需要使用serverSideOption和ajaxOption ajax不定时一讲选项。

### 服务端处理
当开启服务器模式时，服务端接受到的参数和需要返回的数据都是固定的，固此时需要服务端进行相关的处理。

由于这里我们只讨论前端相关的，固感兴趣的小伙伴麻烦自行查看文档：
[服务器处理(Server-side processing)](http://datatables.club/manual/server-side.html)


### 返回的数据处理
这时候服务端返回的数据格式为：
``` json
{
    "draw": 1,
    "recordsTotal": 57,
    "recordsFiltered": 57,
    "data": [
        {
            "DT_RowId": "row_3",
            "DT_RowData": {
                "pkey": 3
            },
            "first_name": "Angelica",
            "last_name": "Ramos",
            "position": "System Architect",
            "office": "London",
            "start_date": "9th Oct 09",
            "salary": "$2,875"
        },
        {
            "DT_RowId": "row_17",
            "DT_RowData": {
                "pkey": 17
            },
            "first_name": "Ashton",
            "last_name": "Cox",
            "position": "Technical Author",
            "office": "San Francisco",
            "start_date": "12th Jan 09",
            "salary": "$4,800"
        },
        ...
    ]
}
```
这里我们会需要对表格的每列进行处理，使用到columns的配置项，这里我们简单列出比较常用的选项：
- columns.className：为指定的列的每个单元格都指定一个css class
- columns.createdCell：单元格生成以后的回调函数，这样你可以在这里改变DOM
- columns.data：设置列的数据源，即如何从整个Table的数据源(object/array)中获得
- columns.orderable：在该列上允许或者禁止排序功能
- ...


## 使用datatables服务器模式渲染列表
---
这里我们将修改产品列表，来进行这次服务器模式的展示。

### Products.vue组件
Products.vue组件的html模板不需要调整，需要调整的是相关的组件逻辑代码：
``` vue
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
```

[传送门：Vue2使用笔记7--vue与datatables(一):浏览器渲染]()

### json展示
这里我们需要将json数据展示为html，本骚年写过两个方法进行实现，大家可以参考之前的文章。
传送门：
- [《将json输出为html(一)：字符串正则匹配》](/2016/11/13/json-to-html-1-use-string-regular/)
- [《将json输出为html(二)：js数据类型判断实现》](/2016/11/13/json-to-html-2-use-object/)


### 页面效果
![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/FB2B.tmp.png)

## 结束语
-----
这里我们使用了dataTables的另外一种使用方法--服务端渲染，这种方法虽然需要服务端按照相关约定进行调整，但是相比一次性加载所有的数据来说，还是方便很多的呢。
[此处查看项目代码](https://github.com/godbasin/godbasin.github.io/tree/blog-codes/vue2-notes/8-use-datatable-with-server)
[此处查看页面效果](http://ofyya1gfg.bkt.clouddn.com/8-use-datatable-with-server/index.html#/app/products)