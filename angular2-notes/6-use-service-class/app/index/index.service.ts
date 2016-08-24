import {Injectable} from '@angular/core';

Injectable()
export class IndexService {
    asidemenus: Array<any>  = [{
        title: '基本资料', // title用于储存该菜单显示名称
        click: 'init', // click用于储存该菜单对应点击时loading的状态值
        show: true, // show用于保存菜单是否隐藏的状态
        menus: [{
          text: '名字', // title用于储存该菜单显示名称
          state: 'active', // state用于储存该菜单状态
          click: 'name' // click用于储存该菜单对应点击时loading的状态值
        }, {
          text: '邮箱',
          state: 'active',
          click: 'email'
        }, {
          text: 'github',
          state: 'active',
          click: 'github'
        }]
      }, {
        title: '设置头像',
        click: 'sethead',
        show: true
      }, {
        title: '修改资料',
        click: 'setinfo',
        show: true
      }, {
        title: '其他',
        click: 'other',
        show: true
      }];

    getAsidemenus(){
        return this.asidemenus;
    }
}