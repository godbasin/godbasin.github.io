import { Component } from '@angular/core';
// 添加HeaderService服务，用来获取菜单
import { HeaderService } from './header.service';

@Component({
  selector: 'my-header',
  styleUrls: ['./header.style.css'],
  templateUrl: './header.template.html',
  providers:[HeaderService] // 注入服务
})
export class Header {
  // clock用于保存时间
  clock: string = '';
  clockTime;
  menus: Array<any>; // menus用于储存主菜单
  usermenus: Array<any>; // usermenus用于储存侧边下拉菜单

  constructor(private headerService: HeaderService) {}

  // 用于格式化时间（少于10在前面增加0）
  numberStandard(num) {
    let _val = Number(num), _num;
    _num = (_val < 10) ? ('0' + _val) : ('' + _val);
    return _num;
  }

  // 用于渲染时钟
  renderClock() {
    let _date = new Date(), clock = '';
    clock += _date.getFullYear() + '年' + (_date.getMonth() + 1) + '月' + _date.getDate() + '日';
    clock += ' ' + this.numberStandard(_date.getHours()) +
      ':' + this.numberStandard(_date.getMinutes()) +
      ':' + this.numberStandard(_date.getSeconds());
    this.clock = clock;
  }

  // 生命周期钩子：初始化
  ngOnInit() {
    // 设定menus的初始值
    this.menus = this.headerService.getMenus();
    // 设定usermenus的初始值
    this.usermenus = this.headerService.getUsermenus();
    // 使用bind解决setInterval的执行环境问题
    this.clockTime = setInterval(this.renderClock.bind(this), 500);
  }

  // 生命周期钩子：销毁
  ngOnDestroy() {
    // 控件摧毁时移除定时事件
    clearInterval(this.clockTime);
  }
}
