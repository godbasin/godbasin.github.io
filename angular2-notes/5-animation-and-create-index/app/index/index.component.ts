import { Component, trigger, state, style, transition, animate } from '@angular/core';

// 添加Header组件，默认从header文件夹的index.ts中获取
import { Header } from '../header';

@Component({
  selector: 'index', // 设置模板元素
  styleUrls: ['./index.style.css'], // 样式文件引入
  templateUrl: './index.template.html', // 模板文件引入
  directives: [Header], // 注入指令
  animations: [
    // 设置动画，@menuState属性动画效果
    trigger('menuState', [ 
      state('false', style({ // menu.show为false时状态
        height: '0px',
        padding: '0px',
        opacity: '0'
      })),
      // 转场的动画效果
      transition('* => *', animate('100ms ease-in'))
    ])
  ]
})
export class Index {
  // 定义并初始化菜单显示状态
  loading: string = 'init';
  asidemenus: Array<any>;

  // 更新loading
  changeState (view) {
    this.loading = view;
  }

  // 显示隐藏子菜单效果并更新loading
  toggleContent (index) {
    this.asidemenus[index].show = !this.asidemenus[index].show;
    this.changeState(this.asidemenus[index].click);
  }

  ngOnInit () {
    // 设定menu的初始值
    this.asidemenus = [{
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
  }
}
