import { Component, trigger, state, style, transition, animate } from '@angular/core';

// 添加Header组件，默认从header文件夹的index.ts中获取
import { Header } from '../header';
// 添加IndexService服务，用来获取菜单
import { IndexService } from './index.service';

@Component({
  selector: 'index', // 设置模板元素
  styleUrls: ['./index.style.css'], // 样式文件引入
  templateUrl: './index.template.html', // 模板文件引入
  directives: [Header], // 注入指令
  providers:[IndexService], // 注入服务
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
  // 
  constructor(private indexService: IndexService) {}

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
    // 设定asidemenus的初始值
    this.asidemenus = this.indexService.getAsidemenus();
  }
}
