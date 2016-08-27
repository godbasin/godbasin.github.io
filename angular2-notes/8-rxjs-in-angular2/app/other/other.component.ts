import { Component } from '@angular/core';

// 添加Header组件，默认从header文件夹的index.ts中获取
import { Header } from '../header';
// 添加OtherService服务，用来获取数据
import { OtherService } from './other.service';

@Component({
  selector: 'other', // 设置模板元素
  templateUrl: './other.template.html', // 模板文件引入
  directives: [Header], // 注入指令
  providers:[OtherService] // 实例化服务
})
export class Other {
  // 定义并初始化数据
  rxjsDate: Array<any> = [];
  errorMessage: string = '';
  // 注入服务
  constructor(private otherService: OtherService) {}

  ngOnInit() {
    // 获得Obervable对象并进行订阅
    this.otherService.getDatas().subscribe(
      // 获取数据并保存在this.rxjsDate中
      datas => this.rxjsDate = datas,
      // 获取错误信息并保存在this.errorMessage中
      error => this.errorMessage = <any>error);
  }
}
