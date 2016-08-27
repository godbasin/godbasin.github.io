// 获取@Injectable装饰器
import {Injectable} from '@angular/core';

// @Injectable()标志着一个类可以被一个注入器实例化
Injectable()
// 输出HeaderService服务类
export class HeaderService {
  // menus用于储存主菜单
  private menus: Array<any> = [{
    title: 'index', // title用于储存路由对应的路径
    href: '/index', // href用于设定该菜单跳转路由
    text: '首页', // text用于储存该菜单显示名称
  }, {
    title: 'others',
    href: '/other',
    text: '其他',
  }];

  // usermenus用于储存侧边下拉菜单
  private usermenus: Array<any> = [{
    href: '/login', // href用于设定该菜单跳转路由
    text: '退出', // text用于储存该菜单显示名称
  }];

  // 提供获取menus的接口
  getMenus(){
    return this.menus;
  }

  // 提供获取usermenus的接口
  getUsermenus(){
    return this.usermenus;
  }
}