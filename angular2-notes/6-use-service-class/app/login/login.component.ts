import { Component } from '@angular/core';

@Component({
  selector: 'login', // 设置模板元素，<login></login>
  styleUrls: ['./login.style.css'], // 样式文件引入
  templateUrl: './login.template.html' // 模板文件引入
})
export class Login {
  // 定义并初始化用户名和密码以及其类型
  name: string = '';
  password: string = '';

  // 定义提交表单事件
  submitForm(name, password) {
    console.log(name, password);
  }
}
