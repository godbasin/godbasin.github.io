<template>
<nav class="navbar navbar-default header">
  <div class="container-fluid">
    <div class="navbar-header">
      <a class="navbar-brand">Godbasin</a>
    </div>
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav">     	
        <li v-for="menu in menus" v-bind:class="current === menu.title ? 'active' : ''">
        	<a href="{{ menu.href }}">{{ menu.text }}<span v-show="menu.current" class="sr-only">(current)</span></a>
        </li>
      </ul>
      <ul class="nav navbar-nav navbar-right">
      	<li><a>{{ clock }}</a></li>
        <li class="dropdown">
          <a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">菜单 <span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li v-for="usermenu in usermenus"><a href="{{ usermenu.href }}">{{ usermenu.text }}</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>
</template>

<script>
export default {
  data () {
    return {
      menus: [{
        title: 'index', // title用于储存路由对应的路径
        href: 'index.html#/index', // href用于设定该菜单跳转路由
        text: '首页' // text用于储存该菜单显示名称
      }, {
        title: 'other',
        href: 'index.html#/other',
        text: '其他'
      }],
      usermenus: [{
        text: '退出', // text用于储存该菜单显示名称
        href: 'index.html#/login' // href用于设定该菜单跳转路由
      }],
      clock: '' // clock用于储存时间
    }
  },
  props: ['current'], // current用于获取当前的位置
  // 在created生命周期钩子上添加setInterval进行时钟的刷新，当然其他的生命周期钩子也可能适用
  created: function () {
    var that = this
    setInterval(function () {
      that.clockRender()
    }, 500)
  },
  // 在 `methods` 对象中定义方法
  methods: {
    clockRender: function () { // 刷新时钟
      var numberStandard = function (num) { // 格式化时间（小于10补上0）
        var _val = Number(num)
        var _num
        _num = (_val < 10) ? ('0' + _val) : ('' + _val)
        return _num
      }
      var _date = new Date() // 获取当前时间
      this.clock = _date.getFullYear() + '年' + (_date.getMonth() + 1) + '月' +
        _date.getDate() + '日' + ' ' + numberStandard(_date.getHours()) + ':' + numberStandard(_date.getMinutes()) +
        ':' + numberStandard(_date.getSeconds())
    }
  }
}
</script>

<style scoped>
.header,
.marketing,
.footer {
  padding-left: 30px;
  padding-right: 30px;
}
.header {
  box-shadow: 0 1px 1px 1px rgba(0,0,0,.1);
  background-image: linear-gradient(-180deg,#fff 0,#e2e2e2 100%);
  padding: 0 20px;
  margin-bottom: 100px;
}
.header h3 {
  margin-top: 0;
  margin-bottom: 0;
  line-height: 40px;
  padding-bottom: 19px;
}
.footer {
  padding-top: 19px;
  color: #777;
  border-top: 1px solid #e5e5e5;
}
.dropdown:hover .dropdown-menu{
	display: block;
}
@media screen and (max-width: 768px) {
  .header,
  .marketing,
  .footer {
    padding-left: 0;
    padding-right: 0;
  }
  .header {
    margin-bottom: 30px;
  }
}
</style>
